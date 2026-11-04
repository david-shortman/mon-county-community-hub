// Plan a bus trip on /bus-routes/ (#1656): pick where you start and where you
// are going, and see which Mountain Line routes get you there, where to change,
// and when each one runs that day. Pure functions, no DOM, so the build draws
// the still version and the browser runs the same code.
//
// Data:
// - Routes, stops in order and hours: content/pdf-pages/mountain-line-routes.yaml
//   (read by routesFrom in bus-network.mjs and routesFromRecord in bus-day.mjs).
// - Places and their stops: content/bus-map/places.yaml.
// - River and interstates: content/bus-map/base.json (Census TIGER/Line).
//
// Care points:
// - Stop lists name a route's main stops, not every stop, so a plan only uses
//   stops on those lists. A change is only planned at a stop both routes list
//   by the same name. We never say buses wait for each other.
// - "First run" and "last run" are when a route starts its first and last trip.
// - Ride length is not stated per leg: we only know one trip around the route.
import { spans, earlyTimes, fmt } from './bus-day.mjs';
import { routeId } from './bus-network.mjs';
import { diagramAt, diagramPath, lineBoxes, riverPath } from './bus-diagram.mjs';

export const DAY_OF_WEEK = ['u', 'm', 'm', 'm', 'r', 'r', 's']; // Date#getDay() -> day key
export const DAY_WORDS = { m: 'Monday to Wednesday', r: 'Thursday or Friday', s: 'Saturday', u: 'Sunday' };

// Routes with stops and hours joined by name.
export function joinRoutes(stopRoutes, hourRoutes) {
  const byName = new Map(hourRoutes.map((r) => [r.name, r]));
  return stopRoutes.map((r) => {
    const h = byName.get(r.name) ?? {};
    return { id: routeId(r), name: r.name, short: r.short, trip: r.trip, stops: r.stops, runs: h.runs ?? [], early: h.early, n: h.n ?? '', g: h.g ?? 'city', unsure: h.unsure ?? '' };
  });
}

// ---------- Planning ----------
const CHANGE_COST = 5; // a change "costs" about 5 stops when ranking plans

export function stopPlace(places) {
  const m = new Map();
  for (const p of places) for (const s of p.stops) m.set(s, p.id);
  return m;
}

// Stops from i to j going the way the route's list runs, wrapping round.
const hop = (r, i, j) => (j - i + r.stops.length) % r.stops.length;
const idx = (r, s) => r.stops.indexOf(s);

// The route's stops from stop a to stop b, in order, wrapping round.
export function between(r, a, b) {
  const n = r.stops.length, out = [];
  for (let i = idx(r, a), k = 0; k <= hop(r, idx(r, a), idx(r, b)); k++, i = (i + 1) % n) out.push(r.stops[i]);
  return out;
}

export function runsOn(r, day) { return spans(r, day).length > 0 || earlyTimes(r, day).length > 0; }

// Hours for one route on one kind of day: { first, last } in words, or null.
export function hoursOn(r, day) {
  const sp = spans(r, day), ea = earlyTimes(r, day);
  if (!sp.length && !ea.length) return null;
  const first = Math.min(...sp.map((s) => s.a), ...ea), last = sp.length ? Math.max(...sp.map((s) => s.b)) : Math.max(...ea);
  return { first: fmt(first), last: fmt(last) };
}

