import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import {
  DEFAULT_FACTPAGES_FETCH_LIMIT,
  FACTPAGES_TABLES,
  type FactpagesCulture,
  MAX_FACTPAGES_FETCH_LIMIT,
  buildFactpagesCsvUrl,
  fetchFactpagesTable,
} from './factpagesClient.js';
import { answerWellboreBusinessQuestion } from './wellboreBusiness.js';

export const server = new McpServer({
  name: '@alexandrepimont/npd-mcp',
  version: '0.0.1',
});

type McpTextContent = {
  type: 'text';
  text: string;
};

type McpToolResponse = {
  content: McpTextContent[];
  isError?: boolean;
};

const MAX_BUSINESS_QUESTION_LIMIT = 250;

function successResponse(payload: unknown): McpToolResponse {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(payload, null, 2),
      },
    ],
  };
}

function errorResponse(error: unknown): McpToolResponse {
  return {
    isError: true,
    content: [
      {
        type: 'text',
        text: `Error description: ${error instanceof Error ? error.message : String(error)}`,
      },
    ],
  };
}

function withMcpErrorHandling(handler: () => Promise<unknown> | unknown): () => Promise<McpToolResponse>;
function withMcpErrorHandling<TArgs>(handler: (args: TArgs) => Promise<unknown> | unknown): (args: TArgs) => Promise<McpToolResponse>;
function withMcpErrorHandling<TArgs>(handler: (args?: TArgs) => Promise<unknown> | unknown) {
  return async (args?: TArgs): Promise<McpToolResponse> => {
    try {
      const payload = await handler(args);
      return successResponse(payload);
    } catch (error) {
      return errorResponse(error);
    }
  };
}

server.registerTool(
  'list_factpages_tables',
  {
    description: 'List the Factpages wellbore exploration tables that are directly available via CSV export endpoints.',
  },
  withMcpErrorHandling(async () => {
    return FACTPAGES_TABLES.map((table) => ({
      key: table.key,
      label: table.label,
      route: table.route,
      category: table.category,
    }));
  }),
);

server.registerTool(
  'fetch_factpages_table',
  {
    description: 'Fetch a Factpages wellbore exploration table as structured CSV rows using the public export endpoint.',
    inputSchema: {
      table: z.string().describe('Table key such as all, all_short, current_year, last_year, or last_10_years.'),
      limit: z.number().int().positive().max(MAX_FACTPAGES_FETCH_LIMIT).optional().describe('Maximum number of rows to return.'),
      culture: z.enum(['en', 'nb-no']).optional().describe('Language code for the export endpoint.'),
    },
  },
  withMcpErrorHandling(async ({
    table,
    limit = DEFAULT_FACTPAGES_FETCH_LIMIT,
    culture = 'en',
  }: {
    table: string;
    limit?: number;
    culture?: FactpagesCulture;
  }) => {
    const rows = await fetchFactpagesTable(table, { limit, culture });

    return {
      table,
      culture,
      source: buildFactpagesCsvUrl(table, culture),
      rowCount: rows.length,
      rows,
    };
  }),
);

server.registerTool(
  'ask_wellbore_business_question',
  {
    description: 'Plan and answer wellbore business questions using semantic metric selection, deterministic aggregation, and source provenance.',
    inputSchema: {
      question: z.string().describe('Business question to answer using the Factpages data.'),
      table: z
        .string()
        .optional()
        .describe('Optional table key. If omitted, the planner selects the best table from question hints.'),
      limit: z.number().int().positive().max(MAX_BUSINESS_QUESTION_LIMIT).optional().describe('Maximum number of rows to use in the business summary.'),
    },
  },
  withMcpErrorHandling(async ({
    question,
    table,
    limit = 100,
  }: {
    question: string;
    table?: string;
    limit?: number;
  }) => {
    return answerWellboreBusinessQuestion(question, { table, limit });
  }),
);