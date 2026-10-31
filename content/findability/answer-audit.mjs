// Answer-first audit (#88). Run after `npm run build` in site/:
//   node ../content/findability/answer-audit.mjs
// For each built page, prints whether it follows the answer-first pattern in
// docs/visibility/answer-pages.md: the H1 is a question or a plain need, a
// short direct answer comes right after it, a "checked" date is visible, and
// the page carries structured data. It reads site/dist only; it changes nothing.
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve(process.cwd(), 'dist');
if (!fs.existsSync(dist)) { console.error('Run `npm run build` in site/ first.'); process.exit(1); }
const pages = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === 'index.html') pages.push(p);
  }
})(dist);

const strip = (h) => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, "'").replace(/\s+/g, ' ').trim();
const rows = [];
for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  const url = '/' + path.relative(dist, path.dirname(file)).split(path.sep).join('/') + (file === path.join(dist, 'index.html') ? '' : '/');
  const main = (html.match(/<main[\s\S]*?<\/main>/) || [html])[0];
  const h1 = strip((main.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [, ''])[1]);
  const afterH1 = main.split(/<\/h1>/)[1] || '';
  const firstP = strip((afterH1.match(/<p[^>]*>([\s\S]*?)<\/p>/) || [, ''])[1]);
  const lead = firstP.split(/(?<=[.!?])\s/).slice(0, 2).join(' ');
  const ld = [...html.matchAll(/"@type"\s*:\s*"([A-Za-z]+)"/g)].map((m) => m[1]);
  rows.push({
    url,
    h1,
    question: /\?\s*$/.test(h1),
    lead_words: lead ? lead.split(/\s+/).length : 0,
    checked: /Checked [A-Z][a-z]+ \d{1,2}, 20\d\d|checked [A-Z][a-z]+ \d{1,2}, 20\d\d/.test(strip(main)),
    jsonld: [...new Set(ld)].filter((t) => !['WebSite', 'WebPage', 'Organization', 'ListItem', 'BreadcrumbList', 'PostalAddress', 'ContactPoint', 'GeoCoordinates', 'OpeningHoursSpecification'].includes(t)).join(' '),
  });
}
rows.sort((a, b) => a.url.localeCompare(b.url));
const json = process.argv.includes('--json');
if (json) { console.log(JSON.stringify(rows, null, 1)); process.exit(0); }
console.log('page | H1 is a question | words in first 2 sentences | checked date shown | structured data');
for (const r of rows) console.log(`${r.url} | ${r.question ? 'yes' : 'no'} | ${r.lead_words} | ${r.checked ? 'yes' : 'no'} | ${r.jsonld || '-'}  (${r.h1.slice(0, 60)})`);
const q = rows.filter((r) => r.question).length;
console.log(`\n${rows.length} pages. H1 is a question: ${q}. Checked date shown: ${rows.filter((r) => r.checked).length}.`);
