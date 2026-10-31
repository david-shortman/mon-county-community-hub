// Catches a page that says dates were "not found" or "not announced" while the
// record it shows already has those dates (#1046). The utility bills page said
// 2026-27 LIEAP dates were not found after the lieap-heating-help record had
// them (#755), and the source line under it made the old sentence look checked.
//
// How it works: for each page in src/pages, look at every line that says a
// date was not found or not announced. Find the records that line uses: a
// variable set from resource('slug'), a resource('slug') call, or a
// slug: 'slug' entry on that line. If one of those records names a date that
// is today or later (like "November 25, 2026"), the line is out of date.
// The general check for every page is #1056.
//
// Usage (from site/): node scripts/check-season-dates.mjs
// Also run by npm run check-content. It tests itself first, then the pages.
// Exit codes: 0 ok, 1 a page line is out of date or the self-test failed.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// "could not find 2026-27 dates", "next date not announced", and the like.
const NOT_FOUND = /\b(could not find|did not find|have not found|not found|not (yet )?announced|not been announced)\b/i;
const DATE_WORD = /\bdates?\b/i;
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const MONTH_DAY_YEAR = new RegExp(`\\b(${MONTHS.join('|')}) (\\d{1,2}), (20\\d{2})\\b`, 'gi');

// Every "Month D, YYYY" in a text, as YYYY-MM-DD.
export function datesIn(text) {
  const out = [];
  for (const m of String(text ?? '').matchAll(MONTH_DAY_YEAR)) {
    const mm = String(MONTHS.indexOf(m[1].toLowerCase()) + 1).padStart(2, '0');
    out.push(`${m[3]}-${mm}-${m[2].padStart(2, '0')}`);
  }
  return out;
}

const recordText = (r) => [r.what_to_do, r.summary, r.who_it_is_for].filter((v) => typeof v === 'string').join(' ');

// Problems in one page's source: [{ line, slug, date, text }].
// records: Map of slug to record. today: YYYY-MM-DD.
export function staleDateLines(source, records, today) {
  const vars = new Map();
  for (const m of source.matchAll(/\bconst\s+(\w+)\s*=\s*resource\(\s*['"]([a-z0-9-]+)['"]\s*\)/g)) vars.set(m[1], m[2]);
  const problems = [];
  source.split('\n').forEach((text, i) => {
    if (!NOT_FOUND.test(text) || !DATE_WORD.test(text)) return;
    const slugs = new Set();
    for (const [v, slug] of vars) if (new RegExp(`\\b${v}\\.`).test(text)) slugs.add(slug);
    for (const m of text.matchAll(/resource\(\s*['"]([a-z0-9-]+)['"]\s*\)/g)) slugs.add(m[1]);
    for (const m of text.matchAll(/\bslug:\s*['"]([a-z0-9-]+)['"]/g)) slugs.add(m[1]);
    for (const slug of slugs) {
      const r = records.get(slug);
      if (!r) continue;
      const date = datesIn(recordText(r)).filter((d) => d >= today).sort()[0];
      if (date) problems.push({ line: i + 1, slug, date, text: text.trim() });
    }
  });
  return problems;
}

// The checker is tested on every run: the old utility bills line must fail,
// and the same line with a record that has no dates must pass.
export function selfTest() {
  const page = [
    "const lieap = resource('lieap-heating-help');",
    '<li><strong>This season:</strong> we could not find 2026-27 dates yet. Call <a href={telHref(lieap.contact.phone)}>{lieap.contact.phone}</a>.</li>',
  ].join('\n');
  const withDates = new Map([['lieap-heating-help', { what_to_do: 'The last day is Wednesday, November 25, 2026.' }]]);
  const noDates = new Map([['lieap-heating-help', { what_to_do: 'Dates are not posted yet.' }]]);
  const pastDates = new Map([['lieap-heating-help', { what_to_do: 'The last day was January 30, 2026.' }]]);
  const fails = [];
  if (staleDateLines(page, withDates, '2026-10-31').length !== 1) fails.push('the stale line with a dated record should fail');
  if (staleDateLines(page, noDates, '2026-10-31').length !== 0) fails.push('a record with no dates should pass');
  if (staleDateLines(page, pastDates, '2026-10-31').length !== 0) fails.push('a record with only past dates should pass');
  if (datesIn('Monday, November 2, 2026').join() !== '2026-11-02') fails.push('datesIn should read "November 2, 2026"');
  return fails;
}

function pageFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? pageFiles(p) : d.name.endsWith('.astro') ? [p] : [];
  });
}

async function main() {
  const fails = selfTest();
  if (fails.length) {
    for (const f of fails) console.error(`check-season-dates self-test: ${f}`);
    process.exit(1);
  }
  const { loadDir, todayYmd } = await import('../src/lib/content.mjs');
  const records = new Map([...loadDir('resources'), ...loadDir('orgs')].map((r) => [r.slug, r]));
  const today = todayYmd();
  const pagesDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/pages');
  let count = 0;
  for (const file of pageFiles(pagesDir)) {
    for (const p of staleDateLines(fs.readFileSync(file, 'utf8'), records, today)) {
      count++;
      console.error(`${path.relative(process.cwd(), file)}:${p.line}: says a date was not found or not announced, but record ${p.slug} has ${p.date}. Show the record's dates instead.`);
    }
  }
  if (count) process.exit(1);
  console.log('check-season-dates: ok');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
