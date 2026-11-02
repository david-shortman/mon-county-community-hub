// Checks content/ entries before they reach the site. Exits 1 on any error.
import fs from 'node:fs';
import path from 'node:path';
import { loadCalendar as loadCalendarShown, loadDir as loadDirShown, loadDoors, loadDoorPage, loadGaps, resource, todayYmd, ymd, CONTENT_DIR, HIDDEN_REASONS, SECONDHAND_KINDS, SECONDHAND_AREAS, SECONDHAND_GOODS, SECONDHAND_STATUS } from '../src/lib/content.mjs';
import { loadTonight, tonightProblems } from '../src/lib/tonight.mjs';
import { ADAPTERS, SNAPSHOT_DIR, entryProblems } from '../src/lib/feeds/index.mjs';
import { factTopics, loadFacts } from '../src/lib/facts.mjs';
import { loadPdfPages, pdfPageProblems } from '../src/lib/pdf-pages.mjs';
import { TOWN_FIELDS, TOWNS, checkTown } from '../src/lib/towns.mjs';
import { LISTING_FIELDS, checkListing } from '../src/lib/listing.mjs';
import { longFields, FOLD_WORDS } from '../src/lib/card-text.mjs';
import { checkPlaces } from './check-places.mjs';
import { agendaProblems, decidedProblems } from '../src/lib/agendas.mjs';
import { duplicateWarnings, missingOrgErrors, movedErrors, venueTownWarnings } from '../src/lib/content-dupes.mjs';
import { MOVED } from '../src/lib/moved.mjs';
import YAML from 'yaml';
import { loadHomeRules, ruleProblems, isStale } from '../src/lib/home-year.mjs';

const errors = [];
const warnings = [];
const isDate = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d ?? '');
const isUrl = (u) => { try { return ['https:', 'http:'].includes(new URL(u).protocol); } catch { return false; } };
const sixMonthsAgo = new Date(); sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
const stale = sixMonthsAgo.toISOString().slice(0, 10);

// Hidden records (#519) are checked like any other, so taking the `hidden`
// block off puts back a record that is still valid.
const loadDir = (name) => loadDirShown(name, { withHidden: true });
const loadCalendar = () => loadCalendarShown({ withHidden: true });
const HIDDEN_FIELDS = ['reason', 'since', 'note'];
// 211 and 988 show on every page, so the site cannot build without them. If
// one looks wrong, fix it from the line's own page the same day instead.
const NEVER_HIDE = ['resources/wv-211.yaml', 'resources/988-lifeline.yaml'];
let hiddenCount = 0;
function checkHidden(e) {
  if (e.hidden == null) return;
  const where = e._file;
  const h = e.hidden;
  hiddenCount++;
  if (NEVER_HIDE.includes(where)) errors.push(`${where}: this line shows on every page and cannot be hidden; fix it from its own page instead`);
  if (typeof h !== 'object' || Array.isArray(h)) { errors.push(`${where}: hidden needs reason and since under it (see content/README.md)`); return; }
  if (!HIDDEN_REASONS.includes(h.reason)) errors.push(`${where}: hidden.reason must be one of ${HIDDEN_REASONS.join(', ')}`);
  const since = ymd(h.since);
  if (!isDate(since)) errors.push(`${where}: hidden.since must be a date (YYYY-MM-DD)`);
  else if (since > todayYmd()) errors.push(`${where}: hidden.since ${since} is in the future`);
  if (h.note != null && typeof h.note !== 'string') errors.push(`${where}: hidden.note must be text`);
  for (const k of Object.keys(h)) if (!HIDDEN_FIELDS.includes(k)) warnings.push(`${where}: unknown hidden field ${k}`);
}

