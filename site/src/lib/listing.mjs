// Listing facts a person needs to decide whether to go (#177,
// docs/design/presentation.md "What every listing needs"): hours the site can
// read, how to get in, and languages and access. All optional, and only ever
// filled from the record's own sources. Used by the content check and by
// PlaceCard (#176).

export const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
// How to get in, with the words people see on the card.
export const GET_IN = { 'walk-in': 'Walk in', appointment: 'By appointment', 'call-first': 'Call first' };
// `steps` (#822): what to do as a short numbered list, when one paragraph
// would be long. Cards show it under `what_to_do`, which stays the summary.
// `closed_on` (#726): holidays the source says the place closes, by name.
// The place card works out each one's date by its fixed rule.
export const HOLIDAYS = {
  'new-years-day': "New Year's Day",
  'memorial-day': 'Memorial Day',
  'independence-day': 'Independence Day',
  'labor-day': 'Labor Day',
  thanksgiving: 'Thanksgiving Day',
  christmas: 'Christmas Day',
};
// `meetings` (#902): regular meetings, each { name, when }, in the source's words.
export const LISTING_FIELDS = ['opening_hours', 'get_in', 'languages', 'access', 'steps', 'closed_on', 'meetings', 'options', 'notes'];

const isTime = (t) => /^([01]\d|2[0-3]):[0-5]\d$|^24:00$/.test(String(t));
const minutes = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));

// The record's hours as a list of { days, opens, closes } in minutes after
// midnight, or 'always'. Closing before opening means it closes the next
// morning (an overnight shelter). Returns null when there are none.
export function schedule(r) {
  const h = r?.opening_hours;
  if (h == null) return null;
  if (h === 'always') return 'always';
  return h.map((p) => ({ days: p.days, opens: minutes(p.opens), closes: minutes(p.closes) }));
}

// Problems with an `opening_hours` value. Resources and places (#1439) share it.
export function checkOpeningHours(h, where) {
  const errors = [];
  if (h == null || h === 'always') return errors;
  if (!Array.isArray(h) || !h.length) errors.push(`${where}: opening_hours must be "always" or a list of days with opens and closes (see content/README.md)`);
  else for (const p of h) {
    if (!Array.isArray(p?.days) || !p.days.length || p.days.some((d) => !DAYS.includes(d))) errors.push(`${where}: opening_hours days must be a list from ${DAYS.join(', ')}`);
    if (!isTime(p?.opens) || !isTime(p?.closes)) errors.push(`${where}: opening_hours opens and closes must be quoted 24-hour times like "08:30"`);
    else if (p.opens === p.closes) errors.push(`${where}: opening_hours opens and closes are the same time; use "always" for 24 hours`);
  }
  return errors;
}

const DAY_NAMES = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' };
// "8 a.m.", "11:30 a.m.", "noon": the same way times read everywhere (#51).
function timeWords(t) {
  const [h, m] = t.split(':').map(Number);
  if (h === 12 && !m) return 'noon';
  if ((h === 0 || h === 24) && !m) return 'midnight';
  return `${h % 12 || 12}${m ? `:${String(m).padStart(2, '0')}` : ''} ${h < 12 ? 'a.m.' : 'p.m.'}`;
}
const andList = (xs) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
// "Monday to Thursday", "Friday and Saturday", "Monday, Wednesday and Friday".
// Three or more days in a row read as a range.
export function dayWords(days) {
  const idx = [...new Set(days)].map((d) => DAYS.indexOf(d)).sort((a, b) => a - b);
  if (idx.length === 7) return 'Every day';
  const runs = [];
  for (const i of idx) {
    const last = runs[runs.length - 1];
    if (last && i === last[last.length - 1] + 1) last.push(i); else runs.push([i]);
  }
  const parts = runs.flatMap((r) => (r.length >= 3 ? [`${DAY_NAMES[DAYS[r[0]]]} to ${DAY_NAMES[DAYS[r[r.length - 1]]]}`] : r.map((i) => DAY_NAMES[DAYS[i]])));
  return andList(parts);
}