// Every way from place A to place B with up to two changes, best first.
// A plan is { legs: [{ r, on, off }], cost, runs } where `runs` says every
// leg runs on `day`.
export function plan(routes, places, fromId, toId, day = 'm', { max = 3 } = {}) {
  const P = new Map(places.map((p) => [p.id, p]));
  const placed = stopPlace(places);
  const A = new Set(P.get(fromId)?.stops ?? []), B = new Set(P.get(toId)?.stops ?? []);
  if (!A.size || !B.size || fromId === toId) return [];
  const at = (r, set) => r.stops.filter((s) => set.has(s));
  const found = [];
  // Best single leg on r from any stop in `ons` to any stop in `offs`.
  const best = (r, ons, offs) => {
    let out = null;
    for (const a of ons) for (const b of offs) {
      if (a === b) continue;
      const c = hop(r, idx(r, a), idx(r, b));
      if (!out || c < out.c) out = { r, on: a, off: b, c };
    }
    return out;
  };
  const push = (legs) => {
    // A change at a stop we can show on the map ranks a little higher.
    const cost = legs.reduce((t, l) => t + l.c, 0) + legs.slice(1).reduce((t, l) => t + CHANGE_COST + (placed.has(l.on) ? 0 : 3), 0);
    // Routes that run only a few hours that day (evening or campus routes) rank lower.
    const hours = Math.min(...legs.map((l) => spans(l.r, day).reduce((t, s) => t + (s.b - s.a) / 60, 0)));
    found.push({ legs: legs.map(({ r, on, off }) => ({ r, on, off })), cost, rank: cost + (hours < 8 ? 8 : 0), runs: legs.every((l) => runsOn(l.r, day)) });
  };
  const direct = new Set();
  for (const r of routes) {
    const l = best(r, at(r, A), at(r, B));
    if (l) { push([l]); direct.add(r); }
  }
  // One change at a stop both routes list.
  for (const r1 of routes) for (const r2 of routes) {
    if (r1 === r2 || direct.has(r1) && direct.has(r2)) continue;
    const ons = at(r1, A), offs = at(r2, B);
    if (!ons.length || !offs.length) continue;
    for (const x of r1.stops) {
      if (!r2.stops.includes(x) || A.has(x) || B.has(x)) continue;
      const l1 = best(r1, ons, [x]), l2 = best(r2, [x], offs);
      if (l1 && l2) push([l1, l2]);
    }
  }
  // Two changes, only when nothing shorter exists.
  if (!found.length) {
    for (const r1 of routes) {
      const ons = at(r1, A); if (!ons.length) continue;
      for (const r3 of routes) {
        const offs = at(r3, B); if (!offs.length || r3 === r1) continue;
        for (const r2 of routes) {
          if (r2 === r1 || r2 === r3) continue;
          for (const x of r1.stops) {
            if (!r2.stops.includes(x)) continue;
            for (const y of r2.stops) {
              if (y === x || !r3.stops.includes(y)) continue;
              const l1 = best(r1, ons, [x]), l2 = best(r2, [x], [y]), l3 = best(r3, [y], offs);
              if (l1 && l2 && l3) push([l1, l2, l3]);
            }
          }
        }
      }
    }
  }
  // Best plan per route sequence; plans that run that day first.
  const seen = new Map();
  for (const f of found) {
    const k = f.legs.map((l) => l.r.id).join('>');
    if (!seen.has(k) || f.cost < seen.get(k).cost) seen.set(k, f);
  }
  return [...seen.values()]
    .sort((a, b) => Number(b.runs) - Number(a.runs) || a.legs.length - b.legs.length || a.rank - b.rank)
    .slice(0, max);
}

// ---------- Words ----------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const routeName = (r) => r.name.replace(/^Route /, 'Route ');

// The steps of one plan as plain HTML (an ordered list), for the answer card.
export function stepsHtml(p, day) {
  const li = [];
  p.legs.forEach((l, i) => {
    const h = hoursOn(l.r, day);
    const when = h ? `On ${DAY_WORDS[day]}, its first run is ${h.first} and its last run is ${h.last}`.replace(/\.?$/, '.') : `It does not run on ${DAY_WORDS[day]}.`;
    const trip = l.r.trip ? ` One trip around the whole route takes about ${l.r.trip} minutes.` : '';
    const verb = i === 0 ? 'Get on' : 'Change to';
    li.push(`<li data-leg="${i + 1}"><strong>${verb} ${esc(routeName(l.r))}</strong> at ${esc(l.on)}. Ride to ${esc(l.off)}.<span class="tp-when">${when}${trip}</span></li>`);
  });
  return `<ol class="tp-steps">${li.join('')}</ol>`;
}

// The whole answer for a pair of places on one kind of day.
export function answerHtml(plans, from, to, day, { phone = '304-291-RIDE (304-291-7433)', tel = 'tel:3042917433' } = {}) {
  const call = `call Mountain Line at <a href="${tel}">${phone}</a>`;
  if (!from || !to || from.id === to.id) return `<p class="tp-none">Pick two different places.</p>`;
  const title = `<p class="tp-for">${esc(from.name)} to ${esc(to.name)}, ${DAY_WORDS[day]}</p>`;
  if (!plans.length) return `${title}<p class="tp-none">We could not find a trip with two changes or fewer, using the main stops Mountain Line lists for each route. Use the trip planner or ${call}.</p>`;
  const [best, ...more] = plans;
  const off = best.runs ? '' : `<p class="tp-none">No bus trip between these places runs on ${DAY_WORDS[day]}. This is the trip on the days it runs.</p>`;
  const change = best.legs.length > 1 ? `<p class="tp-tip">Changing buses: the next bus may not be there yet, and buses do not wait for each other. Check both routes' last runs before you go.</p>` : '';
  const others = more.length ? `<details class="tp-more"><summary>${more.length === 1 ? 'One other way' : `${more.length} other ways`}</summary>${more.map((p) => `<h4>${esc(headline(p))}${p.runs ? '' : ` (not on ${DAY_WORDS[day]})`}</h4>${stepsHtml(p, day)}`).join('')}</details>` : '';
  return `${title}${off}<h3 class="tp-head">${esc(headline(best))}</h3>${stepsHtml(best, day)}${change}${others}`;
}

