// Shared helpers for the end-to-end tests (docs/operations/e2e-tests.md).
// Serves the built site in dist/ on localhost the way GitHub Pages does,
// opens Chromium, and lists the built pages. Run `npm run build` first.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';

export const DIST = new URL('../dist/', import.meta.url).pathname;
export const SITE = 'https://everythingmorgantown.org';
// Set E2E_SMOKE=1 for the quick subset (CI uses it when a PR does not touch the site).
export const SMOKE = process.env.E2E_SMOKE === '1';
export const fullOnly = SMOKE ? 'full suite only (E2E_SMOKE=1)' : false;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.wasm': 'application/wasm',
  '.png': 'image/png', '.ics': 'text/calendar; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.yaml': 'text/yaml; charset=utf-8', '.xml': 'application/xml', '.webmanifest': 'application/manifest+json',
};

// Like GitHub Pages: /a/ serves a/index.html, /a redirects to /a/, a missing file gets 404.html.
export async function serve() {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split(/[?#]/)[0]);
    let file = path.join(DIST, url);
    if (!file.startsWith(DIST)) { res.writeHead(403); return res.end(); }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      if (!url.endsWith('/')) { res.writeHead(301, { location: url + '/' }); return res.end(); }
      file = path.join(file, 'index.html');
    }
    if (!fs.existsSync(file)) {
      res.writeHead(404, { 'content-type': TYPES['.html'] });
      return res.end(fs.existsSync(path.join(DIST, '404.html')) ? fs.readFileSync(path.join(DIST, '404.html')) : 'not found');
    }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
  const origin = `http://127.0.0.1:${server.address().port}`;
  return { origin, close: () => new Promise((ok) => server.close(ok)) };
}

// Cloud sessions have Chromium at /opt/pw-browsers; CI installs its own with `npx playwright install`.
export async function launch() {
  try { return await chromium.launch(); }
  catch (e) {
    if (!fs.existsSync('/opt/pw-browsers/chromium')) throw e;
    return chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  }
}

// One server and one browser for a test file. Call in before(); close() in after().
export async function setup() {
  if (!fs.existsSync(path.join(DIST, 'index.html'))) throw new Error('No dist/index.html. Run `npm run build` in site/ first.');
  const srv = await serve();
  const browser = await launch();
  return { ...srv, browser, close: async () => { await browser.close(); await srv.close(); } };
}

// Every built HTML page as a site path ("/", "/care/", "/404.html"), sorted.
export function pages() {
  const out = [];
  (function walk(dir) {
    for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, d.name);
      if (d.isDirectory()) { if (d.name !== 'pagefind') walk(p); continue; }
      if (!d.name.endsWith('.html')) continue;
      const rel = '/' + path.relative(DIST, p).split(path.sep).join('/');
      out.push(rel.endsWith('/index.html') || rel === '/index.html' ? rel.slice(0, -'index.html'.length) : rel);
    }
  })(DIST);
  return out.sort();
}

// The built HTML of one page path.
export function html(p) {
  const file = path.join(DIST, p.endsWith('/') ? p + 'index.html' : p);
  return fs.readFileSync(file, 'utf8');
}

// A phone, like the accessibility check (390 by 844).
export const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true };
