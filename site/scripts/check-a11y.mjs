// Accessibility scan (#105). Run after `npm run build`: npm run check-a11y
// Serves dist/ on localhost, opens every built page in Chromium at 390px wide (a common
// phone) in light and dark, and runs axe-core with the same rules as the design reviews
// (docs/rubrics/README.md). Also checks that no page scrolls sideways at 320px, with text
// at 100% and at 200%.
// Fails on serious or critical axe problems and on sideways scroll; prints the rest.
// Needs a browser: in CI the Site workflow runs `npx playwright install chromium` first.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';

const require = createRequire(import.meta.url);
const axeSrc = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const dist = new URL('../dist/', import.meta.url).pathname;
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];
const BLOCKING = new Set(['serious', 'critical']);

const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.wasm': 'application/wasm', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  let file = path.join(dist, decodeURIComponent(req.url.split('?')[0]));
  if (!file.startsWith(dist)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(file)] ?? 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
const origin = `http://127.0.0.1:${server.address().port}`;

const urls = [];
(function walk(dir) {
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) { if (d.name !== 'pagefind') walk(p); }
    else if (d.name === 'index.html') urls.push('/' + path.relative(dist, dir).split(path.sep).join('/').replace(/^(.+)$/, '$1/'));
  }
})(dist);
urls.sort();
if (!urls.length) { console.error('check-a11y: no pages in dist/ (run npm run build first)'); process.exit(1); }

// Cloud sessions have a matching Chromium preinstalled at /opt/pw-browsers; CI installs its own.
let browser;
try { browser = await chromium.launch(); }
catch (e) {
  if (!fs.existsSync('/opt/pw-browsers/chromium')) throw e;
  browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
}

let blocking = 0;
let other = 0;
for (const scheme of ['light', 'dark']) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: scheme });
  const page = await ctx.newPage();
  for (const u of urls) {
    await page.goto(origin + u, { waitUntil: 'load' });
    await page.addScriptTag({ content: axeSrc });
    const found = await page.evaluate(async (tags) => (await window.axe.run(document, { runOnly: { type: 'tag', values: tags } })).violations
      .map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.slice(0, 3).map((n) => n.target.join(' ')) })), TAGS);
    for (const v of found) {
      const block = BLOCKING.has(v.impact);
      block ? blocking++ : other++;
      console.log(`${block ? 'FAIL' : 'note'} ${u} (${scheme}) ${v.impact} ${v.id}: ${v.help}\n     at ${v.nodes.join(' | ')}`);
    }
  }
  await ctx.close();
}

// Reflow (WCAG 1.4.10): nothing should scroll sideways on a 320px screen.
// Pages whose 200% text fix waits on a PR that David must review, so they print a note
// instead of failing. The fixes are written out on #971. Remove each line once it is fixed.
const WAITING = [
  [/^\/$/, '#1016 (crisis buttons)'],
  [/^\/community-centers\/[^/]+\/flyer\/$/, '#938 (open, edits the flyer page)'],
  [/^\/how-we-are-doing\/$/, '#956 (open, edits this page)'],
];
const narrow = await browser.newPage({ viewport: { width: 320, height: 640 } });
for (const u of urls) {
  await narrow.goto(origin + u, { waitUntil: 'load' });
  const w = await narrow.evaluate(() => document.documentElement.scrollWidth);
  if (w > 320) { blocking++; console.log(`FAIL ${u} scrolls sideways at 320px (${w}px wide)`); }
  // Text resize (WCAG 1.4.4): with text at 200%, the page still fits a 320px screen (#971).
  await narrow.addStyleTag({ content: 'html{font-size:200% !important}' });
  const w2 = await narrow.evaluate(() => document.documentElement.scrollWidth);
  const waits = WAITING.find(([re]) => re.test(u));
  if (w2 > 320 && waits) { other++; console.log(`note ${u} scrolls sideways at 320px with text at 200% (${w2}px wide). Its fix waits for ${waits[1]}, see #971.`); }
  else if (w2 > 320) { blocking++; console.log(`FAIL ${u} scrolls sideways at 320px with text at 200% (${w2}px wide)`); }
  else if (waits) console.log(`note ${u} fits at 200% text in this run. If its fix has landed, remove it from WAITING in scripts/check-a11y.mjs`);
}

await browser.close();
server.close();
console.log(`\ncheck-a11y: ${urls.length} pages, light and dark at 390px, and 320px reflow at 100% and 200% text. ${blocking} blocking, ${other} other.`);
if (blocking) process.exit(1);
