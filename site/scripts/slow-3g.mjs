// Slow phone test (#529, wave 8): how long the top pages take to show
// something on a slow 3G connection and an older phone. Run after
// `npm run build`: `npm run slow-3g`. Not part of the build, because timings
// vary from machine to machine. Prints a table and, with --json <file>,
// saves the numbers.
//
// - Serves dist/ itself, gzipped the way GitHub Pages sends it.
// - Network: Chrome's "Slow 3G" profile (2 s round trip, about 50 KB/s down).
// - CPU: 4 times slower than this machine, like an older phone.
// - Each page: a fresh browser context (nothing saved), 3 runs, median.
// - First content: the browser's first-contentful-paint time.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { chromium } from 'playwright';

export const TOP_PAGES = [
  '/', '/stay-tonight/', '/tonight/', '/help/food/', '/help/food/today/',
  '/help/food/today/other/', '/utility-bills/', '/after-a-storm/', '/mental-health/',
  '/drugs-and-alcohol/', '/protective-orders/', '/money/', '/care/', '/living-here/',
  '/family/', '/community/', '/calendar/', '/make-a-list/', '/before-you-call/', '/about/',
];
const SLOW_3G = { offline: false, latency: 2000, downloadThroughput: (500 * 1024 / 8) * 0.8, uploadThroughput: (500 * 1024 / 8) * 0.8 };
const RUNS = 3;

const dist = new URL('../dist/', import.meta.url).pathname;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json', '.webmanifest': 'application/manifest+json' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(dist, p);
  if (!file.startsWith(dist) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end(); return; }
  const type = types[path.extname(file)] ?? 'application/octet-stream';
  let body = fs.readFileSync(file);
  const headers = { 'content-type': type, 'cache-control': 'max-age=600' };
  if (/text|javascript|svg|json|manifest/.test(type)) { body = zlib.gzipSync(body); headers['content-encoding'] = 'gzip'; }
  res.writeHead(200, headers);
  res.end(body);
});
await new Promise((r) => server.listen(0, r));
const origin = `http://localhost:${server.address().port}`;

const browser = await chromium.launch();
const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];
const rows = [];
for (const url of TOP_PAGES) {
  const fcp = [];
  const bytes = [];
  for (let i = 0; i < RUNS; i++) {
    const ctx = await browser.newContext({ serviceWorkers: 'block', viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', SLOW_3G);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    let got = 0;
    cdp.on('Network.loadingFinished', (e) => { got += e.encodedDataLength; });
    await page.goto(origin + url, { waitUntil: 'load', timeout: 120000 });
    fcp.push(await page.evaluate(() => performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? NaN));
    bytes.push(got);
    await ctx.close();
  }
  rows.push({ url, fcpMs: Math.round(median(fcp)), kb: +(median(bytes) / 1024).toFixed(1) });
  console.log(`${(median(fcp) / 1000).toFixed(2).padStart(6)} s  ${(median(bytes) / 1024).toFixed(1).padStart(6)} KB  ${url}`);
}
await browser.close();
server.close();
const out = process.argv.indexOf('--json');
if (out > -1) fs.writeFileSync(process.argv[out + 1], JSON.stringify(rows, null, 2));
