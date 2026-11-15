// Follow one estate (#1934, part of #1440): the marker moves day * K, every day
// count in the drawing is also in the words, and the drawing never shows a
// summed total for the whole estate (the lesson of #1925).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../src/components/ProbateJourney.astro', import.meta.url), 'utf8');
const K = Number(src.match(/const X0 = \d+, K = ([\d.]+);/)[1]);
const DAYS = { 2: 90, 3: 90, 4: 150, 5: 150 };

test('the marker moves day * K', () => {
  for (const [s, day] of Object.entries(DAYS)) {
    assert.match(src, new RegExp(`data-s="${s}"\\] \\.mark \\{ transform: translateX\\(${+(day * K).toFixed(1)}px\\)`), `step ${s}`);
  }
});

test('day counts in the drawing are in the words too', () => {
  const body = src.split('const steps = [')[1].split('];')[0];
  for (const n of ['ninety (90) days', '120 days', 'sixty (60) days', 'at the minimum four months']) assert.ok(body.includes(n), n);
  assert.doesNotMatch(src, /—/);
});

test('the creditor clock is marked as an example and no total is drawn', () => {
  assert.match(src, /Example: the appraisement is filed on day 90\./);
  const ticks = src.match(/const TICKS = (\[.*\]);/)[1];
  assert.doesNotMatch(ticks, /'180'|'240'/);
});
