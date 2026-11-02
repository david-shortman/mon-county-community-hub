// Draws site/public/share.png, the 1200 by 630 link preview image (#389):
// the icon (public/favicon.svg), the site name in the logo's typeface (Fraunces,
// soft, src/fonts) and one plain line, on hemlock with one rust quilt corner.
// Press inks only (docs/design/looks/press.md); the same look as the cards in src/lib/share-cards.mjs.
// Run: node scripts/make-share-image.mjs (uses the preinstalled Playwright).
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');

const pub = new URL('../public/', import.meta.url);
const icon = readFileSync(new URL('favicon.svg', pub), 'utf8').replace(/<!--[\s\S]*?-->/, '');
const font = readFileSync(new URL('../src/fonts/fraunces-name-800.woff2', import.meta.url)).toString('base64');
const html = `<!doctype html><html><head><style>
@font-face { font-family: H; font-weight: 800; src: url(data:font/woff2;base64,${font}) format("woff2"); }
body { margin: 0; width: 1200px; height: 630px; background: #24493d; position: relative; display: flex; align-items: center; gap: 64px; padding: 0 96px; box-sizing: border-box; font-family: system-ui, sans-serif; }
.icon { width: 300px; height: 300px; flex: none; border-radius: 12px; overflow: hidden; }
body::before { content: ""; position: absolute; top: 0; left: 0; width: 56px; height: 56px; background: linear-gradient(135deg, #d98c6c 50%, transparent 50%); }
.icon svg { width: 100%; height: 100%; display: block; }
h1 { margin: 0 0 22px; font: 800 76px/1.05 H; color: #f6f1e6; }
p { margin: 0; font-size: 34px; line-height: 1.35; color: #e7ece4; }
</style></head><body><div class="icon">${icon}</div><div><h1>Everything Morgantown</h1><p>Local help in Morgantown and Monongalia County, WV</p></div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: new URL('share.png', pub).pathname });
await browser.close();
console.log('Wrote public/share.png');
