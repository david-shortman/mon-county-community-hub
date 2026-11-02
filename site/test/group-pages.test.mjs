// Group pages (docs/operations/group-pages.md): every visible org gets one,
// listings and dates go to the right group, and titles stay unique.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadDir } from '../src/lib/content.mjs';
import { groupPages } from '../src/lib/group-pages.mjs';

test('every visible org has a page, with only its own listings', () => {
  const pages = groupPages([]);
  assert.equal(pages.length, loadDir('orgs').filter((o) => o.slug && o.name).length);
  for (const g of pages) for (const r of g.listings) assert.equal(r.org, g.org.slug);
});

test('page names are unique, even when two records share a name', () => {
  const names = groupPages([]).map((g) => g.name);
  assert.equal(new Set(names).size, names.length);
});

test('a date belongs to a group only when its org_name matches the name', () => {
  const [g] = groupPages([]);
  const entry = (slug, org_name) => ({ slug, title: slug, starts: '2999-01-01', ends: '2999-01-01', org_name, sources: [] });
  const far = groupPages([entry('a', g.org.name.toUpperCase()), entry('b', `${g.org.name} Friends`)], '2998-12-31').find((x) => x.org.slug === g.org.slug);
  assert.deepEqual(far.dates.map((e) => e.slug), ['a']);
});
