// Deeper accessibility audit (#971 wave 4). Run by hand after `npm run build`:
//   node scripts/a11y-deep.mjs [path-filter]
// `npm run check-a11y` runs in CI (axe at 390px, reflow at 320px). This adds the checks a
// person would otherwise do by hand, so they can be re-run before a screen reader test:
//   axe     axe-core at 1280px, light and dark
//   zoom    320px with text at 200%, 1280px with text at 200% and 400% (WCAG 1.4.4, 1.4.10)
//   keys    Tab through each page: skip link first, a focus ring on every stop, nothing
//           focused while invisible, no trap, Quick exit reachable (2.1.1, 2.1.2, 2.4.7)
//   hidden  on a 390px phone, the focused item is not covered by a sticky bar (2.4.11)
//   spacing WCAG 1.4.12 text spacing: nothing scrolls sideways or gets cut off
//   motion  with "reduce motion" on, nothing animates (2.3.3)
//   images  every svg or canvas has a text name or is hidden from screen readers (1.1.1)
//   links   no empty links and no "click here" style link text (2.4.4)
// It prints findings and a summary. It does not fail the build: some findings need a person.
// Results so far: docs/accessibility.md.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';

const require = createRequire(import.meta.url);
const axeSrc = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const dist = new URL('../dist/', import.meta.url).pathname;
const filter = process.argv[2] ?? '';

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
const list = urls.sort().filter((u) => u.includes(filter));
if (!list.length) { console.error('a11y-deep: no pages (run npm run build first)'); process.exit(1); }

let browser;
try { browser = await chromium.launch(); }
catch (e) {
  if (!fs.existsSync('/opt/pw-browsers/chromium')) throw e;
  browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
}
const counts = {};
const found = (kind, u, msg) => { counts[kind] = (counts[kind] ?? 0) + 1; console.log(`${kind} ${u} ${msg}`); };
const open = async (page, u) => page.goto(origin + u, { waitUntil: 'load' });

// axe at desktop width
for (const scheme of ['light', 'dark']) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, colorScheme: scheme });
  for (const u of list) {
    await open(page, u);
    await page.addScriptTag({ content: axeSrc });
    const v = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } })).violations.map((x) => `${x.impact} ${x.id} at ${x.nodes[0]?.target.join(' ')}`));
    for (const x of v) found('axe', u, `(${scheme}, 1280px) ${x}`);
  }
  await page.close();
}

// text zoom
for (const [w, pct] of [[320, 200], [1280, 200], [1280, 400]]) {
  const page = await browser.newPage({ viewport: { width: w, height: 800 } });
  for (const u of list) {
    await open(page, u);
    await page.addStyleTag({ content: `html{font-size:${pct}% !important}` });
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    if (sw > w) found('zoom', u, `${w}px with text at ${pct}% is ${sw}px wide`);
  }
  await page.close();
}

