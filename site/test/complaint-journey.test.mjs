// Follow one complaint (#1890): the drawing's numbers match its own day line,
// and every day count in the drawing is also in the step text.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../src/components/ComplaintJourney.astro', import.meta.url), 'utf8');
const K = Number(src.match(/const X0 = \d+, K = ([\d.]+);/)[1]);
const DAYS = [0, 1, 21, 42, 60];

test('the marker moves day * K and the line fills to day / 80', () => {
  DAYS.slice(1).forEach((day, i) => {
    const s = i + 2;
    const mv = src.match(new RegExp(`data-s="${s}"\\] \\.mark \\{ transform: translateX\\(([\\d.]+)px\\)`));
    const fl = src.match(new RegExp(`data-s="${s}"\\] \\.fill \\{ transform: scaleX\\(([\\d.]+)\\)`));
    assert.ok(mv && fl, `step ${s} rules`);
    assert.equal(Number(mv[1]), +(day * K).toFixed(1), `step ${s} marker`);
    assert.equal(Number(fl[1]), day / 80, `step ${s} fill`);
  });
});

test('day counts in the drawing are in the words too', () => {
  const body = src.split('const steps = [')[1].split('];')[0];
  for (const n of ['24 hours', '20 days', '21 days', '20 more days']) assert.ok(body.includes(n), n);
  assert.doesNotMatch(src, /—/);
});

// #1925: each step's days come from a different rule, so the end of the line
// is the city's own range, never a single summed number like 62.
test('the end of the day line is the city range, not a summed number', () => {
  const ticks = src.match(/const TICKS = (\[.*\]);/)[1];
  assert.doesNotMatch(ticks, /'62'/);
  assert.match(src, /e-range/);
  assert.match(src, /60 to 80\+ days/);
});
