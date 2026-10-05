import test from 'node:test';
import assert from 'node:assert/strict';

import { enrichWellboreTable, planTableJoins } from '../../src/domain/wellbore/business.ts';

test('planTableJoins enriches all with curated time-window tables', () => {
  const plan = planTableJoins('all');

  assert.equal(plan.baseTable, 'all');
  assert.equal(plan.focus, 'curated');
  assert.ok(plan.joins.some((join) => join.toTable === 'current_year'));
  assert.ok(plan.reachableTables.includes('last_10_years'));
});

test('planTableJoins rejects unknown explicit tables', () => {
  assert.throws(() => planTableJoins('unknown_table'));
});

test('enrichWellboreTable returns a deterministic curated join plan', async () => {
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
    const answer = await enrichWellboreTable('all', { limit: 10 });

    assert.equal(answer.plan.baseTable, 'all');
    assert.equal(answer.plan.focus, 'curated');
    assert.equal(answer.provenance.selectedTable, 'all');
    assert.equal(answer.provenance.fetchedRowCount, 3);
    assert.ok(answer.reachableTables.includes('last_year'));
    assert.ok(answer.plan.joins.some((join) => join.toTable === 'current_year'));
  } finally {
    globalThis.fetch = originalFetch;
  }
});