const slugs = new Set();
for (const e of loadCalendar()) {
  const where = e._file;
  checkHidden(e);
  if (e.private_trace != null && e.private_trace !== true) errors.push(`${where}: private_trace is true or left out (#555)`);
  for (const f of ['title', 'slug', 'starts', 'org_name', 'who_it_is_for', 'what_to_do', 'url']) {
    if (!e[f]) errors.push(`${where}: missing ${f}`);
  }
  if (slugs.has(e.slug)) errors.push(`${where}: duplicate slug ${e.slug}`);
  slugs.add(e.slug);
  if (!isDate(e.starts)) errors.push(`${where}: starts must be YYYY-MM-DD`);
  if (!isDate(e.ends)) errors.push(`${where}: ends must be YYYY-MM-DD`);
  if (e.ends < e.starts) errors.push(`${where}: ends is before starts`);
  const isTime = (t) => /^([01]\d|2[0-3]):[0-5]\d$/.test(t ?? '');
  if (e.start_time != null && !isTime(e.start_time)) errors.push(`${where}: start_time must be quoted 24-hour HH:MM`);
  if (e.end_time != null && !isTime(e.end_time)) errors.push(`${where}: end_time must be quoted 24-hour HH:MM`);
  if (e.end_time && !e.start_time) errors.push(`${where}: end_time needs start_time`);
  if (e.start_time && e.ends !== e.starts) errors.push(`${where}: times are only for single-day entries`);
  if (e.start_time && e.end_time && e.end_time <= e.start_time) errors.push(`${where}: end_time must be after start_time`);
  if (e.url && !isUrl(e.url)) errors.push(`${where}: url is not a web link`);
  if (!e.sources?.length) errors.push(`${where}: needs at least one source`);
  // Optional action fields. Only use a phone or place the source itself publishes.
  if (e.phone && !/^\d{3}-\d{3}-\d{4}$/.test(String(e.phone))) errors.push(`${where}: phone must look like 304-555-0100`);
  if (e.phone_label && !e.phone) errors.push(`${where}: phone_label without phone`);
  if (e.place && (typeof e.place !== 'string' || !/,/.test(e.place))) errors.push(`${where}: place must be text like "200 M-Tec Dr, Morgantown, WV"`);
  errors.push(...checkTown(e));
  for (const s of e.sources ?? []) {
    if (!isUrl(s.url)) errors.push(`${where}: source url is not a web link`);
    if (!isDate(s.checked)) errors.push(`${where}: source needs a checked date (YYYY-MM-DD)`);
    else if (s.checked < stale) warnings.push(`${where}: source last checked ${s.checked}, re-verify`);
  }
  if (JSON.stringify(e).includes('\u2014')) errors.push(`${where}: contains an em dash`);
}

// Orgs and resources (content/orgs, content/resources). Pages build call,
// text and map links straight from these records, so a typo here would
// ship a wrong link without failing the build (#259, #8).
// A phone is a short code (211, 988), a text code (898-211), or a full
// number, with an optional leading 1- (304-555-0100, 1-877-716-1212).
const isPhone = (p) => /^(\d{3}|\d{3}-\d{3}|(1-)?\d{3}-\d{3}-\d{4})$/.test(String(p));
const AREAS = ['morgantown', 'monongalia-county', 'statewide', 'national'];
const KINDS = ['nonprofit', 'government', 'community-group', 'business', 'school', 'faith'];
const ORG_FIELDS = ['name', 'slug', 'kind', 'website', 'phone', 'summary', 'topics', 'area', 'sources', 'hidden', 'phone_confirmed', 'phone_confirmed_by'];
const RESOURCE_FIELDS = ['title', 'slug', 'org', 'topics', 'who_it_is_for', 'hours', 'what_to_do', 'contact', 'cost', 'sources', 'hidden', 'what_to_bring', 'what_happens', 'best_time', 'if_you_want_help', 'phone_confirmed', 'phone_confirmed_by', 'private_trace'];
const CONTACT_FIELDS = ['phone', 'text', 'url', 'place', 'email', 'url_label'];
const isSlug = (s) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(s ?? '');

function checkRecord(e, required, known) {
  const where = e._file;
  checkHidden(e);
  if (e.private_trace != null && e.private_trace !== true) errors.push(`${where}: private_trace is true or left out (#555)`);
  // Confirmed by phone (#164): a date, and optionally the caller's initials.
  // Never the name of the person who answered.
  if (e.phone_confirmed != null) {
    const d = ymd(e.phone_confirmed);
    if (!isDate(d)) errors.push(`${where}: phone_confirmed must be a date (YYYY-MM-DD)`);
    else if (d > todayYmd()) errors.push(`${where}: phone_confirmed ${d} is in the future`);
  }
  if (e.phone_confirmed_by != null && !/^[A-Z]{2,3}$/.test(String(e.phone_confirmed_by))) errors.push(`${where}: phone_confirmed_by is the caller's initials, like DS`);
  if (e.phone_confirmed_by != null && e.phone_confirmed == null) errors.push(`${where}: phone_confirmed_by without phone_confirmed`);
  for (const f of required) if (e[f] == null || e[f] === '') errors.push(`${where}: missing ${f}`);
  for (const k of Object.keys(e)) if (k !== '_file' && !known.includes(k)) warnings.push(`${where}: unknown field ${k} (see content/README.md)`);
  if (e.slug && !isSlug(e.slug)) errors.push(`${where}: slug must be lowercase letters, numbers and dashes`);
  if (e.slug && path.basename(where).replace(/\.ya?ml$/, '') !== e.slug) errors.push(`${where}: file name should match slug ${e.slug}`);
  if (e.topics != null && (!Array.isArray(e.topics) || !e.topics.length)) errors.push(`${where}: topics must be a list with at least one topic`);
  if (!e.sources?.length) errors.push(`${where}: needs at least one source`);
  for (const s of e.sources ?? []) {
    const checked = ymd(s.checked);
    if (!isUrl(s.url)) errors.push(`${where}: source url is not a web link`);
    if (!isDate(checked)) errors.push(`${where}: source needs a checked date (YYYY-MM-DD)`);
    else if (checked > todayYmd()) errors.push(`${where}: source checked date ${checked} is in the future`);
    else if (checked < stale) warnings.push(`${where}: source last checked ${checked}, re-verify`);
  }
  if (JSON.stringify(e).includes('\u2014')) errors.push(`${where}: contains an em dash`);
}

