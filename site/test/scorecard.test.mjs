// Weekly scorecard helpers (#1052).
import test from 'node:test';
import assert from 'node:assert/strict';
import { isoWeek, compare } from '../scripts/scorecard.mjs';
import { pick } from '../scripts/lighthouse.mjs';
import { NOT_YET, phoneDigits } from '../scripts/check-typed-facts.mjs';

test('ISO weeks', () => {
  assert.equal(isoWeek(new Date('2026-11-01T12:00:00Z')), '2026-W44'); // a Sunday
  assert.equal(isoWeek(new Date('2026-11-02T10:23:00Z')), '2026-W45'); // the next Monday
  assert.equal(isoWeek(new Date('2027-01-01T00:00:00Z')), '2026-W53');
});

test('moves past the noise are better or worse', () => {
  const score = { ours: 75, better: 'up', noise: 2 };
  assert.equal(compare(score, 71), '**better**');
  assert.equal(compare(score, 74), 'about the same');
  assert.equal(compare({ ...score, ours: 71 }, 75), '**worse**');
  assert.equal(compare({ ours: 3, better: 'down', noise: 0 }, 5), '**better**');
  assert.equal(compare({ ours: 3, better: null, noise: 0 }, 2), 'up');
  assert.equal(compare({ ours: null, better: 'up', noise: 0 }, 2), '');
  assert.equal(compare(score, undefined), '');
});

test('Lighthouse numbers', () => {
  const lhr = { audits: { 'largest-contentful-paint': { numericValue: 1226.4 }, 'first-contentful-paint': { numericValue: 900 }, 'total-blocking-time': { numericValue: 15.2 }, 'cumulative-layout-shift': { numericValue: 0.01234 } }, categories: { performance: { score: 0.98 } } };
  assert.deepEqual(pick(lhr), { lcp_ms: 1226, fcp_ms: 900, tbt_ms: 15, cls: 0.012, score: 98, error: null });
});

test('typed text hints', () => {
  assert.ok(NOT_YET.test('The 2026-27 dates are not posted yet.'));
  assert.ok(NOT_YET.test('Dates are not yet announced.'));
  assert.ok(!NOT_YET.test('What you send is not posted.'));
  assert.equal(phoneDigits('1-800-642-8589'), '8006428589');
  assert.equal(phoneDigits('tel:13043520805'), '3043520805');
  assert.equal(phoneDigits('911'), null);
});
