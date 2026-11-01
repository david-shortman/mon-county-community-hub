// Help now and the crisis strip: the 911, 988 and 211 links on every page
// are there and dial the right number, and Quick exit leaves the page.
// The first group reads the built HTML only (fast, in the smoke subset).
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { pages, html, setup, PHONE, fullOnly } from './lib.mjs';

const EXIT = 'https://www.weather.gov/';
const strip = (h) => h.match(/<div class="crisis-strip"[\s\S]*?<\/div>\s*<\/div>/)?.[0];
const text = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const ALL = pages().filter((p) => p !== '/404.html');

describe('crisis numbers in the built pages', () => {
  test('every page says to call 911 in an emergency and 988 in a crisis', () => {
    const missing = ALL.filter((p) => !/In an emergency, call 911\. In a crisis, call or text 988\./.test(html(p)));
    assert.deepEqual(missing, [], 'pages without the 911 and 988 line in the footer');
  });

  test('every link that shows 911, 988 or 211 dials that number', () => {
    const wrong = [];
    for (const p of ALL) {
      for (const m of html(p).matchAll(/<a\b[^>]*href="(tel|sms):([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)) {
        const [, kind, num, inner] = m;
        // The visible label, without screen-reader-only extras like ", emergency".
        const label = text(inner.replace(/<span class="sr-only">[\s\S]*?<\/span>/g, ''));
        for (const n of ['911', '988', '211']) {
          const showsOnly = new RegExp(`^(Call |Text |Call or text )?${n}$`).test(label);
          if (showsOnly && num.replace(/^\+?1?(?=\d{3}$)/, '') !== n) wrong.push(`${p}: "${label}" goes to ${kind}:${num}`);
        }
        if (kind === 'tel' && !/^\+?[\d-]{3,}(,\d+)?$/.test(num)) wrong.push(`${p}: odd phone link tel:${num} ("${label}")`);
      }
    }
    assert.deepEqual(wrong, []);
  });

  test('crisis pages have the full strip: 911, 988 and Quick exit', () => {
    const crisis = ALL.filter((p) => html(p).includes('class="crisis-strip"'));
    assert.ok(crisis.includes('/stay-tonight/'), '/stay-tonight/ should have the crisis strip');
    const bad = [];
    for (const p of crisis) {
      const h = html(p);
      const s = strip(h) ?? '';
      if (!s.includes('href="tel:911"')) bad.push(`${p}: no 911 link in the strip`);
      if (!s.includes('href="tel:988"')) bad.push(`${p}: no 988 link in the strip`);
      if (!s.includes(`id="quick-exit" href="${EXIT}"`)) bad.push(`${p}: Quick exit is not a plain link to ${EXIT}`);
      if (!/<meta name="referrer" content="no-referrer"/.test(h)) bad.push(`${p}: crisis page should not send a referrer`);
      if (h.indexOf('class="crisis-strip"') > h.indexOf('<header')) bad.push(`${p}: the strip should come before the header`);
    }
    assert.deepEqual(bad, []);
  });

  test('Help now pages show 911 and 988 near the top', () => {
    const bad = ALL.filter((p) => {
      const h = html(p);
      if (!/data-pagefind-filter="door">Help now</.test(h)) return false;
      return !(h.includes('class="crisis-strip"') || h.includes('class="crisis-line"'));
    });
    assert.deepEqual(bad, [], 'Help now pages without the crisis strip or the crisis line');
  });

  test('the home page Help now bar has 211, 911 and 988', () => {
    const bar = html('/').match(/<section class="right-now"[\s\S]*?<\/section>/)?.[0] ?? '';
    for (const href of ['tel:211', 'sms:898211', 'tel:911', 'tel:988', 'sms:988', '/stay-tonight/']) {
      assert.ok(bar.includes(`href="${href}"`), `Help now bar is missing ${href}`);
    }
  });
});

describe('crisis strip in a browser', () => {
  let s;
  before(async () => { s = await setup(); });
  after(async () => { await s?.close(); });

  // Stand in for weather.gov so the test never leaves this computer.
  async function phone(opts = {}) {
    const ctx = await s.browser.newContext({ ...PHONE, ...opts });
    await ctx.route('https://www.weather.gov/**', (r) => r.fulfill({ contentType: 'text/html', body: '<title>weather</title>weather' }));
    return ctx;
  }

  test('Quick exit replaces the page, so Back does not return to it', async () => {
    const ctx = await phone();
    const page = await ctx.newPage();
    await page.goto(s.origin + '/');
    await page.goto(s.origin + '/stay-tonight/');
    await page.click('#quick-exit');
    await page.waitForURL(EXIT);
    await page.goBack();
    assert.equal(new URL(page.url()).pathname, '/', 'Back should skip the page the person left');
    await ctx.close();
  });

  test('pressing Shift three times leaves, typing a capital letter does not', async () => {
    const ctx = await phone();
    const page = await ctx.newPage();
    await page.goto(s.origin + '/stay-tonight/');
    await page.keyboard.press('Shift');
    await page.keyboard.press('Shift+A');
    await page.keyboard.press('Shift');
    await page.waitForTimeout(100);
    assert.equal(new URL(page.url()).pathname, '/stay-tonight/', 'a capital letter should reset the count');
    // The count now stands at 2 (Shift+A's own Shift key-up counts), so wait out
    // its 1 second window. Otherwise the first press below leaves and the next two
    // start a second exit that cancels the first (ERR_ABORTED on slow CI runners).
    await page.waitForTimeout(1100);
    for (let i = 0; i < 3; i++) await page.keyboard.press('Shift');
    await page.waitForURL(EXIT);
    await ctx.close();
  });

  test('Quick exit works with scripts off', async () => {
    const ctx = await phone({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(s.origin + '/stay-tonight/');
    await page.click('#quick-exit');
    await page.waitForURL(EXIT);
    await ctx.close();
  });

  test('the strip stays on screen while scrolling, on every crisis page', { skip: fullOnly }, async () => {
    const ctx = await phone();
    const page = await ctx.newPage();
    const off = [];
    for (const p of ALL.filter((x) => html(x).includes('class="crisis-strip"'))) {
      await page.goto(s.origin + p);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(50);
      const box = await page.locator('.crisis-strip').boundingBox();
      const exit = await page.locator('#quick-exit').isVisible();
      if (!box || box.y < -1 || box.y > 5 || !exit) off.push(p);
    }
    assert.deepEqual(off, [], 'crisis strip or Quick exit scrolled off screen');
    await ctx.close();
  });

  test('home page: Call 211 is on the first phone screen', async () => {
    const ctx = await phone();
    const page = await ctx.newPage();
    await page.goto(s.origin + '/');
    const call = page.locator('.right-now a[href="tel:211"]');
    assert.ok(await call.isVisible());
    const box = await call.boundingBox();
    assert.ok(box.y + box.height <= PHONE.viewport.height, `Call 211 starts at ${Math.round(box.y)}px, below the first screen`);
    await ctx.close();
  });
});