const orgs = loadDir('orgs');
const orgSlugs = new Set();
for (const o of orgs) {
  const where = o._file;
  checkRecord(o, ['name', 'slug', 'kind', 'summary', 'topics', 'area'], ORG_FIELDS);
  if (orgSlugs.has(o.slug)) errors.push(`${where}: duplicate slug ${o.slug}`);
  orgSlugs.add(o.slug);
  if (o.kind && !KINDS.includes(o.kind)) errors.push(`${where}: kind must be one of ${KINDS.join(', ')}`);
  if (o.area && !AREAS.includes(o.area)) errors.push(`${where}: area must be one of ${AREAS.join(', ')}`);
  if (o.website != null && !isUrl(o.website)) errors.push(`${where}: website is not a web link`);
  if (o.phone != null && !isPhone(o.phone)) errors.push(`${where}: phone must look like 211, 898-211, 304-555-0100 or 1-877-716-1212`);
}

// Listing fields (#177): hours the site can read, how to get in, languages, access.
RESOURCE_FIELDS.push(...LISTING_FIELDS);
// Town and neighborhood (#395).
RESOURCE_FIELDS.push(...TOWN_FIELDS);
const resources = loadDir('resources');
const resourceSlugs = new Set();
for (const r of resources) {
  const where = r._file;
  checkRecord(r, ['title', 'slug', 'org', 'topics', 'who_it_is_for', 'what_to_do', 'contact'], RESOURCE_FIELDS);
  if (resourceSlugs.has(r.slug)) errors.push(`${where}: duplicate slug ${r.slug}`);
  resourceSlugs.add(r.slug);
  if (r.org && !orgSlugs.has(r.org)) errors.push(`${where}: org ${r.org} has no file in content/orgs/`);
  if (r.hours != null && (typeof r.hours !== 'string' || !r.hours.trim())) errors.push(`${where}: hours must be text, like "Monday to Friday, 9 a.m. to 5 p.m."`);
  if (r.cost != null && typeof r.cost !== 'string') errors.push(`${where}: cost must be text`);
  errors.push(...checkTown(r));
  // What happens next (#159): optional, each from the record's own sources.
  if (r.what_to_bring != null && (!Array.isArray(r.what_to_bring) || !r.what_to_bring.length || r.what_to_bring.some((x) => typeof x !== 'string' || !x.trim()))) errors.push(`${where}: what_to_bring must be a list of short text items`);
  for (const f of ['what_happens', 'best_time']) if (r[f] != null && (typeof r[f] !== 'string' || !r[f].trim())) errors.push(`${where}: ${f} must be text`);
  if (r.if_you_want_help != null && (!Array.isArray(r.if_you_want_help) || r.if_you_want_help.some((x) => typeof x !== 'string'))) errors.push(`${where}: if_you_want_help must be a list of resource slugs`);
  { const l = checkListing(r); errors.push(...l.errors); warnings.push(...l.warnings); }
  // Short card text (#1381): the card folds long fields, but a short field reads best.
  for (const f of longFields(r)) warnings.push(`${where}: ${f.field} is ${f.words} words (over ${FOLD_WORDS}); move details into steps, options or notes`);
  const c = r.contact;
  if (c == null) continue;
  if (typeof c !== 'object') { errors.push(`${where}: contact must have phone, text, url, place or email under it`); continue; }
  for (const k of Object.keys(c)) if (!CONTACT_FIELDS.includes(k)) warnings.push(`${where}: unknown contact field ${k}`);
  if (!c.url) errors.push(`${where}: contact needs a url`);
  else if (!isUrl(c.url)) errors.push(`${where}: contact url is not a web link`);
  if (c.phone != null && !isPhone(c.phone)) errors.push(`${where}: contact phone must look like 211, 304-555-0100 or 1-877-716-1212 (quote it)`);
  if (c.text != null && !isPhone(c.text)) errors.push(`${where}: contact text must look like 898-211 or 304-555-0100 (quote it)`);
  if (c.place != null && (typeof c.place !== 'string' || !/,/.test(c.place))) errors.push(`${where}: contact place must be text like "200 M-Tec Dr, Morgantown, WV"`);
  if (c.email != null && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(c.email))) errors.push(`${where}: contact email does not look like an email address`);
}

for (const r of resources) for (const h of r.if_you_want_help ?? []) if (!resourceSlugs.has(h)) errors.push(`${r._file}: if_you_want_help names ${h}, which has no file in content/resources/`);

