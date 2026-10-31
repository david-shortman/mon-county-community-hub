// Embeds (docs/operations/embeds.md): the color tokens in the embed frame
// match the site's, so the contrast check's results hold for embeds too, and
// the widgets filter dates the way the gallery says.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { embedDates, embedTopics, embedTowns, EMBED_MAX } from '../src/lib/embeds.mjs';

const read = (p) => fs.readFileSync(new URL(p, import.meta.url), 'utf8');
const tokens = (css, re) => Object.fromEntries([...(css.match(re)?.[1] ?? '').matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2]]));
const LIGHT = /:root \{([^}]*)\}/;
const DARK = /prefers-color-scheme: dark\) \{\s*:root \{([^}]*)\}/;

test('embed colors are the same as the site colors, light and dark', () => {
  const site = read('../src/layouts/Base.astro');
  const embed = read('../src/layouts/Embed.astro');
  for (const re of [LIGHT, DARK]) {
    const s = tokens(site, re);
    const e = tokens(embed, re);
    assert.ok(Object.keys(e).length >= 7, 'embed frame has its color tokens');
    for (const [k, v] of Object.entries(e)) assert.equal(v, s[k], `--${k} differs from Base.astro`);
  }
});

test('the embed frame loads no scripts', () => {
  assert.doesNotMatch(read('../src/layouts/Embed.astro'), /<script/);
});

const day = (n) => `2026-11-${String(n).padStart(2, '0')}`;
const entry = (slug, starts, extra = {}) => ({ slug, title: slug, starts, ends: starts, topics: ['community'], sources: [{ url: 'https://example.org', checked: '2026-10-30' }], ...extra });

test('dates filter by topic and town, skip past and far-off dates, and cap the list', () => {
  const list = [
    entry('past', '2026-10-01'),
    entry('food', day(3), { topics: ['food'] }),
    entry('westover', day(4), { town: 'Westover' }),
    entry('far', '2027-03-01'),
    ...Array.from({ length: 15 }, (_, i) => entry(`many-${i}`, day(10 + i))),
  ];
  const today = day(1);
  assert.deepEqual(embedDates(list, { topic: 'food' }, today).items.map((e) => e.slug), ['food']);
  assert.deepEqual(embedDates(list, { town: 'Westover' }, today).items.map((e) => e.slug), ['westover']);
  const all = embedDates(list, {}, today);
  assert.equal(all.items.length, EMBED_MAX);
  assert.equal(all.total, 17);
  assert.ok(!all.items.some((e) => e.slug === 'past' || e.slug === 'far'));
});

test('topic and town lists have unique slugs', () => {
  for (const list of [embedTopics(), embedTowns()]) {
    const slugs = list.map((x) => x.slug);
    assert.equal(new Set(slugs).size, slugs.length);
    assert.ok(slugs.every((s) => /^[a-z0-9-]+$/.test(s)));
  }
});
