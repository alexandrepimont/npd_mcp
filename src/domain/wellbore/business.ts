import {
  FACTPAGES_TABLES,
  buildFactpagesCsvUrl,
  fetchFactpagesTable,
  type FactpagesTableKey,
  normalizeFactpagesLimit,
  normalizeTableKey,
} from '../../factpages/client.ts';

export type JoinStep = {
  fromTable: FactpagesTableKey;
  toTable: FactpagesTableKey;
  relationship: 'time_window' | 'subset' | 'same_wellbore' | 'overview';
  on: string[];
  reason: string;
  score: number;
};

export type TableJoinPlan = {
  baseTable: FactpagesTableKey;
  focus: 'curated';
  tableReason: string;
  joins: JoinStep[];
  reachableTables: FactpagesTableKey[];
};

export type EnrichedTableResult = {
  plan: TableJoinPlan;
  provenance: {
    source: string;
    selectedTable: FactpagesTableKey;
    selectedTableLabel: string;
    fetchedRowCount: number;
    usedColumns: string[];
    generatedAt: string;
  };
  reachableTables: FactpagesTableKey[];
  sampleRows: Record<string, string>[];
};

export type BusinessPlan = {
  table: FactpagesTableKey;
  tableReason: string;
  metricId: string;
  metricReason: string;
  intent: 'overview' | 'ranking' | 'distribution' | 'trend';
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
  reachableTables: FactpagesTableKey[];
};

const CURATED_JOIN_MAP: Record<FactpagesTableKey, JoinStep[]> = {
  all: [
    {
      fromTable: 'all',
      toTable: 'current_year',
      relationship: 'time_window',
      on: ['wlbWellboreName', 'wlbEntryYear'],
      reason: 'Enrich the full dataset with the latest reporting window so the newest drilling activity is visible alongside the full well list.',
      score: 9,
    },
    {
      fromTable: 'all',
      toTable: 'last_year',
      relationship: 'time_window',
      on: ['wlbWellboreName', 'wlbEntryYear'],
      reason: 'Compare the full history with the previous year to identify year-over-year changes in drilling and status.',
      score: 8,
    },
    {
      fromTable: 'all',
      toTable: 'last_10_years',
      relationship: 'time_window',
      on: ['wlbWellboreName', 'wlbEntryYear'],
      reason: 'Add the multi-year trend lens so the complete dataset is contextualized against long-run exploration patterns.',
      score: 7,
    },
  ],
  all_short: [
    {
      fromTable: 'all_short',
      toTable: 'current_year',
      relationship: 'time_window',
      on: ['wlbWellboreName', 'wlbEntryYear'],
      reason: 'Use the short table as a fast overview and enrich it with the current year to flag recent drilling priorities.',
      score: 8,
    },
    {
      fromTable: 'all_short',
      toTable: 'last_year',
      relationship: 'time_window',
      on: ['wlbWellboreName', 'wlbEntryYear'],
      reason: 'Compare a quick overview with the previous year to spot recent changes without loading the full long-list.',
      score: 7,
    },
  ],
  current_year: [
    {
      fromTable: 'current_year',
      toTable: 'last_year',
      relationship: 'time_window',
      on: ['wlbWellboreName', 'wlbEntryYear'],
      reason: 'Use the previous year as the principal benchmark for current-year operator, status, and area shifts.',
      score: 9,
    },
    {
      fromTable: 'current_year',
      toTable: 'all',
      relationship: 'overview',
      on: ['wlbWellboreName'],
      reason: 'Join back to the full dataset when you need a complete well context behind the current-year slice.',
      score: 7,
    },
  ],
  last_year: [
    {
      fromTable: 'last_year',
      toTable: 'current_year',
      relationship: 'time_window',
      on: ['wlbWellboreName', 'wlbEntryYear'],
      reason: 'Compare the prior year directly with the current year to surface changes in operator activity and status.',
      score: 9,
    },
    {
      fromTable: 'last_year',
      toTable: 'all',
      relationship: 'overview',
      on: ['wlbWellboreName'],
      reason: 'Use the full well list as a background dataset when the annual slice needs broader ownership or basin context.',
      score: 7,
    },
  ],
  last_10_years: [
    {
      fromTable: 'last_10_years',
      toTable: 'current_year',
      relationship: 'time_window',
      on: ['wlbWellboreName', 'wlbEntryYear'],
      reason: 'Place the newest year inside the longer trend to spot whether activity is accelerating or decelerating.',
      score: 9,
    },
    {
      fromTable: 'last_10_years',
      toTable: 'last_year',
      relationship: 'time_window',
      on: ['wlbWellboreName', 'wlbEntryYear'],
      reason: 'Use the prior year as the nearest annual checkpoint for interpreting the recent decade.',
      score: 8,
    },
  ],
} as const;