// Secondhand shops, free programs and online groups (content/secondhand, #423).
const SECONDHAND_FIELDS = ['name', 'slug', 'kind', 'area', 'run_by', 'org', 'address', 'hours', 'sells', 'takes', 'does_not_take', 'drop_off', 'goods', 'buys_from_you', 'funds_local_cause', 'who_can_use', 'what_to_bring', 'url', 'url_label', 'status', 'note', 'sources', 'hidden'];
const secondhand = loadDir('secondhand');
const secondhandSlugs = new Set();
for (const s of secondhand) {
  const where = s._file;
  checkRecord(s, ['name', 'slug', 'kind', 'area', 'run_by', 'sells', 'url', 'status'], SECONDHAND_FIELDS);
  if (secondhandSlugs.has(s.slug)) errors.push(`${where}: duplicate slug ${s.slug}`);
  secondhandSlugs.add(s.slug);
  if (s.kind && !SECONDHAND_KINDS[s.kind]) errors.push(`${where}: kind must be one of ${Object.keys(SECONDHAND_KINDS).join(', ')}`);
  if (s.area && !SECONDHAND_AREAS[s.area]) errors.push(`${where}: area must be one of ${Object.keys(SECONDHAND_AREAS).join(', ')}`);
  if (s.status && !SECONDHAND_STATUS.includes(s.status)) errors.push(`${where}: status must be one of ${SECONDHAND_STATUS.join(', ')}`);
  if (s.goods != null && (!Array.isArray(s.goods) || s.goods.some((g) => !SECONDHAND_GOODS[g]))) errors.push(`${where}: goods must be a list from ${Object.keys(SECONDHAND_GOODS).join(', ')}`);
  if (s.buys_from_you != null && typeof s.buys_from_you !== 'boolean') errors.push(`${where}: buys_from_you must be true or false`);
  if (s.url && !isUrl(s.url)) errors.push(`${where}: url is not a web link`);
  if (s.org && !orgSlugs.has(s.org)) errors.push(`${where}: org ${s.org} has no file in content/orgs/`);
  if (s.address != null && (typeof s.address !== 'string' || !/,/.test(s.address))) errors.push(`${where}: address must be text like "200 Spruce St, Morgantown, WV"`);
  for (const f of ['hours', 'sells', 'takes', 'does_not_take', 'drop_off', 'funds_local_cause', 'who_can_use', 'what_to_bring', 'note', 'run_by']) {
    if (s[f] != null && typeof s[f] !== 'string') errors.push(`${where}: ${f} must be text`);
  }
}

// Boards (content/boards/<slug>.yaml): city boards and commissions for the
// Serve on a board page (#290). Open seats come from the city's vacancy list.
const BOARD_FIELDS = ['name', 'slug', 'org', 'section', 'created', 'decides', 'meets', 'who_can_serve', 'open_seats', 'open_note', 'page_vacant', 'url', 'topics', 'sources'];
const boards = loadDir('boards');
for (const b of boards) {
  const where = b._file;
  // `section: other` boards are listed by name only, from the vacancy list.
  // `section: county` boards come from the county's list, which gives no seat counts.
  const required = {
    other: ['name', 'slug', 'org', 'open_seats', 'open_note', 'url', 'topics'],
    county: ['name', 'slug', 'org', 'created', 'meets', 'url', 'topics'],
  }[b.section] ?? ['name', 'slug', 'org', 'decides', 'meets', 'open_seats', 'url', 'topics'];
  checkRecord(b, required, BOARD_FIELDS);
  // The note's numbers ("1 seat and 2 alternate seats") add up to open_seats (#856).
  if (b.open_note != null) {
    const sum = (String(b.open_note).match(/\d+/g) ?? []).reduce((n, d) => n + Number(d), 0);
    if (sum !== b.open_seats) errors.push(`${where}: open_note adds up to ${sum} seats but open_seats is ${b.open_seats}`);
  }
  if (b.who_can_serve != null && !/\.$/.test(String(b.who_can_serve).trim())) errors.push(`${where}: who_can_serve should end with a period`);
  if (b.section != null && !['other', 'county'].includes(b.section)) errors.push(`${where}: section must be other or county, or left out`);
  if (b.org && !orgSlugs.has(b.org)) errors.push(`${where}: org ${b.org} has no file in content/orgs/`);
  if (b.url != null && !isUrl(b.url)) errors.push(`${where}: url is not a web link`);
  for (const k of ['open_seats', 'page_vacant']) if (b[k] != null && !(Number.isInteger(b[k]) && b[k] >= 0)) errors.push(`${where}: ${k} must be a whole number`);
}

