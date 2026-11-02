// Tests for src/lib/chart-guide.mjs: the guided look at the unemployment chart (#1451).
import test from 'node:test';
import assert from 'node:assert/strict';
import { chartGuide } from '../src/lib/chart-guide.mjs';

const p = (month, value, preliminary = false) => ({ month, label: month, value, preliminary });

test('newest month, a year before, and the difference, from the data', () => {
  const g = chartGuide([p('2025-09', 3.5), p('2025-11', 3.8), p('2026-09', 2.8, true)], { top: 5 });
  assert.equal(g.latest.month, '2026-09');
  assert.equal(g.yearAgo.month, '2025-09');
  assert.equal(g.diff, -0.7);
  assert.deepEqual(g.steps.map((s) => s.key), ['latest', 'year', 'read']);
  assert.deepEqual(g.steps.map((s) => s.i), [2, 0, 2]);
  assert.match(g.steps[0].text, /was 2\.8%\. This is a preliminary number/);
  assert.match(g.steps[1].text, /was 3\.5%\. So 2026-09 was 0\.7 percentage points lower than a year before\./);
  assert.match(g.steps[2].text, /from 0% to 5%/);
});

test('rounding, the same value, and one point', () => {
  assert.match(chartGuide([p('2025-01', 3.1), p('2026-01', 3.1)]).steps[1].text, /the same as a year before/);
  assert.match(chartGuide([p('2025-01', 2.0), p('2026-01', 3.0)]).steps[1].text, /1 percentage point higher than/);
  assert.equal(chartGuide([p('2025-01', 0.1), p('2026-01', 0.3)]).diff, 0.2);
});

test('no same month a year before: two steps, nothing made up', () => {
  const g = chartGuide([p('2025-10', 3), p('2026-09', 3)]);
  assert.equal(g.yearAgo, null);
  assert.deepEqual(g.steps.map((s) => s.key), ['latest', 'read']);
  assert.equal(chartGuide([]), null);
});

test('no em dashes and no why words', () => {
  const g = chartGuide([p('2025-09', 3.5), p('2026-09', 2.8)]);
  for (const s of g.steps) {
    assert.doesNotMatch(s.text, /—/);
    assert.doesNotMatch(s.text, /because|due to|thanks to|improv|worse|better/i);
  }
});
