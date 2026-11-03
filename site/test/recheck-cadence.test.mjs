// Re-check cadence per record, from the risk rubric (#1461,
// docs/playbook/trust-and-ai.md). src/lib/content.mjs.
import test from 'node:test';
import assert from 'node:assert/strict';
import { recheckDaysFor, recheckProblems, recheckDue, staleDaysFor } from '../src/lib/content.mjs';

const rec = (topics, extra = {}) => ({ _file: 'resources/x.yaml', topics, sources: [{ url: 'https://example.org', checked: '2026-11-01' }], ...extra });

test('high-stakes topics and calendar entries re-check every 90 days', () => {
  assert.equal(recheckDaysFor(rec(['money'])), 90);
  assert.equal(recheckDaysFor(rec(['health', 'community'])), 90);
  assert.equal(recheckDaysFor({ _file: 'calendar/fair-2026-11-20.yaml', topics: ['community'] }), 90);
});

test('other records keep the card rule', () => {
  assert.equal(recheckDaysFor(rec(['outdoors'])), staleDaysFor(rec(['outdoors'])));
  assert.equal(recheckDaysFor(rec(['better'])), 90);
  assert.equal(recheckDaysFor({ _file: 'boards/tree-board.yaml', topics: ['better'] }), 90);
});

test('recheck_days on a record wins', () => {
  assert.equal(recheckDaysFor(rec(['outdoors'], { recheck_days: 30 })), 30);
  assert.equal(recheckDaysFor(rec(['money'], { recheck_days: 30 })), 30);
  assert.equal(recheckDaysFor(rec(['outdoors'], { recheck_days: 365 })), 365);
});

test('check-content refuses a slow or bad recheck_days', () => {
  assert.deepEqual(recheckProblems(rec(['outdoors'])), []);
  assert.deepEqual(recheckProblems(rec(['outdoors'], { recheck_days: 365 })), []);
  assert.equal(recheckProblems(rec(['money'], { recheck_days: 180 })).length, 1, 'a high-stakes record may not be slower than 90 days');
  assert.equal(recheckProblems(rec(['outdoors'], { recheck_days: 0 })).length, 1);
  assert.equal(recheckProblems(rec(['outdoors'], { recheck_days: 400 })).length, 1);
  assert.equal(recheckProblems(rec(['outdoors'], { recheck_days: '90' })).length, 1);
});

test('due when the oldest source is past the cadence', () => {
  const r = rec(['money'], { sources: [{ url: 'https://a.example', checked: '2026-11-01' }, { url: 'https://b.example', checked: '2026-08-01' }] });
  assert.equal(recheckDue(r, '2026-10-29'), false);
  assert.equal(recheckDue(r, '2026-11-01'), true);
  assert.equal(recheckDue(rec(['outdoors']), '2027-02-15'), false);
});

test('cards follow the cadence, never later than 6 months', () => {
  assert.equal(staleDaysFor(rec(['money'])), 90);
  assert.equal(staleDaysFor({ _file: 'calendar/fair-2026-11-20.yaml', topics: ['community'] }), 90);
  assert.equal(staleDaysFor(rec(['outdoors'])), 183);
  assert.equal(staleDaysFor(rec(['outdoors'], { recheck_days: 365 })), 183);
  assert.equal(staleDaysFor(rec(['outdoors'], { recheck_days: 30 })), 30);
});
