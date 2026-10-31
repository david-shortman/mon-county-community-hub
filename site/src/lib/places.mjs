// Gathering places from content/places/ (#455): community centers, senior
// centers, neighborhood houses, public rec buildings and fire halls with a
// hall to rent. Shared with the groups directory (#263).
import { loadDir, ymd, todayYmd, oldestChecked, STALE_DAYS } from './content.mjs';

// The section's name in one place, so renaming it is a one-line change (#454).
export const SECTION = { name: 'Community centers and halls', short: 'Community centers', route: '/community-centers/' };

// Parts of the county, in the order the section lists them (#462).
export const AREAS = [
  ['morgantown', 'Morgantown and close in'],
  ['south', 'South county'],
  ['west', 'West county'],
  ['north', 'North county'],
  ['east', 'East county'],
];
export const areaLabel = (a) => AREAS.find(([k]) => k === a)?.[1] ?? a;

export const KIND_LABELS = {
  'community-center': 'Community center',
  'senior-center': 'Senior center',
  'neighborhood-house': 'Neighborhood house',
  'rec-center': 'Public rec building',
  'park-building': 'Park building',
  'fire-hall': 'Fire hall',
};

const STATUS_LABELS = {
  active: null,
  'no-recent-activity': 'No recent activity seen, call first',
  closed: 'Closed',
  renovating: 'Closed for renovation',
};

const daysAgo = (d, today) => (Date.parse(`${today}T12:00:00Z`) - Date.parse(`${d}T12:00:00Z`)) / 86400000;

// The status a card shows. An "active" place whose newest sign of activity
// is over 6 months old reads "No recent activity seen, call first" (#39, #458).
export function placeStatus(p, today = todayYmd()) {
  let status = p.status;
  if (status === 'active' && p.last_activity_seen && daysAgo(p.last_activity_seen, today) > STALE_DAYS) status = 'no-recent-activity';
  return { status, label: STATUS_LABELS[status] ?? null };
}

let cache;
export function loadPlaces() {
  cache ??= loadDir('places').map((p) => ({
    ...p,
    last_activity_seen: ymd(p.last_activity_seen),
    phone_confirmed: ymd(p.phone_confirmed),
    sources: (p.sources ?? []).map((s) => ({ ...s, checked: ymd(s.checked) })),
    checked: oldestChecked(p.sources ?? []),
  })).sort((a, b) => a.name.localeCompare(b.name));
  return cache;
}

export function place(slug) {
  const p = loadPlaces().find((x) => x.slug === slug);
  if (!p) throw new Error(`content/places: no entry with slug ${slug}`);
  return p;
}

// Places grouped by part of the county, in AREAS order, skipping empty parts.
export function byArea(places = loadPlaces()) {
  return AREAS.map(([key, label]) => ({ key, label, places: places.filter((p) => p.area === key) })).filter((g) => g.places.length);
}

// Every rental row with its place, for the hall finder (#464).
export function rentalRows(places = loadPlaces()) {
  const order = Object.fromEntries(AREAS.map(([k], i) => [k, i]));
  return places
    .flatMap((p) => (p.rentals ?? []).map((r) => ({ ...r, place: p })))
    .sort((a, b) => order[a.place.area] - order[b.place.area] || a.place.name.localeCompare(b.place.name));
}

// "Hall for 72, second room for 28, kitchen, pavilion": what's there, in words.
export function whatsThere(p) {
  const f = p.facilities ?? {};
  const bits = [
    ...(f.rooms ?? []).map((r) => (r.seats ? `${r.name} (seats ${r.seats})` : r.name)),
    f.kitchen && 'kitchen',
    f.gym && 'gym',
    ...(f.outdoor ?? []),
    ...(f.other ?? []),
    f.step_free && 'step-free entrance',
  ].filter(Boolean);
  if (!bits.length) return null;
  const s = bits.join(', ');
  return s[0].toUpperCase() + s.slice(1);
}
