// Morgantown 311: a few big-picture totals (#881, part of #86).
// Run on a GitHub Actions runner by .github/workflows/311-totals.yml, because
// the SeeClickFix API refuses requests from our cloud sandbox.
//
// Rules (David's decision on #300): only a few totals, credited "Data from
// SeeClickFix, Morgantown 311." Never single requests, their text, photos,
// addresses or reporters. This script reads request dates and status in
// memory and prints only counts and medians. It saves nothing to the repo;
// a person copies the totals into content/ through a PR after checking them.
//
// Usage (from site/): node scripts/check-311.mjs   prints JSON totals
// Exit codes: 0 ok, 1 the API or the place lookup failed.
const API = 'https://seeclickfix.com/api/v2';
const HEADERS = { 'User-Agent': 'mon-county-community-hub (github.com/david-shortman/mon-county-community-hub)', Accept: 'application/json' };
const DAY = 864e5;

async function get(path, params) {
  const url = `${API}/${path}?${new URLSearchParams(params)}`;
  const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);
  return res.json();
}

// The place: look it up by name instead of guessing its id, and stop unless
// exactly one place is Morgantown in West Virginia.
async function findPlace() {
  let data = await get('places', { address: 'Morgantown, WV' }).catch(() => ({}));
  if (!(data.places ?? []).length) data = await get('places', { search: 'Morgantown' });
  const places = (data.places ?? []).filter((p) => /morgantown/i.test(p.name ?? '') && /(WV|West Virginia)/i.test(`${p.state ?? ''} ${p.name ?? ''} ${p.url_name ?? ''}`));
  if (places.length !== 1) throw new Error(`expected one Morgantown, WV place, found ${places.length}: ${places.map((p) => `${p.name} (${p.url_name})`).join(', ') || 'none'}`);
  return places[0];
}

// Every request created since `after`, newest first, keeping only dates,
// status and category in memory.
async function requestsSince(placeUrl, after) {
  const out = [];
  for (let page = 1; page <= 60; page++) {
    // The API returns only open and acknowledged requests unless asked for every status.
    const data = await get('issues', { place_url: placeUrl, after: after.toISOString(), status: 'open,acknowledged,closed,archived', per_page: 100, page, sort: 'created_at' });
    for (const i of data.issues ?? []) out.push({ created: i.created_at, closed: i.closed_at ?? null, status: i.status, type: i.request_type?.title ?? '' });
    if (!data.metadata?.pagination?.next_page) break;
  }
  return out;
}

const median = (xs) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

function totals(list) {
  const closed = list.filter((r) => r.closed && /closed/i.test(r.status ?? ''));
  const days = closed.map((r) => (Date.parse(r.closed) - Date.parse(r.created)) / DAY).filter((d) => d >= 0);
  return { opened: list.length, closed: closed.length, median_days_to_close: days.length ? Math.round(median(days) * 10) / 10 : null };
}

try {
  const now = new Date();
  const after = new Date(now.getTime() - 365 * DAY);
  const place = await findPlace();
  const list = await requestsSince(place.url_name, after);
  const potholes = list.filter((r) => /pothole|street maint/i.test(r.type));
  console.log(JSON.stringify({
    source: 'SeeClickFix, Morgantown 311',
    credit: 'Data from SeeClickFix, Morgantown 311.',
    place: { name: place.name, url_name: place.url_name },
    window: { from: after.toISOString().slice(0, 10), to: now.toISOString().slice(0, 10) },
    all_requests: totals(list),
    street_maintenance_and_potholes: totals(potholes),
    note: 'Requests opened in the window; "closed" counts requests opened in the window that are now closed. Closed does not always mean fixed; check the source wording before saying more.',
  }, null, 2));
} catch (e) {
  console.error(`check-311: ${e.message}`);
  process.exit(1);
}
