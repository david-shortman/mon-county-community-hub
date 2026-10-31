// Reading grade warning (#833). Runs after `npm run build`. Warns, never fails.
// For each built page, reads the first two sentences after the H1 (the part
// most people, and answer engines, read first) and estimates the reading grade
// with the Flesch-Kincaid formula. The charter asks for about grade 8; this
// warns above grade 9. Lists and phone blocks (no real sentences) are skipped.
// The same formula is used by the source benchmark
// (content/findability/benchmark/measure.js). See docs/visibility/answer-pages.md.
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

const high = [];
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
  if (g > LIMIT) high.push({ url: '/' + path.relative(dist, path.dirname(file)).split(path.sep).join('/'), g, lead });
}
high.sort((a, b) => b.g - a.g);
console.log(`\nReading grade of page openings (first two sentences after the H1), warn above ${LIMIT}: ${checked} pages checked, ${high.length} above.`);
for (const h of high) console.log(`  warning: grade ${h.g.toFixed(1)}  ${h.url}  "${h.lead.slice(0, 110)}${h.lead.length > 110 ? '...' : ''}"`);
