// Page weight check (#180). Runs after `npm run build`. Exits 1 if a page is over budget.
// Budget (docs/design/presentation.md, "Weight budget"): urgent pages under 100 KB,
// every other page under 300 KB. Weight is the page plus everything it loads on a first
// visit (fonts, icons, scripts, styles, images), each gzipped the way GitHub Pages sends it.
// Files a page loads only when asked (the search index on /search/) are not counted.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const KB = 1024;
const URGENT_KB = 100;
const EVERYDAY_KB = 300;
// Urgent pages: the one list. Any page with the crisis strip counts as urgent too.
const URGENT = ['index.html', 'stay-tonight/index.html', 'help/food/'];

const dist = new URL('../dist/', import.meta.url).pathname;
const gz = new Map();
const gzSize = (file) => {
  if (!gz.has(file)) gz.set(file, zlib.gzipSync(fs.readFileSync(file), { level: 9 }).length);
  return gz.get(file);
};
const htmlFiles = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
  const p = path.join(dir, d.name);
  if (d.isDirectory()) return d.name === 'pagefind' ? [] : htmlFiles(p);
  return p.endsWith('.html') ? [p] : [];
});

// Same-site files the page asks for as it loads: <link href>, <script src>, <img src>,
// <source srcset> and url(...) in inline CSS. Off-site files are not ours to count.
function assets(html, pageDir) {
  const refs = new Set();
  const add = (u) => {
    if (!u || /^(https?:|data:|mailto:|tel:|sms:|#)/.test(u) || u.startsWith('//')) return;
    const clean = u.split(/[?#]/)[0];
    const file = clean.startsWith('/') ? path.join(dist, clean) : path.join(pageDir, clean);
    if (fs.existsSync(file) && fs.statSync(file).isFile()) refs.add(file);
  };
  for (const m of html.matchAll(/<link\b[^>]*>/g)) {
    const rel = m[0].match(/rel="([^"]*)"/)?.[1] ?? '';
    if (/\b(stylesheet|preload|modulepreload|icon)\b/.test(rel)) add(m[0].match(/href="([^"]*)"/)?.[1]);
  }
  for (const m of html.matchAll(/<(?:script|img)\b[^>]*\ssrc="([^"]*)"/g)) add(m[1]);
  for (const m of html.matchAll(/\ssrcset="([^"]*)"/g)) m[1].split(',').forEach((s) => add(s.trim().split(/\s+/)[0]));
  for (const m of html.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) add(m[1]);
  return [...refs];
}

const rows = [];
for (const file of htmlFiles(dist)) {
  const where = path.relative(dist, file);
  const html = fs.readFileSync(file, 'utf8');
  const urgent = URGENT.some((u) => (u.endsWith('/') ? where.startsWith(u) : where === u)) || html.includes('class="crisis-strip"');
  const files = assets(html, path.dirname(file));
  const bytes = gzSize(file) + files.reduce((n, f) => n + gzSize(f), 0);
  const budget = (urgent ? URGENT_KB : EVERYDAY_KB) * KB;
  rows.push({ where, urgent, bytes, budget, files: files.length });
}

rows.sort((a, b) => b.bytes - a.bytes);
const kb = (n) => (n / KB).toFixed(1).padStart(6);
console.log('\nPage weight, gzipped, page plus what it loads (budget: urgent 100 KB, everyday 300 KB)');
for (const r of rows) {
  const flag = r.bytes > r.budget ? '  OVER BUDGET' : '';
  console.log(`${kb(r.bytes)} KB  ${r.urgent ? 'urgent  ' : 'everyday'}  ${r.where} (${r.files} files)${flag}`);
}
const over = rows.filter((r) => r.bytes > r.budget);
if (!rows.length) { console.error('check-weight: no pages found in dist/ (run npm run build first)'); process.exit(1); }
if (over.length) {
  console.error(`\ncheck-weight: ${over.length} page(s) over budget. See "Weight budget" in docs/design/presentation.md.`);
  process.exit(1);
}
console.log(`\nAll ${rows.length} pages are within budget.`);
