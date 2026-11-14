// @everything-morgantown/data: one loader for the YAML records in content/.
// Every surface (the site, the API, the MCP server, later apps) reads content
// through these functions, so all of them see the same records the same way
// (#69, docs/architecture/adr/0004-monorepo-layout.md).
//
// Only plain data rules live here: loading, dates, hidden records and how
// often a record is re-checked. Display helpers (pretty dates, source labels,
// phone links) stay in site/src/lib/content.mjs, which re-exports all of
// this so its importers never change.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

// The repo's content/ folder. Found by walking up from this file, so it is
// right whether this runs from packages/data, through the node_modules link,
// or bundled into a build chunk somewhere under the repo.
function findContentDir(start) {
  for (let dir = start; ; dir = path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, 'content', 'README.md'))) return path.join(dir, 'content');
    if (path.dirname(dir) === dir) return path.resolve(start, '../../content');
  }
}
export const CONTENT_DIR = findContentDir(path.dirname(fileURLToPath(import.meta.url)));

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

// Hidden records (#519) stay in content/ with their history but are left out
// of every page, the search index, calendar.ics and the counts. Checks and
// the Health report pass { withHidden: true } so hidden items still get
// re-checked and can come back by removing the `hidden` block.
export const HIDDEN_REASONS = ['group-request', 'unconfirmed-risky', 'overdue', 'other'];
export const isHidden = (e) => e?.hidden != null && e.hidden !== false;
// A listing tied to one date (Election Day polling places, say) can set
// `show_until: YYYY-MM-DD`. From the next Morgantown day on, the daily build
// leaves it off pages like a hidden record, with no edit needed (QA sweep 2,
// #529). Lookups by slug still find it, so a page that names it keeps working.
export const isPast = (e, today = todayYmd()) => e?.show_until != null && ymd(e.show_until) < today;

export function loadDir(name, { withHidden = false } = {}) {
  const dir = path.join(CONTENT_DIR, name);
  if (!fs.existsSync(dir)) return [];
  const all = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'))
    .sort()
    .map((f) => ({ ...YAML.parse(fs.readFileSync(path.join(dir, f), 'utf8')), _file: `${name}/${f}` }));
  return withHidden ? all : all.filter((e) => !isHidden(e) && !isPast(e));
}

export function loadCalendar({ withHidden = false } = {}) {
  return loadDir('calendar', { withHidden }).map((e) => ({
    ...e,
    starts: ymd(e.starts),
    ends: ymd(e.ends) || ymd(e.starts),
    sources: (e.sources || []).map((s) => ({ ...s, checked: ymd(s.checked) })),
  }));
}

// Checked dates are Morgantown dates (America/New_York). After 6 months a
// card says it may be out of date (the rule in content/README.md, #39).
export const STALE_DAYS = 183;
export function isStale(checked, today = todayYmd(), days = STALE_DAYS) {
  if (!checked) return false;
  return (Date.parse(`${today}T12:00:00Z`) - Date.parse(`${checked}T12:00:00Z`)) / 86400000 > days;
}

// The oldest checked date across a record's sources, so a card never says an
// item is fresher than its stalest source (#39).
export function oldestChecked(sources = []) {
  return sources.map((s) => ymd(s.checked)).sort()[0];
}

// Make it better entries (topic `better`, and board records in
// content/boards/) change faster: seat counts and grant rounds. They say
// "may be out of date" after 90 days instead of 6 months (#791, #291).
export const FAST_STALE_DAYS = 90;
const baseStaleDays = (r) => ((r?.topics ?? []).includes('better') || String(r?._file ?? '').startsWith('boards/') ? FAST_STALE_DAYS : STALE_DAYS);
// Cards follow the re-check cadence below (#1461), never later than 6 months.
export const staleDaysFor = (r) => Math.min(recheckDaysFor(r), STALE_DAYS);

// Re-check cadence from the risk rubric (docs/playbook/trust-and-ai.md, #1461).
// The high-stakes topics and every calendar entry are in the top tier: re-check
// every 90 days. A record can set `recheck_days` to go faster (or, outside the
// top tier, slower, up to a year); check-content refuses a top-tier record
// slower than 90 days. Otherwise the cadence is the card's own rule above.
//
// The Health check counts items re-checked on time, and cards say "may be
// out of date" once a listing is past its cadence (staleDaysFor, capped at 6
// months, the promise on About and How we check).
export const HIGH_STAKES_TOPICS = ['health', 'money', 'housing', 'family', 'taxes', 'voting'];
export const TOP_TIER_DAYS = 90;
export const MAX_RECHECK_DAYS = 365;
export const isTopTier = (r) => (r?.topics ?? []).some((t) => HIGH_STAKES_TOPICS.includes(t)) || String(r?._file ?? '').startsWith('calendar/');
export function recheckDaysFor(r) {
  const set = Number(r?.recheck_days);
  if (Number.isInteger(set) && set > 0) return set;
  return isTopTier(r) ? TOP_TIER_DAYS : baseStaleDays(r);
}
// Problems with a record's recheck_days, for check-content.
export function recheckProblems(r) {
  if (r?.recheck_days == null) return [];
  const d = r.recheck_days;
  if (!Number.isInteger(d) || d < 1 || d > MAX_RECHECK_DAYS) return [`recheck_days must be a whole number of days from 1 to ${MAX_RECHECK_DAYS}, like 90`];
  if (isTopTier(r) && d > TOP_TIER_DAYS) return [`recheck_days ${d} is slower than the ${TOP_TIER_DAYS} days every high-stakes record needs (risk rubric, docs/playbook/trust-and-ai.md)`];
  return [];
}
// Is a record past its re-check date? Uses the oldest source check.
export const recheckDue = (r, today = todayYmd()) => {
  const c = oldestChecked((r?.sources ?? []).map((s) => ({ ...s, checked: ymd(s.checked) })));
  return Boolean(c) && isStale(c, today, recheckDaysFor(r));
};
