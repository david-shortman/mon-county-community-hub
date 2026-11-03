// The "Serves:" line on new issues (#1037). src/lib/serves.mjs.
import test from 'node:test';
import assert from 'node:assert/strict';
import { servesLine, servesProblems } from '../src/lib/serves.mjs';

test('reads the Serves line in plain or bold form', () => {
  assert.deepEqual(servesLine('What\n\nServes: short-on-food, enough-food\n'), ['short-on-food', 'enough-food']);
  assert.deepEqual(servesLine('**Serves:** `nowhere-to-sleep`'), ['nowhere-to-sleep']);
  assert.equal(servesLine('This serves nobody in particular'), null);
});

test('lists new issues with no Serves line or an unknown one', () => {
  const known = new Set(['nowhere-to-sleep', 'enough-food']);
  const issues = [
    { number: 1, created_at: '2026-11-04T00:00:00Z', body: 'Serves: nowhere-to-sleep', labels: [] },
    { number: 2, created_at: '2026-11-04T00:00:00Z', body: 'No line', labels: [] },
    { number: 3, created_at: '2026-11-04T00:00:00Z', body: 'Serves: someone-else', labels: [] },
    { number: 4, created_at: '2026-10-01T00:00:00Z', body: 'Old issue', labels: [] },
    { number: 5, created_at: '2026-11-04T00:00:00Z', body: 'Weekly list', labels: [{ name: 'checklist' }] },
    { number: 6, created_at: '2026-11-04T00:00:00Z', body: 'Serves: project', labels: [] },
  ];
  const { missing, unknown } = servesProblems(issues, known, '2026-11-03');
  assert.deepEqual(missing.map((i) => i.number), [2]);
  assert.deepEqual(unknown.map((u) => u.issue.number), [3]);
});

test('reads the issue form heading', () => {
  assert.deepEqual(servesLine('### What needs doing\n\nX\n\n### Serves\n\nshort-on-food\n\n### Why'), ['short-on-food']);
  assert.equal(servesLine('### Serves\n\n_No response_\n'), null);
});
