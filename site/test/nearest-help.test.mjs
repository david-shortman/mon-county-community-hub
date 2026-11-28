// Nearest help on town pages (#1814): every row rests on a checked source,
// distances are straight-line and rounded the way the page says, and a bus
// line only names a stop area close to the address.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NEAREST, BUS_PLACES, NEEDS, miles, roundMiles, nearestFor } from '../src/lib/nearest-help.mjs';

const P = Object.fromEntries(BUS_PLACES.map((p) => [p.id, p]));

test('miles: haversine in miles', () => {
  // Pifer Terminal to downtown Morgantown is about a mile apart on the map.
  const d = miles(P.pifer.point, P.downtown.point);
  assert.ok(d > 0.8 && d < 1.2, `got ${d}`);
  assert.equal(miles([39.6, -79.9], [39.6, -79.9]), 0);
});

test('roundMiles: half miles under 2, whole miles from 2', () => {
  assert.equal(roundMiles(0.3).text, 'less than half a mile');
  assert.equal(roundMiles(0.61).text, 'about half a mile');
  assert.equal(roundMiles(1.03).text, 'about 1 mile');
  assert.equal(roundMiles(1.3).text, 'about 1.5 miles');
  assert.equal(roundMiles(4.3).text, 'about 4 miles');
});

test('every provider has a need, a point, a phone and a checked source', () => {
  const needs = NEEDS.map(([n]) => n);
  for (const p of NEAREST.providers) {
    assert.ok(needs.includes(p.need), `${p.id}: need ${p.need}`);
    assert.ok(Array.isArray(p.point) && p.point.length === 2, `${p.id}: point`);
    assert.ok(p.point[0] > 39.4 && p.point[0] < 39.8 && p.point[1] > -80.5 && p.point[1] < -79.7, `${p.id}: point is not in Mon County`);
    assert.match(p.phone, /^\d{3}-\d{3}-\d{4}$/, `${p.id}: phone`);
    assert.ok(p.sources?.length && p.sources.every((s) => /^https:\/\//.test(s.url) && s.checked), `${p.id}: sources`);
    assert.ok(p.address && p.when, `${p.id}: address and when`);
    assert.doesNotMatch(`${p.name} ${p.when}`, /—/, `${p.id}: no em dashes`);
  }
});

test('a bus stop area is within half a mile of its address', () => {
  for (const p of NEAREST.providers.filter((x) => x.bus_place)) {
    assert.ok(P[p.bus_place], `${p.id}: unknown bus_place ${p.bus_place}`);
    assert.ok(miles(p.point, P[p.bus_place].point) < 0.5, `${p.id}: ${p.bus_place} is too far`);
  }
});

test('a second geocoder match never changes a rounded distance', () => {
  for (const p of NEAREST.providers.filter((x) => x.other_point)) {
    for (const t of NEAREST.towns) {
      assert.equal(roundMiles(miles(P[t].point, p.point)).text, roundMiles(miles(P[t].point, p.other_point)).text, `${p.id} from ${t}`);
    }
  }
});

test('each town with a box has a row for every need, and only routes with a page', () => {
  for (const t of NEAREST.towns) {
    const rows = nearestFor(t);
    assert.equal(rows.length, NEEDS.length, t);
    for (const r of rows) {
      if (r.bus) for (const l of r.bus.legs) assert.match(l.url ?? '', /^https:\/\/www\.busride\.org\//, `${t} ${r.need}: ${l.route}`);
      assert.ok(!(r.bus && r.noBus), `${t} ${r.need}`);
    }
  }
  assert.deepEqual(nearestFor('morgantown'), []);
});

test('Brookhaven: Route 8 to downtown for the pantry and DoHS', () => {
  const rows = Object.fromEntries(nearestFor('brookhaven').map((r) => [r.need, r]));
  assert.equal(rows.food.provider.id, 'christian-help-pantry');
  assert.equal(rows.food.bus.legs.length, 1);
  assert.equal(rows.food.bus.legs[0].route, 'Route 8 Brookhaven');
  assert.equal(rows.benefits.far.text, 'about 4 miles');
});
