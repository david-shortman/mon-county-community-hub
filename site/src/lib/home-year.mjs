// Yearly home dates (#1051): content/home-year.yaml holds dates that come
// back every year (tax deadlines, fire seasons, upkeep tips). This turns each
// rule into its next date within the coming 12 months, in the same shape as
// a content/calendar/ entry, so the Dates page, calendar.ics and home.ics all
// show it. A rule whose sources were last checked more than 13 months ago is
// left out and flagged, so a stale date never lingers.
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

export const KIND_LABEL = { due: 'Due', season: 'Season', tip: 'Tip' };
export const STALE_MONTHS = 13;
export const HOME_FEED_NAME = 'Mon County home and yearly dates';
export const HOME_FEED_DESCRIPTION = 'Yearly deadlines, burning seasons, frost dates and upkeep tips for Monongalia County, WV, from Everything Morgantown. Each event links its source and the date it was checked.';

const pad = (n) => String(n).padStart(2, '0');
const ymdOf = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v ?? '').slice(0, 10));
const addMonths = (d, n) => { const x = new Date(`${d}T12:00:00Z`); x.setUTCMonth(x.getUTCMonth() + n); return x.toISOString().slice(0, 10); };
const addDays = (d, n) => { const x = new Date(`${d}T12:00:00Z`); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };
// A real calendar date (so Feb 30 is caught).
const isRealDate = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d) && new Date(`${d}T12:00:00Z`).toISOString().slice(0, 10) === d;

export function loadHomeRules(contentDir) {
  const file = path.join(contentDir, 'home-year.yaml');
  if (!fs.existsSync(file)) return [];
  const data = YAML.parse(fs.readFileSync(file, 'utf8')) ?? {};
  return (data.rules ?? []).map((r) => ({ ...r, sources: (r.sources ?? []).map((s) => ({ ...s, checked: ymdOf(s.checked) })) }));
}

// Problems with one rule, as strings. Used by check-content and the tests.
export function ruleProblems(r) {
  const out = [];
  for (const f of ['slug', 'kind', 'month', 'day', 'title', 'org_name', 'who_it_is_for', 'what_to_do', 'url', 'topics', 'sources']) if (r[f] == null || r[f] === '') out.push(`missing ${f}`);
  if (r.kind && !KIND_LABEL[r.kind]) out.push(`kind must be due, season or tip, not ${r.kind}`);
  if (r.kind === 'season' && (r.end_month == null || r.end_day == null)) out.push('a season needs end_month and end_day');
  if (r.kind !== 'season' && (r.end_month != null || r.end_day != null)) out.push('only a season has end_month and end_day');
  if (!isRealDate(`2027-${pad(r.month)}-${pad(r.day)}`)) out.push('month and day are not a real date');
  if (r.kind === 'season' && !isRealDate(`2027-${pad(r.end_month)}-${pad(r.end_day)}`)) out.push('end_month and end_day are not a real date');
  if (/^(Due|Season|Tip):/.test(r.title ?? '')) out.push('title should not start with Due:, Season: or Tip:; the build adds it');
  if (!Array.isArray(r.topics) || !r.topics.includes('home')) out.push('topics must include home');
  for (const t of ['housing', 'money', 'food']) if (r.topics?.includes(t)) out.push(`topic ${t} is high stakes; use a hand-written calendar file instead`);
  if (!Array.isArray(r.sources) || !r.sources.length) out.push('needs at least one source');
  for (const s of r.sources ?? []) if (!s.url || !isRealDate(ymdOf(s.checked))) out.push('each source needs a url and a checked date');
  if (!/Monongalia County, WV/.test(`${r.who_it_is_for} ${r.what_to_do}`)) out.push('say "Monongalia County, WV" in who_it_is_for or what_to_do, so assistants do not mix it up with another Morgantown');
  return out;
}

// The oldest checked date on a rule, and whether it is too old to show.
export function isStale(r, today) {
  const oldest = r.sources.map((s) => s.checked).sort()[0];
  return !oldest || addMonths(oldest, STALE_MONTHS) < today;
}

// The rule's next date: the first one that has not ended yet and starts
// within the next 12 months. Null if none (which only happens for a broken rule).
export function nextOccurrence(r, today) {
  const year = Number(today.slice(0, 4));
  const limit = addDays(addMonths(today, 12), -1);
  for (const y of [year - 1, year, year + 1]) {
    const starts = `${y}-${pad(r.month)}-${pad(r.day)}`;
    let ends = starts;
    if (r.kind === 'season') {
      const endYear = r.end_month * 100 + r.end_day < r.month * 100 + r.day ? y + 1 : y;
      ends = `${endYear}-${pad(r.end_month)}-${pad(r.end_day)}`;
    }
    if (ends >= today && starts <= limit) return { starts, ends, year: y };
  }
  return null;
}

export const ruleTitle = (r) => `${KIND_LABEL[r.kind]}: ${r.title}`;

// Every rule as a calendar entry for its next date. `warn` gets one line per
// stale rule. Each entry keeps `home_rule` (the rule slug) and `home_kind`.
export function homeEntries(rules, today, warn = () => {}) {
  const out = [];
  for (const r of rules) {
    if (ruleProblems(r).length) { warn(`home-year.yaml: ${r.slug ?? '(no slug)'}: ${ruleProblems(r).join('; ')}`); continue; }
    if (isStale(r, today)) { warn(`home-year.yaml: ${r.slug} was last checked more than ${STALE_MONTHS} months ago, so it is left off the calendar until someone re-checks it`); continue; }
    const next = nextOccurrence(r, today);
    if (!next) continue;
    out.push({
      title: ruleTitle(r),
      slug: `${r.slug}-${next.year}`,
      starts: next.starts,
      ends: next.ends,
      org_name: r.org_name,
      who_it_is_for: r.who_it_is_for,
      what_to_do: r.what_to_do,
      url: r.url,
      topics: r.topics,
      sources: r.sources,
      home_rule: r.slug,
      home_kind: r.kind,
      _file: 'home-year.yaml',
    });
  }
  return out;
}