// keyboard, then focus hidden by sticky bars on a phone
const tabThrough = async (page, perStop) => {
  const seen = new Set();
  for (let i = 0; i < 400; i++) {
    await page.keyboard.press('Tab');
    const s = await page.evaluate(perStop);
    if (!s) return { i, trapped: false };
    if (seen.has(s.key)) return { i, trapped: i < 3 };
    seen.add(s.key);
    s.i = i;
    page.__stops.push(s);
  }
  return { i: 400, trapped: false, long: true };
};
const stopInfo = () => {
  const el = document.activeElement;
  if (!el || el === document.body) return null;
  const s = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  const text = (el.getAttribute('aria-label') || el.textContent || el.value || '').trim().replace(/\s+/g, ' ').slice(0, 40);
  const pts = [[r.left + r.width / 2, r.top + r.height / 2], [r.left + 2, r.top + 2], [r.right - 2, r.bottom - 2]];
  const covered = r.width > 0 && pts.every(([x, y]) => {
    if (y < 0 || y > innerHeight || x < 0 || x > innerWidth) return true;
    const t = document.elementFromPoint(x, y);
    return t && !el.contains(t) && !t.contains(el);
  });
  return {
    key: [...document.querySelectorAll('*')].indexOf(el),
    text,
    ring: (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || (s.boxShadow && s.boxShadow !== 'none'),
    visible: r.width > 0 && r.height > 0 && s.visibility !== 'hidden',
    covered,
  };
};
for (const [w, h, kind] of [[1280, 900, 'keys'], [390, 844, 'hidden']]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  for (const u of list) {
    await open(page, u);
    page.__stops = [];
    const { trapped, long } = await tabThrough(page, stopInfo);
    const stops = page.__stops;
    if (kind === 'keys') {
      if (!/skip/i.test(stops[0]?.text ?? '')) found('keys', u, `first Tab stop is "${stops[0]?.text}", not the skip link`);
      if (trapped) found('keys', u, 'focus seems stuck (possible keyboard trap)');
      if (long) console.log(`note ${u} has more than 400 Tab stops (not a trap, but long without a way to jump ahead)`);
      for (const s of stops.filter((x) => !x.ring)) found('keys', u, `no focus ring on "${s.text}"`);
      for (const s of stops.filter((x) => !x.visible)) found('keys', u, `focus lands on something invisible: "${s.text}"`);
      const qe = await page.evaluate(() => [...document.querySelectorAll('a,button')].some((e) => /quick exit|leave this page/i.test(e.textContent)));
      if (qe && !stops.some((s) => /quick exit|leave this page/i.test(s.text))) found('keys', u, 'Quick exit is not reachable with Tab');
    } else {
      for (const s of stops.filter((x) => x.covered)) found('hidden', u, `focused "${s.text}" is covered at 390px`);
    }
  }
  await page.close();
}

// text spacing, motion, images, links
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  for (const u of list) {
    await open(page, u);
    await page.addStyleTag({ content: '*{line-height:1.5 !important;letter-spacing:0.12em !important;word-spacing:0.16em !important} p{margin-bottom:2em !important}' });
    const r = await page.evaluate(() => {
      const cut = [];
      for (const el of document.querySelectorAll('body *')) {
        if (el.closest('.sr-only, [hidden], details:not([open]), .table-scroll') || el.tagName === 'THEAD') continue;
        const s = getComputedStyle(el);
        if (!(el.innerText || '').trim()) continue;
        if (/(hidden|clip)/.test(s.overflowY) && el.clientHeight > 0 && el.scrollHeight > el.clientHeight + 2) cut.push(el.tagName.toLowerCase() + '.' + el.className);
        if (/(hidden|clip)/.test(s.overflowX) && el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 2) cut.push(el.tagName.toLowerCase() + '.' + el.className);
      }
      return { wide: document.documentElement.scrollWidth > innerWidth, cut: [...new Set(cut)].slice(0, 4) };
    });
    if (r.wide) found('spacing', u, 'scrolls sideways with WCAG text spacing');
    for (const c of r.cut) found('spacing', u, `text may be cut off in ${c}`);
  }
  await page.close();
}
{
  const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  for (const u of list) {
    await open(page, u);
    const r = await page.evaluate(() => {
      const named = (s) => s.getAttribute('aria-label') || s.getAttribute('aria-labelledby') || s.querySelector(':scope > title');
      const vague = /^(here|click here|more|read more|learn more|link|this|details|go|info|more info|see more|this page|website|site)$/i;
      return {
        moving: document.getAnimations().length + (getComputedStyle(document.documentElement).scrollBehavior === 'smooth' ? 1 : 0),
        unnamed: [...document.querySelectorAll('svg, canvas')].filter((s) => !s.closest('[aria-hidden="true"]') && !named(s)).length,
        badLinks: [...document.querySelectorAll('a[href]')].map((a) => (a.getAttribute('aria-label') || a.textContent || '').trim()).filter((t) => !t || vague.test(t)),
      };
    });
    if (r.moving) found('motion', u, `${r.moving} animation(s) run with reduce motion on`);
    if (r.unnamed) found('images', u, `${r.unnamed} svg or canvas with no text name`);
    for (const t of r.badLinks) found('links', u, t ? `vague link text "${t}"` : 'a link with no text');
  }
  await ctx.close();
}

await browser.close();
server.close();
const kinds = ['axe', 'zoom', 'keys', 'hidden', 'spacing', 'motion', 'images', 'links'];
console.log(`\na11y-deep: ${list.length} pages. ${kinds.map((k) => `${k} ${counts[k] ?? 0}`).join(', ')}.`);
