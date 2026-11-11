// The 311 counting rules (#1785): closed plus archived is "closed", the
// median uses closed dates, and it is null for small or incomplete sets.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { totals311, MIN_FOR_MEDIAN } from '../src/lib/totals-311.mjs';

const req = (status, days, closed = true) => {
  const created = '2026-10-01T00:00:00Z';
  return { created, status, closed: closed && days != null ? new Date(Date.parse(created) + days * 864e5).toISOString() : null };
};

test('archived requests count as closed, and are also shown on their own', () => {
  const list = [req('open', null), req('acknowledged', null), req('closed', 1), req('archived', 3), req('archived', 5)];
  const t = totals311(list);
  assert.equal(t.opened, 5);
  assert.equal(t.closed, 3);
  assert.equal(t.archived, 2);
});

test('the median uses closed and archived requests together', () => {
  // 15 closed in 1 day, 16 archived in 9 days: the median is 9, not 1.
  const list = [...Array(15)].map(() => req('closed', 1)).concat([...Array(16)].map(() => req('archived', 9)));
  const t = totals311(list);
  assert.equal(t.median_days_to_close, 9);
  assert.equal(t.median_from, 31);
  assert.equal(t.median_null_because, undefined);
});

test(`fewer than ${MIN_FOR_MEDIAN} closed requests give no median`, () => {
  const t = totals311([...Array(MIN_FOR_MEDIAN - 1)].map(() => req('archived', 2)));
  assert.equal(t.closed, MIN_FOR_MEDIAN - 1);
  assert.equal(t.median_days_to_close, null);
  assert.match(t.median_null_because, /only 29 closed requests/);
});

test('an archived request with no closed date makes the median null', () => {
  const list = [...Array(40)].map(() => req('archived', 2)).concat([req('archived', null, false)]);
  const t = totals311(list);
  assert.equal(t.closed, 41);
  assert.equal(t.median_days_to_close, null);
  assert.match(t.median_null_because, /1 closed or archived requests have no closed date/);
});

test('street work with only archived requests still gets a median', () => {
  // The 2026-11-09 run had 0 closed and 219 archived for potholes.
  const t = totals311([...Array(219)].map((_, i) => req('archived', i % 10)));
  assert.equal(t.closed, 219);
  assert.equal(typeof t.median_days_to_close, 'number');
});
