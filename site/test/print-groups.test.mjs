// Group sheets (#405): every record named in content/print-groups.yaml exists,
// and the sheets leave off the topics that wait for David.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadDir } from '../src/lib/content.mjs';
import { loadPrintGroups, groupList, printSheets, GROUP_SKIP_TOPICS } from '../src/lib/printouts.mjs';

const groups = loadPrintGroups();
const withHidden = new Set(loadDir('resources', { withHidden: true }).map((r) => r.slug));

test('every group names records that exist', () => {
  assert.ok(groups.length > 0);
  for (const g of groups) for (const s of g.resources) assert.ok(withHidden.has(s), `${g.slug}: no resource ${s}`);
});

test('group sheets skip housing, money and food records', () => {
  const fake = [{ slug: 'a', topics: ['community'] }, { slug: 'b', topics: ['food'] }];
  assert.deepEqual(groupList({ resources: ['a', 'b', 'missing'] }, fake).map((r) => r.slug), ['a']);
  for (const s of printSheets().filter((x) => x.kind === 'group')) {
    assert.ok(s.page?.startsWith('/'), `${s.slug} needs a page for its QR code`);
    for (const r of s.list) assert.ok(!r.topics.some((t) => GROUP_SKIP_TOPICS.includes(t)), `${s.slug}: ${r.slug}`);
  }
});

test('group sheet slugs do not clash with other sheets', () => {
  const slugs = printSheets().map((s) => s.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});
