// The food day list (#60): free food and meals by day of the week, built from
// content/food-days.yaml and the records it names. Each entry keeps its own
// checked date, and a person re-reads every entry once a month
// (content/checklists/food-days.yaml, the food-days list in
// scripts/checklists.mjs).
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { CONTENT_DIR, loadDir, oldestChecked, ymd } from './content.mjs';
import { DAYS, timeWords } from './listing.mjs';

export const FOOD_DAYS_FILE = path.join(CONTENT_DIR, 'food-days.yaml');
export const DAY_NAMES = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' };
export const KINDS = { meal: 'Meal', groceries: 'Food to take home' };
// An entry not re-read for this long says "call before you go" (monthly
// re-check, with two weeks of slack).
export const RECHECK_DAYS = 45;
const ENTRY_FIELDS = ['resource', 'place', 'org', 'days', 'kind', 'for', 'when'];
const DIRS = { resource: 'resources', place: 'places', org: 'orgs' };

export function loadFoodDaysFile(file = FOOD_DAYS_FILE) {
  return YAML.parse(fs.readFileSync(file, 'utf8')) ?? {};
}

const refOf = (e) => Object.keys(DIRS).find((k) => e?.[k]);

// Each entry joined to its record: { ...entry, type, slug, record, name, checked }.
// Throws on a name with no record, so the page never ships a dead entry.
export function resolveEntries(list, dirs = {}) {
  const load = (k) => (dirs[DIRS[k]] ??= loadDir(DIRS[k]));
  return (list ?? []).map((e) => {
    const type = refOf(e);
    const slug = e[type];
    const record = load(type).find((r) => r.slug === slug);
    if (!record) throw new Error(`content/food-days.yaml: no ${type} with slug ${slug}`);
    const name = record.title ?? record.name;
    const checked = oldestChecked((record.sources ?? []).map((s) => ({ ...s, checked: ymd(s.checked) })));
    return { ...e, type, slug, record, name, checked };
  });
}

// The days an entry runs: its own `days`, or the record's opening_hours.
export function entryDays(e) {
  if (e.days) return e.days;
  const h = e.record?.opening_hours;
  if (Array.isArray(h)) return DAYS.filter((d) => h.some((p) => p.days.includes(d)));
  return [];
}

// The time on one day in words: from opening_hours for that day, else `when`,
// else the place's first `regular` line.
export function timeOn(e, day) {
  const h = e.record?.opening_hours;
  if (Array.isArray(h)) {
    const parts = h.filter((p) => p.days.includes(day)).sort((a, b) => (a.opens < b.opens ? -1 : 1));
    if (parts.length) return parts.map((p) => `${timeWords(p.opens)} to ${timeWords(p.closes)}`).join(' and ');
  }
  return e.when ?? e.record?.regular?.[0] ?? '';
}

// The address or place in words, for the short line on each day.
export const placeOf = (e) => e.record?.contact?.place ?? null;

// { day, name, rows } for each day of the week, Monday first.
export function byDay(entries) {
  return DAYS.map((d) => ({
    day: d,
    name: DAY_NAMES[d],
    rows: entries.filter((e) => entryDays(e).includes(d)).map((e) => ({ ...e, time: timeOn(e, d) })),
  }));
}

export function isOverdue(checked, today) {
  if (!checked) return true;
  const age = (new Date(`${today}T12:00:00Z`) - new Date(`${checked}T12:00:00Z`)) / 86_400_000;
  return age > RECHECK_DAYS;
}

// Problems with the file, for npm test.
export function foodDaysProblems(data, dirs = {}) {
  const errors = [];
  for (const [section, list] of [['days', data.days], ['appointment', data.appointment]]) {
    if (list != null && !Array.isArray(list)) { errors.push(`food-days.yaml: ${section} must be a list`); continue; }
    for (const [i, e] of (list ?? []).entries()) {
      const where = `food-days.yaml ${section}[${i}]`;
      for (const k of Object.keys(e ?? {})) if (!ENTRY_FIELDS.includes(k)) errors.push(`${where}: unknown field ${k}`);
      const refs = Object.keys(DIRS).filter((k) => e?.[k]);
      if (refs.length !== 1) { errors.push(`${where}: name exactly one of resource, place or org`); continue; }
      if (!KINDS[e.kind]) errors.push(`${where}: kind must be one of ${Object.keys(KINDS).join(', ')}`);
      let r;
      try { [r] = resolveEntries([e], dirs); } catch (err) { errors.push(`${where}: ${err.message}`); continue; }
      const hasHours = Array.isArray(r.record.opening_hours);
      if (section === 'days') {
        if (e.days && hasHours) errors.push(`${where}: ${r.slug} has opening_hours, so leave days out (they come from the record)`);
        if (!e.days && !hasHours) errors.push(`${where}: ${r.slug} has no opening_hours, so give days`);
        if (e.days && (!Array.isArray(e.days) || !e.days.length || e.days.some((d) => !DAYS.includes(d)))) errors.push(`${where}: days must be a list from ${DAYS.join(', ')}`);
        if (!hasHours && !e.when && !r.record.regular?.length) errors.push(`${where}: say the time in when`);
      } else if (e.days) errors.push(`${where}: appointment entries have no days`);
      const topics = [...(r.record.topics ?? []), ...(r.record.interests ?? [])];
      if (r.type !== 'org' && !topics.includes('food')) errors.push(`${where}: ${r.slug} is not tagged food`);
      if (!r.checked) errors.push(`${where}: ${r.slug} has no checked date`);
      if (/—/.test(`${e.when ?? ''}${e.for ?? ''}`)) errors.push(`${where}: no em dashes`);
    }
  }
  return errors;
}
