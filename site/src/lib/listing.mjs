// Listing facts a person needs to decide whether to go (#177,
// docs/design/presentation.md "What every listing needs"): hours the site can
// read, how to get in, and languages and access. All optional, and only ever
// filled from the record's own sources. Used by the content check and by
// PlaceCard (#176).

export const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
// How to get in, with the words people see on the card.
export const GET_IN = { 'walk-in': 'Walk in', appointment: 'By appointment', 'call-first': 'Call first' };
export const LISTING_FIELDS = ['opening_hours', 'get_in', 'languages', 'access'];

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

// Problems with the listing fields on one resource record.
export function checkListing(r) {
  const where = r._file;
  const errors = [];
  const warnings = [];
  const h = r.opening_hours;
  if (h != null && h !== 'always') {
    if (!Array.isArray(h) || !h.length) errors.push(`${where}: opening_hours must be "always" or a list of days with opens and closes (see content/README.md)`);
    else for (const p of h) {
      if (!Array.isArray(p?.days) || !p.days.length || p.days.some((d) => !DAYS.includes(d))) errors.push(`${where}: opening_hours days must be a list from ${DAYS.join(', ')}`);
      if (!isTime(p?.opens) || !isTime(p?.closes)) errors.push(`${where}: opening_hours opens and closes must be quoted 24-hour times like "08:30"`);
      else if (p.opens === p.closes) errors.push(`${where}: opening_hours opens and closes are the same time; use "always" for 24 hours`);
    }
  }
  if (h != null && !r.hours) errors.push(`${where}: opening_hours needs hours in words too, so the card can always say them`);
  if (r.get_in != null && !GET_IN[r.get_in]) errors.push(`${where}: get_in must be one of ${Object.keys(GET_IN).join(', ')}`);
  if (r.languages != null && (!Array.isArray(r.languages) || r.languages.some((l) => typeof l !== 'string' || !l.trim()))) errors.push(`${where}: languages must be a list of language names`);
  if (r.access != null && (typeof r.access !== 'string' || !r.access.trim())) errors.push(`${where}: access must be text`);
  // A place a person goes to needs the first seven listing facts.
  if (r.contact?.place) {
    const missing = [!r.hours && 'hours', !r.cost && 'cost', !r.get_in && 'get_in'].filter(Boolean);
    if (missing.length) warnings.push(`${where}: a place to go, but no ${missing.join(', ')} yet. Add from the source only, never guess`);
  }
  return { errors, warnings };
}
