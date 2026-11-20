// The printable sheets (#405): one per door that has resource records, and one
// per topic with at least MIN records (smaller topics are on their door's
// sheet). Shared by the sheet pages, the Printouts list and llms.txt, so all
// three always agree. Group sheets (older adults, teens) list the records
// named in content/print-groups.yaml.
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { loadDir, loadDoors, CONTENT_DIR } from './content.mjs';

export const MIN = 4;

// Topics whose records wait for David under the High stakes rules
// (docs/COORDINATION.md). Group sheets leave them off and point to the
// Get through this month sheet instead.
export const GROUP_SKIP_TOPICS = ['housing', 'money', 'food'];

// [{ slug, name, page, resources: [slug] }] from content/print-groups.yaml.
export function loadPrintGroups() {
  const file = path.join(CONTENT_DIR, 'print-groups.yaml');
  if (!fs.existsSync(file)) return [];
  return YAML.parse(fs.readFileSync(file, 'utf8'))?.groups ?? [];
}

// A group's records, in the order of the file. A slug that is missing or
// hidden is skipped here; test/print-groups.test.mjs catches a typo.
export function groupList(group, all = loadDir('resources').filter((r) => r.slug)) {
  const bySlug = new Map(all.map((r) => [r.slug, r]));
  return group.resources.map((s) => bySlug.get(s)).filter((r) => r && !r.topics.some((t) => GROUP_SKIP_TOPICS.includes(t)));
}

// [{ slug, kind: 'door' | 'topic' | 'group', name, door, page, list }]
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
  for (const g of loadPrintGroups()) {
    const list = groupList(g, all);
    if (list.length) out.push({ slug: g.slug, kind: 'group', name: g.name, page: g.page, list });
  }
  return out;
}
