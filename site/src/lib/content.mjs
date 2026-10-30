// Loads the YAML entries in ../content so pages can render them.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { loadFeedEntries } from './feeds/index.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const CONTENT_DIR = path.resolve(here, '../../../content');

// Hidden records (#519) stay in content/ with their history but are left out
// of every page, the search index, calendar.ics and the counts. Checks and
// the Health report pass { withHidden: true } so hidden items still get
// re-checked and can come back by removing the `hidden` block.
export const HIDDEN_REASONS = ['group-request', 'unconfirmed-risky', 'overdue', 'other'];
export const isHidden = (e) => e?.hidden != null && e.hidden !== false;

export function loadDir(name, { withHidden = false } = {}) {
  const dir = path.join(CONTENT_DIR, name);
  if (!fs.existsSync(dir)) return [];
  const all = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'))
    .sort()
    .map((f) => ({ ...YAML.parse(fs.readFileSync(path.join(dir, f), 'utf8')), _file: `${name}/${f}` }));
  return withHidden ? all : all.filter((e) => !isHidden(e));
}

// What a page shows in place of a hidden record it names on purpose (a
// crisis page that always shows one shelter, say). It keeps the name so the
// page still reads, and drops every fact: no phone, link, hours or sources.
// Cards (ResourceCard, PlaceCard, AnswerFacts, SourceLine) see `hidden` and
// say plainly that the item is being re-checked.
export const RECHECK_TEXT = 'We are re-checking this listing, so its details are off the site for now.';
function standIn(r) {
  return {
    slug: r.slug, title: r.title, name: r.name, org: r.org, kind: r.kind, area: r.area, topics: r.topics ?? [],
    hidden: true, who_it_is_for: '', what_to_do: RECHECK_TEXT, summary: RECHECK_TEXT, hours: '', cost: '',
    contact: {}, sources: [], _file: r._file,
  };
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

export function loadCalendar({ withHidden = false } = {}) {
  return loadDir('calendar', { withHidden }).map((e) => ({
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
    // A hidden hand-written entry also hides the feed item with its slug (#519).
    const hand = loadCalendar();
    const taken = new Set(loadCalendar({ withHidden: true }).map((e) => e.slug));
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

// Times read one way everywhere (#51): "8 a.m.", "11:30 a.m.", "noon".
function prettyTime(t) {
  const [h, m] = t.split(':').map(Number);
  if (h === 12 && !m) return 'noon';
  if (h === 0 && !m) return 'midnight';
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
// No number (a hidden record's stand-in) gives no link, never "tel:".
export const telHref = (phone) => (phone ? `tel:${String(phone).replace(/[^\d+]/g, '')}` : undefined);

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
// A source on a .gov address is marked "(government site)". Only US
// government bodies can register .gov, so the mark is never a guess. Other
// official sites (a county health department on .org) are named by their
// org instead.
export const isGovSite = (u) => /\.gov$/.test(hostOf(u));
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
    const link = { url: s.url, text, gov: isGovSite(s.url) };
    if (g) g.links.push(link);
    else groups.push({ name, links: [link] });
  }
  return groups;
}

// Checked dates are Morgantown dates (America/New_York). After 6 months a
// card says it may be out of date (the rule in content/README.md, #39).
export const STALE_DAYS = 183;
export function isStale(checked, today = todayYmd()) {
  if (!checked) return false;
  return (Date.parse(`${today}T12:00:00Z`) - Date.parse(`${checked}T12:00:00Z`)) / 86400000 > STALE_DAYS;
}

// A "Report a problem" link that opens our GitHub issue form with the item
// already filled in: its name, its slug and its source (#39, #48). It asks
// for nothing personal. GitHub needs a free account and reports are public;
// the site footer says so.
export const REPORT_FORM = 'https://github.com/david-shortman/mon-county-community-hub/issues/new';
export function reportUrl({ title, slug, url }) {
  const q = new URLSearchParams({ template: 'suggest-resource.yml', title: `Problem with: ${title}`, name: slug ? `${title} (${slug})` : title });
  if (url) q.set('url', url);
  return `${REPORT_FORM}?${q}`;
}

// The oldest checked date across a record's sources, so a card never says an
// item is fresher than its stalest source (#39).
export function oldestChecked(sources = []) {
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
// A hidden record comes back as a stand-in with no facts (#519).
export function resource(slug) {
  const r = loadDir('resources', { withHidden: true }).find((x) => x.slug === slug);
  if (!r) throw new Error(`content/resources: no entry with slug ${slug}`);
  return isHidden(r) ? standIn(r) : r;
}
export function org(slug) {
  const o = loadDir('orgs', { withHidden: true }).find((x) => x.slug === slug);
  if (!o) throw new Error(`content/orgs: no entry with slug ${slug}`);
  return isHidden(o) ? standIn(o) : o;
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

// Secondhand shops, free and lending programs, and online groups (#423).
// Only confirmed and likely entries reach a page; unclear and closed ones
// stay in the data so a person can re-check them.
export const SECONDHAND_KINDS = {
  'charity-thrift': 'Charity thrift store',
  resale: 'Buys and sells used goods',
  consignment: 'Consignment',
  'vintage-antique': 'Vintage and antiques',
  'used-media': 'Used books, records and games',
  'free-program': 'Free program',
  lending: 'Lending library',
  repair: 'Repair help',
  'online-group': 'Online group',
};
export const SECONDHAND_AREAS = {
  westover: 'Westover, Mall Rd and Fairmont Rd',
  downtown: 'Downtown and High St',
  mileground: 'Mileground and Mountaineer Mall',
  'university-ave': 'University Ave',
  'cheat-lake': 'Cheat Lake',
  elsewhere: 'Elsewhere in the county',
  'outside-county': 'Just outside the county',
  online: 'Online',
};
export const SECONDHAND_GOODS = {
  clothes: 'Clothes',
  kids: 'Kids',
  home: 'Furniture and home',
  books: 'Books, records and games',
  vintage: 'Antiques and vintage',
  tools: 'Tools',
  electronics: 'Electronics',
  building: 'Building materials',
};
export const SECONDHAND_STATUS = ['confirmed', 'likely', 'unclear', 'closed'];
export function loadSecondhand({ all = false } = {}) {
  const list = loadDir('secondhand').map((e) => ({ ...e, sources: (e.sources || []).map((s) => ({ ...s, checked: ymd(s.checked) })) }));
  return all ? list : list.filter((e) => e.status === 'confirmed' || e.status === 'likely');
}
// Secondhand cards say "Not checked lately" after 4 months (#430), sooner
// than the 6 month rule, since shops open, move and close often.
export const FRESH_DAYS = 122;
export function notCheckedLately(sources, today = todayYmd()) {
  const c = oldestChecked(sources);
  return !!c && (Date.parse(`${today}T12:00:00Z`) - Date.parse(`${c}T12:00:00Z`)) / 86400000 > FRESH_DAYS;
}
