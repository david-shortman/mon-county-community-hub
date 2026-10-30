// Checks content/places/ (gathering places, #455) against
// content/schemas/place.schema.json, plus the rules a schema cannot say:
// file names match slugs, org links are real, dates are not in the future,
// and calendar entries with `venue` point to a real place.
// Called from check-content.mjs; returns { errors, warnings, count }.
import fs from 'node:fs';
import path from 'node:path';
import { loadDir, loadCalendar, todayYmd, ymd, CONTENT_DIR } from '../src/lib/content.mjs';

const schema = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'schemas', 'place.schema.json'), 'utf8'));

// A small validator for the parts of JSON Schema the place schema uses:
// type, enum, required, properties, additionalProperties, items, minItems,
// minLength, minimum, pattern, and the date and uri formats.
const isUrl = (u) => { try { return ['https:', 'http:'].includes(new URL(u).protocol); } catch { return false; } };
const isDate = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d ?? '');
function typeOf(v) {
  if (Array.isArray(v)) return 'array';
  if (v === null) return 'null';
  if (Number.isInteger(v)) return 'integer';
  return typeof v;
}
export function validate(value, s, at, out) {
  if (s.enum && !s.enum.includes(value)) { out.push(`${at} must be one of ${s.enum.join(', ')}`); return; }
  if (s.type) {
    const t = typeOf(value);
    const ok = s.type === t || (s.type === 'number' && t === 'integer');
    if (!ok) { out.push(`${at} must be ${s.type === 'object' ? 'a group of fields' : s.type === 'array' ? 'a list' : s.type}`); return; }
  }
  if (typeof value === 'string') {
    if (s.minLength && value.length < s.minLength) out.push(`${at} is empty`);
    if (s.pattern && !new RegExp(s.pattern).test(value)) out.push(`${at} does not match ${s.pattern}`);
    if (s.format === 'uri' && !isUrl(value)) out.push(`${at} is not a web link`);
    if (s.format === 'date' && !isDate(value)) out.push(`${at} must be YYYY-MM-DD`);
  }
  if (typeof value === 'number' && s.minimum != null && value < s.minimum) out.push(`${at} must be at least ${s.minimum}`);
  if (Array.isArray(value)) {
    if (s.minItems && value.length < s.minItems) out.push(`${at} needs at least ${s.minItems}`);
    if (s.items) value.forEach((v, i) => validate(v, s.items, `${at}[${i}]`, out));
  }
  if (typeOf(value) === 'object') {
    for (const f of s.required ?? []) if (value[f] == null || value[f] === '') out.push(`${at ? `${at}.` : ''}${f} is missing`);
    for (const [k, v] of Object.entries(value)) {
      const sub = s.properties?.[k];
      if (sub) validate(v, sub, at ? `${at}.${k}` : k, out);
      else if (s.additionalProperties === false) out.push(`${at ? `${at}.` : ''}${k} is not a known field (see content/schemas/place.schema.json)`);
    }
  }
}

// YAML reads dates as Date objects; the schema wants YYYY-MM-DD text.
function normalize(v) {
  if (v instanceof Date) return ymd(v);
  if (Array.isArray(v)) return v.map(normalize);
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, normalize(x)]));
  return v;
}

const isPhone = (p) => /^(1-)?\d{3}-\d{3}-\d{4}$/.test(String(p));

export function checkPlaces() {
  const errors = [];
  const warnings = [];
  const today = todayYmd();
  const sixMonthsAgo = new Date(); sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const stale = sixMonthsAgo.toISOString().slice(0, 10);
  const orgSlugs = new Set(loadDir('orgs').map((o) => o.slug));
  const places = loadDir('places');
  const slugs = new Set();
  for (const raw of places) {
    const where = raw._file;
    const { _file, ...rest } = raw;
    const p = normalize(rest);
    const out = [];
    validate(p, schema, '', out);
    for (const m of out) errors.push(`${where}: ${m}`);
    if (p.slug && path.basename(where).replace(/\.ya?ml$/, '') !== p.slug) errors.push(`${where}: file name should match slug ${p.slug}`);
    if (slugs.has(p.slug)) errors.push(`${where}: duplicate slug ${p.slug}`);
    slugs.add(p.slug);
    if (p.run_by?.org && !orgSlugs.has(p.run_by.org)) errors.push(`${where}: run_by.org ${p.run_by.org} has no file in content/orgs/`);
    if (p.contact?.phone && !isPhone(p.contact.phone)) errors.push(`${where}: contact.phone must look like 304-555-0100 (quote it)`);
    if (p.contact?.place && !/,/.test(p.contact.place)) errors.push(`${where}: contact.place must be text like "200 M-Tec Dr, Morgantown, WV"`);
    if (p.contact?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.contact.email)) errors.push(`${where}: contact.email does not look like an email address`);
    if (p.rentals?.length && !p.contact?.phone && !p.contact?.url && !p.contact?.email && !p.contact?.facebook) warnings.push(`${where}: has rentals but no public phone, website, email or Facebook page to book through`);
    for (const d of [p.last_activity_seen, p.phone_confirmed, ...(p.sources ?? []).map((s) => s.checked)]) {
      if (isDate(d) && d > today) errors.push(`${where}: date ${d} is in the future`);
    }
    for (const s of p.sources ?? []) if (isDate(s.checked) && s.checked < stale) warnings.push(`${where}: source last checked ${s.checked}, re-verify`);
    if (JSON.stringify(p).includes('—')) errors.push(`${where}: contains an em dash`);
  }
  // Calendar entries can name the place they happen at (#455, #457).
  for (const e of loadCalendar()) {
    if (e.venue != null && !slugs.has(e.venue)) errors.push(`${e._file}: venue ${e.venue} has no file in content/places/`);
  }
  return { errors, warnings, count: places.length };
}
