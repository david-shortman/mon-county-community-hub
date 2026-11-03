// "How the routes fit together" on /bus-routes/ (#1445, redone in #1656): where
// the Mountain Line routes meet. Everything comes from
// content/pdf-pages/mountain-line-routes.yaml ("Stops along the way, in
// order" on each route, copied from busride.org). Counts are worked out here
// at build time, never typed in.
// The first version was a network drawing; with 20 routes its lines crossed
// everywhere on a phone, so it is now a chart of routes by busy stops. A
// shared stop does not mean buses wait for each other.

// One spelling per stop. Only clear spelling differences are joined; names
// that might be different places stay apart (for example "Court House (High
// St.)", "University Park Apartments", "Willowdale/Stadium").
export const ALIASES = {
  'Public Safety': 'Public Safety Building',
  'Public Safety Bldg.': 'Public Safety Building',
  'E.Moor Hall': 'E. Moore Hall',
  'Wal-mart/UTC': 'Walmart/UTC',
  'Stewart St.': 'Stewart Street',
  Courthouse: 'Court House',
};
export const one = (s) => ALIASES[s] ?? s;

const STOPS_LINE = /^Stops along the way, in order: /;

// Routes from the record: [{ name, short, trip, stops: [one spelling each] }].
export function routesFrom(record) {
  const out = [];
  for (const sec of record.sections ?? []) {
    for (const it of sec.items ?? []) {
      const line = (it.lines ?? []).find((l) => STOPS_LINE.test(l));
      if (!line) continue; // RideMon vans have no fixed stops
      const stops = line.replace(STOPS_LINE, '').replace(/\.$/, '').split(/, (?![^(]*\))/).map((s) => one(s.trim()));
      out.push({ name: it.name, short: it.hours?.short ?? it.name, trip: it.hours?.trip ?? null, stops });
    }
  }
  return out;
}

// Stop name -> route names that stop there, for stops on two or more routes,
// most routes first.
export function sharedStops(routes) {
  const at = new Map();
  for (const r of routes) for (const s of new Set(r.stops)) at.set(s, [...(at.get(s) ?? []), r.name]);
  return [...at].filter(([, rs]) => rs.length > 1).sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
}

export const touches = (r, stop) => r.stops.includes(stop);

export const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const routeId = (r) => 'r-' + slug(r.name);

// The busy stops: on HUB_MIN or more routes, most routes first. These are the
// chart's columns.
export const HUB_MIN = 5;
export const hubs = (routes, min = HUB_MIN) => sharedStops(routes).filter(([, rs]) => rs.length >= min).map(([s]) => s);

// The "where routes meet" chart: one row per route, one column per busy stop.
// Rows are grouped by the first busy stop they reach, going down the columns
// (routes through Pifer, then the rest through Towers, and so on). Groups of
// one route join "Other routes". Inside a group, rows with the same dots sit
// together. `also` lists the other shared stops on a route.
export function grid(routes) {
  const cols = hubs(routes);
  const shared = new Set(sharedStops(routes).map(([s]) => s));
  const left = new Set(routes);
  const groups = [];
  const used = [];
  const rowOf = (r) => ({ r, on: cols.map((c) => touches(r, c)), also: [...new Set(r.stops)].filter((s) => shared.has(s) && !cols.includes(s)) });
  const order = (a, b) => b.on.map(Number).join('').localeCompare(a.on.map(Number).join('')) || routes.indexOf(a.r) - routes.indexOf(b.r);
  for (const c of cols) {
    const rs = [...left].filter((r) => touches(r, c));
    if (rs.length < 2) continue;
    rs.forEach((r) => left.delete(r));
    groups.push({ hub: c, not: [...used], rows: rs.map(rowOf).sort(order) });
    used.push(c);
  }
  if (left.size) groups.push({ hub: '', not: used, rows: [...left].map(rowOf).sort(order) });
  return { cols, groups };
}

// Words for the steps, worked out from the data.
export function facts(routes) {
  const n = routes.length;
  const shared = sharedStops(routes);
  const count = (s) => shared.find(([x]) => x === s)?.[1].length ?? 0;
  const noPifer = routes.filter((r) => !touches(r, 'Pifer Terminal'));
  return { n, pifer: count('Pifer Terminal'), downtown: count('Downtown'), towers: count('Towers'), lair: count('Mountainlair'), shared, noPifer };
}

// "Ride one route" words for one route: stop count, trip time, and where you
// can change to other routes.
export function rideText(routes, r) {
  const shared = new Map(sharedStops(routes));
  const changes = [...new Set(r.stops)].filter((s) => shared.has(s)).map((s) => `${s} (${shared.get(s).filter((x) => x !== r.name).map((x) => x.replace(/^Route \d+ /, '')).join(', ')})`);
  const trip = r.trip ? ` One trip around the route takes about ${r.trip} minutes.` : '';
  return `${r.name}: ${new Set(r.stops).size} stops.${trip}${changes.length ? ` Other routes also stop at ${changes.join('; ')}.` : ' No other route shares its stops.'}`;
}
