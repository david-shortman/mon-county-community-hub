// Unit tests for the shared data code (#69, step 5): the content loader and
// the open data API shape. Run with `npm test` in site/ (no build needed);
// the build also runs them. Uses Node's built-in test runner, no packages.
import test from 'node:test';
import assert from 'node:assert/strict';
import { ymd, todayYmd, isStale, oldestChecked, isHidden, loadDir, loadCalendarWithFeeds } from '../src/lib/content.mjs';
import { TYPES, shape, fieldPaths } from '../src/lib/api.mjs';

test('ymd turns YAML dates and strings into YYYY-MM-DD', () => {
  assert.equal(ymd(new Date('2026-10-30T00:00:00Z')), '2026-10-30');
  assert.equal(ymd('2026-10-30'), '2026-10-30');
  assert.equal(ymd(null), null);
});

test('todayYmd is the Morgantown date, not the UTC date', () => {
  // 03:00 UTC on Oct 31 is still Oct 30 in Morgantown.
  assert.equal(todayYmd(new Date('2026-10-31T03:00:00Z')), '2026-10-30');
});

test('isStale flags a checked date over 6 months old', () => {
  assert.equal(isStale('2026-01-01', '2026-10-30'), true);
  assert.equal(isStale('2026-10-01', '2026-10-30'), false);
  assert.equal(isStale(null, '2026-10-30'), false);
});

test('oldestChecked takes the stalest source, so nothing looks fresher than it is', () => {
  assert.equal(oldestChecked([{ checked: '2026-10-30' }, { checked: new Date('2026-05-01T00:00:00Z') }]), '2026-05-01');
});

test('isHidden reads the hidden block', () => {
  assert.equal(isHidden({ hidden: { reason: 'other', since: '2026-10-30' } }), true);
  assert.equal(isHidden({ hidden: false }), false);
  assert.equal(isHidden({}), false);
});

test('loadDir leaves hidden records out unless asked', () => {
  const all = loadDir('resources', { withHidden: true });
  const shown = loadDir('resources');
  assert.equal(shown.length, all.filter((r) => !isHidden(r)).length);
  assert.ok(shown.every((r) => r._file.startsWith('resources/')));
});

test('every org and resource slug is unique', () => {
  for (const dir of ['orgs', 'resources']) {
    const slugs = loadDir(dir, { withHidden: true }).map((r) => r.slug);
    assert.equal(new Set(slugs).size, slugs.length, `${dir} has a repeated slug`);
  }
});

test('the calendar never shows one feed event twice', async () => {
  process.env.FEEDS_OFFLINE = '1';
  const all = await loadCalendarWithFeeds();
  const slugs = all.map((e) => e.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const e of all.filter((x) => x.feed)) assert.equal(e.sources[0].method, 'feed');
});

test('the API shape drops internal fields and writes dates as text', () => {
  const r = shape('orgs', { name: 'X', slug: 'x', _file: 'orgs/x.yaml', sources: [{ url: 'https://example.org', checked: new Date('2026-10-30T00:00:00Z') }] });
  assert.equal(r._file, undefined);
  assert.equal(r.sources[0].checked, '2026-10-30');
});

test('every API type has an id field and a field list', () => {
  const paths = fieldPaths();
  for (const [name, t] of Object.entries(TYPES)) {
    assert.ok(paths[name].includes(t.id), `${name} is missing its id field`);
  }
});