// Saved feed snapshots are committed too, so check them the same way.
let feedCount = 0;
for (const a of ADAPTERS) {
  const file = path.join(SNAPSHOT_DIR, `${a.id}.json`);
  if (!fs.existsSync(file)) { warnings.push(`feeds/${a.id}: no saved snapshot yet (run npm run update-feeds)`); continue; }
  let snap;
  try { snap = JSON.parse(fs.readFileSync(file, 'utf8')); } catch { errors.push(`feeds/${a.id}: snapshot is not valid JSON`); continue; }
  if (!snap.fetched || Number.isNaN(Date.parse(snap.fetched))) errors.push(`feeds/${a.id}: snapshot needs a fetched time`);
  for (const e of snap.entries ?? []) {
    feedCount++;
    for (const p of entryProblems(e)) errors.push(`feeds/${a.id}: ${e.slug ?? e.title}: ${p}`);
    if (e.url && !isUrl(e.url)) errors.push(`feeds/${a.id}: ${e.slug}: url is not a web link`);
  }
}

// Doors (content/doors.yaml): every topic belongs to exactly one door, and
// every topic used in content/ has a door, so it can show on a door page.
// Page tags are checked when the site builds (src/lib/pages.mjs).
let doors;
try { doors = loadDoors(); } catch (err) { errors.push(`doors.yaml: ${err.message}`); }
if (doors) {
  if (doors.doors.length !== 5) warnings.push(`doors.yaml: has ${doors.doors.length} doors; the site plan (#248) has five`);
  const seenSlugs = new Set();
  const topicHome = new Map();
  for (const d of [...doors.doors, ...doors.lanes]) {
    if (!/^[a-z0-9-]+$/.test(d.slug ?? '')) errors.push(`doors.yaml: "${d.name}" needs a slug of lowercase letters, numbers and dashes`);
    if (seenSlugs.has(d.slug)) errors.push(`doors.yaml: duplicate slug ${d.slug}`);
    seenSlugs.add(d.slug);
    if (!d.name) errors.push(`doors.yaml: ${d.slug} needs a name`);
    if (d.page && !/^\/([a-z0-9-]+\/)*$/.test(d.page)) errors.push(`doors.yaml: ${d.slug} page must look like /calendar/`);
  }
  for (const d of doors.doors) {
    if (!d.hint) errors.push(`doors.yaml: ${d.slug} needs a hint (example problems in residents' words)`);
    if (!Object.keys(d.topics).length) errors.push(`doors.yaml: ${d.slug} needs at least one topic`);
    for (const [t, label] of Object.entries(d.topics)) {
      if (topicHome.has(t)) errors.push(`doors.yaml: topic ${t} is in both ${topicHome.get(t)} and ${d.slug}`);
      topicHome.set(t, d.slug);
      if (!label) errors.push(`doors.yaml: topic ${t} in ${d.slug} needs a label`);
    }
    for (const e of d.examples ?? []) {
      for (const k of ['from', 'until']) {
        if (e[k] !== undefined && !/^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(String(e[k]))) errors.push(`doors.yaml: example "${e.text}" in ${d.slug} needs ${k} as a quoted "MM-DD", like "09-01"`);
      }
    }
  }
  if (JSON.stringify(doors).includes('\u2014')) errors.push('doors.yaml: contains an em dash');
  for (const e of [...loadDir('orgs'), ...loadDir('resources'), ...loadCalendar(), ...loadHomeRules(CONTENT_DIR).map((r) => ({ ...r, _file: 'home-year.yaml' }))]) {
    for (const t of e.topics ?? []) {
      if (!topicHome.has(t)) errors.push(`${e._file}: topic "${t}" has no door; add it to a door in content/doors.yaml`);
    }
  }
}

