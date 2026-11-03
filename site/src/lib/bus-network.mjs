// The bus route diagram on /bus-routes/ (#1445, part of #1440): how the
// Mountain Line network fits together. Everything comes from
// content/pdf-pages/mountain-line-routes.yaml ("Stops along the way, in
// order" on each route, copied from busride.org). Counts are worked out here
// at build time, never typed in.
// The drawing is a diagram, not a map: only stops on two or more routes get a
// spot, placed by hand so lines do not cross much. A shared stop does not
// mean buses wait for each other.

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

// Hand-placed spots for the shared stops (viewBox 0 0 340 250). Rough
// directions only: Westover and Pifer to the west, downtown in the middle,
// campus and Evansdale to the north and east.
export const SPOTS = {
  'Cassville': [24, 34],
  'New Hill': [44, 64],
  'Westover Terminal': [30, 108],
  'Westover Triangle': [78, 120],
  'Mountaineer Station': [120, 40],
  'Pifer Terminal': [56, 168],
  'Giant Eagle': [84, 228],
  'Public Safety Building': [124, 214],
  'Downtown': [150, 168],
  'Court House': [176, 198],
  'Unity Manor': [206, 222],
  'Sunnyside': [150, 118],
  'Mountainlair': [178, 140],
  'Met Theatre': [214, 172],
  "Colasante's Shelter": [248, 196],
  'Fort Pierpont': [300, 226],
  'Law School': [192, 100],
  'E. Moore Hall': [238, 146],
  'Towers': [222, 70],
  'Life Sciences': [262, 98],
  'Ruby': [276, 40],
  'Valley View': [312, 80],
  'Stewart Street': [176, 52],
  'Walmart/UTC': [96, 84],
};

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

// The shared stops a route passes, in its order, as points for a line.
export function path(r, spots = SPOTS) {
  const pts = r.stops.filter((s) => spots[s]).map((s) => spots[s]);
  return pts.filter((p, i) => i === 0 || p !== pts[i - 1]);
}

const d = (pts) => (pts.length > 1 ? 'M' + pts.map((p) => p.join(' ')).join('L') : '');
const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const routeId = (r) => 'r-' + slug(r.name);

// The diagram. data-s picks the step (CSS on the page turns parts on);
// data-r on a route line marks the picked route for the "ride one route" step.
export function diagram(routes, { step = 'all', pick = '' } = {}) {
  const shared = sharedStops(routes);
  const pifer = new Set(routes.filter((r) => touches(r, 'Pifer Terminal')).map(routeId));
  const lines = routes.map((r) => {
    let pts = path(r);
    if (pts.length === 1) {
      // A route that meets the rest at one stop: a short line out from it, away from the middle.
      const [x, y] = pts[0], dx = x - 170, dy = y - 140, k = 26 / (Math.hypot(dx, dy) || 1);
      pts = [pts[0], [Math.round(x + dx * k), Math.round(y + dy * k)]];
    }
    if (pts.length < 2) return '';
    const cls = ['ln', pifer.has(routeId(r)) ? 'ln-p' : 'ln-o', routeId(r) === pick ? 'ln-pick' : ''].filter(Boolean).join(' ');
    return `<path class="${cls}" data-r="${routeId(r)}" d="${d(pts)}"/>`;
  }).join('');
  const dots = shared.filter(([s]) => SPOTS[s]).map(([s, rs]) => {
    const [x, y] = SPOTS[s];
    const r = Math.min(4 + rs.length, 13);
    return `<g class="stop${s === 'Pifer Terminal' ? ' hub' : ''}${rs.length >= 5 ? ' big' : ''}" data-n="${rs.length}"><circle cx="${x}" cy="${y}" r="${r}"/></g>`;
  }).join('');
  const labels = [['Pifer Terminal', -4, 22, 'middle'], ['Downtown', 0, 22, 'middle'], ['Towers', 0, -14, 'middle'], ['Mountainlair', -14, 4, 'end'], ["Colasante's Shelter", 0, 22, 'middle'], ['Westover Terminal', 0, 22, 'middle'], ['Ruby', 0, -12, 'middle']]
    .map(([s, dx, dy, a]) => `<text class="lbl" x="${SPOTS[s][0] + dx}" y="${SPOTS[s][1] + dy}" text-anchor="${a}">${s === "Colasante's Shelter" ? 'Colasante&#39;s' : s.replace(' Terminal', '')}</text>`).join('');
  return `<svg class="net" data-s="${step}" viewBox="0 0 340 250" aria-hidden="true" focusable="false">${lines}${dots}${labels}<g class="bus"><rect x="-7" y="-5" width="14" height="10" rx="2"/></g></svg>`;
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
