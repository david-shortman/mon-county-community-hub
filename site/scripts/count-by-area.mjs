// Counts our own in-person listings by area (#834): resources with a street
// address (contact.place), by the town in that address, and gathering places
// (content/places) by their `area`. Counts of listings, never of people.
// Run with each findability run and copy the table to docs/scoreboard.md.
// Usage (from site/): node scripts/count-by-area.mjs
import { loadDir, todayYmd } from '../src/lib/content.mjs';

// "40 Commerce Drive, Morgantown, WV 26505" -> "Morgantown". The town is the
// part before the state; a mailing town, so "Morgantown" also covers
// addresses outside city limits that use a Morgantown mailing address.
const town = (place) => {
  const parts = String(place).split(',').map((p) => p.trim());
  const i = parts.findIndex((p) => /^WV\b/.test(p));
  return i > 0 ? parts[i - 1] : 'Unknown';
};

const resources = loadDir('resources');
const inPerson = resources.filter((r) => r.contact?.place);
const byTown = new Map();
for (const r of inPerson) byTown.set(town(r.contact.place), (byTown.get(town(r.contact.place)) ?? 0) + 1);
const places = loadDir('places');
const byArea = new Map();
for (const p of places) byArea.set(p.area, (byArea.get(p.area) ?? 0) + 1);

const rows = [...byTown].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
console.log(`In-person listings by area, ${todayYmd()}\n`);
console.log(`Resources: ${resources.length} listings, ${inPerson.length} with a street address.\n`);
console.log('| Town in the address | Resources |\n|---|---|');
for (const [t, n] of rows) console.log(`| ${t} | ${n} |`);
console.log(`\nGathering places: ${places.length}.\n`);
console.log('| Area | Places |\n|---|---|');
for (const [a, n] of [...byArea].sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0]))) console.log(`| ${a} | ${n} |`);
