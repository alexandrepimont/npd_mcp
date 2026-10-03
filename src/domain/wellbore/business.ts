import {
  FACTPAGES_TABLES,
  buildFactpagesCsvUrl,
  fetchFactpagesTable,
  type FactpagesTableKey,
  normalizeFactpagesLimit,
  normalizeTableKey,
} from '../../factpages/client.ts';
import { WELLBORE_METRICS, scoreMetricSignals, type MetricDefinition } from '../../semantic/metrics.ts';

export type BusinessPlan = {
  table: FactpagesTableKey;
  tableReason: string;
  metricId: string;
  metricReason: string;
  intent: MetricDefinition['intent'];
};

export type BusinessAnswer = {
  question: string;
  plan: BusinessPlan;
  result: {
    metricId: string;
    metricLabel: string;
    metricDescription: string;
    kind: 'count' | 'distribution';
    value: number | { name: string; count: number }[];
    sampleRows: Record<string, string>[];
  };
  provenance: {
    source: string;
    selectedTable: FactpagesTableKey;
    selectedTableLabel: string;
    fetchedRowCount: number;
    usedColumns: string[];
    generatedAt: string;
  };
  confidence: number;
};

function normalize(text: string): string {
  return text.trim().toLowerCase();
}

function resolveTableFromQuestion(question: string): { table: FactpagesTableKey; reason: string } {
  const normalizedQuestion = normalize(question);
  let bestMatch: { key: FactpagesTableKey; score: number; reason: string } | null = null;

  for (const table of FACTPAGES_TABLES) {
    const signals = [...table.queryHints, ...table.relatedTerms, table.label.toLowerCase(), table.key];
    const score = signals.reduce((accumulator, signal) => {
      const normalizedSignal = normalize(signal);
      return normalizedQuestion.includes(normalizedSignal) ? accumulator + 1 : accumulator;
    }, 0);

    if (!bestMatch || score > bestMatch.score) {
      bestMatch = {
        key: table.key as FactpagesTableKey,
        score,
        reason:
          score > 0
            ? `Matched table hints from question against ${table.key}.`
            : 'No explicit table signal in question. Falling back to default full dataset.',
      };
    }
  }

  if (bestMatch && bestMatch.score > 0) {
    return { table: bestMatch.key, reason: bestMatch.reason };
  }

  return {
    table: 'all',
    reason: 'No explicit table signal in question. Using all records for broad business coverage.',
  };
}

function resolveMetricFromQuestion(question: string, table: FactpagesTableKey): { metric: MetricDefinition; reason: string; score: number } {
  const supported = WELLBORE_METRICS.filter((metric) => metric.supportedTables.includes(table));
  let best = supported[0];
  let bestScore = -1;

  for (const metric of supported) {
    const score = scoreMetricSignals(metric, question);
    if (score > bestScore) {
      best = metric;
      bestScore = score;
    }
  }

  if (bestScore > 0) {
    return {
      metric: best,
      score: bestScore,
      reason: `Metric selected from semantic signal match score ${bestScore}.`,
    };
  }

  const fallback = supported.find((metric) => metric.id === 'wellbore_count') ?? supported[0];
  return {
    metric: fallback,
    score: 0,
    reason: 'No strong metric signal in question. Using stable overview metric.',
  };
}

function computeConfidence(signalScore: number, rowCount: number): number {
  const scoreFactor = Math.min(signalScore, 4) * 0.12;
  const volumeFactor = rowCount > 0 ? 0.22 : 0;
  const confidence = 0.45 + scoreFactor + volumeFactor;
  return Number(Math.min(0.95, confidence).toFixed(2));
}

function resolveExplicitTable(table: string): { table: FactpagesTableKey; reason: string } {
  const normalized = normalizeTableKey(table);
  const match = FACTPAGES_TABLES.find((item) => item.key === normalized);

  if (!match) {
    const supported = FACTPAGES_TABLES.map((item) => item.key).join(', ');
    throw new Error(`Unknown factpages table "${table}". Try one of: ${supported}`);
  }

  return {
    table: match.key as FactpagesTableKey,
    reason: 'Caller provided explicit table.',
  };
}

export function planBusinessQuestion(question: string, table?: string): BusinessPlan {
  const tablePlan = table ? resolveExplicitTable(table) : resolveTableFromQuestion(question);
  const metricPlan = resolveMetricFromQuestion(question, tablePlan.table);

  return {
    table: tablePlan.table,
    tableReason: tablePlan.reason,
    metricId: metricPlan.metric.id,
    metricReason: metricPlan.reason,
    intent: metricPlan.metric.intent,
  };
}

export async function answerWellboreBusinessQuestion(
  question: string,
  options: { table?: string; limit?: number },
): Promise<BusinessAnswer> {
  const plan = planBusinessQuestion(question, options.table);
  const metric = WELLBORE_METRICS.find((item) => item.id === plan.metricId) ?? WELLBORE_METRICS[0];
  const rows = await fetchFactpagesTable(plan.table, { limit: normalizeFactpagesLimit(options.limit ?? 100) });
  const metricResult = metric.compute(rows);
  const tableMetadata = FACTPAGES_TABLES.find((table) => table.key === plan.table);
  const signalScore = scoreMetricSignals(metric, question);

  return {
    question,
    plan,
    result: {
      metricId: metric.id,
      metricLabel: metric.label,
      metricDescription: metric.description,
      kind: metricResult.kind,
      value: metricResult.value,
      sampleRows: metricResult.sampleRows,
    },
    provenance: {
      source: buildFactpagesCsvUrl(plan.table),
      selectedTable: plan.table,
      selectedTableLabel: tableMetadata?.label ?? plan.table,
      fetchedRowCount: rows.length,
      usedColumns: metric.requiredColumns,
      generatedAt: new Date().toISOString(),
    },
    confidence: computeConfidence(signalScore, rows.length),
  };
}
