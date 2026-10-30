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

// "13:05" -> "1:05 p.m."; "08:00" -> "8 a.m."
function prettyTime(t) {
  const [h, m] = t.split(':').map(Number);
  if (h === 12 && !m) return 'noon';
  return `${h % 12 || 12}${m ? `:${String(m).padStart(2, '0')}` : ''} ${h < 12 ? 'a.m.' : 'p.m.'}`;
}
export function prettyTimes(start, end) {
  if (!start) return '';
  return end ? `${prettyTime(start)} to ${prettyTime(end)}` : `from ${prettyTime(start)}`;
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

// Who published a source (#327). A source is named by an organization only
// when its web address is on that organization's own site: first the record's
// own org, then any org whose website matches. Otherwise it shows the address
// alone, so we never credit a page to the wrong group.
export const hostOf = (u) => new URL(u).hostname.replace(/^www\./, '');
const sameSite = (a, b) => a === b || a.endsWith(`.${b}`) || b.endsWith(`.${a}`);
export function sourceOrg(url, orgSlug) {
  const h = hostOf(url);
  const orgs = loadDir('orgs').filter((o) => o.website);
  const own = orgs.find((o) => o.slug === orgSlug);
  if (own && sameSite(h, hostOf(own.website))) return own;
  return orgs.find((o) => hostOf(o.website) === h) ?? null;
}
export function sourceLabel(url, orgSlug) {
  const o = sourceOrg(url, orgSlug);
  return o ? `${o.name} (${shortUrl(url)})` : shortUrl(url);
}
// A card's sources grouped by publisher, in order: [{ name, links: [{url, text}] }].
// name is the source's own `name` if given, else the org whose site it is on,
// else null. Link text is the short web
// address, made longer when two links on one card would read the same.
export function sourceGroups(sources, orgSlug) {
  const seen = new Map();
  const groups = [];
  for (const s of sources) {
    let text = shortUrl(s.url);
    if (seen.has(text)) {
      const u = new URL(s.url);
      text = (hostOf(s.url) + u.pathname).replace(/\/$/, '') + u.hash;
      if (seen.has(text)) continue; // the same page twice: link it once
    }
    seen.set(text, true);
    const name = s.name ?? sourceOrg(s.url, orgSlug)?.name ?? null;
    const g = groups.find((x) => x.name === name);
    if (g) g.links.push({ url: s.url, text });
    else groups.push({ name, links: [{ url: s.url, text }] });
  }
  return groups;
}

// The oldest checked date across a record's sources, so a card never says an
// item is fresher than its stalest source (#39).
export function oldestChecked(sources) {
  return sources.map((s) => ymd(s.checked)).sort()[0];
}

// A website button gets a short label that says what the person gets, never
// a raw web address (#335): the record's own `contact.url_label` ("Apply
// online"), or "Website". Buttons stay compact and sit side by side; the
// domain shows once, in the source line. Screen readers also hear what the
// card is about (Actions adds it).
export function websiteLabel(r) {
  return r?.contact?.url ? (r.contact.url_label ?? 'Website') : null;
}

// One record from content/resources or content/orgs by slug. Throws when it is
// missing, so a page never ships pointing at a record that is not there.
export function resource(slug) {
  const r = loadDir('resources').find((x) => x.slug === slug);
  if (!r) throw new Error(`content/resources: no entry with slug ${slug}`);
  return r;
}
export function org(slug) {
  const o = loadDir('orgs').find((x) => x.slug === slug);
  if (!o) throw new Error(`content/orgs: no entry with slug ${slug}`);
  return o;
}

// The five doors and the lanes around them, from content/doors.yaml (#248).
// `topicDoor` maps each topic tag to its door slug.
export function loadDoors() {
  const raw = YAML.parse(fs.readFileSync(path.join(CONTENT_DIR, 'doors.yaml'), 'utf8'));
  const doors = (raw.doors ?? []).map((d) => ({ ...d, topics: d.topics ?? {} }));
  const lanes = raw.lanes ?? [];
  const topicDoor = {};
  for (const d of doors) for (const t of Object.keys(d.topics)) topicDoor[t] ??= d.slug;
  const bySlug = Object.fromEntries([...doors, ...lanes].map((d) => [d.slug, d]));
  return { doors, lanes, bySlug, topicDoor };
}

// A door's own page data, from content/doors/<slug>.yaml (#235). Each step
// gets its resource record, which carries the phone, link and sources.
export function loadDoorPage(slug) {
  const file = path.join(CONTENT_DIR, 'doors', `${slug}.yaml`);
  if (!fs.existsSync(file)) return null;
  const raw = YAML.parse(fs.readFileSync(file, 'utf8'));
  const steps = Object.fromEntries(Object.entries(raw.steps ?? {}).map(([id, s]) => [id, { id, ...s, record: resource(s.resource) }]));
  return { ...raw, steps, situations: raw.situations ?? [], also: raw.also ?? [], _file: `doors/${slug}.yaml` };
}
