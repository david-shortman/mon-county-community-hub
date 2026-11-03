// Tests for src/lib/year-strip.mjs (#1448), with the real content/home-year.yaml.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadHomeRules } from '../src/lib/home-year.mjs';
import { yearStrip, partIn, dateWords, MONTHS } from '../src/lib/year-strip.mjs';

const rules = loadHomeRules(new URL('../../content/', import.meta.url).pathname);
const ys = yearStrip(rules);

test('frost marks come from half_of_years, and match the words in the rule', () => {
  for (const slug of ['last-spring-frost', 'first-fall-frost']) {
    const r = rules.find((x) => x.slug === slug);
    const words = dateWords(r.half_of_years.month, r.half_of_years.day);
    assert.match(r.what_to_do, new RegExp(`half of years[^.]*${words}`), `${slug}: what_to_do says half of years by ${words}`);
  }
  assert.deepEqual([ys.spring.month, ys.spring.day, ys.fall.month, ys.fall.day], [4, 23, 10, 24]);
});

test('the growing season fills from after the spring frost to the fall frost', () => {
  const g = ys.months.map((m) => m.grow);
  for (const i of [0, 1, 2, 10, 11]) assert.equal(g[i], null, MONTHS[i]);
  assert.ok(Math.abs(g[3].a - 23 / 30) < 1e-9 && g[3].b === 1);
  for (const i of [4, 5, 6, 7, 8]) assert.deepEqual(g[i], { a: 0, b: 1 });
  assert.ok(g[9].a === 0 && Math.abs(g[9].b - 24 / 31) < 1e-9);
  assert.equal(ys.days, 184);
});

test('every rule shows once, in its own month, and in its step words', () => {
  const shown = ys.months.flatMap((m) => m.items.map((it) => [it.slug, m.m]));
  assert.equal(shown.length, rules.length);
  for (const [slug, m] of shown) assert.equal(rules.find((r) => r.slug === slug).month, m);
  const words = ys.steps.flatMap((s) => s.list).join(' ');
  for (const r of rules) assert.ok(words.includes(dateWords(r.month, r.day)), r.slug);
});

test('a range that runs into the next year', () => {
  const from = { month: 11, day: 15 }, to = { month: 2, day: 10 };
  assert.deepEqual(partIn(12, from, to), { a: 0, b: 1 });
  assert.ok(partIn(2, from, to).b < 0.4);
  assert.equal(partIn(5, from, to), null);
});

test('plain words, no em dashes', () => {
  for (const s of ys.steps) for (const t of [s.title, s.text, ...s.list]) assert.doesNotMatch(t, /—/);
});
