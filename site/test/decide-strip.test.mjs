// The time strip on When plans and budgets get decided (#1444).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { strip, yearPos, ZOOMS } from '../src/lib/decide-strip.mjs';

test('a budget year starts July 1 and March comes before April', () => {
  assert.equal(yearPos(7, 1), 0);
  assert.ok(yearPos(6, 30) < 1 && yearPos(6, 30) > 0.99);
  assert.ok(yearPos(3, 7) < yearPos(3, 28));
  assert.ok(yearPos(3, 28) < yearPos(4, 15));
});

test('each zoom makes one hidden drawing', () => {
  for (const z of ZOOMS) {
    const svg = strip(z);
    assert.match(svg, new RegExp(`data-z="${z}"`));
    assert.match(svg, /aria-hidden="true"/);
  }
  assert.throws(() => strip('2'), RangeError);
});

test('the dates drawn match the dates in the page text', () => {
  assert.match(strip('1'), /March 7 to 28/);
  assert.match(strip('1'), /July 1/);
  assert.match(strip('1'), /June 30/);
  assert.match(strip('5'), /2027-2031/);
  assert.match(strip('10'), /Dec 2023/);
  assert.match(strip('10'), /Feb 2023/);
  assert.match(strip('5'), /July 2027 to June 2031/);
});

test('no amounts in the drawing', () => {
  for (const z of ZOOMS) assert.doesNotMatch(strip(z), /\$/);
});

test('the scroll story drawing holds all three strips and starts at one year', async () => {
  const { stage } = await import('../src/lib/decide-strip.mjs');
  const svg = stage();
  assert.match(svg, /data-z="1"/);
  for (const g of ['z-yr', 'z-five', 'z-ten']) assert.ok(svg.includes(`z ${g}`), g);
  assert.match(svg, /t-idea/);
  assert.match(svg, /t-now/);
  assert.match(svg, /aria-hidden="true"/);
});
