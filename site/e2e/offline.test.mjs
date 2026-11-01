// Offline (src/pages/sw.js.js, docs/operations/offline.md): after one visit,
// the hard-moment pages open with no signal, with a dated "call before you
// go" note, and saved copies that are too old are not shown.
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { setup, PHONE, fullOnly } from './lib.mjs';

const HARD = ['/stay-tonight/', '/tonight/', '/help/food/', '/help/food/today/other/', '/utility-bills/', '/after-a-storm/', '/mental-health/', '/drugs-and-alcohol/', '/protective-orders/'];

describe('offline', { skip: fullOnly }, () => {
  let s;
  before(async () => { s = await setup(); });
  after(async () => { await s?.close(); });

  // One visit to the home page, then wait until the hard-moment pages are saved.
  async function visitOnce() {
    const ctx = await s.browser.newContext(PHONE);
    const page = await ctx.newPage();
    await page.goto(s.origin + '/');
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.waitForFunction(async (n) => (await (await caches.open('pages-v1')).keys()).length >= n, HARD.length, { timeout: 30000 });
    return { ctx, page };
  }

  test('after one visit, every hard-moment page opens offline with a dated note', async () => {
    const { ctx, page } = await visitOnce();
    await ctx.setOffline(true);
    for (const url of HARD) {
      await page.goto(s.origin + url);
      const note = await page.locator('.saved-copy').innerText();
      assert.match(note, /^Saved copy from \d{1,2}:\d{2} [ap]\.m\. on [A-Z][a-z]+ \d{1,2}, \d{4}/, url);
      assert.match(note, /Call before you go\./, url);
      assert.ok(await page.locator('main h1').count(), `${url} shows the page itself`);
    }
    await ctx.close();
  });

  test('a page that is not saved falls back to Help now, saying so', async () => {
    const { ctx, page } = await visitOnce();
    await ctx.setOffline(true);
    await page.goto(s.origin + '/pets/');
    assert.match(await page.locator('.saved-copy').innerText(), /no recent copy of it on this phone.*Call before you go\./s);
    await ctx.close();
  });

  test('an old saved copy of a daily page is not shown; an old Help now copy says how old it is', async () => {
    const { ctx, page } = await visitOnce();
    // Backdate the saved copies by 40 days.
    await page.evaluate(async () => {
      const cache = await caches.open('pages-v1');
      for (const req of await cache.keys()) {
        const res = await cache.match(req);
        const headers = new Headers(res.headers);
        headers.set('x-saved-at', new Date(Date.now() - 40 * 864e5).toISOString());
        await cache.put(req, new Response(await res.blob(), { headers }));
      }
    });
    await ctx.setOffline(true);
    await page.goto(s.origin + '/tonight/');
    const note = await page.locator('.saved-copy').innerText();
    assert.match(note, /no recent copy of it on this phone/);
    assert.match(note, /more than a month ago/);
    assert.equal(await page.locator('main h1').innerText(), await (async () => {
      await page.goto(s.origin + '/stay-tonight/');
      return page.locator('main h1').innerText();
    })());
    await ctx.close();
  });

  test('back online, pages come from the network with no note', async () => {
    const { ctx, page } = await visitOnce();
    await page.goto(s.origin + '/mental-health/');
    assert.equal(await page.locator('.saved-copy').count(), 0);
    await ctx.close();
  });
});
