// Phone-width screenshots of the most-used pages, for reviewers (not a test).
// Run after `npm run build`: npm run screenshots
// Saves PNGs to site/e2e-shots/ (ignored by git). On each pull request, CI
// uploads them as the "phone-screenshots" artifact on the Site run's summary page.
// The site has no visit counts yet, so the list is the pages residents are
// most likely to need: the home page, Help now, food, money, care, search and
// the calendar. Change it here; keep it near 15 so CI stays quick.
import fs from 'node:fs';
import path from 'node:path';
import { setup, PHONE } from './lib.mjs';

export const PAGES = [
  '/', '/search/', '/stay-tonight/', '/tonight/', '/help/food/', '/help/food/today/', '/help/what-help/',
  '/calendar/', '/money/', '/care/', '/file-today/', '/utility-bills/', '/snap/', '/vote/', '/recycling/',
];
const OUT = new URL('../e2e-shots/', import.meta.url).pathname;
const MAX_HEIGHT = 6000; // long pages are cut here so the files stay small

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const s = await setup();
const ctx = await s.browser.newContext({ ...PHONE, reducedMotion: 'reduce' });
// Keep weather.gov and other outside requests from slowing or changing the pictures.
await ctx.route((u) => !u.href.startsWith(s.origin), (r) => r.abort());
const page = await ctx.newPage();
for (const p of PAGES) {
  await page.goto(s.origin + p, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const name = (p === '/' ? 'home' : p.replace(/^\/|\/$/g, '').replace(/\//g, '--')) + '.png';
  await page.screenshot({ path: path.join(OUT, name), fullPage: true, clip: { x: 0, y: 0, width: PHONE.viewport.width, height: Math.min(height, MAX_HEIGHT) } });
  console.log(`saved e2e-shots/${name}${height > MAX_HEIGHT ? ` (first ${MAX_HEIGHT}px of ${height})` : ''}`);
}
await ctx.close();
await s.close();