export function headline(p) {
  if (p.legs.length === 1) return `One bus: ${routeName(p.legs[0].r)}`;
  return `${p.legs.length} buses, ${p.legs.length - 1 === 1 ? 'one change' : 'two changes'}: ${p.legs.map((l) => l.r.name.replace(/^Route /, '')).join(', then ')}`;
}

// ---------- The map ----------
// A simplified map, not to scale: directions are true, but distances from
// downtown are squeezed (a square-root scale) so the busy middle has room and
// the far ends of the county still fit on a phone.
export const W = 340;
const CENTER = [39.6295, -79.9559]; // downtown Morgantown (Census point)
const POWER = 0.42;
function km([lat, lon]) {
  return [(lon - CENTER[1]) * 111.32 * Math.cos((CENTER[0] * Math.PI) / 180), (lat - CENTER[0]) * 110.57];
}
function squeeze([x, y]) {
  const r = Math.hypot(x, y); if (!r) return [0, 0];
  const f = Math.pow(r, POWER) / r; return [x * f, -y * f];
}

// Fit the squeezed places into the drawing; returns lat/lon -> [x, y].
export function projection(places, { pad = 26, padTop = 22 } = {}) {
  const pts = places.map((p) => squeeze(km(p.point)));
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const s = (W - 2 * pad) / (x1 - x0);
  const H = Math.round((y1 - y0) * s + padTop + pad);
  const f = (latlon) => { const [x, y] = squeeze(km(latlon)); return [+(pad + (x - x0) * s).toFixed(1), +(padTop + (y - y0) * s).toFixed(1)]; };
  return { f, H };
}

// A smooth line through points (Catmull-Rom as cubic Beziers).
export function smooth(pts) {
  if (pts.length < 2) return '';
  if (pts.length === 2) return `M${pts[0]}L${pts[1]}`;
  let d = `M${pts[0]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1.map((v) => v.toFixed(1))} ${c2.map((v) => v.toFixed(1))} ${p2}`;
  }
  return d;
}

// The places a list of stops passes, in order, as map points (unplaced stops
// are skipped and repeats are joined).
export function placeIds(stops, sp) {
  const ids = [];
  for (const s of stops) { const id = sp.get(s); if (id && ids[ids.length - 1] !== id) ids.push(id); }
  return ids;
}
export function placePath(stops, sp, at) { return placeIds(stops, sp).map((id) => at[id]); }

// A line through the places a list of stops passes: diagram style (straight
// and 45 degree) when the model is a diagram, smooth curves otherwise.
export function drawStops(m, stops, opts) {
  const ids = placeIds(stops, m.sp);
  return m.U ? diagramPath(ids, m.at, m.U, opts) : smooth(ids.map((id) => m.at[id]));
}

// Everything the browser needs to redraw a trip, worked out once at build time.
// Places with a `grid` spot are drawn as a transit diagram (bus-diagram.mjs);
// otherwise as the squeezed geographic map above.
export function mapModel(routes, places, base) {
  const sp = stopPlace(places);
  if (places.every((p) => Array.isArray(p.grid))) {
    const { at, H, U } = diagramAt(places);
    return { H, U, at, sp, base, routes, places, boxes: lineBoxes(routes.map((r) => placeIds(r.stops, sp)), at, U) };
  }
  const { f, H } = projection(places);
  const at = Object.fromEntries(places.map((p) => [p.id, f(p.point)]));
  return { f, H, at, sp, base, routes, places };
}

const ring = (pts, f) => 'M' + pts.map(([lon, lat]) => f([lat, lon]).join(' ')).join('L') + 'Z';
const line = (pts, f) => 'M' + pts.map(([lon, lat]) => f([lat, lon]).join(' ')).join('L');

