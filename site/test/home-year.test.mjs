// Tests for the yearly home dates (#1051): next dates, seasons that span the
// new year, stale rules dropping out, and the rules file itself.
import test from 'node:test';
import assert from 'node:assert/strict';
import { nextOccurrence, homeEntries, isStale, ruleProblems, loadHomeRules } from '../src/lib/home-year.mjs';
import { CONTENT_DIR } from '../src/lib/content.mjs';

const rule = (over = {}) => ({
  slug: 'test-rule', kind: 'due', month: 9, day: 1, title: 'Test', org_name: 'Org',
  who_it_is_for: 'People in Monongalia County, WV.', what_to_do: 'Do it.', url: 'https://example.org/',
  topics: ['home'], sources: [{ url: 'https://example.org/', checked: '2026-11-01' }], ...over,
});

test('a date that has passed this year rolls to next year', () => {
  assert.deepEqual(nextOccurrence(rule(), '2026-11-01'), { starts: '2027-09-01', ends: '2027-09-01', year: 2027 });
  assert.equal(nextOccurrence(rule({ month: 12, day: 1 }), '2026-11-01').starts, '2026-12-01');
});

test('today counts as not over yet', () => {
  assert.equal(nextOccurrence(rule({ month: 11, day: 1 }), '2026-11-01').starts, '2026-11-01');
});

test('a season in progress shows the current one', () => {
  const fall = rule({ kind: 'season', month: 10, day: 1, end_month: 12, end_day: 31 });
  assert.deepEqual(nextOccurrence(fall, '2026-11-01'), { starts: '2026-10-01', ends: '2026-12-31', year: 2026 });
});

test('a season can run into the next year', () => {
  const winter = rule({ kind: 'season', month: 12, day: 1, end_month: 2, end_day: 28 });
  assert.deepEqual(nextOccurrence(winter, '2027-01-15'), { starts: '2026-12-01', ends: '2027-02-28', year: 2026 });
});

test('the next date is always within 12 months', () => {
  for (const today of ['2026-01-01', '2026-03-01', '2026-03-02', '2026-12-31']) {
    const n = nextOccurrence(rule({ month: 3, day: 1 }), today);
    assert.ok(n.starts >= today || n.ends >= today, today);
    assert.ok(Date.parse(n.starts) - Date.parse(today) < 366 * 864e5, today);
  }
});

test('a rule checked more than 13 months ago drops out with a warning', () => {
  const old = rule({ sources: [{ url: 'https://example.org/', checked: '2025-09-01' }] });
  assert.equal(isStale(old, '2026-11-01'), true);
  assert.equal(isStale(rule(), '2026-11-01'), false);
  const warnings = [];
  assert.equal(homeEntries([old], '2026-11-01', (w) => warnings.push(w)).length, 0);
  assert.equal(warnings.length, 1);
});

test('entries get a kind prefix, a yearly slug and the home rule', () => {
  const [e] = homeEntries([rule({ kind: 'tip' })], '2026-11-01');
  assert.equal(e.title, 'Tip: Test');
  assert.equal(e.slug, 'test-rule-2027');
  assert.equal(e.home_rule, 'test-rule');
});

test('high stakes topics and missing place name are refused', () => {
  assert.ok(ruleProblems(rule({ topics: ['home', 'money'] })).some((p) => p.includes('high stakes')));
  assert.ok(ruleProblems(rule({ who_it_is_for: 'Anyone.' })).some((p) => p.includes('Monongalia County, WV')));
  assert.ok(ruleProblems(rule({ month: 2, day: 30 })).some((p) => p.includes('real date')));
  assert.deepEqual(ruleProblems(rule()), []);
});

test('every rule in content/home-year.yaml is complete and shows up', () => {
  const rules = loadHomeRules(CONTENT_DIR);
  assert.ok(rules.length >= 13);
  for (const r of rules) assert.deepEqual(ruleProblems(r), [], r.slug);
  const today = rules.flatMap((r) => r.sources.map((s) => s.checked)).sort().at(-1);
  assert.equal(homeEntries(rules, today).length, rules.length);
});
