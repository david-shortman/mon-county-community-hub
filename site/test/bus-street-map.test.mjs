// The street map's data (#1721): Census only, small, and loaded on tap.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const dir = new URL('../public/bus-map/', import.meta.url);
const read = (f) => readFileSync(new URL(f, dir));
const FILES = { 'county.json': 10, 'areas.json': 20, 'water.json': 90, 'roads-major.json': 40, 'roads-local.json': 450 };

test('every base map file is GeoJSON inside Mon County and under its size limit (KB, compressed)', () => {
  for (const [f, kb] of Object.entries(FILES)) {
    const raw = read(f), d = JSON.parse(raw);
    assert.equal(d.type, 'FeatureCollection', f);
    assert.ok(d.features.length > 0, f);
    const size = gzipSync(raw).length / 1024;
    assert.ok(size < kb, `${f} is ${size.toFixed(0)} KB compressed (limit ${kb})`);
    const walk = (c) => (typeof c[0] === 'number' ? [c] : c.flatMap(walk));
    for (const ft of d.features) for (const [x, y] of walk(ft.geometry.coordinates)) assert.ok(x > -80.5 && x < -79.6 && y > 39.3 && y < 39.8, `${f} has a point outside the county: ${x}, ${y}`);
  }
});

test('street labels have the fonts they ask for, with the font license', () => {
  for (const font of ['Noto Sans Regular', 'Noto Sans Medium']) assert.ok(existsSync(new URL(`fonts/${font}/0-255.pbf`, dir)), font);
  assert.match(read('fonts/OFL.txt').toString(), /SIL Open Font License/);
});

test('the map credits Census and uses no OpenStreetMap data', () => {
  const src = readFileSync(new URL('../src/lib/bus-street-map.mjs', import.meta.url), 'utf8');
  assert.match(src, /U\.S\. Census Bureau TIGER\/Line/);
  assert.doesNotMatch(src, /openstreetmap\.org|openfreemap|tile\.osm|mapbox\.com|maptiler/i);
  for (const f of readdirSync(dir)) if (f.endsWith('.json')) assert.doesNotMatch(read(f).toString().slice(0, 2000), /openstreetmap\.org|osm_id/i, f);
});

test('the street map is only loaded on tap, never by the page itself', () => {
  const client = readFileSync(new URL('../src/lib/bus-map-client.mjs', import.meta.url), 'utf8');
  assert.match(client, /await import\('\.\/bus-street-map\.mjs'\)/);
  assert.doesNotMatch(client, /^import .*bus-street-map/m);
  const street = readFileSync(new URL('../src/lib/bus-street-map.mjs', import.meta.url), 'utf8');
  // A plain CSS import would be inlined into every page.
  assert.doesNotMatch(street, /^import ['"][^'"]+\.css['"]/m);
  const page = readFileSync(new URL('../src/components/TripPlanner.astro', import.meta.url), 'utf8');
  assert.doesNotMatch(page, /from ['"]maplibre/);
});
