// The printable sheets (#405): one per door that has resource records, and one
// per topic with at least MIN records (smaller topics are on their door's
// sheet). Shared by the sheet pages, the Printouts list and llms.txt, so all
// three always agree.
import { loadDir, loadDoors } from './content.mjs';

export const MIN = 4;

// [{ slug, kind: 'door' | 'topic', name, door, list }]
export function printSheets() {
  const all = loadDir('resources').filter((r) => r.slug);
  const { doors } = loadDoors();
  const out = [];
  for (const d of doors) {
    const topics = Object.keys(d.topics);
    const list = all.filter((r) => r.topics.some((t) => topics.includes(t)));
    if (!list.length) continue;
    out.push({ slug: d.slug, kind: 'door', name: d.name, door: d.slug, list });
    for (const t of topics) {
      const tl = all.filter((r) => r.topics.includes(t));
      if (tl.length >= MIN && tl.length < list.length && !doors.some((x) => x.slug === t)) out.push({ slug: t, kind: 'topic', name: d.topics[t], door: d.slug, list: tl });
    }
  }
  return out;
}
