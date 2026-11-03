// The bus route diagram (#1445): built from the route file, counts from data.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { routesFrom, sharedStops, SPOTS, ALIASES, path, diagram, facts, rideText } from '../src/lib/bus-network.mjs';

const rec = parse(readFileSync(new URL('../../content/pdf-pages/mountain-line-routes.yaml', import.meta.url), 'utf8'));
const routes = routesFrom(rec);

test('every route with fixed stops is read, each with stops in order', () => {
  assert.ok(routes.length >= 15);
  for (const r of routes) assert.ok(r.stops.length >= 2, r.name);
});

test('every stop on two or more routes has a spot on the diagram', () => {
  const missing = sharedStops(routes).map(([s]) => s).filter((s) => !SPOTS[s]);
  assert.deepEqual(missing, [], `add these to SPOTS in src/lib/bus-network.mjs: ${missing.join(', ')}`);
});

test('no spot is left over for a stop no longer shared', () => {
  const shared = new Set(sharedStops(routes).map(([s]) => s));
  const extra = Object.keys(SPOTS).filter((s) => !shared.has(s));
  assert.deepEqual(extra, []);
});

test('aliases only point at names the routes really use', () => {
  const used = new Set(routes.flatMap((r) => r.stops));
  for (const to of Object.values(ALIASES)) assert.ok(used.has(to), to);
});

test('every route meets the drawing at one stop or more', () => {
  for (const r of routes) assert.ok(path(r).length >= 1, r.name);
});

test('counts come from the data', () => {
  const f = facts(routes);
  const pifer = routes.filter((r) => r.stops.includes('Pifer Terminal')).length;
  assert.equal(f.pifer, pifer);
  assert.equal(f.noPifer.length, f.n - pifer);
});

test('the ride line never promises a connection and the drawing has no crisis numbers', () => {
  for (const r of routes) assert.doesNotMatch(rideText(routes, r), /wait|connect|transfer guaranteed/i);
  assert.doesNotMatch(diagram(routes), /\b(988|211|911)\b/);
});