// Door pages (content/doors/<slug>.yaml): each step points to a real
// resource, each situation names real steps and a page link.
// Topic guides (content/guides/<slug>.yaml, like /grow/) have the same shape,
// plus the door, topic and page they belong to.
const yamlIn = (dir) => (fs.existsSync(path.join(CONTENT_DIR, dir)) ? fs.readdirSync(path.join(CONTENT_DIR, dir)).filter((x) => x.endsWith('.yaml')).map((f) => [dir, f]) : []);
for (const [dir, f] of [...yamlIn('doors'), ...yamlIn('guides')]) {
  const slug = f.replace(/\.yaml$/, '');
  const where = `${dir}/${f}`;
  let dp;
  try { dp = loadDoorPage(slug, dir); } catch (err) { errors.push(`${where}: ${err.message}`); continue; }
  if (dir === 'guides') {
    const d = doors?.bySlug[dp.door];
    if (!d?.topics?.[dp.topic]) errors.push(`${where}: needs a door from doors.yaml and one of its topics`);
    if (!/^\/[^\s]*\/$/.test(dp.page ?? '')) errors.push(`${where}: needs a page like /grow/`);
  } else {
    const d = doors?.bySlug[slug];
    if (!d?.topics) errors.push(`${where}: ${slug} is not a door in doors.yaml`);
    else if (!d.page) errors.push(`${where}: give the ${slug} door a page in doors.yaml`);
    if (dp.door !== slug) errors.push(`${where}: door should be ${slug}`);
  }
  if (!dp.lede) errors.push(`${where}: needs a lede`);
  for (const [id, st] of Object.entries(dp.steps)) {
    if (!['today', 'week', 'season', 'opens'].includes(st.when)) errors.push(`${where}: step ${id} when must be today, week, season or opens`);
    if (!st.text) errors.push(`${where}: step ${id} needs text`);
    if (st.record.hidden) { warnings.push(`${where}: step ${id}'s resource ${st.resource} is hidden, so the step says it is being re-checked`); continue; }
    if (!st.record.contact?.url) errors.push(`${where}: step ${id}'s resource needs a contact url`);
  }
  if (dp.cant_wait) {
    try { resource(dp.cant_wait.resource); } catch { errors.push(`${where}: cant_wait resource ${dp.cant_wait.resource} not found`); }
  }
  for (const [id, st] of Object.entries(dp.steps)) {
    if (st.record.hidden) continue;
    if (!st.record.sources?.length || st.record.sources.some((x) => !isDate(ymd(x.checked)))) errors.push(`${where}: step ${id}'s resource needs sources with checked dates`);
    if (!dp.situations.some((x) => (x.steps ?? []).includes(id))) warnings.push(`${where}: step ${id} is not used by any situation, so it never shows`);
  }
  const ids = new Set();
  for (const s of dp.situations) {
    if (ids.has(s.id)) errors.push(`${where}: duplicate situation ${s.id}`);
    ids.add(s.id);
    if (!s.label || !/^\/[^\s]*$/.test(s.page ?? '')) errors.push(`${where}: situation ${s.id} needs a label and a page like /flu-shots/`);
    for (const st of s.steps ?? []) if (!dp.steps[st]) errors.push(`${where}: situation ${s.id} names a missing step ${st}`);
  }
  const ownText = [dp.lede, dp.cant_wait?.text, ...dp.situations.map((x) => x.label), ...Object.values(dp.steps).map((x) => [x.text, x.action]).flat(), ...dp.also.map((x) => x.text)];
  if (ownText.some((t) => (t ?? '').includes('\u2014'))) errors.push(`${where}: contains an em dash`);
}

// Gaps (content/gaps/<topic>.yaml, #444): each needs what, why and a checked
// date, and its topic must have a door.
const gapDir = path.join(CONTENT_DIR, 'gaps');
for (const f of fs.existsSync(gapDir) ? fs.readdirSync(gapDir).filter((x) => x.endsWith('.yaml')) : []) {
  const g = loadGaps(f.replace(/\.yaml$/, ''));
  if (g.topic !== f.replace(/\.yaml$/, '')) errors.push(`gaps/${f}: topic should match the file name`);
  if (!doors?.topicDoor[g.topic]) errors.push(`gaps/${f}: topic "${g.topic}" has no door in content/doors.yaml`);
  for (const [i, x] of (g.gaps ?? []).entries()) {
    if (!x.what || !x.why || !isDate(ymd(x.checked))) errors.push(`gaps/${f}: gap ${i + 1} needs what, why and a checked date`);
  }
  if (JSON.stringify(g).includes('\u2014')) errors.push(`gaps/${f}: contains an em dash`);
}

// Time and deadline wording (#413). Warnings only. Times read "8 a.m.",
// "8:30 a.m.", "noon"; deadlines read "The last day is Tuesday, December 15."
// See "Voice notes" in docs/design/identity.md. Feed snapshots are left out:
// they say what the feed says.
const MONTH = '(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|June?|July?|Aug(ust)?|Sep(t(ember)?)?|Oct(ober)?|Nov(ember)?|Dec(ember)?)\\.?';
const TIME_RULES = [
  [/\b\d{1,2}(:\d{2})?\s?(am|pm|AM|PM|A\.M\.|P\.M\.)(?![\w.])/, 'write times as "8 a.m." or "8:30 p.m." (lowercase, with periods)'],
  [/\b\d{1,2}:00\b/, 'drop ":00" from whole hours ("8 a.m.", not "8:00 a.m.")'],
  [/\b(0\d|1[3-9]|2[0-3]):[0-5]\d\b/, 'use 12-hour times ("1 p.m.", not "13:00")'],
];
const BY_DATE = new RegExp(`\\bby ${MONTH} \\d{1,2}\\b`, 'i');
const DEADLINE_VERB = /\b(apply|applies|file|pay|register|enroll|sign up|submit|send|mail|return|renew|turn in|drop off|request|order|change|choose|vote|respond|reply|call)\b/i;
// opens and closes are structured 24-hour times (opening_hours, #177), not words people read.
const SKIP_KEYS = new Set(['_file', 'slug', 'url', 'sources', 'start_time', 'end_time', 'phone', 'text', 'email', 'starts', 'ends', 'topics', 'opens', 'closes']);
function eachText(value, key, visit) {
  if (SKIP_KEYS.has(key)) return;
  if (typeof value === 'string') visit(key, value);
  else if (Array.isArray(value)) value.forEach((v) => eachText(v, key, visit));
  else if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) eachText(v, k, visit);
}
for (const e of [...orgs, ...resources, ...secondhand, ...loadCalendar()]) {
  eachText(e, '', (key, t) => {
    for (const [re, msg] of TIME_RULES) if (re.test(t)) warnings.push(`${e._file}: ${key}: ${msg}: "${t.match(re)[0]}"`);
    // Only sentences that ask the reader to act by a date ("Apply by May 1"), not ones like "families heard by July 1".
    if (key === 'what_to_do') for (const sentence of t.split(/(?<=[.!?])\s+/)) {
      if (BY_DATE.test(sentence) && DEADLINE_VERB.test(sentence)) warnings.push(`${e._file}: what_to_do: for a deadline, write "The last day is Tuesday, December 15." instead of "${sentence.match(BY_DATE)[0]}"`);
    }
  });
}

