import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tierOf, lowerTierOnly, loadSourceTiers, tierListProblems } from '../src/lib/source-tiers.mjs';

const tiers = [
  { tier: 'news', host: 'dominionpost.com', ownerOf: [] },
  { tier: 'news', host: 'wboy.com', ownerOf: [] },
  { tier: 'directory', host: 'nextdoor.com', ownerOf: ['secondhand/nextdoor-morgantown.yaml'] },
];

test('tierOf matches a host, www and subdomains', () => {
  assert.equal(tierOf('https://www.dominionpost.com/2026/11/01/x/', tiers), 'news');
  assert.equal(tierOf('https://digital-release.wboy.com/a', tiers), 'news');
  assert.equal(tierOf('https://www.morgantownwv.gov/', tiers), null);
  assert.equal(tierOf('https://notdominionpost.com/', tiers), null);
  assert.equal(tierOf('not a url', tiers), null);
});

test('a site is the owner of a listing about itself', () => {
  assert.equal(tierOf('https://nextdoor.com/x', tiers, 'secondhand/nextdoor-morgantown.yaml'), null);
  assert.equal(tierOf('https://nextdoor.com/x', tiers, 'secondhand/other.yaml'), 'directory');
});

test('lowerTierOnly flags only records with no owner or office source', () => {
  assert.deepEqual(lowerTierOnly({ sources: [{ url: 'https://dominionpost.com/a' }, { url: 'https://nextdoor.com/b' }] }, tiers), ['news', 'directory']);
  assert.equal(lowerTierOnly({ sources: [{ url: 'https://dominionpost.com/a' }, { url: 'https://www.boparc.org/' }] }, tiers), null);
  assert.equal(lowerTierOnly({ sources: [] }, tiers), null);
});

test('the real list loads and has no problems', () => {
  assert.ok(loadSourceTiers().length > 0);
  assert.deepEqual(tierListProblems(), []);
});
