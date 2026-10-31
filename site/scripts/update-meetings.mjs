// Refreshes the saved copy of each meetings source (#12) and prints what is
// new or changed since the last saved copy: new meetings, new agendas, and
// newly posted minutes. Commit the changed files in src/lib/meetings/snapshots/.
import { SOURCES, loadSource } from '../src/lib/meetings/index.mjs';

for (const src of SOURCES) {
  const { meetings, status, previous } = await loadSource(src, { save: true });
  if (status !== 'live') { console.error(`${src.id}: could not read the live page (${status}); saved copy unchanged.`); process.exitCode = 1; continue; }
  const before = new Map(previous.map((m) => [m.slug, m]));
  const added = meetings.filter((m) => !before.has(m.slug));
  const minutes = meetings.filter((m) => m.minutes_url && before.has(m.slug) && !before.get(m.slug).minutes_url);
  console.log(`${src.id}: ${meetings.length} meetings saved. ${added.length} new, ${minutes.length} with new minutes.`);
  for (const m of added) console.log(`  new: ${m.date} ${m.body}: ${m.title}`);
  for (const m of minutes) console.log(`  minutes posted: ${m.date} ${m.body}: ${m.title}`);
}
