// "Nearest help" on town pages (#1814): for each kind of help (food pantry,
// clinic, benefits office), the closest provider on our checked list, its
// straight-line distance from the town, and the bus trip that gets there.
//
// Data: content/towns/nearest-help.yaml (providers, their geocoded points and
// sources), content/bus-map/places.yaml (town points and bus stops) and
// content/pdf-pages/mountain-line-routes.yaml (routes, through bus-trips.mjs).
// Distances are straight-line miles, never driving miles or time.
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { pdfPage } from './pdf-pages.mjs';
import { routesFrom } from './bus-network.mjs';
import { routesFromRecord } from './bus-day.mjs';
import { joinRoutes, plan, routeName } from './bus-trips.mjs';

const read = (p) => parse(readFileSync(new URL(p, import.meta.url), 'utf8'));
export const NEAREST = read('../../../content/towns/nearest-help.yaml');
const busMap = read('../../../content/bus-map/places.yaml');
export const BUS_PLACES = busMap.places;
export const PLACES_CHECKED = busMap.checked;

export const NEEDS = [
  ['food', 'Food pantry'],
  ['clinic', 'Clinic'],
  ['benefits', 'SNAP, Medicaid and other state help'],
];

// Great-circle distance in miles (haversine, Earth radius 3958.8 miles).
export function miles([lat1, lon1], [lat2, lon2]) {
  const rad = (d) => (d * Math.PI) / 180;
  const a = Math.sin(rad(lat2 - lat1) / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lon2 - lon1) / 2) ** 2;
  return 2 * 3958.8 * Math.asin(Math.sqrt(a));
}

// Rounded the way the page says it: under half a mile; to the half mile
// under 2 miles; to the whole mile from 2 miles up.
export function roundMiles(d) {
  if (d < 0.5) return { n: 0, text: 'less than half a mile' };
  const n = d < 2 ? Math.round(d * 2) / 2 : Math.round(d);
  if (n === 0.5) return { n, text: 'about half a mile' };
  return { n, text: `about ${String(n)} ${n === 1 ? 'mile' : 'miles'}` };
}

let routesCache;
function routes() {
  if (!routesCache) { const d = pdfPage('mountain-line-routes'); routesCache = { d, list: joinRoutes(routesFrom(d), routesFromRecord(d)) }; }
  return routesCache;
}

// The bus trip from the town's stops to the provider's stop area, in words:
// { text, legs } or null when we have no confirmed bus for that address.
export function busTrip(fromId, toId) {
  if (!toId || fromId === toId) return null;
  const [best] = plan(routes().list, BUS_PLACES, fromId, toId, 'm');
  if (!best) return null;
  const P = Object.fromEntries(BUS_PLACES.map((p) => [p.id, p]));
  const to = P[toId].short ?? P[toId].name;
  const legs = best.legs.map((l) => ({ route: routeName(l.r), on: l.on, off: l.off, url: routeUrl(l.r.name) }));
  return { to, legs, weekdays: best.runs };
}

function routeUrl(name) {
  for (const s of routes().d.sections ?? []) for (const it of s.items ?? []) {
    if (it.name === name) return it.links?.find((l) => l.label === 'Route page')?.url ?? null;
  }
  return null;
}

// Rows for one town page, or [] for a town without a box.
export function nearestFor(slug) {
  if (!NEAREST.towns.includes(slug)) return [];
  const town = BUS_PLACES.find((p) => p.id === slug);
  if (!town) throw new Error(`nearest-help: no point for ${slug} in content/bus-map/places.yaml`);
  return NEEDS.map(([need, label]) => {
    const ranked = NEAREST.providers.filter((p) => p.need === need)
      .map((p) => ({ p, d: miles(town.point, p.point) }))
      .sort((a, b) => a.d - b.d);
    if (!ranked.length) return null;
    const { p, d } = ranked[0];
    const far = roundMiles(d);
    // In town (under a mile): no bus line, the reader is already there.
    const bus = d < 1 ? null : busTrip(slug, p.bus_place);
    return { need, label, provider: p, miles: d, far, bus, noBus: d >= 1 && !bus };
  }).filter(Boolean);
}

export const townPoint = (slug) => BUS_PLACES.find((p) => p.id === slug);
