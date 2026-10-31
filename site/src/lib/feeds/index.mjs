// Live calendar feeds. Each adapter in ./adapters turns one public feed
// into entries in the same shape as content/calendar/*.yaml.
//
// At build time we fetch every feed. If a feed is down or broken, we log a
// warning and use the last good copy saved in ./snapshots/<id>.json. If
// there is no saved copy, that feed is skipped. The build never fails
// because of a feed.
//
// To refresh the saved copies: `npm run update-feeds` in site/, then commit.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { inWindow } from './util.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));

// Every file in ./adapters is a feed (#71), so adding a feed is one new file
// plus its snapshot, with no shared list to edit. In the site build, Vite
// replaces import.meta.glob with the files it finds; in plain Node scripts
// (update-feeds, check-content) it does not exist, so we read the folder.
// Adapters run in file-name order, which also decides which feed wins when
// two feeds list the same event (see loadCalendarWithFeeds in ../content.mjs).
async function findAdapters() {
  let mods;
  try {
    mods = import.meta.glob('./adapters/*.mjs', { eager: true });
  } catch {
    const dir = path.join(here, 'adapters');
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mjs'));
    mods = Object.fromEntries(await Promise.all(files.map(async (f) => [`./adapters/${f}`, await import(pathToFileURL(path.join(dir, f)).href)])));
  }
  return Object.keys(mods).sort().map((k) => mods[k].default).filter((a) => a?.id && a?.parse);
}
export const ADAPTERS = await findAdapters();
// Astro bundles this file during the build, so find snapshots from the repo root.
export const SNAPSHOT_DIR = fs.existsSync(path.join(here, 'snapshots'))
  ? path.join(here, 'snapshots')
  : path.resolve(process.cwd(), 'src/lib/feeds/snapshots');

const TIMEOUT_MS = 20_000;
const TRIES = 3;
const REQUIRED = ['title', 'slug', 'starts', 'ends', 'org_name', 'who_it_is_for', 'what_to_do', 'url'];
const isDate = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d ?? '');

function feedUrlFor(adapter, today) {
  return adapter.feedUrl ? adapter.feedUrl(today) : adapter.feed_url;
}

async function fetchOnce(url, format) {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { 'User-Agent': 'MonCountyCommunityHub/1.0 (+https://github.com/david-shortman/mon-county-community-hub)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return format === 'json' ? res.json() : res.text();
}

async function fetchWithRetry(url, format) {
  let last;
  for (let i = 0; i < TRIES; i++) {
    try {
      return await fetchOnce(url, format);
    } catch (err) {
      last = err;
      if (i < TRIES - 1) await new Promise((r) => setTimeout(r, 1000 * 2 ** i));
    }
  }
  throw last;
}

// Problems with one entry, as a list of strings. Empty means it is fine.
export function entryProblems(e) {
  const problems = REQUIRED.filter((f) => !e[f]).map((f) => `missing ${f}`);
  if (!isDate(e.starts) || !isDate(e.ends)) problems.push('bad date');
  else if (e.ends < e.starts) problems.push('ends before starts');
  if (JSON.stringify(e).includes('\u2014')) problems.push('contains an em dash');
  return problems;
}

// Adds where the entry came from, so the page can say so.
function stamp(adapter, entries, fetched, feedUrl) {
  const checked = fetched.slice(0, 10);
  return entries.map((e) => ({
    ...e,
    // One provenance shape for every record (ADR 0002, #70). The `feed` object
    // stays too: the API publishes it in v1.
    sources: [{ url: adapter.page_url, checked, method: 'feed', fetched, feed: adapter.id }],
    feed: { id: adapter.id, name: adapter.name, url: feedUrl, page_url: adapter.page_url, fetched },
  }));
}

function readSnapshot(adapter) {
  const file = path.join(SNAPSHOT_DIR, `${adapter.id}.json`);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

function writeSnapshot(adapter, snap) {
  fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
  fs.writeFileSync(path.join(SNAPSHOT_DIR, `${adapter.id}.json`), JSON.stringify(snap, null, 2) + '\n');
}

// Loads one feed. Returns { entries, status } and never throws.
export async function loadFeed(adapter, { today, live = true, save = false, log = console } = {}) {
  const feedUrl = feedUrlFor(adapter, today);
  let error = live ? null : 'live fetch turned off';
  if (live) {
    try {
      const raw = await fetchWithRetry(feedUrl, adapter.format);
      const parsed = adapter.parse(raw);
      const good = [];
      const seen = new Set();
      for (const e of parsed) {
        const problems = entryProblems(e);
        if (problems.length) { log.warn(`feeds: ${adapter.id}: skipped "${e.title}": ${problems.join(', ')}`); continue; }
        if (seen.has(e.slug)) continue;
        seen.add(e.slug);
        if (inWindow(e, today)) good.push(e);
      }
      const fetched = new Date().toISOString();
      if (save) writeSnapshot(adapter, { id: adapter.id, feed_url: feedUrl, fetched, entries: good });
      if (!good.length) log.warn(`feeds: ${adapter.id}: feed worked but had no upcoming entries`);
      return { entries: stamp(adapter, good, fetched, feedUrl), status: 'live', fetched };
    } catch (err) {
      error = err.message;
      log.warn(`feeds: ${adapter.id}: could not load ${feedUrl} (${err.message}). Using the saved copy if there is one.`);
    }
  }
  const snap = readSnapshot(adapter);
  if (!snap) {
    log.warn(`feeds: ${adapter.id}: no saved copy, skipping this feed`);
    return { entries: [], status: 'skipped', fetched: null, error };
  }
  const entries = (snap.entries ?? []).filter((e) => !entryProblems(e).length && inWindow(e, today));
  return { entries: stamp(adapter, entries, snap.fetched, snap.feed_url), status: 'snapshot', fetched: snap.fetched, error };
}

// All feed entries from every adapter.
let lastHealth = [];
// Health of each feed from the last loadFeedEntries call in this process.
export const feedHealth = () => lastHealth;

export async function loadFeedEntries({ today, live = process.env.FEEDS_OFFLINE !== '1', save = false, log = console } = {}) {
  const results = await Promise.all(ADAPTERS.map((a) => loadFeed(a, { today, live, save, log })));
  results.forEach((r, i) => log.log?.(`feeds: ${ADAPTERS[i].id}: ${r.entries.length} entries (${r.status})`));
  // One health line per feed (#71), so a feed that breaks or goes quiet shows.
  lastHealth = results.map((r, i) => ({
    id: ADAPTERS[i].id,
    name: ADAPTERS[i].name,
    page_url: ADAPTERS[i].page_url,
    status: r.status, // live, snapshot (live failed, saved copy used) or skipped
    entries: r.entries.length,
    fetched: r.fetched ?? null,
    error: r.error ?? null,
  }));
  return results.flatMap((r) => r.entries);
}