export function mapSvg(m, { trip = null, from = '', to = '', id = 'tp-map' } = {}) {
  const { f, H, at, sp, base, routes, places } = m;
  const change = new Set(trip ? trip.legs.slice(1).map((l) => sp.get(l.on)) : []);
  const rv = m.U ? riverPath(at, H) : null;
  const river = m.U ? `<path class="tm-river-band" d="${rv.d}"/><text class="tm-river-l" transform="translate(${rv.x - 3} 12) rotate(90)">Monongahela River</text>` : base.river.map((r) => `<path class="tm-river" d="${ring(r, f)}"/>`).join('');
  const roads = m.U ? '' : Object.entries(base.roads).map(([name, ls]) => {
    const d = ls.map((l) => line(l, f)).join('');
    const longest = ls.reduce((a, b) => (b.length > a.length ? b : a));
    // Name the road near where it leaves the drawing (north for I-79, east for I-68).
    const ends = [longest[0], longest[longest.length - 1]].map(([lon, lat]) => f([lat, lon]));
    const [ex, ey] = name === 'I-79' ? ends.reduce((a, b) => (b[1] < a[1] ? b : a)) : ends.reduce((a, b) => (b[0] > a[0] ? b : a));
    const x = Math.min(Math.max(ex, 14), W - 14), y = Math.min(Math.max(ey, 10), H - 4);
    return `<path class="tm-road" d="${d}"/><text class="tm-road-l" x="${x}" y="${y}" text-anchor="${x > W / 2 ? 'end' : 'start'}" dx="${x > W / 2 ? -4 : 4}" dy="${name === 'I-79' ? 9 : -4}">${name}</text>`;
  }).join('');
  const lines = routes.map((r) => { const d = drawStops(m, r.stops, { plain: true }); return d ? `<path class="tm-ln" data-r="${r.id}" d="${d}"/>` : ''; }).join('');
  const dots = places.map((p) => {
    const [x, y] = at[p.id];
    const mark = p.id === from || p.id === to ? ' is-end' : change.has(p.id) ? ' is-change' : '';
    return `<g class="tm-p k-${p.kind}${mark}" data-p="${p.id}"><circle cx="${x}" cy="${y}" r="${p.kind === 'hub' ? 5 : 3.2}"/></g>`;
  }).join('');
  // Invisible, wider targets so a finger can tap a place or a route line.
  const hits = routes.map((r) => { const d = drawStops(m, r.stops, { plain: true }); return d ? `<path class="tm-hit-r" data-r="${r.id}" d="${d}"/>` : ''; }).join('')
    + places.map((p) => { const [x, y] = at[p.id]; return `<circle class="tm-hit-p" data-p="${p.id}" cx="${x}" cy="${y}" r="9"/>`; }).join('');
  return `<svg class="tm" id="${id}" viewBox="0 0 ${W} ${H}" aria-hidden="true" focusable="false"><rect class="tm-bg" width="${W}" height="${H}"/><g class="tm-base">${river}${roads}</g><g class="tm-lines">${lines}</g><g class="tm-trip">${trip ? tripSvg(m, trip) : ''}</g><g class="tm-places">${dots}</g><g class="tm-labels">${mapLabels(m, trip ? tripIds(m, trip, from, to) : [])}</g><g class="tm-marks">${trip ? tripSvg(m, trip, 'marks') : ''}</g><g class="tm-hits">${hits}</g></svg>`;
}

// The highlighted legs of one plan, with a numbered marker where you get on.
export const tripIds = (m, p, fromId, toId) => [fromId, toId, ...p.legs.slice(1).map((l) => m.sp.get(l.on))].filter(Boolean);
// part 'legs': the colored lines (drawn under the dots); part 'marks': the
// numbered circles where you get on (drawn on top).
export function tripSvg(m, p, part = 'legs') {
  const { at, sp } = m;
  return p.legs.map((l, i) => {
    const pts = placePath(between(l.r, l.on, l.off), sp, at);
    const start = at[sp.get(l.on)];
    if (part === 'legs') return pts.length > 1 ? `<path class="tm-leg tm-leg-${i + 1}" d="${drawStops(m, between(l.r, l.on, l.off))}"/>` : '';
    return (start ? `<g class="tm-num tm-num-${i + 1}"><circle cx="${start[0]}" cy="${start[1]}" r="7.5"/><text x="${start[0]}" y="${start[1] + 3.6}" text-anchor="middle">${i + 1}</text></g>` : '');
  }).join('');
}

