// The simple bus diagram on /bus-routes/ (#1723): a transit-map style drawing
// where places sit on a hand-placed grid (`grid` in content/bus-map/places.yaml)
// and every line runs straight or at 45 degrees, with rounded bends. True in
// rough direction, not in distance. The street map (bus-street-map.mjs) is the
// one to use for where things really are.
// Pure functions, no DOM: the build draws it and the browser redraws trips.

export const W = 340;
const R = 7; // bend radius in drawing units
const LONG = 6; // links longer than this many grid steps are left out of the plain lines

// Grid -> drawing points. Returns { at: { id: [x, y] }, H, U }.
export function diagramAt(places, { pad = 34, padTop = 26 } = {}) {
  const xs = places.map((p) => p.grid[0]), ys = places.map((p) => p.grid[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const U = (W - 2 * pad) / (x1 - x0);
  const at = Object.fromEntries(places.map((p) => [p.id, [+(pad + (p.grid[0] - x0) * U).toFixed(1), +(padTop + (p.grid[1] - y0) * U).toFixed(1)]]));
  return { at, H: Math.round(padTop + (y1 - y0) * U + pad), U, grid: { x0, y0 } };
}

// The corner of a link from a to b. mode 's': straight part first (leaving
// a), then the 45 degree part; mode 'd': 45 degree part first.
function corner(a, b, mode) {
  const dx = b[0] - a[0], dy = b[1] - a[1], ax = Math.abs(dx), ay = Math.abs(dy), sx = Math.sign(dx), sy = Math.sign(dy);
  if (!ax || !ay || ax === ay) return null; // already straight or 45 degrees
  const diag = Math.min(ax, ay);
  const straight = ax > ay ? [sx * (ax - diag), 0] : [0, sy * (ay - diag)];
  return mode === 's' ? [a[0] + straight[0], a[1] + straight[1]] : [a[0] + sx * diag, a[1] + sy * diag];
}

// Distance from point p to segment ab.
function segDist(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy;
  const t = L ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L)) : 0;
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
}

// Pick the bend that passes fewest other places; ties go to straight-first
// from the end with the smaller id, so the choice never depends on direction.
export function bendFor(aId, bId, at) {
  const [i, j] = [aId, bId].sort(), a = at[i], b = at[j];
  const others = Object.entries(at).filter(([id]) => id !== i && id !== j).map(([, p]) => p);
  const cost = (mode) => { const c = corner(a, b, mode); const pts = c ? [a, c, b] : [a, b]; let n = 0; for (const p of others) for (let k = 1; k < pts.length; k++) if (segDist(p, pts[k - 1], pts[k]) < 7) n++; return n; };
  return { from: i, mode: cost('s') <= cost('d') ? 's' : 'd' };
}

// The points of one link, a to b, with its corner.
export function linkPoints(aId, bId, at) {
  const { from, mode } = bendFor(aId, bId, at);
  const [s, e] = from === aId ? [at[aId], at[bId]] : [at[bId], at[aId]];
  const c = corner(s, e, mode);
  const pts = c ? [s, c, e] : [s, e];
  return from === aId ? pts : pts.reverse();
}

const f1 = (n) => +n.toFixed(1);
// SVG path through points, with the corners rounded.
function rounded(pts) {
  let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
  for (let k = 1; k < pts.length; k++) {
    const p = pts[k], prev = pts[k - 1], next = pts[k + 1];
    if (!next) { d += `L${f1(p[0])} ${f1(p[1])}`; break; }
    const l1 = Math.hypot(p[0] - prev[0], p[1] - prev[1]), l2 = Math.hypot(next[0] - p[0], next[1] - p[1]);
    const r = Math.min(R, l1 / 2, l2 / 2);
    const a = [p[0] - ((p[0] - prev[0]) / l1) * r, p[1] - ((p[1] - prev[1]) / l1) * r];
    const b = [p[0] + ((next[0] - p[0]) / l2) * r, p[1] + ((next[1] - p[1]) / l2) * r];
    d += `L${f1(a[0])} ${f1(a[1])}Q${f1(p[0])} ${f1(p[1])} ${f1(b[0])} ${f1(b[1])}`;
  }
  return d;
}

// A line through places in order. plain: leave out very long links (a route
// that jumps across the county on its way back), drawn only for a trip.
export function diagramPath(ids, at, U, { plain = false } = {}) {
  const runs = [[]];
  for (let k = 0; k < ids.length; k++) {
    const cur = runs[runs.length - 1];
    if (!k) { cur.push(at[ids[0]]); continue; }
    const a = at[ids[k - 1]], b = at[ids[k]];
    if (plain && Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])) / U > LONG) { runs.push([b]); continue; }
    const pts = linkPoints(ids[k - 1], ids[k], at);
    cur.push(...pts.slice(1));
  }
  return runs.filter((r) => r.length > 1).map(rounded).join('');
}

// Small boxes along every plain line, so place names keep off the lines.
export function lineBoxes(routeIds, at, U) {
  const boxes = [], seen = new Set();
  for (const ids of routeIds) for (let k = 1; k < ids.length; k++) {
    const key = [ids[k - 1], ids[k]].sort().join('|'); if (seen.has(key)) continue; seen.add(key);
    const a = at[ids[k - 1]], b = at[ids[k]];
    if (Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])) / U > LONG) continue;
    const pts = linkPoints(ids[k - 1], ids[k], at);
    for (let q = 1; q < pts.length; q++) {
      const [p, r] = [pts[q - 1], pts[q]], n = Math.ceil(Math.hypot(r[0] - p[0], r[1] - p[1]) / 4);
      for (let t = 1; t < n; t++) { const x = p[0] + ((r[0] - p[0]) * t) / n, y = p[1] + ((r[1] - p[1]) * t) / n; boxes.push([x - 1.5, y - 1.5, x + 1.5, y + 1.5]); }
    }
  }
  return boxes;
}

// The river, drawn as a band between the grid columns it runs between.
// It runs north between Star City and Suncrest, and between Pifer and Downtown.
export function riverPath(at, H) {
  const x = at['star-city'] && at.suncrest ? (at['star-city'][0] + at.suncrest[0]) / 2 : W / 2;
  return { d: `M${f1(x)} 0V${H}`, x };
}
