// Checks content/ entries before they reach the site. Exits 1 on any error.
import fs from 'node:fs';
import path from 'node:path';
import { loadCalendar, loadDir, loadDoors, loadDoorPage, CONTENT_DIR } from '../src/lib/content.mjs';
import { ADAPTERS, SNAPSHOT_DIR, entryProblems } from '../src/lib/feeds/index.mjs';

const errors = [];
const warnings = [];
const isDate = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d ?? '');
const isUrl = (u) => { try { return ['https:', 'http:'].includes(new URL(u).protocol); } catch { return false; } };
const sixMonthsAgo = new Date(); sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
const stale = sixMonthsAgo.toISOString().slice(0, 10);

const slugs = new Set();
for (const e of loadCalendar()) {
  const where = e._file;
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
  for (const s of e.sources ?? []) {
    if (!isUrl(s.url)) errors.push(`${where}: source url is not a web link`);
    if (!isDate(s.checked)) errors.push(`${where}: source needs a checked date (YYYY-MM-DD)`);
    else if (s.checked < stale) warnings.push(`${where}: source last checked ${s.checked}, re-verify`);
  }
  if (JSON.stringify(e).includes('\u2014')) errors.push(`${where}: contains an em dash`);
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
  }
  if (JSON.stringify(doors).includes('\u2014')) errors.push('doors.yaml: contains an em dash');
  for (const e of [...loadDir('orgs'), ...loadDir('resources'), ...loadCalendar()]) {
    for (const t of e.topics ?? []) {
      if (!topicHome.has(t)) errors.push(`${e._file}: topic "${t}" has no door; add it to a door in content/doors.yaml`);
    }
  }
}

// Door pages (content/doors/<slug>.yaml): each step points to a real
// resource, each situation names real steps and a page link.
const doorDir = path.join(CONTENT_DIR, 'doors');
for (const f of fs.existsSync(doorDir) ? fs.readdirSync(doorDir).filter((x) => x.endsWith('.yaml')) : []) {
  const slug = f.replace(/\.yaml$/, '');
  const where = `doors/${f}`;
  let dp;
  try { dp = loadDoorPage(slug); } catch (err) { errors.push(`${where}: ${err.message}`); continue; }
  const d = doors?.bySlug[slug];
  if (!d?.topics) errors.push(`${where}: ${slug} is not a door in doors.yaml`);
  else if (!d.page) errors.push(`${where}: give the ${slug} door a page in doors.yaml`);
  if (dp.door !== slug) errors.push(`${where}: door should be ${slug}`);
  if (!dp.lede) errors.push(`${where}: needs a lede`);
  for (const [id, st] of Object.entries(dp.steps)) {
    if (!['today', 'week', 'opens'].includes(st.when)) errors.push(`${where}: step ${id} when must be today, week or opens`);
    if (!st.text) errors.push(`${where}: step ${id} needs text`);
    if (!st.record.contact?.url) errors.push(`${where}: step ${id}'s resource needs a contact url`);
  }
  const ids = new Set();
  for (const s of dp.situations) {
    if (ids.has(s.id)) errors.push(`${where}: duplicate situation ${s.id}`);
    ids.add(s.id);
    if (!s.label || !/^\/[^\s]*$/.test(s.page ?? '')) errors.push(`${where}: situation ${s.id} needs a label and a page like /flu-shots/`);
    for (const st of s.steps ?? []) if (!dp.steps[st]) errors.push(`${where}: situation ${s.id} names a missing step ${st}`);
  }
  if (JSON.stringify(dp.situations).includes('\u2014') || JSON.stringify(Object.values(dp.steps).map((x) => x.text)).includes('\u2014') || (dp.lede ?? '').includes('\u2014')) errors.push(`${where}: contains an em dash`);
}

for (const w of warnings) console.warn(`warning: ${w}`);
for (const e of errors) console.error(`error: ${e}`);
console.log(`Checked ${slugs.size} calendar entries, ${feedCount} saved feed entries and the doors: ${errors.length} errors, ${warnings.length} warnings.`);
process.exit(errors.length ? 1 : 0);
