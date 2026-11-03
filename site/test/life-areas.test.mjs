// Life areas map on /topics/ (#1040): every page named must exist.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import YAML from 'yaml';
import path from 'node:path';
import { LIFE_AREAS_FILE, lifeAreaTiles } from '../src/lib/topics-extras.mjs';

const PAGES = path.join(path.dirname(new URL(import.meta.url).pathname), '../src/pages');
const pageExists = (r) => { const b = r.replace(/\/$/, ''); return fs.existsSync(`${PAGES}${b}.astro`) || fs.existsSync(`${PAGES}${b}/index.astro`); };

test('every page in docs/research/life-areas.yaml exists', () => {
  const doc = YAML.parse(fs.readFileSync(LIFE_AREAS_FILE, 'utf8'));
  const missing = doc.areas.flatMap((a) => a.pages.filter((r) => !pageExists(r)).map((r) => `${a.name}: ${r}`));
  assert.deepEqual(missing, []);
  assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(String(doc.checked instanceof Date ? doc.checked.toISOString().slice(0, 10) : doc.checked)));
});

test('tiles count only pages that exist', () => {
  const doc = { areas: [{ name: 'A', pages: ['/a/', '/gone/'], not_yet: [{ text: 'X' }] }, { name: 'B', pages: ['/gone/'] }] };
  const tiles = lifeAreaTiles(doc, (r) => r === '/a/');
  assert.deepEqual(tiles, [{ name: 'A', href: '/a/', count: 1, missing: ['/gone/'], notYet: ['X'] }]);
});