// Names beside dots, placed where they cover the fewest other dots and names.
// `must` names always show (main stops, the trip's places); `maybe` names
// show only where they fit cleanly.
const TW = 5.6, TH = 10; // rough size of one letter and a line
const SPOTS = [[8, 4, 'start'], [-8, 4, 'end'], [0, -8, 'middle'], [0, 15, 'middle'], [6, -6, 'start'], [-6, -6, 'end'], [6, 13, 'start'], [-6, 13, 'end']];
function box(x, y, dx, dy, a, text, k = 1) {
  const w = text.length * TW * k, x0 = a === 'start' ? x + dx : a === 'end' ? x + dx - w : x + dx - w / 2;
  return [x0 - 1, y + dy - TH * k + 1, x0 + w + 1, y + dy + 2];
}
const overlap = (a, b) => Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])) * Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]));
export function placeLabels(at, places, { must = [], maybe = [], k = 1, H = 1e9, boxes = [] } = {}) {
  const P = new Map(places.map((p) => [p.id, p]));
  // k < 1 when the map is zoomed in: names, dots and gaps shrink in map units
  // so they stay the same size on screen.
  const d = 4.5 * k;
  // Dots and names are hard: a name never covers them. Lines (`boxes`) are
  // soft: a name may sit over a line when there is no better spot.
  const taken = places.map((p) => { const [x, y] = at[p.id]; return [x - d, y - d, x + d, y + d]; });
  const soft = boxes;
  const out = [];
  const one = (id, need) => {
    const p = P.get(id); if (!p) return;
    const [x, y] = at[id], name = p.short ?? p.name;
    let best = null;
    SPOTS.forEach(([sx, sy, a], i) => {
      const dx = sx * k, dy = sy * k;
      const b = box(x, y, dx, dy, a, name, k);
      const off = Math.max(0, -b[0]) + Math.max(0, b[2] - W) + Math.max(0, -b[1]) + Math.max(0, b[3] - H);
      const hit = taken.reduce((t, o) => t + overlap(b, o), 0);
      const lineHit = soft.reduce((t, o) => t + overlap(b, o), 0);
      const score = hit * 4 + lineHit + off * 50 + i * 0.5;
      if (!best || score < best.score) best = { score, hit: hit + off, dx, dy, a, b };
    });
    if (!need && best.hit > 0) return;
    taken.push(best.b);
    out.push({ id, name, x: +(x + best.dx).toFixed(1), y: +(y + best.dy).toFixed(1), a: best.a });
  };
  must.forEach((id) => one(id, true));
  maybe.forEach((id) => one(id, false));
  return out;
}
const hubIds = (places) => places.filter((p) => p.kind === 'hub').map((p) => p.id);
const KIND_ORDER = { place: 0, town: 1, area: 2 };
export function labelText(ls, cls) {
  return ls.map((l) => `<text class="${cls}" data-p="${l.id}" x="${l.x}" y="${l.y}" text-anchor="${l.a}">${esc(l.name)}</text>`).join('');
}
// The map's names for one trip (or none): main stops and the trip's places
// always, other places where they fit.
export function mapLabels(m, ids = [], { k = 1 } = {}) {
  const { at, places, H } = m;
  const trip = ids.filter((id) => !hubIds(places).includes(id));
  const others = places.filter((p) => p.kind !== 'hub' && !ids.includes(p.id)).sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind]).map((p) => p.id);
  const ls = placeLabels(at, places, { must: [...trip, ...hubIds(places)], maybe: others, H, k, boxes: m.boxes ?? [] });
  const strong = new Set([...ids, ...hubIds(places)]);
  return labelText(ls.filter((l) => strong.has(l.id)), 'tm-l') + labelText(ls.filter((l) => !strong.has(l.id)), 'tm-ol');
}

// Place ids a plan touches: start, end and change places.
export function tripPlaces(m, p, fromId, toId) {
  const change = p.legs.slice(1).map((l) => m.sp.get(l.on)).filter(Boolean);
  return { from: fromId, to: toId, change };
}

