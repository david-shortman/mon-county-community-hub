import test from 'node:test';
import assert from 'node:assert/strict';
import { isPast } from '../src/lib/content.mjs';

test('a listing with show_until shows through that day, then drops off', () => {
  const r = { show_until: '2026-11-03' };
  assert.equal(isPast(r, '2026-11-02'), false);
  assert.equal(isPast(r, '2026-11-03'), false);
  assert.equal(isPast(r, '2026-11-04'), true);
});

test('a YAML date works too, and no show_until never drops off', () => {
  assert.equal(isPast({ show_until: new Date('2026-11-03T00:00:00Z') }, '2026-11-04'), true);
  assert.equal(isPast({}, '2030-01-01'), false);
});
