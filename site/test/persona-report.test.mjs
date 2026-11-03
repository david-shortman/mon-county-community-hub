// Scoreboard persona line (#1037). scripts/persona-report.mjs.
import test from 'node:test';
import assert from 'node:assert/strict';
import { latestScores, personaCounts, personaLine } from '../scripts/persona-report.mjs';

test('uses the latest score for each question', () => {
  const s = latestScores([
    { date: '2026-11-01', results: [{ id: 'q1', total: 12 }] },
    { date: '2026-10-28', results: [{ id: 'q1', total: 4 }, { id: 'q2', total: 9 }] },
  ]);
  assert.equal(s.get('q1').total, 12);
  assert.equal(s.get('q2').total, 9);
});

test('counts paths, passing questions and uncovered needs', () => {
  const personas = [
    { slug: 'a', needs: ['n1'], questions: ['q1'] },
    { slug: 'b', needs: ['n1'], questions: ['q2'] },
    { slug: 'c', needs: [], questions: [] },
  ];
  const needs = [{ slug: 'n1', get_help: [{ path: '/x/' }] }, { slug: 'n2', get_help: [] }];
  const scores = new Map([['q1', { total: 12, date: '2026-11-01' }], ['q2', { total: 9, date: '2026-11-01' }]]);
  const c = personaCounts({ personas, needs, scores, pathOk: (p) => p.slug !== 'c' });
  assert.equal(c.withPath, 2);
  assert.deepEqual(c.passing, ['a']);
  assert.deepEqual(c.failing, ['b']);
  assert.deepEqual(c.noPersona, ['n2']);
  assert.deepEqual(c.noPage, ['n2']);
  assert.match(personaLine(c, '2026-11-02', '2026-11-01'), /2 of 3 personas pass the path check; 1 of 2 scored personas/);
});
