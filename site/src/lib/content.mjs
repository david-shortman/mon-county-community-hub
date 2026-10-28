// Loads the YAML entries in ../content so pages can render them.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { loadFeedEntries } from './feeds/index.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const CONTENT_DIR = path.resolve(here, '../../../content');

export function loadDir(name) {
  const dir = path.join(CONTENT_DIR, name);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'))
    .sort()
    .map((f) => ({ ...YAML.parse(fs.readFileSync(path.join(dir, f), 'utf8')), _file: `${name}/${f}` }));
}

// Dates in YAML parse as Date objects or strings; normalize to YYYY-MM-DD.
export function ymd(value) {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

// Today in Eastern time, since that is where the county is.
export function todayYmd(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(now);
}

export function loadCalendar() {
  return loadDir('calendar').map((e) => ({
    ...e,
    starts: ymd(e.starts),
    ends: ymd(e.ends) || ymd(e.starts),
    sources: (e.sources || []).map((s) => ({ ...s, checked: ymd(s.checked) })),
  }));
}

// Hand-written entries plus entries pulled from live feeds (see ./feeds).
// A hand-written entry wins when both have the same slug.
// Cached so the page and the .ics feed share one fetch per build.
let merged;
export function loadCalendarWithFeeds() {
  merged ??= (async () => {
    const hand = loadCalendar();
    const taken = new Set(hand.map((e) => e.slug));
    const fromFeeds = (await loadFeedEntries({ today: todayYmd() })).filter((e) => !taken.has(e.slug));
    return [...hand, ...fromFeeds];
  })();
  return merged;
}

// Entries still worth showing: not over yet, and starting within `days`.
export function upcoming(entries, today = todayYmd(), days = 62) {
  const limit = new Date(`${today}T12:00:00Z`);
  limit.setUTCDate(limit.getUTCDate() + days);
  const limitYmd = limit.toISOString().slice(0, 10);
  return entries
    .filter((e) => e.ends >= today && e.starts <= limitYmd)
    .sort((a, b) => (a.starts < b.starts ? -1 : a.starts > b.starts ? 1 : a.title.localeCompare(b.title)));
}

const fmt = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
export function prettyDate(d) {
  return fmt.format(new Date(`${d}T12:00:00Z`));
}
export function prettyRange(starts, ends) {
  return starts === ends ? prettyDate(starts) : `${prettyDate(starts)} to ${prettyDate(ends)}`;
}

// Short date for the big date chip: "Fri, Oct 31". Adds the year when it is
// not this year, so "Jan 15, 2027" never reads as the coming January by mistake.
export function chipDate(d, today = todayYmd()) {
  const sameYear = d.slice(0, 4) === today.slice(0, 4);
  const opts = { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC', ...(sameYear ? {} : { year: 'numeric' }) };
  return new Intl.DateTimeFormat('en-US', opts).format(new Date(`${d}T12:00:00Z`));
}

const daysBetween = (a, b) => Math.round((Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`)) / 86400000);
const inDays = (n) => (n === 1 ? 'tomorrow' : `in ${n} days`);

// "in 3 days", "today", "open now, ends in 5 days". The page also runs the
// same rule in the browser (see Base.astro) so it stays right between builds.
export function relativeLabel(starts, ends, today = todayYmd()) {
  if (starts > today) return inDays(daysBetween(today, starts));
  if (starts === ends) return 'today';
  if (ends === today) return 'last day is today';
  return `open now, ends ${inDays(daysBetween(today, ends))}`;
}

// A map search link that opens the phone's maps app. We only pass a place
// the source itself published.
export const mapsUrl = (place) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;
export const telHref = (phone) => `tel:${String(phone).replace(/[^\d+]/g, '')}`;

// "mountaineerfoodbank.org/food-pantries" style link text, so two links to
// the same site never share a name.
export function shortUrl(u) {
  const url = new URL(u);
  const first = url.pathname.split('/').filter(Boolean)[0];
  return url.hostname.replace(/^www\./, '') + (first ? `/${first}` : '');
}
