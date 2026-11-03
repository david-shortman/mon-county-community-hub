// Time-of-day words (#1378): a page should not say "tonight" or "this morning"
// unless the time is the point. A reader at 8 a.m. who sees "download the forms
// tonight" gets copy that does not fit their day. Run after `npm run build`.
//
// Flags, in the main text of every built page:
// - "this morning", "this evening", "this afternoon", anywhere outside PAGES.
// - "tonight", unless the sentence is about a hard moment tonight (a place to
//   stay or sleep, a bed or shelter, food, being safe, danger, a crisis, or
//   "help tonight" for Help now), or "Tonight" is the name of the Tonight
//   page ("Tonight:", or a capital T mid-sentence).
// - A source described with "today" ("the page shows today", "as of today"):
//   it goes stale the day after we check. Say "when we checked" instead; the
//   card already shows the checked date.
// Fails the build on any of these. The rule is in content/README.md, "Rules for every entry".
import fs from 'node:fs';
import path from 'node:path';

const DIST = process.argv[2] ?? new URL('../dist/', import.meta.url).pathname;
// Pages that are about a time of day, where any of these words fits.
const PAGES = [/^\/tonight\/$/, /^\/stay-tonight\/$/, /^\/help\/what-help\/stay\//, /^\/calendar\//, /^\/embed\/help-now\//];
const CLOCK = /\b(this morning|this evening|this afternoon)\b/i;
const TONIGHT = /\btonight\b/i;
const HARD = /\b(stay|sleep|bed|beds|shelter|shelters|warm|warming|food|eat|meal|meals|safe|safety|danger|crisis|emergency|help tonight)\b/i;
// "Tonight" with a capital T after the start of a sentence is the Tonight page's name.
const PAGE_NAME = /(\bTonight:|(?<=\S.*)\bTonight\b)/;
const STALE = /\b((page|pages|site|list|rink|arena)\s+(shows?|says?|lists?)(\s+\w+)?\s+today|(shows?|showed)\s+(them\s+)?today|on the \w+ page today|as of today)\b/i;

const text = (h) => (h.match(/<main[\s\S]*<\/main>/)?.[0] ?? '')
  .replace(/<(script|style|template)\b[\s\S]*?<\/\1>/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&#39;|&rsquo;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ');

export function findTimeWords(pagePath, body) {
  if (PAGES.some((re) => re.test(pagePath))) return [];
  const out = [];
  for (const s of body.split(/(?<=[.?!])\s+/)) {
    if (CLOCK.test(s)) out.push(s);
    else if (TONIGHT.test(s) && !HARD.test(s) && !PAGE_NAME.test(s)) out.push(s);
    else if (STALE.test(s)) out.push(s);
  }
  return out.map((s) => s.trim().slice(0, 160));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const found = [];
  (function walk(dir) {
    for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, d.name);
      if (d.isDirectory()) { if (!['pagefind', '_astro', 'api'].includes(d.name)) walk(p); continue; }
      if (d.name !== 'index.html') continue;
      const rel = '/' + path.relative(DIST, dir).split(path.sep).join('/');
      const pagePath = rel === '/' ? '/' : rel + '/';
      for (const s of findTimeWords(pagePath, text(fs.readFileSync(p, 'utf8')))) found.push(`${pagePath}: "${s}"`);
    }
  })(DIST);
  if (found.length) {
    console.error(found.join('\n'));
    console.error(`\ncheck-time-words: ${found.length} sentence(s) use a time of day that may not fit the reader's day (#1378). Reword them, say "when we checked" for a source, or add the page to PAGES if it is about that time.`);
    process.exit(1);
  }
  console.log('check-time-words: no stray time-of-day words.');
}
