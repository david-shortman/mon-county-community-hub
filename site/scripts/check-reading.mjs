// Reading level check (#833). Runs after `npm run build`. Warns, never fails.
// For each page, takes the first two sentences of the first paragraph after the
// H1 (the part most people read, and on a phone often the only part) and lists
// pages whose Flesch-Kincaid grade is above 9. The charter asks for about grade 8.
// The formula is the same one the source benchmark uses
// (content/findability/benchmark/measure.js), so the numbers match.
// Text without sentences (lists, phone blocks) and very short openings get no grade.
import fs from 'node:fs';
import path from 'node:path';

const LIMIT = 9;
const MIN_WORDS = 12;

const dist = new URL('../dist/', import.meta.url).pathname;
const pages = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (e.name !== 'pagefind') walk(p); }
    else if (e.name === 'index.html') pages.push(p);
  }
})(dist);

function syllables(w) {
  w = w.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  const m = w.match(/[aeiouy]{1,2}/g);
  return m ? m.length : 1;
}
export function grade(text) {
  const sentences = (text.match(/[.!?](\s|$)/g) || []).length;
  const ws = text.match(/[A-Za-z][A-Za-z'-]*/g) || [];
  if (!sentences || ws.length < MIN_WORDS) return null;
  if (ws.length / sentences > 40) return null;
  const syl = ws.reduce((n, w) => n + syllables(w), 0);
  return Math.round((0.39 * (ws.length / sentences) + 11.8 * (syl / ws.length) - 15.59) * 10) / 10;
}

const strip = (h) => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&')
  .replace(/&#39;|&rsquo;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();

const high = [];
let graded = 0;
for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  const main = (html.match(/<main[\s\S]*?<\/main>/) || [html])[0];
  const afterH1 = main.split(/<\/h1>/)[1];
  if (!afterH1) continue;
  const firstP = strip((afterH1.match(/<p[^>]*>([\s\S]*?)<\/p>/) || [, ''])[1]);
  const opening = firstP.split(/(?<=[.!?])\s+/).slice(0, 2).join(' ');
  const g = grade(opening);
  if (g == null) continue;
  graded++;
  if (g > LIMIT) high.push({ url: '/' + path.relative(dist, path.dirname(file)).split(path.sep).join('/') + '/', g, opening });
}

high.sort((a, b) => b.g - a.g);
for (const h of high) console.warn(`warning: ${h.url.replace(/^\/\/$/, '/')} opens at about grade ${h.g} (aim for 8): "${h.opening.slice(0, 120)}${h.opening.length > 120 ? '...' : ''}"`);
console.log(`Reading level check: ${graded} page openings graded, ${high.length} above grade ${LIMIT} (warnings only).`);
