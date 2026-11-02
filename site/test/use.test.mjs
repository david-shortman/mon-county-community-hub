// Level 2 use counts copied by hand (#1432).
import test from 'node:test';
import assert from 'node:assert/strict';
import { checkUse, latestUse, useLine, loadUse } from '../scripts/check-use.mjs';

const good = { start: '2026-11-01', end: '2026-11-30', read: '2026-12-01', total: 1234, pages: { '/': 300, '/money/': 'fewer than 10', '/help/food/': 0 } };

test('the real file passes', () => {
  assert.deepEqual(checkUse(loadUse()), []);
});

test('a good period passes', () => {
  assert.deepEqual(checkUse({ periods: [good] }), []);
});

test('counts from 1 to 9 must say "fewer than 10"', () => {
  const errs = checkUse({ periods: [{ ...good, pages: { '/money/': 7 } }] });
  assert.equal(errs.length, 1);
  assert.match(errs[0], /fewer than 10/);
  assert.match(checkUse({ periods: [{ ...good, total: 3 }] })[0], /under 10/);
});

test('dates, order and extra fields are checked', () => {
  assert.ok(checkUse({ periods: [{ ...good, read: '2026-11-15' }] }).some((e) => /read is before/.test(e)));
  assert.ok(checkUse({ periods: [good, { ...good }] }).some((e) => /overlaps/.test(e)));
  assert.ok(checkUse({ periods: [{ ...good, visitor: 'x' }] }).some((e) => /unknown field/.test(e)));
  assert.ok(checkUse({ periods: [{ ...good, pages: { 'money': 20 } }] }).some((e) => /site path/.test(e)));
  assert.ok(checkUse({}).length);
});

test('the scorecard line', () => {
  const l = useLine(latestUse({ periods: [good] }));
  assert.equal(l.ours, 1234);
  assert.equal(l.shown, '1,234 page views');
  assert.match(l.note, /November 1, 2026 to November 30, 2026/);
  assert.doesNotMatch(l.note, /chance/);
  assert.match(useLine({ ...good, total: 40 }).note, /could be chance/);
  assert.equal(useLine({ ...good, total: 'fewer than 10' }).ours, null);
  assert.equal(useLine(latestUse({ periods: [] })), null);
});