// Yearly home dates (content/home-year.yaml, #1051): each rule is complete,
// slugs are unique and do not clash with a hand-written calendar slug pattern,
// and a stale rule is a warning (the build leaves it off the calendar).
{
  const seen = new Set();
  for (const r of loadHomeRules(CONTENT_DIR)) {
    const where = `home-year.yaml: ${r.slug ?? '(no slug)'}`;
    for (const p of ruleProblems(r)) errors.push(`${where}: ${p}`);
    if (seen.has(r.slug)) errors.push(`${where}: duplicate slug`);
    seen.add(r.slug);
    if (r.sources?.length && isStale(r, todayYmd())) warnings.push(`${where}: a source was last checked more than 13 months ago; re-check it, or it stays off the calendar`);
    if (JSON.stringify(r).includes('\u2014')) errors.push(`${where}: contains an em dash`);
  }
}

// Gathering places (content/places, #455), checked against content/schemas/place.schema.json.
const placeCheck = checkPlaces();
errors.push(...placeCheck.errors);
warnings.push(...placeCheck.warnings);

// Wrong place (#494). AI tools and directories mix up places with the same
// name. Warn when an address leaves out West Virginia, or any text names
// Morgantown in another state. Warnings only: some groups serve a wider area.
const OTHER_MORGANTOWN = /\bMorgantown,?\s+(KY|Ky\.|Kentucky|IN|Ind\.|Indiana|NC|North Carolina|GA|Georgia|MS|Mississippi|TN|Tennessee|PA|Pennsylvania)\b/;
const IN_WV = /\b(WV|W\. ?Va\.|West Virginia)\b/;
for (const e of [...orgs, ...resources, ...secondhand, ...loadCalendar()]) {
  for (const [key, value] of [['contact.place', e.contact?.place], ['place', e.place], ['address', e.address]]) {
    if (typeof value === 'string' && !IN_WV.test(value)) warnings.push(`${e._file}: ${key} "${value}" does not say WV; check it is the Morgantown, WV place`);
  }
  eachText(e, '', (key, t) => {
    const m = t.match(OTHER_MORGANTOWN);
    if (m) warnings.push(`${e._file}: ${key} names "${m[0]}"; this site is for Morgantown, WV`);
  });
}

// County indicators (content/indicators, #62): an official number, its own
// definition, the data year, and sources with checked dates.
const INDICATOR_FIELDS = ['title', 'slug', 'topic', 'definition', 'unit', 'data_year', 'release', 'values', 'sources', 'more', 'chr', 'history'];
for (const i of loadDir('indicators')) {
  checkRecord(i, ['title', 'slug', 'topic', 'definition', 'unit', 'data_year', 'release', 'values'], INDICATOR_FIELDS);
  if (!['health', 'schools', 'safety'].includes(i.topic)) errors.push(`${i._file}: topic must be health, schools or safety`);
  if (!['percent', 'number', 'years'].includes(i.unit)) errors.push(`${i._file}: unit must be percent, number or years`);
  if (!/^\d{4}(-\d{4})?$/.test(String(i.data_year ?? ''))) errors.push(`${i._file}: data_year must look like "2023" or "2020-2022" (quote it)`);
  if (typeof i.values?.monongalia !== 'number') errors.push(`${i._file}: values.monongalia must be a number`);
  for (const [k, v] of Object.entries(i.values ?? {})) if (typeof v !== 'number') errors.push(`${i._file}: values.${k} must be a number`);
  if (i.unit === 'percent' && Object.values(i.values ?? {}).some((v) => v < 0 || v > 1)) errors.push(`${i._file}: percent values are written as a share, like 0.129 for 12.9%`);
  if (i.more != null && !isUrl(i.more)) errors.push(`${i._file}: more is not a web link`);
  // history (#15): years in order, each with a number, as the source gives it.
  for (const [k, pts] of Object.entries(i.history ?? {})) {
    if (!Array.isArray(pts)) { errors.push(`${i._file}: history.${k} must be a list`); continue; }
    const yrs = pts.map((p) => String(p.year));
    if (pts.some((p) => !/^\d{4}(-\d{4})?$/.test(String(p.year)) || typeof p.value !== 'number')) errors.push(`${i._file}: history.${k} needs year and value on each point`);
    if (yrs.join() !== [...yrs].sort().join()) errors.push(`${i._file}: history.${k} years must be in order`);
  }
}

