import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildFactpagesCsvUrl,
  normalizeFactpagesCulture,
  normalizeFactpagesLimit,
  parseCsvRows,
} from '../../src/factpages/client.ts';

test('buildFactpagesCsvUrl builds the public CSV endpoint', () => {
  const url = buildFactpagesCsvUrl('all');

  assert.match(url, /wellbore_exploration_all/);
  assert.match(url, /rs:Format=CSV/);
});

test('parseCsvRows parses quoted CSV payload deterministically', () => {
  const csv = [
    'wlbWellboreName,wlbDrillingOperator,wlbStatus',
    '31/2-1,"Company, Inc.",COMPLETED',
    '31/2-2,Operator B,DRY',
  ].join('\n');

  const rows = parseCsvRows(csv);

  assert.equal(rows.length, 2);
  assert.equal(rows[0].wlbWellboreName, '31/2-1');
  assert.equal(rows[0].wlbDrillingOperator, 'Company, Inc.');
  assert.equal(rows[1].wlbStatus, 'DRY');
});

test('normalizeFactpagesCulture validates supported values', () => {
  assert.equal(normalizeFactpagesCulture(undefined), 'en');
  assert.equal(normalizeFactpagesCulture('en'), 'en');
  assert.equal(normalizeFactpagesCulture('nb-no'), 'nb-no');
  assert.throws(() => normalizeFactpagesCulture('fr'));
});

test('normalizeFactpagesLimit validates bounds and integer values', () => {
  assert.equal(normalizeFactpagesLimit(undefined), 25);
  assert.equal(normalizeFactpagesLimit(10), 10);
  assert.throws(() => normalizeFactpagesLimit(0));
  assert.throws(() => normalizeFactpagesLimit(-1));
  assert.throws(() => normalizeFactpagesLimit(3.5));
  assert.throws(() => normalizeFactpagesLimit(1000));
});
