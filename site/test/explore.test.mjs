// Topics explorer ranking (#2027): src/lib/explore-rank.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rankPicks, cleanPicks } from '../src/lib/explore-rank.mjs';
import { loadChips } from '../src/lib/explore.mjs';

const chips = [
  { id: 'a', name: 'A', pages: ['/1/', '/2/', '/3/', '/4/'] },
  { id: 'b', name: 'B', pages: ['/5/', '/3/', '/6/', '/7/'] },
  { id: 'c', name: 'C', pages: ['/8/', '/9/', '/10/', '/11/'] },
];
const pages = Object.fromEntries(['/1/', '/2/', '/3/', '/4/', '/5/', '/6/', '/7/', '/8/', '/9/', '/10/', '/11/'].map((r) => [r, { label: `L${r}`, summary: `S${r}` }]));

test('nothing picked, nothing listed', () => {
  assert.deepEqual(rankPicks(chips, [], pages), []);
});

test('one chip keeps its own order', () => {
  assert.deepEqual(rankPicks(chips, ['a'], pages).map((p) => p.route), ['/1/', '/2/', '/3/', '/4/']);
});

test('a page in two picked chips comes first and names both', () => {
  const r = rankPicks(chips, ['b', 'a'], pages);
  assert.equal(r[0].route, '/3/');
  assert.deepEqual(r[0].chips, ['A', 'B']);
  // Then the top page of each chip, in file order, before second places.
  assert.deepEqual(r.slice(1, 4).map((p) => p.route), ['/1/', '/5/', '/2/']);
  assert.equal(r.length, 7, 'each page once');
});

test('pages without a tag are skipped', () => {
  const some = { ...pages };
  delete some['/2/'];
  assert.ok(!rankPicks(chips, ['a'], some).some((p) => p.route === '/2/'));
});

test('cleanPicks keeps only real chips, once', () => {
  assert.deepEqual(cleanPicks('["a","zz","a","c"]', chips), ['a', 'c']);
  assert.deepEqual(cleanPicks('not json', chips), []);
  assert.deepEqual(cleanPicks('{"a":1}', chips), []);
  assert.deepEqual(cleanPicks(null, chips), []);
});

test('Get outside and Meet people put the key pages near the top (#2027)', () => {
  const real = loadChips().chips;
  const all = Object.fromEntries(real.flatMap((c) => c.pages).map((r) => [r, { label: r, summary: '' }]));
  const order = rankPicks(real, ['outside', 'people'], all).map((p) => p.route);
  assert.ok(order.indexOf('/find-your-people/') < 3, order.join(' '));
  assert.ok(order.indexOf('/parks/') < 3, order.join(' '));
  assert.ok(order.indexOf('/volunteer/') > -1 && order.indexOf('/volunteer/') < 10, order.join(' '));
});

import { newDeck, deckAct, deckSavedCount, isQuietPage } from '../src/lib/explore-rank.mjs';

test('deck: save, skip, back undoes, end stops', () => {
  let d = newDeck(['/a/', '/b/', '/c/']);
  let saved = ['/z/'];
  ({ state: d, saved } = deckAct(d, saved, 'save'));
  assert.deepEqual(saved, ['/z/', '/a/']);
  ({ state: d, saved } = deckAct(d, saved, 'skip'));
  assert.equal(d.i, 2);
  ({ state: d, saved } = deckAct(d, saved, 'back'));
  assert.equal(d.i, 1, 'back undoes the skip');
  ({ state: d, saved } = deckAct(d, saved, 'back'));
  assert.deepEqual(saved, ['/z/'], 'back undoes the save');
  assert.equal(d.i, 0);
  const same = deckAct(d, saved, 'back');
  assert.equal(same.state, d, 'back at the start does nothing');
  for (const a of ['save', 'save', 'save']) ({ state: d, saved } = deckAct(d, saved, a));
  assert.equal(deckSavedCount(d), 3);
  assert.equal(deckAct(d, saved, 'save').state, d, 'nothing after the last card');
});

test('deck: saving a page already saved keeps it, and back leaves it', () => {
  let d = newDeck(['/a/']);
  let saved = ['/a/'];
  ({ state: d, saved } = deckAct(d, saved, 'save'));
  assert.deepEqual(saved, ['/a/']);
  ({ state: d, saved } = deckAct(d, saved, 'back'));
  assert.deepEqual(saved, ['/a/'], 'it was saved before, so it stays');
});

test('quiet pages: Pass it on hides them', () => {
  assert.ok(isQuietPage('/protective-orders/'));
  assert.ok(isQuietPage('/x/', { label: 'Domestic violence help' }));
  assert.ok(!isQuietPage('/parks/', { label: 'Parks and trails', summary: 'Trails, playgrounds' }));
});
