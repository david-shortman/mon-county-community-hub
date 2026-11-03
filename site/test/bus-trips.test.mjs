// Plan a trip by bus (#1656): places, plans and the map come from the data.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { routesFrom } from '../src/lib/bus-network.mjs';
import { routesFromRecord } from '../src/lib/bus-day.mjs';
import { joinRoutes, plan, answerHtml, mapModel, mapSvg, between, hoursOn } from '../src/lib/bus-trips.mjs';

const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');
const rec = parse(read('../../content/pdf-pages/mountain-line-routes.yaml'));
const routes = joinRoutes(routesFrom(rec), routesFromRecord(rec));
const placesFile = parse(read('../../content/bus-map/places.yaml'));
const places = placesFile.places;
const base = JSON.parse(read('../../content/bus-map/base.json'));
const P = Object.fromEntries(places.map((p) => [p.id, p]));

test('every place has a point in the county, a source and stops that are on a route', () => {
  const used = new Set(routes.flatMap((r) => r.stops));
  const ids = new Set();
  for (const p of places) {
    assert.ok(!ids.has(p.id), `duplicate ${p.id}`); ids.add(p.id);
    const [lat, lon] = p.point;
    assert.ok(lat > 39.45 && lat < 39.75 && lon > -80.45 && lon < -79.7, `${p.id} is outside Mon County`);
    assert.ok(/^(https:\/\/|content\/)/.test(p.source), `${p.id} needs a source`);
    assert.ok(['census-point', 'census-area', 'census-town', 'address'].includes(p.from), p.id);
    assert.ok(['hub', 'place', 'town', 'area'].includes(p.kind), p.id);
    for (const s of p.stops) assert.ok(used.has(s), `${p.id}: "${s}" is not a stop on any route`);
  }
});

test('a stop is in one place at most', () => {
  const seen = new Map();
  for (const p of places) for (const s of p.stops) { assert.ok(!seen.has(s), `${s} is in ${seen.get(s)} and ${p.id}`); seen.set(s, p.id); }
});

test('every route with hours has them joined in', () => {
  for (const r of routes) assert.ok(r.runs.length || r.early, r.name);
});

test('a plan only changes buses at a stop both routes list, and every leg is real', () => {
  for (const a of places) for (const b of places) {
    for (const p of plan(routes, places, a.id, b.id, 'm')) {
      assert.ok(a.stops.includes(p.legs[0].on), `${a.id}->${b.id} starts off ${a.id}`);
      assert.ok(b.stops.includes(p.legs[p.legs.length - 1].off), `${a.id}->${b.id} ends off ${b.id}`);
      p.legs.forEach((l, i) => {
        assert.ok(l.r.stops.includes(l.on) && l.r.stops.includes(l.off), `${l.r.name} does not stop at ${l.on} and ${l.off}`);
        if (i) assert.equal(l.on, p.legs[i - 1].off);
      });
      assert.ok(p.legs.length <= 3);
    }
  }
});

test('almost every pair of places has a trip with two changes or fewer, and the rest say who to call', () => {
  const none = [];
  for (const a of places) for (const b of places) if (a !== b && !plan(routes, places, a.id, b.id, 'm').length) none.push([a, b]);
  // On 2026-11-03 only Mon General to and from Dellslow and Rock Forge needed three changes.
  assert.ok(none.length <= 6, none.map(([a, b]) => `${a.id}->${b.id}`).join(', '));
  for (const [a, b] of none) assert.match(answerHtml([], a, b, 'm'), /304-291-RIDE/);
});

test('known trips: Sabraton to Ruby changes once, Pifer to Ruby is one bus', () => {
  assert.equal(plan(routes, places, 'pifer', 'ruby', 'm')[0].legs.length, 1);
  assert.equal(plan(routes, places, 'sabraton', 'ruby', 'm')[0].legs.length, 2);
});

test('the words never promise a connection and use the route page hours', () => {
  const html = answerHtml(plan(routes, places, 'sabraton', 'ruby', 'm'), P.sabraton, P.ruby, 'm');
  assert.match(html, /do not wait for each other/);
  assert.doesNotMatch(html, /guarantee|will wait|connects? with/i);
  assert.doesNotMatch(html, /\.\./);
  assert.doesNotMatch(html, /—/);
  const purple = routes.find((r) => /Purple/.test(r.name));
  assert.match(html, new RegExp(`last run is ${hoursOn(purple, 'm').last.replace(/\./g, '\\.')}`));
});

test('between() wraps round a loop', () => {
  const r = { stops: ['A', 'B', 'C', 'D'] };
  assert.deepEqual(between(r, 'C', 'A'), ['C', 'D', 'A']);
  assert.deepEqual(between(r, 'A', 'C'), ['A', 'B', 'C']);
});

test('the map fits a phone and has no crisis numbers', () => {
  const m = mapModel(routes, places, base);
  for (const [id, [x, y]] of Object.entries(m.at)) assert.ok(x >= 0 && x <= 340 && y >= 0 && y <= m.H, `${id} is off the map`);
  const svg = mapSvg(m, { trip: plan(routes, places, 'sabraton', 'ruby', 'm')[0], from: 'sabraton', to: 'ruby' });
  assert.ok(svg.length < 40000, `map is ${svg.length} bytes`);
  const words = svg.replace(/<[^>]*>/g, ' ');
  assert.doesNotMatch(words, /\b(988|211|911)\b/);
});
