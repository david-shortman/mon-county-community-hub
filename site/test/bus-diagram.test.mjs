// The simple bus diagram (#1723): a hand-placed grid, straight and 45 degree lines.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { routesFrom } from '../src/lib/bus-network.mjs';
import { routesFromRecord } from '../src/lib/bus-day.mjs';
import { joinRoutes, mapModel, mapSvg, placeIds, plan, tripSummaryHtml, tripSvg } from '../src/lib/bus-trips.mjs';
import { linkPoints } from '../src/lib/bus-diagram.mjs';

const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');
const rec = parse(read('../../content/pdf-pages/mountain-line-routes.yaml'));
const routes = joinRoutes(routesFrom(rec), routesFromRecord(rec));
const places = parse(read('../../content/bus-map/places.yaml')).places;
const base = JSON.parse(read('../../content/bus-map/base.json'));
const m = mapModel(routes, places, base);
const P = Object.fromEntries(places.map((p) => [p.id, p]));

test('every place has its own spot on the diagram grid', () => {
  const seen = new Map();
  for (const p of places) {
    assert.ok(Array.isArray(p.grid) && p.grid.length === 2 && p.grid.every(Number.isInteger), `${p.id} needs grid: [x, y] in places.yaml`);
    const k = p.grid.join(',');
    assert.ok(!seen.has(k), `${p.id} and ${seen.get(k)} share grid spot ${k}`);
    seen.set(k, p.id);
  }
  assert.ok(m.U > 0, 'the page draws the diagram, not the squeezed map');
});

test('every link runs straight or at 45 degrees', () => {
  for (const r of routes) {
    const ids = placeIds(r.stops, m.sp);
    for (let k = 1; k < ids.length; k++) {
      const pts = linkPoints(ids[k - 1], ids[k], m.at);
      for (let q = 1; q < pts.length; q++) {
        const dx = Math.abs(pts[q][0] - pts[q - 1][0]), dy = Math.abs(pts[q][1] - pts[q - 1][1]);
        assert.ok(dx < 0.2 || dy < 0.2 || Math.abs(dx - dy) < 0.2, `${r.name}: ${ids[k - 1]} to ${ids[k]} is not straight or 45 degrees`);
      }
    }
  }
});

test('the plain lines never run through a place the line does not stop at', () => {
  const segD = (p, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy; const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L)); return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy); };
  const bad = [];
  for (const r of routes) {
    const ids = placeIds(r.stops, m.sp);
    for (let k = 1; k < ids.length; k++) {
      const a = m.at[ids[k - 1]], b = m.at[ids[k]];
      if (Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])) / m.U > 6) continue; // long links are left out of plain lines
      const pts = linkPoints(ids[k - 1], ids[k], m.at);
      for (const p of places) {
        if (p.id === ids[k - 1] || p.id === ids[k]) continue;
        for (let q = 1; q < pts.length; q++) if (segD(m.at[p.id], pts[q - 1], pts[q]) < 3) bad.push(`${r.name}: ${ids[k - 1]} to ${ids[k]} runs through ${p.id}`);
      }
    }
  }
  assert.deepEqual([...new Set(bad)], []);
});

test('the diagram fits a phone, and a trip draws on it', () => {
  for (const [id, [x, y]] of Object.entries(m.at)) assert.ok(x > 0 && x < 340 && y > 0 && y < m.H, id);
  const best = plan(routes, places, 'sabraton', 'ruby', 'm')[0];
  const svg = mapSvg(m, { trip: best, from: 'sabraton', to: 'ruby' });
  assert.match(svg, /tm-leg tm-leg-2/);
  assert.match(svg, /Monongahela River/);
  assert.doesNotMatch(tripSvg(m, best), /C/); // diagram legs use lines and rounded corners, not curves
});

test('the full map panel keeps planning in the map', () => {
  const plans = plan(routes, places, 'sabraton', 'mylan-park', 'u');
  const html = tripSummaryHtml(plans, P.sabraton, P['mylan-park'], 'u');
  assert.match(html, /data-day="u" aria-pressed="true"/);
  assert.match(html, /data-full/);
  assert.match(html, /Not on Sunday/);
  assert.doesNotMatch(html, /\.\.|—/);
  assert.match(tripSummaryHtml([], P.sabraton, P.sabraton, 'm'), /Tap a place/);
});
