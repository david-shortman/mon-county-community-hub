// Topics explorer (#2025) on /topics/: interest chips (#2027) with scripts on
// and off, picks kept on the phone, and Back landing where you were (#1369).
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { setup, html, PHONE } from './lib.mjs';

describe('topics explorer', () => {
  let s;
  before(async () => { s = await setup(); });
  after(async () => { await s?.close(); });

  test('with no script, chips are links to built pick pages', async () => {
    const page = html('/topics/');
    const links = [...page.matchAll(/<a class="ec-chip"[^>]*href="([^"]+)"/g)].map((m) => m[1]);
    assert.ok(links.length >= 10, 'chips are in the built page');
    for (const href of links.slice(0, 3)) assert.match(html(href), /<ul class="topic-list">\s*<li>/, `${href} lists pages`);
    // Help now stays first: its section comes before the chips.
    assert.ok(page.indexOf('id="help-now"') > -1 && page.indexOf('id="help-now"') < page.indexOf('id="curious"'), 'Help now comes before the chips');
  });

  test('scripts off: chips work as links, no bar', async () => {
    const ctx = await s.browser.newContext({ ...PHONE, javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(s.origin + '/topics/');
    assert.equal(await page.locator('#curious button[data-chip]').count(), 0);
    assert.equal(await page.locator('#explore-bar').isVisible(), false);
    await page.locator('#curious a.ec-chip', { hasText: 'Get outside' }).click();
    assert.match(new URL(page.url()).pathname, /\/topics\/pick\/outside\/$/);
    assert.ok(await page.locator('main a[href$="/parks/"]').count() > 0);
    await ctx.close();
  });

  test('picking chips lists pages, keeps them, and Clear empties them', async () => {
    const ctx = await s.browser.newContext(PHONE);
    const page = await ctx.newPage();
    await page.goto(s.origin + '/topics/');
    const chip = (name) => page.locator('#curious button.ec-chip', { hasText: name });
    await chip('Get outside').click();
    await chip('Meet people').click();
    assert.equal(await chip('Get outside').getAttribute('aria-pressed'), 'true');
    const routes = await page.locator('#picked-list a').evaluateAll((as) => as.map((a) => new URL(a.href).pathname));
    for (const r of ['/find-your-people/', '/parks/']) assert.ok(routes.indexOf(r) > -1 && routes.indexOf(r) < 3, `${r} near the top: ${routes.join(' ')}`);
    assert.ok(routes.includes('/volunteer/'));
    assert.match(await page.locator('#picked-count').textContent(), /\d+ pages picked for you/);
    assert.ok(await page.locator('#explore-bar').isVisible(), 'the bar shows');

    await page.reload();
    assert.equal(await chip('Meet people').getAttribute('aria-pressed'), 'true', 'picks are kept on this phone');

    // Pressed by keyboard: a pointer click would first scroll the sticky bar under the site header.
    await page.locator('#explore-bar [data-act="clear"]').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#picked').isVisible(), false);
    assert.equal(await page.evaluate(() => localStorage.getItem('em-explore-picks')), null, 'Clear empties storage');
    await ctx.close();
  });

  test('the bar never sits over Help now', async () => {
    const ctx = await s.browser.newContext(PHONE);
    await ctx.addInitScript(() => localStorage.setItem('em-explore-picks', '["outside"]'));
    const page = await ctx.newPage();
    await page.goto(s.origin + '/topics/');
    const bar = await page.locator('#explore-bar').boundingBox();
    const help = await page.locator('#help-now').boundingBox();
    if (bar && help) assert.ok(bar.y >= help.y + help.height - 1, 'bar is below Help now');
    await ctx.close();
  });

  test('back from a topic lands where you were, with picks saved (#1369)', async () => {
    const ctx = await s.browser.newContext(PHONE);
    await ctx.addInitScript(() => localStorage.setItem('em-explore-picks', '["outside","people"]'));
    const page = await ctx.newPage();
    await page.goto(s.origin + '/topics/');
    const link = page.locator('#a-to-z + ul a').nth(20);
    await link.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const y = await page.evaluate(() => scrollY);
    assert.ok(y > 500, 'scrolled down');
    await link.click();
    await page.waitForLoadState('load');
    await page.goBack();
    await page.waitForLoadState('load');
    await page.waitForTimeout(400);
    const back = await page.evaluate(() => scrollY);
    assert.ok(Math.abs(back - y) < 60, `back at ${back}, was ${y}`);
    await ctx.close();
  });

  test('Flip through: open, Save, Skip, Back, keys, Escape and focus return (#2028)', async () => {
    const ctx = await s.browser.newContext(PHONE);
    await ctx.addInitScript(() => { localStorage.setItem('em-explore-picks', '["outside"]'); localStorage.removeItem('em-explore-saved'); });
    const page = await ctx.newPage();
    await page.goto(s.origin + '/topics/');
    const opener = page.locator('#curious [data-flip]');
    assert.match(await opener.textContent(), /Flip through \d+ pages picked for you/);
    await opener.click();
    const dlg = page.locator('#flip-deck');
    // With motion on, a card flies off for about 190 ms before the next one shows.
    const at = (n) => page.waitForFunction((n) => document.getElementById('fd-count')?.textContent?.startsWith(`${n} of`), n, { timeout: 3000 });
    assert.ok(await dlg.isVisible(), 'the deck opens');
    assert.equal(await page.evaluate(() => document.activeElement?.id), 'fd-title', 'focus on the card heading');
    assert.match(await page.locator('#fd-count').textContent(), /^1 of \d+$/);
    const first = await page.locator('#fd-title').textContent();
    await dlg.locator('[data-fd="save"]').click();
    await at(2);
    await dlg.locator('[data-fd="skip"]').click();
    await at(3);
    await dlg.locator('[data-fd="back"]').click();
    await at(2); // Back undoes the Skip
    await page.keyboard.press('ArrowRight');
    await at(3); // Right arrow saves
    await page.keyboard.press('Backspace');
    await at(2);
    assert.match(await page.locator('#fd-live').textContent(), /^Card 2 of \d+: /);
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('em-explore-saved') || '[]'));
    assert.equal(saved.length, 1, 'one page saved after the undo');
    assert.ok(first && saved[0], 'the first card was saved');
    await page.keyboard.press('Escape');
    assert.equal(await dlg.isVisible(), false, 'Escape closes');
    assert.equal(await page.evaluate(() => document.activeElement?.hasAttribute('data-flip')), true, 'focus goes back to the button');
    await ctx.close();
  });

  test('Flip through with no picks uses the starter list, and the last card sums up', async () => {
    const ctx = await s.browser.newContext({ ...PHONE, reducedMotion: 'reduce' });
    await ctx.addInitScript(() => { localStorage.removeItem('em-explore-picks'); localStorage.removeItem('em-explore-saved'); });
    const page = await ctx.newPage();
    await page.goto(s.origin + '/topics/');
    const opener = page.locator('#curious [data-flip]');
    assert.match(await opener.textContent(), /pages to start/);
    await opener.click();
    const total = Number((await page.locator('#fd-count').textContent()).split(' of ')[1]);
    for (let i = 0; i < total; i++) await page.keyboard.press(i < 2 ? 'ArrowRight' : 'ArrowLeft');
    assert.match(await page.locator('#fd-end-h').textContent(), new RegExp(`You saved 2 of ${total}`));
    await ctx.close();
  });

  test('with scripts off, there is no Flip through button', async () => {
    const ctx = await s.browser.newContext({ ...PHONE, javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(s.origin + '/topics/');
    assert.equal(await page.locator('[data-flip]:visible').count(), 0);
    assert.equal(await page.locator('#flip-deck').isVisible(), false);
    await ctx.close();
  });

  test('Flip through: a long drag right saves, a short drag springs back', async () => {
    const ctx = await s.browser.newContext({ viewport: { width: 390, height: 844 } });
    await ctx.addInitScript(() => { localStorage.setItem('em-explore-picks', '["grow"]'); localStorage.removeItem('em-explore-saved'); });
    const page = await ctx.newPage();
    await page.goto(s.origin + '/topics/');
    await page.locator('#curious [data-flip]').click();
    const box = await page.locator('#fd-card').boundingBox();
    const drag = async (dx) => {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      for (let i = 1; i <= 5; i++) await page.mouse.move(box.x + box.width / 2 + (dx * i) / 5, box.y + box.height / 2);
      await page.mouse.up();
    };
    await drag(30);
    await page.waitForTimeout(300);
    assert.match(await page.locator('#fd-count').textContent(), /^1 of/, 'a short drag does nothing');
    await drag(150);
    await page.waitForFunction(() => document.getElementById('fd-count')?.textContent?.startsWith('2 of'), null, { timeout: 3000 });
    assert.equal((await page.evaluate(() => JSON.parse(localStorage.getItem('em-explore-saved') || '[]'))).length, 1);
    await ctx.close();
  });
});
