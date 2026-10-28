// Usage: node content/findability/mobile-check.js <url> [<url>...]
// Loads each URL at 390px wide (an iPhone-sized screen) and prints one JSON line per URL:
// viewport meta, whether the page scrolls sideways, body font size, and the latest year on the page.
// Needs Playwright with Chromium. Some sites block headless browsers; then check by hand.
const { chromium } = require('playwright');
(async () => {
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch({ proxy });
  for (const url of process.argv.slice(2)) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, ignoreHTTPSErrors: false,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' });
    const page = await ctx.newPage();
    try {
      const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(1500);
      const r = await page.evaluate(() => {
        const vp = document.querySelector('meta[name=viewport]');
        const sw = document.documentElement.scrollWidth;
        const fs = parseFloat(getComputedStyle(document.body).fontSize);
        const text = document.body.innerText || '';
        const years = (text.match(/20(1\d|2[0-6])/g) || []);
        const maxYear = years.length ? Math.max(...years.map(Number)) : null;
        return { title: document.title, viewportMeta: vp ? vp.content : null, scrollWidth: sw, bodyFontPx: fs, words: text.split(/\s+/).length, maxYearOnPage: maxYear };
      });
      console.log(JSON.stringify({ url, status: resp && resp.status(), ...r, horizontalScroll: r.scrollWidth > 400 }));
    } catch (e) { console.log(JSON.stringify({ url, error: String(e).slice(0, 200) })); }
    await ctx.close();
  }
  await browser.close();
})();