// ---------- Exploring the map ----------
// Words for the panel under the map when someone taps a place or a route, or
// picks one from the "Look at" list. Buttons carry data-* for the page script.
export function placeInfoHtml(place, routes, day) {
  const rs = routes.filter((r) => r.stops.some((s) => place.stops.includes(s)));
  const items = rs.map((r) => {
    const h = hoursOn(r, day);
    const at = r.stops.filter((s) => place.stops.includes(s)).join(', ');
    return `<li><button type="button" class="tp-chip" data-look-r="${r.id}">${esc(routeName(r))}</button> <span>at ${esc(at)}. ${h ? `${DAY_WORDS[day]}: ${h.first} to ${h.last}`.replace(/\.?$/, '.') : `Not on ${DAY_WORDS[day]}.`}</span></li>`;
  }).join('');
  return `<h3>${esc(place.name)}</h3>`
    + `<div class="tp-acts"><button type="button" class="tp-act" data-set="from" data-p="${place.id}">Start here</button><button type="button" class="tp-act" data-set="to" data-p="${place.id}">Go here</button></div>`
    + (rs.length ? `<p>${rs.length === 1 ? 'One route stops' : `${rs.length} routes stop`} here. Tap a route to see it.</p><ul class="tp-rl">${items}</ul>` : '<p>No route lists a stop here.</p>');
}

export function routeInfoHtml(r, places, day) {
  const sp = stopPlace(places), P = new Map(places.map((p) => [p.id, p]));
  const h = hoursOn(r, day);
  const ids = [];
  for (const s of r.stops) { const id = sp.get(s); if (id && ids[ids.length - 1] !== id && ids[0] !== id) ids.push(id); }
  const chips = ids.map((id) => `<li><button type="button" class="tp-chip" data-look-p="${id}">${esc(P.get(id).short ?? P.get(id).name)}</button></li>`).join('');
  const off = r.stops.filter((s) => !sp.has(s));
  return `<h3>${esc(routeName(r))}</h3>`
    + `<p>${h ? `${DAY_WORDS[day]}: first run ${h.first}, last run ${h.last}`.replace(/\.?$/, '.') : `It does not run on ${DAY_WORDS[day]}.`}${r.trip ? ` One trip around takes about ${r.trip} minutes.` : ''}</p>`
    + `<p>Places on the map, in stop order:</p><ol class="tp-pl">${chips}</ol>`
    + (off.length ? `<p class="tp-off-map">Also stops at ${esc(off.join(', '))} (not on the map).</p>` : '');
}

// Place ids a route passes, for its names on the map.
export function routePlaceIds(r, places) {
  const sp = stopPlace(places);
  return [...new Set(r.stops.map((s) => sp.get(s)).filter(Boolean))];
}

// The trip, short, for the panel under the full map (#1723): planning stays
// in the map. From and To, the day as buttons, one line per bus, and a way to
// the full steps on the page.
export function tripSummaryHtml(plans, from, to, day) {
  const days = Object.entries({ m: 'Mon to Wed', r: 'Thu or Fri', s: 'Sat', u: 'Sun' })
    .map(([k, v]) => `<button type="button" class="tp-day${k === day ? ' is-on' : ''}" data-day="${k}" aria-pressed="${k === day}">${v}</button>`).join('');
  const ends = `<p class="tp-ends"><span class="tp-end-k">From</span> <strong>${esc(from?.name ?? 'Pick a place')}</strong> <span aria-hidden="true">→</span> <span class="tp-end-k">To</span> <strong>${esc(to?.name ?? 'Pick a place')}</strong></p>`;
  const tip = '<p class="tp-hint">Tap a place on the map to start or end there.</p>';
  if (!from || !to || from.id === to.id) return ends + tip;
  const best = plans[0];
  if (!best) return `${ends}<div class="tp-days" role="group" aria-label="Day">${days}</div><p class="tp-none">No trip with two changes or fewer. Call Mountain Line at <a href="tel:3042917433">304-291-RIDE</a>.</p>${tip}`;
  const legs = best.legs.map((l, i) => {
    const h = hoursOn(l.r, day);
    return `<li data-leg="${i + 1}"><strong>${esc(routeName(l.r))}</strong><span>${esc(l.on)} to ${esc(l.off)}</span><span class="tp-when">${h ? `${h.first} to ${h.last}` : `Not on ${DAY_WORDS[day]}`}</span></li>`;
  }).join('');
  return `${ends}<div class="tp-days" role="group" aria-label="Day">${days}</div>`
    + (best.runs ? '' : `<p class="tp-none">Not on ${DAY_WORDS[day]}. These are the buses on the days they run.</p>`)
    + `<ol class="tp-steps tp-mini">${legs}</ol>`
    + (best.legs.length > 1 ? '<p class="tp-hint">Buses do not wait for each other.</p>' : '')
    + `<div class="tp-acts"><button type="button" class="tp-act" data-full>See full steps</button><button type="button" class="tp-clear" data-swap>Swap</button></div>${tip}`;
}
