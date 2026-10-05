import test from 'node:test';
import assert from 'node:assert/strict';

import { FACTPAGES_TABLES } from '../../knowledge_graph/factpages/index.ts';
import { BAA_FACTPAGES_SECTION } from '../../knowledge_graph/factpages/baa/index.ts';
import { WELLBORE_FACTPAGES_SECTION } from '../../knowledge_graph/factpages/wellbore/index.ts';

test('knowledge graph exposes AI-friendly metadata for all Factpages tables', () => {
  assert.ok(Array.isArray(FACTPAGES_TABLES));
  assert.ok(FACTPAGES_TABLES.length >= 5);

  for (const table of FACTPAGES_TABLES) {
    assert.ok(table.key);
    assert.ok(table.label);
    assert.ok(table.route);
    assert.ok(table.explanation);
    assert.ok(table.aiSummary);
    assert.ok(Array.isArray(table.relatedTerms));
    assert.ok(table.urlTemplate.includes('{route}'));
  }
});

test('BAA section contains nested attributes and table-view groups', () => {
  const groupSlugs = BAA_FACTPAGES_SECTION.groups.map((group) => group.slug);

  assert.ok(groupSlugs.includes('attributes'));
  assert.ok(groupSlugs.includes('table_view'));
  assert.ok(BAA_FACTPAGES_SECTION.groups.some((group) => group.slug === 'table_view' && group.tables.some((table) => table.key === 'overview')));
  assert.ok(BAA_FACTPAGES_SECTION.groups.some((group) => group.slug === 'table_view' && group.tables.some((table) => table.key === 'licensees')));
});

test('wellbore section includes development, other, and carbon-storage related groups', () => {
  const groupSlugs = WELLBORE_FACTPAGES_SECTION.groups.map((group) => group.slug);

  assert.ok(groupSlugs.includes('development'));
  assert.ok(groupSlugs.includes('other'));
  assert.ok(groupSlugs.includes('co2_storage'));
  assert.ok(WELLBORE_FACTPAGES_SECTION.groups.some((group) => group.slug === 'co2_storage' && group.tables.length >= 1));
});
