import { FACTPAGES_TABLES } from '../../knowledge_graph/factpages/index.ts';

export type MetricValue = {
  name: string;
  count: number;
};

export type MetricResult = {
  kind: 'count' | 'distribution';
  value: number | MetricValue[];
  sampleRows: Record<string, string>[];
};

export type MetricDefinition = {
  id: string;
  label: string;
  description: string;
  intent: 'overview' | 'ranking' | 'distribution' | 'trend';
  signals: string[];
  requiredColumns: string[];
  supportedTables: string[];
  compute: (rows: Record<string, string>[]) => MetricResult;
};

function normalize(text: string): string {
  return text.trim().toLowerCase();
}

function topValues(rows: Record<string, string>[], columnName: string, topN = 5): MetricValue[] {
  const counts = rows
    .map((row) => row[columnName] ?? '')
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
    .reduce<Record<string, number>>((accumulator, value) => {
      accumulator[value] = (accumulator[value] ?? 0) + 1;
      return accumulator;
    }, {});

  return Object.entries(counts)
    .sort((left, right) => right[1] - left[1])
    .slice(0, topN)
    .map(([name, count]) => ({ name, count }));
}

const WELLBORE_TABLE_KEYS = FACTPAGES_TABLES.map((table) => table.key);

export const WELLBORE_METRICS: MetricDefinition[] = [
  {
    id: 'wellbore_count',
    label: 'Wellbore count',
    description: 'Total count of rows in the selected wellbore dataset.',
    intent: 'overview',
    signals: ['how many', 'count', 'total', 'size', 'volume', 'overview'],
    requiredColumns: [],
    supportedTables: WELLBORE_TABLE_KEYS,
    compute: (rows) => ({
      kind: 'count',
      value: rows.length,
      sampleRows: rows.slice(0, 3),
    }),
  },
  {
    id: 'top_operators',
    label: 'Top drilling operators',
    description: 'Distribution of rows by drilling operator.',
    intent: 'ranking',
    signals: ['operator', 'company', 'who', 'top operator', 'drilling operator'],
    requiredColumns: ['wlbDrillingOperator'],
    supportedTables: WELLBORE_TABLE_KEYS,
    compute: (rows) => ({
      kind: 'distribution',
      value: topValues(rows, 'wlbDrillingOperator'),
      sampleRows: rows.slice(0, 3),
    }),
  },
  {
    id: 'status_distribution',
    label: 'Status distribution',
    description: 'Distribution of rows by wellbore status.',
    intent: 'distribution',
    signals: ['status', 'result', 'success', 'dry', 'plugged'],
    requiredColumns: ['wlbStatus'],
    supportedTables: WELLBORE_TABLE_KEYS,
    compute: (rows) => ({
      kind: 'distribution',
      value: topValues(rows, 'wlbStatus'),
      sampleRows: rows.slice(0, 3),
    }),
  },
  {
    id: 'main_area_distribution',
    label: 'Main area distribution',
    description: 'Distribution of rows by main area.',
    intent: 'distribution',
    signals: ['area', 'basin', 'region', 'where', 'main area'],
    requiredColumns: ['wlbMainArea'],
    supportedTables: WELLBORE_TABLE_KEYS,
    compute: (rows) => ({
      kind: 'distribution',
      value: topValues(rows, 'wlbMainArea'),
      sampleRows: rows.slice(0, 3),
    }),
  },
  {
    id: 'entry_year_distribution',
    label: 'Entry year distribution',
    description: 'Distribution of rows by entry year.',
    intent: 'trend',
    signals: ['year', 'when', 'entry year', 'trend', 'historical'],
    requiredColumns: ['wlbEntryYear'],
    supportedTables: WELLBORE_TABLE_KEYS,
    compute: (rows) => ({
      kind: 'distribution',
      value: topValues(rows, 'wlbEntryYear'),
      sampleRows: rows.slice(0, 3),
    }),
  },
];

export function scoreMetricSignals(metric: MetricDefinition, question: string): number {
  const normalized = normalize(question);
  return metric.signals.reduce((score, signal) => {
    return normalized.includes(signal) ? score + 1 : score;
  }, 0);
}
