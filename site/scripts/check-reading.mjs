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
//
// Only the prose a resident reads counts (#1621, since 2026-11-03):
// - A paragraph is a real <p> tag. The old pattern also matched SVG <path>
//   tags in button icons, so whole button rows ("Call ..., Directions, Add to
//   calendar, Share") were graded as one long sentence.
// - Source and check lines (<p class="meta">), date chips and the Pass it on
//   address are skipped, and so is text only screen readers hear.
// - Each paragraph ends a sentence, so a short line with no period does not
//   run into the next one.
// - Embed listings (/embed/listing/<slug>/) are one resource card each, so their
//   opening is that card's "Who it's for" line. They are kept in the file with
//   `card: true` and counted on their own (`cards_above_9`), not with pages.
import fs from 'node:fs';
import path from 'node:path';

const LIMIT = 9;
const MIN_WORDS = 12;
// Paragraph classes that are not prose: source and check lines, date chips,
// the Pass it on web address.
const SKIP_CLASSES = ['meta', 'date-chip', 'pi-url'];

function syllables(w) {
  w = w.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  const m = w.match(/[aeiouy]{1,2}/g);
  return m ? m.length : 1;
}
// A sentence ends at . ! or ? and any closing quote marks or brackets right
// after it, then a space or the end: 'a tax break." It' is two sentences (#1665).
const END = /[.!?]["'\u201d\u2019)\]]*(?=\s|$)/g;
export function grade(text) {
  const sentences = Math.max(1, (text.match(END) || []).length);
  const ws = text.match(/[A-Za-z][A-Za-z'-]*/g) || [];
  if (ws.length < MIN_WORDS || ws.length / sentences > 40) return null;
  const syl = ws.reduce((n, w) => n + syllables(w), 0);
  return Math.round((0.39 * (ws.length / sentences) + 11.8 * (syl / ws.length) - 15.59) * 10) / 10;
}
const strip = (h) => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '')
  .replace(/<span class="sr-only">[^<]*<\/span>/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, "'").replace(/&[a-z]+;|&#\d+;/g, ' ').replace(/\s+/g, ' ').trim();

// The prose paragraphs after the H1, as plain text, in page order.
export function paragraphs(html) {
  const main = (html.match(/<main[\s\S]*?<\/main>/) || [])[0];
  if (!main) return null;
  const after = main.split(/<\/h1>/)[1] || '';
  const out = [];
  for (const m of after.matchAll(/<p(\s[^>]*)?>([\s\S]*?)<\/p>/g)) {
    const cls = (m[1] || '').match(/class="([^"]*)"/)?.[1].split(/\s+/) ?? [];
    if (cls.some((c) => SKIP_CLASSES.includes(c))) continue;
    const t = strip(m[2]);
    if (t) out.push(t);
  }
  return out;
}
// The first two sentences of the first paragraph.
export const opening = (ps) => (ps[0] || '').split(/(?<=[.!?]["'\u201d\u2019)\]]*)\s+/).slice(0, 2).join(' ');
// All paragraphs as one text, each ending a sentence.
export const fullText = (ps) => ps.map((t) => (/[.!?]["')]?$/.test(t) ? t : t + '.')).join(' ');

const median = (xs) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b), m = Math.floor(s.length / 2);
  return Math.round((s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2) * 10) / 10;
};

if (import.meta.url === `file://${process.argv[1]}`) {
  const dist = path.resolve('dist');
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

  const high = [];
  const rows = [];
  for (const file of files) {
    const ps = paragraphs(fs.readFileSync(file, 'utf8'));
    if (!ps?.length) continue;
    const lead = opening(ps);
    const g = grade(lead);
    if (g == null) continue;
    const rel = path.relative(dist, path.dirname(file)).split(path.sep).join('/');
    const url = '/' + rel + (rel ? '/' : '');
    const card = url.startsWith('/embed/listing/');
    rows.push({ url, door: doorFor(url), opening: g, full: grade(fullText(ps)), ...(card ? { card: true } : {}) });
    if (g > LIMIT && !card) high.push({ url: '/' + rel, g, lead });
  }
  high.sort((a, b) => b.g - a.g);
  const pageRows = rows.filter((r) => !r.card);
  const cardRows = rows.filter((r) => r.card);
  console.log(`\nReading grade of page openings (first two sentences after the H1), warn above ${LIMIT}: ${pageRows.length} pages checked, ${high.length} above.`);
  for (const h of high) console.log(`  warning: grade ${h.g.toFixed(1)}  ${h.url}  "${h.lead.slice(0, 110)}${h.lead.length > 110 ? '...' : ''}"`);

  const openings = pageRows.map((r) => r.opening);
  const fulls = pageRows.map((r) => r.full).filter((g) => g != null);
  const summary = {
    pages: pageRows.length,
    opening_median: median(openings),
    opening_grade_8_or_under: openings.filter((g) => g <= 8).length,
    opening_above_9: openings.filter((g) => g > LIMIT).length,
    full_median: median(fulls),
    full_above_10: fulls.filter((g) => g > 10).length,
    help_now_above_8: pageRows.filter((r) => r.door === 'help-now' && r.opening > 8).map((r) => r.url),
    cards: cardRows.length,
    cards_above_9: cardRows.filter((r) => r.opening > LIMIT).length,
  };
  fs.writeFileSync(path.join(dist, 'reading-grades.json'), JSON.stringify({
    about: 'Flesch-Kincaid reading grade for each built page: its opening (first two sentences after the H1) and all its paragraph text. Only prose counts: source and check lines, date chips, button rows and screen-reader-only text are left out (#1621, since 2026-11-03). From site/scripts/check-reading.mjs.',
    built: new Date().toISOString().slice(0, 10),
    method: 'prose-only since 2026-11-03 (#1621)',
    summary,
    pages: rows.sort((a, b) => a.url.localeCompare(b.url)),
  }, null, 1) + '\n');
  console.log(`Resource cards (embed listings): ${summary.cards_above_9} of ${summary.cards} "Who it's for" lines above grade ${LIMIT}.`);
  console.log(`Middle value: openings ${summary.opening_median}, full text ${summary.full_median}. Wrote dist/reading-grades.json.`);
}
