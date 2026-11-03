// Tests for src/lib/property-tax-estimate.mjs (#1446), with the real levy rates.
import test from 'node:test';
import assert from 'node:assert/strict';
import { estimate, sayMath, money } from '../src/lib/property-tax-estimate.mjs';
import { loadFacts } from '../src/lib/facts.mjs';

const levy = loadFacts('property-tax')['levy-rates-class-2'];
const rate = (id) => levy.rates.find((r) => r.id === id).total;

test('the Assessor sheet example: $60,000 in Morgantown', () => {
  const e = estimate(60000, rate('towns'));
  assert.equal(e.assessed, 36000);
  assert.equal(e.tax, 475); // 360 x 1.3184 = 474.62
  const h = estimate(60000, rate('towns'), true);
  assert.equal(h.taxable, 16000);
  assert.equal(h.tax, 211); // 160 x 1.3184 = 210.94
});

test('homestead never goes below zero, and the rate is per $100', () => {
  assert.deepEqual(estimate(20000, 1.0684, true), { market: 20000, assessed: 12000, off: 12000, taxable: 0, tax: 0 });
  assert.equal(estimate(150000, 1.0684).tax, 962); // 900 x 1.0684 = 961.56
  assert.equal(estimate('abc', 1).tax, 0);
});

test('the math in words', () => {
  const r = rate('towns');
  assert.equal(sayMath(estimate(150000, r, true), r), '$150,000 times 60% is $90,000, the assessed value. Take off $20,000 for the homestead exemption, which leaves $70,000. $70,000 times $1.3184 for each $100 is about $923 a year.');
  assert.equal(money(1234.4), '$1,234');
});

test('levy record: parts add up and every district is listed once', () => {
  const seen = levy.rates.flatMap((r) => r.districts);
  assert.equal(new Set(seen).size, seen.length);
  assert.equal(seen.length, 13);
  for (const r of levy.rates) assert.ok(Math.abs(Object.values(r.parts).reduce((a, b) => a + b, 0) - r.total) < 1e-9);
});