// Fact records (content/facts/<topic>/, #122, tier 2 of ADR 0007): text,
// the source's exact words, and sources with checked dates. recheck_days is
// optional. A page cannot render a fact without them.
const FACT_FIELDS = ['slug', 'text', 'quote', 'sources', 'recheck_days', 'phone', 'phone_label', 'place'];
let factCount = 0;
for (const topic of factTopics()) {
  for (const f of Object.values(loadFacts(topic))) {
    factCount++;
    const where = f._file;
    for (const k of ['slug', 'text', 'quote']) if (f[k] == null || f[k] === '') errors.push(`${where}: missing ${k}`);
    for (const k of Object.keys(f)) if (!['_file', 'checked'].includes(k) && !FACT_FIELDS.includes(k)) warnings.push(`${where}: unknown field ${k}`);
    if (f.slug && path.basename(where).replace(/\.ya?ml$/, '') !== f.slug) errors.push(`${where}: file name should match slug ${f.slug}`);
    if (!f.sources?.length) errors.push(`${where}: needs at least one source`);
    for (const s of f.sources ?? []) {
      if (!isUrl(s.url)) errors.push(`${where}: source url is not a web link`);
      if (!isDate(s.checked)) errors.push(`${where}: source needs a checked date (YYYY-MM-DD)`);
      else if (s.checked > todayYmd()) errors.push(`${where}: source checked date ${s.checked} is in the future`);
    }
    if (f.recheck_days != null && (!Number.isInteger(f.recheck_days) || f.recheck_days < 1)) errors.push(`${where}: recheck_days must be a whole number of days, like 90`);
    if (/[<>]/.test(f.text ?? '')) errors.push(`${where}: text allows only **bold** and [label](link), no HTML`);
    if (f.phone != null && !isPhone(f.phone)) errors.push(`${where}: phone must look like 304-555-0100 (quote it)`);
    if (f.place != null && !/,/.test(String(f.place))) errors.push(`${where}: place must be text like "200 M-Tec Dr, Morgantown, WV"`);
    if (JSON.stringify(f).includes('\u2014')) errors.push(`${where}: contains an em dash`);
  }
}

// PDF pages (content/pdf-pages/, #393): a PDF's useful part as short lists.
// Each needs a title, publisher, sections and sources with checked dates, and
// a PDF link needs the date printed on that PDF.
for (const d of loadPdfPages()) for (const p of pdfPageProblems(d)) errors.push(`${d._file}: ${p}`);
// Tonight's warming shelter status (content/tonight, #401).
for (const p of tonightProblems(loadTonight())) errors.push(`tonight/warming-shelter.yaml: ${p}`);

// Plain-language agenda guides (content/agendas, #529).
for (const p of agendaProblems()) errors.push(p);
// What was decided: actions from posted minutes (content/minutes, #529).
for (const p of decidedProblems()) errors.push(p);

// Duplicates and broken org links (#1170): the same group under two slugs,
// or an org: anywhere else in content/ that has no file in content/orgs/
// (resources, secondhand, boards and places are checked above).
warnings.push(...duplicateWarnings({ orgs, places: loadDir('places'), resources }));
const everyRecord = fs.readdirSync(CONTENT_DIR, { recursive: true })
  .filter((f) => /\.ya?ml$/.test(f) && !/^(orgs|resources|secondhand|boards|places)\//.test(f))
  .flatMap((f) => { try { return [{ ...YAML.parse(fs.readFileSync(path.join(CONTENT_DIR, f), 'utf8')), _file: f }]; } catch { return []; } });
errors.push(...missingOrgErrors(everyRecord, orgSlugs));
errors.push(...movedErrors(MOVED, orgSlugs));
// A date held at a place whose record names its town gets that town (#395).
warnings.push(...venueTownWarnings(loadCalendar(), loadDir('places'), TOWNS));

for (const w of warnings) console.warn(`warning: ${w}`);
for (const e of errors) console.error(`error: ${e}`);
console.log(`Checked ${placeCheck.count} gathering places (content/places).`);
console.log(`Checked ${slugs.size} calendar entries, ${orgs.length} orgs, ${resources.length} resources, ${secondhand.length} secondhand entries (${hiddenCount} hidden in all), ${feedCount} saved feed entries and the doors: ${errors.length} errors, ${warnings.length} warnings.`);
process.exit(errors.length ? 1 : 0);
