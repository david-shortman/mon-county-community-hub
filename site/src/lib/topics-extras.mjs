// Small "keep exploring" pieces for /topics/ (#1040): "Did you know" facts
// from place stories, pages new or changed this week from the build log, and
// one page picked for "Show me something". All are chosen when the site is
// built (it rebuilds every day), so no script runs in the browser and nothing
// is tracked.
import fs from 'node:fs';
import path from 'node:path';

// The day number of a YYYY-MM-DD date. The same date always picks the same
// items, and the next day picks different ones.
export const dayNumber = (ymd) => Math.floor(Date.parse(`${ymd}T12:00:00Z`) / 86_400_000);

// A fixed shuffle for one day: a small linear congruential generator seeded
// with the day number, so a build is repeatable.
export function shuffleForDay(list, ymd) {
  const out = [...list];
  let seed = dayNumber(ymd) >>> 0;
  const rand = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 2 ** 32; };
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// "Did you know": up to n places with a story and a source, at most one per
// area of the county, so the cards do not all come from one place.
export function pickStories(places, ymd, n = 3) {
  const seen = new Set();
  const picked = [];
  for (const p of shuffleForDay(places.filter((x) => x.story && x.sources?.length), ymd)) {
    if (seen.has(p.area)) continue;
    seen.add(p.area);
    picked.push(p);
    if (picked.length === n) break;
  }
  return picked;
}

// "Show me something": one listed page, a different one each day.
export const pickSurprise = (pages, ymd) => (pages.length ? pages[dayNumber(ymd) % pages.length] : null);

// Pages a build log entry from the last `days` days names, like `/permits/`.
// Newest first, each page once. `routes` is the set of real page routes.
export function recentPages(logDir, routes, ymd, { days = 7, n = 6 } = {}) {
  const from = new Date(Date.parse(`${ymd}T12:00:00Z`) - days * 86_400_000).toISOString().slice(0, 10);
  const files = fs.readdirSync(logDir).filter((f) => /^\d{4}-\d{2}-\d{2}-\d{4}-.+\.md$/.test(f) && f.slice(0, 10) >= from && f.slice(0, 10) <= ymd).sort().reverse();
  const out = new Map();
  for (const f of files) {
    for (const [, r] of fs.readFileSync(path.join(logDir, f), 'utf8').matchAll(/`(\/[a-z0-9/-]*\/)`/g)) {
      if (routes.has(r) && !out.has(r)) out.set(r, f.slice(0, 10));
    }
  }
  return { count: out.size, pages: [...out].slice(0, n).map(([route, date]) => ({ route, date })) };
}
