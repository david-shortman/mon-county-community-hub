// Reading grade warning (#833). Runs after `npm run build`. Warns, never fails.
// For each built page, reads the first two sentences after the H1 (the part
// most people, and answer engines, read first) and estimates the reading grade
// with the Flesch-Kincaid formula. The charter asks for about grade 8; this
// warns above grade 9. Lists and phone blocks (no real sentences) are skipped.
// The same formula is used by the source benchmark
// (content/findability/benchmark/measure.js). See docs/visibility/answer-pages.md.
// It also writes dist/reading-grades.json (#1054) for the weekly scorecard:
// each page's grade for its opening and for all its paragraph text, its door,
// and a summary (middle values, count above 9, Help now pages above 8).
import fs from 'node:fs';
import path from 'node:path';

const LIMIT = 9;
const MIN_WORDS = 12;
const dist = path.resolve('dist');

function syllables(w) {
  w = w.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  const m = w.match(/[aeiouy]{1,2}/g);
  return m ? m.length : 1;
}
function grade(text) {
  const sentences = Math.max(1, (text.match(/[.!?](\s|$)/g) || []).length);
  const ws = text.match(/[A-Za-z][A-Za-z'-]*/g) || [];
  if (ws.length < MIN_WORDS || ws.length / sentences > 40) return null;
  const syl = ws.reduce((n, w) => n + syllables(w), 0);
  return Math.round((0.39 * (ws.length / sentences) + 11.8 * (syl / ws.length) - 15.59) * 10) / 10;
}
const strip = (h) => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, "'").replace(/&[a-z]+;|&#\d+;/g, ' ').replace(/\s+/g, ' ').trim();

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === 'index.html') files.push(p);
  }
})(dist);

// The door a page sits in, read from its source file's `export const page`.
function doorFor(url) {
  const r = url.replace(/^\/|\/$/g, '');
  for (const f of [`src/pages/${r}.astro`, `src/pages/${r}${r ? '/' : ''}index.astro`]) {
    if (fs.existsSync(f)) return fs.readFileSync(f, 'utf8').match(/door:\s*["']([a-z-]+)["']/)?.[1] ?? null;
  }
  return null;
}
const median = (xs) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b), m = Math.floor(s.length / 2);
  return Math.round((s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2) * 10) / 10;
};

const high = [];
const rows = [];
let checked = 0;
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const main = (html.match(/<main[\s\S]*?<\/main>/) || [])[0];
  if (!main) continue;
  const after = main.split(/<\/h1>/)[1] || '';
  const p = (after.match(/<p[^>]*>([\s\S]*?)<\/p>/) || [])[1];
  if (!p) continue;
  const lead = strip(p).split(/(?<=[.!?])\s+/).slice(0, 2).join(' ');
  const g = grade(lead);
  if (g == null) continue;
  checked++;
  const rel = path.relative(dist, path.dirname(file)).split(path.sep).join('/');
  const url = '/' + rel + (rel ? '/' : '');
  // All paragraph text after the H1, as one block.
  const full = grade([...after.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((m) => strip(m[1])).filter(Boolean).join(' '));
  rows.push({ url, door: doorFor(url), opening: g, full });
  if (g > LIMIT) high.push({ url: '/' + rel, g, lead });
}
high.sort((a, b) => b.g - a.g);
console.log(`\nReading grade of page openings (first two sentences after the H1), warn above ${LIMIT}: ${checked} pages checked, ${high.length} above.`);
for (const h of high) console.log(`  warning: grade ${h.g.toFixed(1)}  ${h.url}  "${h.lead.slice(0, 110)}${h.lead.length > 110 ? '...' : ''}"`);

const openings = rows.map((r) => r.opening);
const fulls = rows.map((r) => r.full).filter((g) => g != null);
const summary = {
  pages: rows.length,
  opening_median: median(openings),
  opening_grade_8_or_under: openings.filter((g) => g <= 8).length,
  opening_above_9: openings.filter((g) => g > LIMIT).length,
  full_median: median(fulls),
  full_above_10: fulls.filter((g) => g > 10).length,
  help_now_above_8: rows.filter((r) => r.door === 'help-now' && r.opening > 8).map((r) => r.url),
};
fs.writeFileSync(path.join(dist, 'reading-grades.json'), JSON.stringify({
  about: 'Flesch-Kincaid reading grade for each built page: its opening (first two sentences after the H1) and all its paragraph text. From site/scripts/check-reading.mjs.',
  built: new Date().toISOString().slice(0, 10),
  summary,
  pages: rows.sort((a, b) => a.url.localeCompare(b.url)),
}, null, 1) + '\n');
console.log(`Middle value: openings ${summary.opening_median}, full text ${summary.full_median}. Wrote dist/reading-grades.json.`);
