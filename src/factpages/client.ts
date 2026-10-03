import { FACTPAGES_TABLES as FACTPAGES_TABLE_GRAPH } from '../../knowledge_graph/factpages/index.ts';

export const FACTPAGES_TABLES = FACTPAGES_TABLE_GRAPH;
export const FACTPAGES_REQUEST_TIMEOUT_MS = 15_000;
export const DEFAULT_FACTPAGES_FETCH_LIMIT = 25;
export const MAX_FACTPAGES_FETCH_LIMIT = 500;

export type FactpagesCulture = 'en' | 'nb-no';

export type FactpagesTableKey = (typeof FACTPAGES_TABLES)[number]['key'];

export type FetchFactpagesTableOptions = {
  limit?: number;
  culture?: FactpagesCulture;
};

export function normalizeTableKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export function resolveFactpagesTableRoute(table: string): string {
  const normalized = normalizeTableKey(table);
  const match = FACTPAGES_TABLES.find((item) => item.key === normalized);

  if (match) {
    return match.route;
  }

  const known = FACTPAGES_TABLES.map((item) => item.key).join(', ');
  throw new Error(`Unknown factpages table "${table}". Try one of: ${known}`);
}

export function buildFactpagesCsvUrl(
  table: string,
  culture: FactpagesCulture = 'en',
): string {
  const route = resolveFactpagesTableRoute(table);

  return `https://factpages.sodir.no/public?/Factpages/external/tableview/${route}&rs:Command=Render&rc:Toolbar=false&rc:Parameters=f&IpAddress=not_used&CultureCode=${culture}&rs:Format=CSV&Top100=false`;
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === '"') {
      if (insideQuotes && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (char === ',' && !insideQuotes) {
      cells.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current);
  return cells.map((cell) => cell.trim());
}

export function parseCsvRows(csvText: string): Record<string, string>[] {
  const rows = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (rows.length === 0) {
    return [];
  }

  const headers = parseCsvLine(rows[0]);

  return rows.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const record: Record<string, string> = {};

    headers.forEach((header, index) => {
      record[header] = values[index] ?? '';
    });

    return record;
  });
}

export async function fetchFactpagesTable(
  table: string,
  options: FetchFactpagesTableOptions = {},
): Promise<Record<string, string>[]> {
  const limit = normalizeFactpagesLimit(options.limit);
  const culture = normalizeFactpagesCulture(options.culture);
  const url = buildFactpagesCsvUrl(table, culture);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, FACTPAGES_REQUEST_TIMEOUT_MS);

  let response: Response;

  try {
    response = await fetch(url, {
      headers: {
        Accept: 'text/csv,text/plain,*/*',
        'User-Agent': 'Mozilla/5.0 (compatible; npd-mcp/1.0; +https://github.com/alexandrepimont/npd_mcp)',
      },
      signal: controller.signal,
    });
  } catch (error) {
    if (isAbortError(error)) {
      throw new Error(`Factpages CSV request timed out after ${FACTPAGES_REQUEST_TIMEOUT_MS}ms`);
    }

    throw new Error(`Factpages CSV request failed: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new Error(`Factpages CSV request failed with status ${response.status}: ${response.statusText}`);
  }

  const csvText = await response.text();
  const rows = parseCsvRows(csvText);
  return rows.slice(0, limit);
}

export function normalizeFactpagesCulture(culture?: string): FactpagesCulture {
  if (!culture || culture === 'en') {
    return 'en';
  }

  if (culture === 'nb-no') {
    return 'nb-no';
  }

  throw new Error(`Unsupported culture "${culture}". Use "en" or "nb-no".`);
}

export function normalizeFactpagesLimit(limit?: number): number {
  if (limit === undefined) {
    return DEFAULT_FACTPAGES_FETCH_LIMIT;
  }

  if (!Number.isInteger(limit) || limit <= 0) {
    throw new Error('Limit must be a positive integer.');
  }

  if (limit > MAX_FACTPAGES_FETCH_LIMIT) {
    throw new Error(`Limit must be less than or equal to ${MAX_FACTPAGES_FETCH_LIMIT}.`);
  }

  return limit;
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}
