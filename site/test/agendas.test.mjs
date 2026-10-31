// Checks for the agenda guide rules (#529): the word check catches judging
// words and em dashes, and the real guide files pass.
import test from 'node:test';
import assert from 'node:assert/strict';
import { agendaProblems, wordProblems, clock } from '../src/lib/agendas.mjs';

const guide = (items, extra = {}) => ({
  _file: 'agendas/x.yaml', slug: 'x', body: 'city-council', meeting: 'Regular meeting', date: '2026-11-10', time: '19:00',
  place: 'Council Chambers', watch: 'YouTube', agenda_url: 'https://example.gov/a', read: '2026-11-06',
  sources: [{ url: 'https://example.gov/a', checked: '2026-11-06' }], items, ...extra,
});
const item = (line, kind = 'vote') => ({ number: '1', title: 'An Ordinance', kind, line });

test('the real guide files pass', () => assert.deepEqual(agendaProblems(), []));
test('a plain line passes', () => assert.deepEqual(agendaProblems([guide([item('A vote on a contract for paving.')])]), []));
test('judging words fail', () => {
  for (const line of ['A controversial vote on paving.', 'This should pass.', 'A costly contract.', 'Supporters want this.', 'It will pass.']) {
    assert.ok(agendaProblems([guide([item(line)])]).some((p) => /judging word/.test(p)), line);
  }
});
test('em dashes fail', () => assert.ok(wordProblems('A vote — on paving').length));
test('unknown kinds and missing agenda source fail', () => {
  assert.ok(agendaProblems([guide([item('A vote.', 'hot-topic')])]).some((p) => /kind must be/.test(p)));
  assert.ok(agendaProblems([guide([item('A vote.')], { sources: [{ url: 'https://example.gov/other', checked: '2026-11-06' }] })]).some((p) => /agenda_url/.test(p)));
});
test('clock reads like the rest of the site', () => {
  assert.equal(clock('19:00'), '7 p.m.');
  assert.equal(clock('10:00'), '10 a.m.');
  assert.equal(clock('17:30'), '5:30 p.m.');
});
