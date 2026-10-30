// Draws site/public/share.png, the 1200 by 630 link preview image (#389):
// the icon (public/favicon.svg), the site name in the logo's typeface (Fraunces,
// soft, src/fonts) and one plain line, on hill green. Colors are identity tokens.
// Run: node scripts/make-share-image.mjs (uses the preinstalled Playwright).
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');

const pub = new URL('../public/', import.meta.url);
const icon = readFileSync(new URL('favicon.svg', pub), 'utf8').replace(/<!--[\s\S]*?-->/, '');
const font = readFileSync(new URL('../src/fonts/fraunces-name-800.woff2', import.meta.url)).toString('base64');
const html = `<!doctype html><html><head><style>
@font-face { font-family: H; font-weight: 800; src: url(data:font/woff2;base64,${font}) format("woff2"); }
body { margin: 0; width: 1200px; height: 630px; background: #1f5c4a; display: flex; align-items: center; gap: 64px; padding: 0 96px; box-sizing: border-box; font-family: system-ui, sans-serif; }
.icon { width: 300px; height: 300px; flex: none; border-radius: 66px; overflow: hidden; box-shadow: 0 0 0 6px #2f7a63; }
.icon svg { width: 100%; height: 100%; display: block; }
h1 { margin: 0 0 22px; font: 800 76px/1.05 H; color: #f9f7f2; }
p { margin: 0; font-size: 34px; line-height: 1.35; color: #e6f0ec; }
</style></head><body><div class="icon">${icon}</div><div><h1>Everything Morgantown</h1><p>Local help in Morgantown and Monongalia County, WV</p></div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: new URL('share.png', pub).pathname });
await browser.close();
console.log('Wrote public/share.png');
