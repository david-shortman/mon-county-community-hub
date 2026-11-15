// content/explore-chips.yaml (#2026): every chip points at real, tagged pages,
// never at Help now or a page that names a crisis line. Reads the page source
// files, since the page tags come from Astro frontmatter.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { loadChips, chipProblems } from '../src/lib/explore.mjs';
import { mentionsCrisis } from '../scripts/high-stakes-rules.mjs';

const PAGES = path.join(path.dirname(new URL(import.meta.url).pathname), '../src/pages');
function scanPages() {
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
  const map = new Map();
  for (const f of walk(PAGES).filter((f) => f.endsWith('.astro') && !/\[|\/_/.test(f))) {
    const r = f.slice(PAGES.length).replace(/\.astro$/, '').replace(/(^|\/)index$/, '');
    const route = r.endsWith('/') ? r : `${r}/`;
    const src = fs.readFileSync(f, 'utf8');
    const tag = src.match(/export const page\s*=\s*\{([^}]*)\}/);
    map.set(route, { tagged: Boolean(tag), door: tag?.[1].match(/door:\s*['"]([^'"]+)/)?.[1], crisis: mentionsCrisis(src) });
  }
  return map;
}

test('the real chips file has no problems', () => {
  assert.deepEqual(chipProblems(loadChips(), scanPages()), []);
});

test('the real file has 20 chips and a starter list', () => {
  const { chips, starter } = loadChips();
  assert.equal(chips.length, 20);
  assert.ok(starter.length >= 4);
});

test('chipProblems catches each rule', () => {
  const pages = new Map([
    ['/a/', { tagged: true, door: 'living-here' }], ['/b/', { tagged: true, door: 'care' }], ['/c/', { tagged: true, door: 'family' }],
    ['/d/', { tagged: true, door: 'community' }], ['/untagged/', { tagged: false }], ['/now/', { tagged: true, door: 'help-now' }],
    ['/crisis/', { tagged: true, door: 'care', crisis: true }],
  ]);
  const ok = { id: 'ok', name: 'Get outside', pages: ['/a/', '/b/', '/c/', '/d/'] };
  const doc = (chips, starter = ['/a/', '/b/', '/c/', '/d/']) => ({ chips, starter });
  assert.deepEqual(chipProblems(doc([ok]), pages), []);
  const has = (chips, re, starter) => assert.ok(chipProblems(doc(chips, starter), pages).some((p) => re.test(p)), String(re));
  has([ok, ok], /used twice/);
  has([{ ...ok, pages: ['/a/', '/b/', '/c/'] }], /needs 4 to 12/);
  has([{ ...ok, pages: [...ok.pages, '/nope/'] }], /not a page/);
  has([{ ...ok, pages: [...ok.pages, '/untagged/'] }], /no page tag/);
  has([{ ...ok, pages: [...ok.pages, '/now/'] }], /Help now/);
  has([{ ...ok, pages: [...ok.pages, '/crisis/'] }], /crisis line/);
  has([{ ...ok, name: 'A name that is too long' }], /more than 3 words/);
  has([ok], /crisis line/, ['/a/', '/b/', '/c/', '/crisis/']);
});
