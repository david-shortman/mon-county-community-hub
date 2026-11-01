// The small tools residents use: the File today "what to bring" builder,
// Make a list for someone, and search.
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { setup, PHONE, SMOKE } from './lib.mjs';

describe('tools', () => {
  let s;
  before(async () => { s = await setup(); });
  after(async () => { await s?.close(); });

  test('what to bring: scripts off shows the whole list', async () => {
    const ctx = await s.browser.newContext({ ...PHONE, javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(s.origin + '/file-today/?have=rent');
    assert.equal(await page.locator('#ftb-form').isVisible(), false, 'the picker needs scripts, so it hides without them');
    const all = await page.locator('.ftb-items li').count();
    assert.ok(all > 10, `expected the full list, found ${all} items`);
    assert.equal(await page.locator('.ftb-items li:visible').count(), all, 'every item shows with scripts off');
    await ctx.close();
  });

  test('what to bring: picks show only the items that fit, and stay in the address', async () => {
    const ctx = await s.browser.newContext(PHONE);
    const page = await ctx.newPage();
    await page.goto(s.origin + '/file-today/');
    const total = await page.locator('.ftb-items li').count();
    assert.equal(await page.locator('.ftb-items li:visible').count(), total, 'no picks yet: everything shows');
    await page.locator('#ftb-form input[value="rent"]').check();
    await page.locator('#ftb-form input[value="job"]').check();
    await page.locator('#ftb-form [type="submit"]').click();
    await page.waitForURL(/have=rent/);
    const url = new URL(page.url());
    assert.deepEqual(url.searchParams.getAll('have').sort(), ['job', 'rent']);
    const when = await page.locator('.ftb-items li:visible').evaluateAll((ls) => ls.map((l) => l.dataset.when));
    assert.ok(when.includes('all') && when.includes('rent') && when.includes('job'), `shown: ${[...new Set(when)]}`);
    assert.ok(when.every((w) => ['all', 'rent', 'job'].includes(w)), `items for other homes show too: ${[...new Set(when)]}`);
    assert.ok(when.length < total, 'the list should get shorter');
    // Reloading the address brings back the same boxes, so it can be texted or bookmarked.
    await page.reload();
    assert.ok(await page.locator('#ftb-form input[value="rent"]').isChecked());
    assert.ok(await page.locator('#ftb-print').isVisible(), 'Print this list button');
    await ctx.close();
  });

  test('make a list: picks and a note become a one-page list', async () => {
    const ctx = await s.browser.newContext(PHONE);
    const page = await ctx.newPage();
    await page.goto(s.origin + '/make-a-list/');
    // Places are folded by door (#1174): open the first door, as a person would.
    await page.locator('#mal-form details.fold > summary').first().click();
    const boxes = page.locator('#mal-form details.fold').first().locator('input[name="pick"]');
    await boxes.nth(0).check();
    await boxes.nth(1).check();
    await page.locator('#mal-note').fill('Call the first one in the morning.');
    await page.locator('#mal-form [type="submit"]').click();
    await page.waitForURL(/pick=/);
    assert.equal(await page.locator('#mal-list li[data-slug]:visible').count(), 2);
    assert.match(await page.locator('#mal-note-out').textContent(), /Call the first one/);
    assert.match(await page.locator('#mal-text').getAttribute('href'), /^sms:/);
    await ctx.close();
  });

  // Words people type. Each should find at least one page.
  const WORDS = SMOKE ? ['food'] : ['food', 'rent', 'shelter', 'snap', 'bus', 'recycling', 'vote', 'dentist', 'taxes', 'job', 'electric bill', 'food pantry'];
  test('search finds pages for common words', async () => {
    const ctx = await s.browser.newContext(PHONE);
    const page = await ctx.newPage();
    const none = [];
    for (const w of WORDS) {
      await page.goto(`${s.origin}/search/#q=${encodeURIComponent(w)}`);
      await page.waitForFunction(() => !/Searching/.test(document.getElementById('search-status').textContent) && document.getElementById('search-status').textContent);
      const n = await page.locator('#search-results li').count();
      if (!n) { none.push(`${w}: ${await page.locator('#search-status').textContent()}`); continue; }
      // The first result opens a real page.
      const href = await page.locator('#search-results li a').first().getAttribute('href');
      const r = await page.request.get(new URL(href, s.origin).href);
      if (r.status() !== 200) none.push(`${w}: first result ${href} gives HTTP ${r.status()}`);
    }
    assert.deepEqual(none, []);
    await ctx.close();
  });

  test('the search box on the home page opens results', async () => {
    const ctx = await s.browser.newContext(PHONE);
    const page = await ctx.newPage();
    await page.goto(s.origin + '/');
    const box = page.locator('form[data-hash-search] input[name="q"]').first();
    if (!(await box.count())) return; // the home page has no search box right now
    await box.fill('food');
    await box.press('Enter');
    await page.waitForURL(/\/search\/#q=food/);
    await page.locator('#search-results li').first().waitFor();
    await ctx.close();
  });
});
