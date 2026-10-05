import test from 'node:test';
import assert from 'node:assert/strict';

import { connectMcpTestClient, parseJsonToolResponse } from '../helpers/mcpHarness.ts';

test('e2e list_factpages_tables returns visible table catalog', async () => {
  const { client, close } = await connectMcpTestClient();

  try {
    const result = await client.callTool({
      name: 'list_factpages_tables',
      arguments: {},
    });

    assert.notEqual(result.isError, true);
    const payload = parseJsonToolResponse(result) as Array<{ key: string; label: string; route: string }>;
    assert.ok(payload.length >= 5);
    assert.ok(payload.some((item) => item.key === 'all'));
  } finally {
    await close();
  }
});

test('e2e fetch_factpages_table returns mocked rows and respects limit', async () => {
  const { client, close } = await connectMcpTestClient();
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async () =>
    new Response(
      [
        'wlbWellboreName,wlbDrillingOperator,wlbStatus',
        '31/2-1,Operator A,COMPLETED',
        '31/2-2,Operator B,DRY',
        '31/2-3,Operator C,COMPLETED',
      ].join('\n'),
      {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
        },
      },
    );

  try {
    const result = await client.callTool({
      name: 'fetch_factpages_table',
      arguments: {
        table: 'all',
        limit: 2,
      },
    });

    assert.notEqual(result.isError, true);
    const payload = parseJsonToolResponse(result) as {
      table: string;
      rowCount: number;
      rows: Record<string, string>[];
    };

    assert.equal(payload.table, 'all');
    assert.equal(payload.rowCount, 2);
    assert.equal(payload.rows.length, 2);
  } finally {
    globalThis.fetch = originalFetch;
    await close();
  }
});
