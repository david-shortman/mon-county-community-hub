// Duplicate and broken-link checks for content/ (#1170), run by npm test.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { duplicateWarnings, missingOrgErrors, movedErrors, orgLinks } from '../src/lib/content-dupes.mjs';
import { loadDir } from '../src/lib/content.mjs';
import { MOVED } from '../src/lib/moved.mjs';

test('two orgs with the same website or phone are flagged, written differently', () => {
  const w = duplicateWarnings({ orgs: [
    { _file: 'orgs/a.yaml', name: 'Bus Line', website: 'https://www.bus.org/', phone: '304-555-0100' },
    { _file: 'orgs/b.yaml', name: 'Bus Line Authority', website: 'http://bus.org', phone: '1-304-555-0100' },
    { _file: 'orgs/c.yaml', name: 'Other Group', website: 'https://other.org/' },
  ] });
  assert.equal(w.length, 2);
  assert.ok(w.some((x) => /orgs\/a\.yaml and orgs\/b\.yaml: same org website/.test(x)));
  assert.ok(w.some((x) => /same org phone/.test(x)));
});

test('places that only share a building, and resources that share an office, are not flagged', () => {
  const w = duplicateWarnings({
    places: [{ _file: 'places/a.yaml', name: 'Craft Night', contact: { phone: '304-555-0100' } }, { _file: 'places/b.yaml', name: 'Book Club', contact: { phone: '304-555-0100' } }],
    resources: [{ _file: 'resources/a.yaml', title: 'Septic permit', org: 'x' }, { _file: 'resources/b.yaml', title: 'Well permit', org: 'x' }],
  });
  assert.deepEqual(w, []);
});

test('the same resource title from the same org is flagged', () => {
  const w = duplicateWarnings({ resources: [{ _file: 'resources/a.yaml', title: 'Road repair', org: 'x' }, { _file: 'resources/b.yaml', title: 'Road  Repair', org: 'x' }] });
  assert.equal(w.length, 1);
});

test('an org link anywhere in a record must have a file', () => {
  const rec = { _file: 'needs/x.yaml', who_works_on_it: [{ org: 'real' }, { org: 'gone' }], run_by: { org: 'real' } };
  assert.deepEqual(orgLinks(rec).map((l) => l.at), ['who_works_on_it[0].org', 'who_works_on_it[1].org', 'run_by.org']);
  assert.deepEqual(missingOrgErrors([rec], new Set(['real'])), ['needs/x.yaml: who_works_on_it[1].org gone has no file in content/orgs/']);
});

test('moved group pages point at a live group and are not live themselves', () => {
  assert.equal(movedErrors({ '/groups/old/': '/groups/new/' }, new Set(['new'])).length, 0);
  assert.equal(movedErrors({ '/groups/old/': '/groups/new/' }, new Set(['old', 'new'])).length, 1);
  assert.equal(movedErrors({ '/groups/old/': '/groups/none/' }, new Set(['new'])).length, 1);
  assert.deepEqual(movedErrors(MOVED, new Set(loadDir('orgs', { withHidden: true }).map((o) => o.slug))), []);
});

test('pairs listed as not duplicates are not flagged', () => {
  const orgs = [{ _file: 'orgs/usda-farm-service-agency.yaml', website: 'https://x.gov/a' }, { _file: 'orgs/usda-natural-resources-conservation-service.yaml', website: 'https://x.gov/a' }];
  assert.deepEqual(duplicateWarnings({ orgs }), []);
});

test('a date at a venue gets the town its place record names', async () => {
  const { townFromCommunity, venueTownWarnings } = await import('../src/lib/content-dupes.mjs');
  const towns = ['Morgantown', 'Westover'];
  assert.deepEqual(townFromCommunity('Westover', towns), { town: 'Westover' });
  assert.deepEqual(townFromCommunity('Wiles Hill, Morgantown', towns), { town: 'Morgantown', neighborhood: 'Wiles Hill' });
  assert.equal(townFromCommunity('Mylan Park, west of Morgantown', towns), null);
  assert.equal(townFromCommunity('Morgantown (Mountaineer Mall)', towns), null);
  const places = [{ slug: 'hall', community: 'Westover' }];
  assert.equal(venueTownWarnings([{ _file: 'calendar/a.yaml', venue: 'hall' }], places, towns).length, 1);
  assert.equal(venueTownWarnings([{ _file: 'calendar/a.yaml', venue: 'hall', town: 'Westover' }], places, towns).length, 0);
  assert.match(venueTownWarnings([{ _file: 'calendar/a.yaml', venue: 'hall', town: 'Morgantown' }], places, towns)[0], /differs/);
});
