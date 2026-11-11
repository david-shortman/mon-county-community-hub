// Morgantown 311 totals (#881, #1785): the counting rules, kept apart from
// the API calls in scripts/check-311.mjs so they can be tested.
//
// On SeeClickFix a request moves from "closed" to "archived" once it has been
// closed for 7 days, and an archived request cannot change again. So closed
// plus archived is the closed count, and the median time to close uses both.
// It needs each request's closed date (not the date it was archived). If any
// closed or archived request has no closed date, or fewer than MIN_FOR_MEDIAN
// requests go in, the median is null, so a number from a handful of requests,
// or from a biased part of them, never reaches the site.

export const MIN_FOR_MEDIAN = 30;
const DAY = 864e5;

export const median = (xs) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

// list: [{ created, closed, status }], dates as ISO strings.
export function totals311(list) {
  const done = list.filter((r) => /^(closed|archived)$/i.test(r.status ?? ''));
  const archived = done.filter((r) => /^archived$/i.test(r.status ?? '')).length;
  const missing = done.filter((r) => !r.closed || Number.isNaN(Date.parse(r.closed))).length;
  const days = done.filter((r) => r.closed && !Number.isNaN(Date.parse(r.closed)))
    .map((r) => (Date.parse(r.closed) - Date.parse(r.created)) / DAY)
    .filter((d) => d >= 0);
  let med = null;
  let why = null;
  if (missing > 0) why = `${missing} closed or archived requests have no closed date`;
  else if (days.length < MIN_FOR_MEDIAN) why = `only ${days.length} closed requests (needs ${MIN_FOR_MEDIAN})`;
  else med = Math.round(median(days) * 10) / 10;
  return {
    opened: list.length,
    closed: done.length,
    archived,
    median_days_to_close: med,
    median_from: med == null ? 0 : days.length,
    ...(why ? { median_null_because: why } : {}),
  };
}
