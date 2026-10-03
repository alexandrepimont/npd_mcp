import test from 'node:test';
import assert from 'node:assert/strict';

import { answerWellboreBusinessQuestion, planBusinessQuestion } from '../src/domain/wellbore/business.ts';

test('planBusinessQuestion resolves metric from operator signal', () => {
  const plan = planBusinessQuestion('Who are the top drilling operators in the current year?');

  assert.equal(plan.metricId, 'top_operators');
  assert.equal(plan.table, 'current_year');
  assert.equal(plan.intent, 'ranking');
});

test('planBusinessQuestion rejects unknown explicit tables', () => {
  assert.throws(() => planBusinessQuestion('Show me wellbore status', 'unknown_table'));
});

test('answerWellboreBusinessQuestion returns deterministic provenance and metric output', async () => {
  const originalFetch = globalThis.fetch;
  const csv = [
    'wlbWellboreName,wlbDrillingOperator,wlbStatus,wlbMainArea,wlbEntryYear',
    '31/2-1,Operator A,COMPLETED,NORTH SEA,2025',
    '31/2-2,Operator A,DRY,NORTH SEA,2025',
    '31/2-3,Operator B,COMPLETED,NORWEGIAN SEA,2024',
  ].join('\n');

  globalThis.fetch = async () =>
    new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
      },
    });

  try {
    const answer = await answerWellboreBusinessQuestion('Who is drilling the most wells?', {
      table: 'all',
      limit: 10,
    });

    assert.equal(answer.result.metricId, 'top_operators');
    assert.equal(answer.result.kind, 'distribution');
    assert.equal(answer.provenance.selectedTable, 'all');
    assert.equal(answer.provenance.fetchedRowCount, 3);
    assert.ok(Array.isArray(answer.result.value));
    const distribution = answer.result.value as { name: string; count: number }[];
    assert.equal(distribution[0]?.name, 'Operator A');
    assert.equal(distribution[0]?.count, 2);
    assert.ok(answer.confidence >= 0.45);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
