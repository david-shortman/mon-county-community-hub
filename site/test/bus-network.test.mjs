// The bus route diagram (#1445): built from the route file, counts from data.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { routesFrom, sharedStops, ALIASES, grid, hubs, HUB_MIN, facts, rideText } from '../src/lib/bus-network.mjs';

const rec = parse(readFileSync(new URL('../../content/pdf-pages/mountain-line-routes.yaml', import.meta.url), 'utf8'));
const routes = routesFrom(rec);

test('every route with fixed stops is read, each with stops in order', () => {
  assert.ok(routes.length >= 15);
  for (const r of routes) assert.ok(r.stops.length >= 2, r.name);
});

test('aliases only point at names the routes really use', () => {
  const used = new Set(routes.flatMap((r) => r.stops));
  for (const to of Object.values(ALIASES)) assert.ok(used.has(to), to);
});

test('the chart has every route once, in a group, with a dot list per busy stop', () => {
  const { cols, groups } = grid(routes);
  assert.deepEqual(cols, hubs(routes));
  assert.ok(cols.length >= 3 && cols.length <= 7, `${cols.length} columns will not fit a phone; change HUB_MIN`);
  for (const c of cols) assert.ok(sharedStops(routes).find(([s]) => s === c)[1].length >= HUB_MIN);
  const rows = groups.flatMap((g) => g.rows);
  assert.equal(rows.length, routes.length);
  assert.equal(new Set(rows.map((x) => x.r.name)).size, routes.length);
  for (const x of rows) assert.deepEqual(x.on, cols.map((c) => x.r.stops.includes(c)));
  for (const g of groups) if (g.hub) for (const x of g.rows) assert.ok(x.r.stops.includes(g.hub), x.r.name);
});

test('counts come from the data', () => {
  const f = facts(routes);
  const pifer = routes.filter((r) => r.stops.includes('Pifer Terminal')).length;
  assert.equal(f.pifer, pifer);
  assert.equal(f.noPifer.length, f.n - pifer);
});

test('the ride line never promises a connection ', () => {
  for (const r of routes) assert.doesNotMatch(rideText(routes, r), /wait|connect|transfer guaranteed/i);
});
