import test from 'node:test';
import assert from 'node:assert/strict';

import { connectMcpTestClient, parseJsonToolResponse } from '../helpers/mcpHarness.ts';

const MOCK_CSV = [
  'wlbWellboreName,wlbDrillingOperator,wlbStatus,wlbMainArea,wlbEntryYear',
  '31/2-1,Operator A,COMPLETED,NORTH SEA,2025',
  '31/2-2,Operator A,DRY,NORTH SEA,2025',
  '31/2-3,Operator B,COMPLETED,NORWEGIAN SEA,2024',
  '31/2-4,Operator C,DRY,BARENTS SEA,2023',
].join('\n');

async function withMockedFetch<T>(run: () => Promise<T>): Promise<T> {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response(MOCK_CSV, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
      },
    });

  try {
    return await run();
  } finally {
    globalThis.fetch = originalFetch;
  }
}

test('business tool generates enrich join plan for a base table', async () => {
  const { client, close } = await connectMcpTestClient();

  try {
    await withMockedFetch(async () => {
      const result = await client.callTool({
        name: 'suggest_wellbore_join',
        arguments: {
          table: 'all',
        },
      });

      assert.notEqual(result.isError, true);
      const payload = parseJsonToolResponse(result) as {
        baseTable: string;
        focus: string;
        joins: Array<{ toTable: string }>;
        reachableTables: string[];
      };

      assert.equal(payload.baseTable, 'all');
      assert.equal(payload.focus, 'curated');
      assert.ok(payload.joins.some((join) => join.toTable === 'current_year'));
      assert.ok(payload.reachableTables.includes('last_10_years'));
    });
  } finally {
    await close();
  }
});

test('business tool generates reach plan for a time-window table', async () => {
  const { client, close } = await connectMcpTestClient();

  try {
    await withMockedFetch(async () => {
      const result = await client.callTool({
        name: 'suggest_wellbore_join',
        arguments: {
          table: 'current_year',
        },
      });

      assert.notEqual(result.isError, true);
      const payload = parseJsonToolResponse(result) as {
        baseTable: string;
        focus: string;
        joins: Array<{ toTable: string }>;
      };

      assert.equal(payload.baseTable, 'current_year');
      assert.equal(payload.focus, 'curated');
      assert.ok(payload.joins.some((join) => join.toTable === 'last_year'));
    });
  } finally {
    await close();  }
});
