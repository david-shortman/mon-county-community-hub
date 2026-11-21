// Tests for src/lib/chart-scale.mjs: round axis tops for counts and rates (#2002).
import test from 'node:test';
import assert from 'node:assert/strict';
import { roundTop } from '../src/lib/chart-scale.mjs';

test('rounds up to a top whose half is also round', () => {
  assert.equal(roundTop(13324.08), 14000);
  assert.equal(roundTop(7458.56), 7600);
  assert.equal(roundTop(78.9), 80);
  assert.equal(roundTop(45.3), 46);
  assert.equal(roundTop(3.41), 3.6);
});

test('a value already on a step stays, and the top is never below the value', () => {
  assert.equal(roundTop(14000), 14000);
  assert.equal(roundTop(100), 100);
  for (const v of [1.01, 9.99, 10, 10.01, 99.9, 101, 12968.83, 0.07]) assert.ok(roundTop(v) >= v, String(v));
});

test('zero, negative and missing values are left alone', () => {
  assert.equal(roundTop(0), 0);
  assert.equal(roundTop(-5), -5);
  assert.ok(Number.isNaN(roundTop(NaN)));
});
