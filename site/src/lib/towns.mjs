// Town and neighborhood on places and dates (#395, "Quiet local touches" in
// docs/design/identity.md). Both are optional and set by hand from the
// record's own source. Never work a town out from a mailing address: many
// places with a "Morgantown, WV" address are outside the city.
//
// TOWNS is the list of names the content check accepts, so the same place is
// always spelled the same way and the Dates page can group by it. Add a name
// here when a sourced record needs it. Westover, Star City, Granville, Cheat
// Lake and Blacksville are their own places; never fold them into Morgantown.
export const TOWNS = [
  'Arnettsville', 'Blacksville', 'Brookhaven', 'Cassville', 'Cheat Lake', 'Core', 'Daybrook',
  'Granville', 'Maidsville', 'Morgantown', 'Osage', 'Pentress', 'Sabraton', 'Smithtown', 'Star City', 'Westover',
  // Nearby, outside Monongalia County, for dates people here travel to.
  'Fairmont', 'Kingwood', 'Masontown',
];
export const TOWN_FIELDS = ['town', 'neighborhood'];

// Problems with the town fields on one record.
export function checkTown(e) {
  const errors = [];
  if (e.town != null && !TOWNS.includes(e.town)) errors.push(`${e._file}: town "${e.town}" is not in the list in site/src/lib/towns.mjs (add it there if the source names it)`);
  if (e.neighborhood != null && (typeof e.neighborhood !== 'string' || !e.neighborhood.trim())) errors.push(`${e._file}: neighborhood must be text, like "Sunnyside"`);
  if (e.neighborhood != null && e.town == null) errors.push(`${e._file}: neighborhood needs a town too`);
  return errors;
}

// "Sunnyside, Morgantown" or "Westover", or null.
export const townLine = (e) => (e?.town ? [e.neighborhood, e.town].filter(Boolean).join(', ') : null);
