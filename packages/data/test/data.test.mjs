// Unit tests for @everything-morgantown/data (#69). Run: npm test -w packages/data
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import * as data from '../index.mjs';
import { isDate, isUrl, hiddenProblems, NEVER_HIDE } from '../checks.mjs';

test('CONTENT_DIR is the repo content/ folder', () => {
  assert.ok(fs.existsSync(path.join(data.CONTENT_DIR, 'README.md')));
  assert.equal(path.basename(data.CONTENT_DIR), 'content');
});

test('ymd normalizes dates and strings, and keeps missing as null', () => {
  assert.equal(data.ymd(new Date('2026-11-14T00:00:00Z')), '2026-11-14');
  assert.equal(data.ymd('2026-11-14T09:00'), '2026-11-14');
  assert.equal(data.ymd(undefined), null);
});

test('todayYmd uses Morgantown time', () => {
  // 03:00 UTC on Nov 15 is still Nov 14 in Eastern time.
  assert.equal(data.todayYmd(new Date('2026-11-15T03:00:00Z')), '2026-11-14');
});

test('loadDir reads every org and leaves hidden ones out unless asked', () => {
  const shown = data.loadDir('orgs');
  const all = data.loadDir('orgs', { withHidden: true });
  assert.ok(shown.length > 0);
  assert.ok(all.length >= shown.length);
  assert.ok(shown.every((o) => !data.isHidden(o)));
  assert.ok(all.every((o) => o._file.startsWith('orgs/')));
  assert.deepEqual(data.loadDir('no-such-folder'), []);
});

test('loadCalendar gives every entry YYYY-MM-DD starts and ends', () => {
  for (const e of data.loadCalendar({ withHidden: true })) {
    assert.ok(isDate(e.starts), e._file);
    assert.ok(isDate(e.ends), e._file);
  }
});

test('isPast and isHidden', () => {
  assert.equal(data.isPast({ show_until: '2026-11-13' }, '2026-11-14'), true);
  assert.equal(data.isPast({ show_until: '2026-11-14' }, '2026-11-14'), false);
  assert.equal(data.isHidden({ hidden: false }), false);
  assert.equal(data.isHidden({ hidden: { reason: 'other' } }), true);
});

test('staleness and re-check cadence', () => {
  assert.equal(data.isStale('2026-01-01', '2026-11-14'), true);
  assert.equal(data.isStale('2026-11-01', '2026-11-14'), false);
  assert.equal(data.oldestChecked([{ checked: '2026-10-01' }, { checked: '2026-09-01' }]), '2026-09-01');
  assert.equal(data.recheckDaysFor({ topics: ['food'] }), data.STALE_DAYS);
  assert.equal(data.recheckDaysFor({ topics: ['money'] }), data.TOP_TIER_DAYS);
  assert.equal(data.recheckDaysFor({ topics: ['better'] }), data.FAST_STALE_DAYS);
  assert.equal(data.recheckDaysFor({ _file: 'calendar/x.yaml' }), data.TOP_TIER_DAYS);
  assert.equal(data.recheckProblems({ topics: ['money'], recheck_days: 120 }).length, 1);
  assert.deepEqual(data.recheckProblems({ topics: ['food'], recheck_days: 120 }), []);
  assert.equal(data.recheckDue({ topics: ['money'], sources: [{ checked: '2026-01-01' }] }, '2026-11-14'), true);
});

test('isDate and isUrl', () => {
  assert.ok(isDate('2026-11-14'));
  assert.ok(!isDate('11/14/2026'));
  assert.ok(isUrl('https://example.org/'));
  assert.ok(!isUrl('example.org'));
  assert.ok(!isUrl('mailto:a@example.org'));
});

test('hiddenProblems names each problem plainly', () => {
  const ok = hiddenProblems({ _file: 'orgs/x.yaml', hidden: { reason: 'other', since: '2026-11-01' } }, '2026-11-14');
  assert.deepEqual(ok, { errors: [], warnings: [] });
  assert.deepEqual(hiddenProblems({ _file: 'orgs/x.yaml' }), { errors: [], warnings: [] });
  const bad = hiddenProblems({ _file: 'orgs/x.yaml', hidden: { reason: 'nope', since: '2026-12-01', note: 3, extra: 1 } }, '2026-11-14');
  assert.equal(bad.errors.length, 3);
  assert.match(bad.errors[0], /hidden.reason must be one of/);
  assert.match(bad.errors[1], /in the future/);
  assert.deepEqual(bad.warnings, ['unknown hidden field extra']);
  assert.match(hiddenProblems({ _file: 'orgs/x.yaml', hidden: true }).errors[0], /needs reason and since/);
  assert.match(hiddenProblems({ _file: NEVER_HIDE[0], hidden: { reason: 'other', since: '2026-11-01' } }, '2026-11-14').errors[0], /cannot be hidden/);
});

test('site/src/lib/content.mjs re-exports the same functions', async () => {
  const site = await import('../../../site/src/lib/content.mjs');
  for (const [k, v] of Object.entries(data)) assert.equal(site[k], v, k);
});