function normalize(text: string): string {
  return text.trim().toLowerCase();
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

export function planTableJoins(table: string): TableJoinPlan {
  const base = resolveExplicitTable(table);
  const joins = CURATED_JOIN_MAP[base.table] ?? [];

  const reachable = Array.from(
    new Set(joins.flatMap((join) => [join.toTable, ...(CURATED_JOIN_MAP[join.toTable] ?? []).map((step) => step.toTable)])),
  ) as FactpagesTableKey[];

  const orderedJoins = [...joins].sort((left, right) => right.score - left.score);

  return {
    baseTable: base.table,
    focus: 'curated',
    tableReason: `${base.reason} This curated join plan is the supported enrichment path for ${base.table}.`,
    joins: orderedJoins,
    reachableTables: reachable,
  };
}

export function suggestWellboreJoins(table: string): TableJoinPlan {
  return planTableJoins(table);
}

export function enrichWellboreTable(
  table: string,
  options: { limit?: number },
): Promise<EnrichedTableResult> {
  return (async () => {
    const plan = planTableJoins(table);
    const rows = await fetchFactpagesTable(plan.baseTable, { limit: normalizeFactpagesLimit(options.limit ?? 100) });
    const tableMetadata = FACTPAGES_TABLES.find((item) => item.key === plan.baseTable);
    const usedColumns = Array.from(
      new Set(plan.joins.flatMap((join) => join.on).concat(Object.keys(rows[0] ?? {}))),
    );

    return {
      plan,
      provenance: {
        source: buildFactpagesCsvUrl(plan.baseTable),
        selectedTable: plan.baseTable,
        selectedTableLabel: tableMetadata?.label ?? plan.baseTable,
        fetchedRowCount: rows.length,
        usedColumns,
        generatedAt: new Date().toISOString(),
      },
      reachableTables: plan.reachableTables,
      sampleRows: rows.slice(0, 3),
    };
  })();
}

export function planBusinessQuestion(question: string, table?: string): BusinessPlan {
  const tablePlan = table ? resolveExplicitTable(table) : { table: 'all', reason: 'No explicit table signal in question. Using all records for broad business coverage.' };

  return {
    table: tablePlan.table,
    tableReason: tablePlan.reason,
    metricId: 'table_join_plan',
    metricReason: 'Business meaning shifted from single-question metricing to table enrichment and reachability planning.',
    intent: 'distribution',
  };
}

export async function answerWellboreBusinessQuestion(
  question: string,
  options: { table?: string; limit?: number },
): Promise<BusinessAnswer> {
  const baseTable = options.table ?? 'all';
  const plan = planTableJoins(baseTable);
  const rows = await fetchFactpagesTable(baseTable, { limit: normalizeFactpagesLimit(options.limit ?? 100) });
  const tableMetadata = FACTPAGES_TABLES.find((item) => item.key === baseTable);

  return {
    question,
    plan: {
      table: baseTable,
      tableReason: plan.tableReason,
      metricId: 'table_join_plan',
      metricReason: 'Join-oriented business model: enrich dataset by generating reachable tables and related joins.',
      intent: 'distribution',
    },
    result: {
      metricId: 'table_join_plan',
      metricLabel: 'Table join plan',
      metricDescription: 'A curated join plan that enriches the selected table with related Factpages tables.',
      kind: 'distribution',
      value: plan.joins.map((join) => ({ name: join.toTable, count: join.score })),
      sampleRows: rows.slice(0, 3),
    },
    provenance: {
      source: buildFactpagesCsvUrl(baseTable),
      selectedTable: baseTable,
      selectedTableLabel: tableMetadata?.label ?? baseTable,
      fetchedRowCount: rows.length,
      usedColumns: Array.from(new Set(plan.joins.flatMap((join) => join.on))),
      generatedAt: new Date().toISOString(),
    },
    confidence: 0.9,
    reachableTables: plan.reachableTables,
  };
}
