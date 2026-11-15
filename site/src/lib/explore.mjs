// Topics explorer (#2025): interest chips and the pages each one lifts, from
// content/explore-chips.yaml (#2026). Pure helpers live here so tests run in
// Node; the Astro pages pass in the page tags.
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { CONTENT_DIR } from './content.mjs';

export const CHIPS_FILE = path.join(CONTENT_DIR, 'explore-chips.yaml');
export const MIN_PAGES = 4;
export const MAX_PAGES = 12;
export const MAX_NAME_WORDS = 3;

// { chips: [{ id, name, pages }], starter: [route] }
export function loadChips(file = CHIPS_FILE) {
  const doc = YAML.parse(fs.readFileSync(file, 'utf8')) ?? {};
  return { chips: doc.chips ?? [], starter: doc.starter ?? [] };
}

// Problems with the chips file. `pages` maps a route to what we know about it:
// { tagged, door, crisis } (crisis: the page names 988, 211 or 911).
export function chipProblems(doc, pages) {
  const out = [];
  const seen = new Set();
  const checkRoute = (where, r) => {
    const p = pages.get(r);
    if (!p) out.push(`${where}: ${r} is not a page on the site`);
    else if (!p.tagged) out.push(`${where}: ${r} has no page tag`);
    else if (p.door === 'help-now') out.push(`${where}: ${r} is a Help now page, which never goes in the explorer`);
    else if (p.crisis) out.push(`${where}: ${r} names a crisis line (988, 211 or 911), so it never goes in the explorer`);
  };
  if (!Array.isArray(doc.chips) || !doc.chips.length) out.push('needs a list of chips');
  for (const c of doc.chips ?? []) {
    const where = `chip ${c.id ?? '(no id)'}`;
    if (!/^[a-z][a-z0-9-]*$/.test(c.id ?? '')) out.push(`${where}: id must be short lowercase letters`);
    if (seen.has(c.id)) out.push(`${where}: id is used twice`);
    seen.add(c.id);
    if (!c.name) out.push(`${where}: needs a name`);
    else if (c.name.trim().split(/\s+/).length > MAX_NAME_WORDS) out.push(`${where}: name "${c.name}" is more than ${MAX_NAME_WORDS} words`);
    const list = c.pages ?? [];
    if (list.length < MIN_PAGES || list.length > MAX_PAGES) out.push(`${where}: has ${list.length} pages, needs ${MIN_PAGES} to ${MAX_PAGES}`);
    if (new Set(list).size !== list.length) out.push(`${where}: lists a page twice`);
    for (const r of list) checkRoute(where, r);
  }
  if (!Array.isArray(doc.starter) || doc.starter.length < MIN_PAGES) out.push(`starter: needs at least ${MIN_PAGES} pages`);
  for (const r of doc.starter ?? []) checkRoute('starter', r);
  if (JSON.stringify(doc).includes('—')) out.push('contains an em dash');
  return out;
}

import { isQuietPage } from './explore-rank.mjs';
export { rankPicks, cleanPicks, isQuietPage } from './explore-rank.mjs';

// What the browser needs, kept small: each chip's id, name and page indexes,
// and each page's route, label and summary once.
// `doors` maps a door slug to its name, for the deck's cards (#2028). `quiet`
// marks pages that never get a Save button (isQuietPage).
export function chipData(doc, pageTags, doors = {}) {
  const routes = [...new Set([...doc.chips.flatMap((c) => c.pages), ...doc.starter])].filter((r) => pageTags.has(r));
  const pages = Object.fromEntries(routes.map((r) => {
    const t = pageTags.get(r);
    const p = { label: t.label, summary: t.summary };
    if (doors[t.door]) p.door = doors[t.door];
    if (isQuietPage(r, p)) p.quiet = 1;
    return [r, p];
  }));
  return { chips: doc.chips.map((c) => ({ id: c.id, name: c.name, pages: c.pages.filter((r) => pages[r]) })), starter: doc.starter.filter((r) => pages[r]), pages };
}