// Opening hours as a few short lines, days with the same hours together (#1439):
// ["Monday to Thursday: 9 a.m. to 8 p.m.", "Friday and Saturday: 9 a.m. to 4 p.m.", "Closed Sunday"].
// One line per day ran long on a phone and read as "Tuesdays Closed".
export function hoursLines(h) {
  if (h == null) return [];
  if (h === 'always') return ['Open 24 hours, every day'];
  const byDay = Object.fromEntries(DAYS.map((d) => [d, []]));
  for (const p of h) for (const d of p.days) byDay[d].push(p);
  const groups = [];
  for (const d of DAYS) {
    if (!byDay[d].length) continue;
    const key = byDay[d].slice().sort((a, b) => (a.opens < b.opens ? -1 : 1)).map((p) => `${timeWords(p.opens)} to ${timeWords(p.closes)}`).join(' and ');
    const g = groups.find((x) => x.key === key);
    if (g) g.days.push(d); else groups.push({ key, days: [d] });
  }
  const lines = groups.map((g) => `${dayWords(g.days)}: ${g.key}`);
  const closed = DAYS.filter((d) => !byDay[d].length);
  if (closed.length && closed.length < 7) lines.push(`Closed ${dayWords(closed)}`);
  return lines;
}

// Problems with the listing fields on one resource record.
export function checkListing(r) {
  const where = r._file;
  const errors = [];
  const warnings = [];
  const h = r.opening_hours;
  errors.push(...checkOpeningHours(h, where));
  if (h != null && !r.hours) errors.push(`${where}: opening_hours needs hours in words too, so the card can always say them`);
  if (r.get_in != null && !GET_IN[r.get_in]) errors.push(`${where}: get_in must be one of ${Object.keys(GET_IN).join(', ')}`);
  if (r.languages != null && (!Array.isArray(r.languages) || r.languages.some((l) => typeof l !== 'string' || !l.trim()))) errors.push(`${where}: languages must be a list of language names`);
  if (r.access != null && (typeof r.access !== 'string' || !r.access.trim())) errors.push(`${where}: access must be text`);
  if (r.closed_on != null && (!Array.isArray(r.closed_on) || r.closed_on.some((h) => !HOLIDAYS[h]))) errors.push(`${where}: closed_on must be a list from ${Object.keys(HOLIDAYS).join(', ')}`);
  if (r.closed_on != null && !r.opening_hours) errors.push(`${where}: closed_on only matters with opening_hours`);
  if (r.meetings != null && (!Array.isArray(r.meetings) || !r.meetings.length || r.meetings.some((m) => typeof m?.name !== 'string' || !m.name.trim() || typeof m?.when !== 'string' || !m.when.trim()))) errors.push(`${where}: meetings must be a list of { name, when } in the source's words`);
  if (r.steps != null && (!Array.isArray(r.steps) || !r.steps.length || r.steps.some((t) => typeof t !== 'string' || !t.trim()))) errors.push(`${where}: steps must be a list of short sentences`);
  // `options` (#973): a short bulleted list of choices, like the kinds of ID that count.
  // `notes`: short paragraphs shown after the lists, for exceptions and special cases.
  for (const f of ['options', 'notes']) if (r[f] != null && (!Array.isArray(r[f]) || !r[f].length || r[f].some((t) => typeof t !== 'string' || !t.trim()))) errors.push(`${where}: ${f} must be a list of short text items`);
  // A place a person goes to needs the first seven listing facts.
  if (r.contact?.place) {
    const missing = [!r.hours && 'hours', !r.cost && 'cost', !r.get_in && 'get_in'].filter(Boolean);
    if (missing.length) warnings.push(`${where}: a place to go, but no ${missing.join(', ')} yet. Add from the source only, never guess`);
  }
  return { errors, warnings };
}
