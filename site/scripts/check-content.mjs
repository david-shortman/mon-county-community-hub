// Checks content/ entries before they reach the site. Exits 1 on any error.
import { loadCalendar } from '../src/lib/content.mjs';

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
  if (e.url && !isUrl(e.url)) errors.push(`${where}: url is not a web link`);
  if (!e.sources?.length) errors.push(`${where}: needs at least one source`);
  for (const s of e.sources ?? []) {
    if (!isUrl(s.url)) errors.push(`${where}: source url is not a web link`);
    if (!isDate(s.checked)) errors.push(`${where}: source needs a checked date (YYYY-MM-DD)`);
    else if (s.checked < stale) warnings.push(`${where}: source last checked ${s.checked}, re-verify`);
  }
  if (JSON.stringify(e).includes('\u2014')) errors.push(`${where}: contains an em dash`);
}

for (const w of warnings) console.warn(`warning: ${w}`);
for (const e of errors) console.error(`error: ${e}`);
console.log(`Checked ${slugs.size} calendar entries: ${errors.length} errors, ${warnings.length} warnings.`);
process.exit(errors.length ? 1 : 0);
