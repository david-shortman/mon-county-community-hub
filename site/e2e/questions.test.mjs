// Question paths: every short question flow (Question.astro) and every door
// page reaches an answer with scripts off, the way an old phone or a locked-
// down library computer sees it. With scripts on, door picks show steps.
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { pages, html, setup, PHONE, SMOKE } from './lib.mjs';

const ALL = pages();
const QUESTIONS = ALL.filter((p) => html(p).includes('class="question"'));
const DOORS = ALL.filter((p) => html(p).includes('id="door-pick"'));

describe('question paths', () => {
  let s;
  before(async () => { s = await setup(); });
  after(async () => { await s?.close(); });

  test('the site has question flows and door pages to test', () => {
    assert.ok(QUESTIONS.includes('/help/what-help/'), 'What help might I get? should be a question flow');
    assert.ok(DOORS.length >= 5, `expected the door pages, found ${DOORS.join(', ')}`);
  });

  test('every choice in every question flow leads to an answer, with scripts off', async () => {
    const ctx = await s.browser.newContext({ ...PHONE, javaScriptEnabled: false });
    const page = await ctx.newPage();
    const starts = SMOKE ? ['/help/what-help/'] : QUESTIONS.filter((p) => !QUESTIONS.some((q) => q !== p && html(q).includes(`class="choice" href="${p}"`)));
    const seen = new Set();
    const bad = [];
    let answers = 0;
    const queue = starts.map((p) => [p, [p]]);
    while (queue.length) {
      const [url, trail] = queue.shift();
      if (seen.has(url)) continue;
      seen.add(url);
      // A same-page #answer link is not a new load, so start from a blank page each time.
      await page.goto('about:blank');
      const res = await page.goto(s.origin + url);
      const where = trail.join(' > ');
      if (res.status() !== 200) { bad.push(`${where}: HTTP ${res.status()}`); continue; }
      const hash = new URL(url, s.origin).hash.slice(1);
      if (hash) {
        // An answer further down the same page, like Who serves me.
        if (!(await page.locator(`[id="${hash}"]`).isVisible())) bad.push(`${where}: #${hash} is not shown with scripts off`);
        else answers++;
        continue;
      }
      const choices = await page.locator('.question a.choice').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
      if (choices.length) {
        for (const c of choices) queue.push([c, [...trail, c]]);
        continue;
      }
      // An answer page: a heading and at least one way forward that is not Back or Start over.
      const h1 = await page.locator('h1').first().textContent().catch(() => '');
      const next = await page.locator('main a').evaluateAll((as) => as.filter((a) => !/^(Back|Start over)$/i.test(a.textContent.trim())).length);
      if (!h1?.trim() || !next) bad.push(`${where}: answer page has no heading or no links`);
      else answers++;
    }
    assert.deepEqual(bad, []);
    assert.ok(answers > (SMOKE ? 5 : 30), `reached only ${answers} answers`);
    await ctx.close();
  });

  test('door pages list every situation as a plain link with scripts off', async () => {
    const ctx = await s.browser.newContext({ ...PHONE, javaScriptEnabled: false });
    const page = await ctx.newPage();
    const bad = [];
    for (const d of SMOKE ? DOORS.slice(0, 1) : DOORS) {
      await page.goto(s.origin + d);
      if (await page.locator('#door-pick').isVisible()) bad.push(`${d}: the checkbox form shows with scripts off`);
      const links = page.locator('#door-links a');
      if (!(await links.count()) || !(await links.first().isVisible())) { bad.push(`${d}: no situation links with scripts off`); continue; }
      for (const href of await links.evaluateAll((as) => as.map((a) => a.getAttribute('href')))) {
        const r = await page.request.get(s.origin + href);
        if (r.status() !== 200) bad.push(`${d}: situation link ${href} gives HTTP ${r.status()}`);
      }
    }
    assert.deepEqual(bad, []);
    await ctx.close();
  });

  test('picking a situation on a door page shows steps', async () => {
    const ctx = await s.browser.newContext(PHONE);
    const page = await ctx.newPage();
    const bad = [];
    for (const d of SMOKE ? DOORS.slice(0, 1) : DOORS) {
      await page.goto(s.origin + d);
      const boxes = page.locator('#door-pick input[name="pick"]');
      const n = await boxes.count();
      if (!n) { bad.push(`${d}: no checkboxes`); continue; }
      // Each pick on its own, through the web address the form makes.
      for (const v of await boxes.evaluateAll((bs) => bs.map((b) => b.value))) {
        await page.goto(`${s.origin}${d}?pick=${encodeURIComponent(v)}`);
        const steps = await page.locator('#door-plan .step:visible').count();
        if (!(await page.locator('#door-plan').isVisible()) || !steps) bad.push(`${d}?pick=${v}: no steps shown`);
        if (await page.locator('#door-nomatch').isVisible()) bad.push(`${d}?pick=${v}: says it found no steps`);
      }
      // And once by ticking a box and pressing the button, like a person would.
      await page.goto(s.origin + d);
      await boxes.first().check();
      await page.locator('#door-pick [type="submit"]').click();
      await page.waitForURL(/\?pick=/);
      if (!(await page.locator('#door-plan .step:visible').count())) bad.push(`${d}: ticking a box and submitting shows no steps`);
    }
    assert.deepEqual(bad, []);
    await ctx.close();
  });

  test('What help might I get? sends each answer to steps that exist', async () => {
    const ctx = await s.browser.newContext(PHONE);
    const page = await ctx.newPage();
    // Walk it like a person: question 1, question 2, then each "Your steps" link.
    await page.goto(s.origin + '/help/what-help/');
    await page.locator('.question a.choice').first().click();
    await page.locator('.question a.choice').first().click();
    assert.equal(await page.locator('h1').textContent(), 'Places that may help');
    const leaves = ALL.filter((p) => /^\/help\/what-help\/[^/]+\/[^/]+\/$/.test(p));
    assert.ok(leaves.length >= 10, `expected the answer pages, found ${leaves.length}`);
    const picks = new Set();
    for (const leaf of SMOKE ? leaves.slice(0, 2) : leaves) {
      for (const m of html(leaf).matchAll(/class="topic-list wh-list">([\s\S]*?)<\/ol>/g)) {
        for (const a of m[1].matchAll(/href="([^"]+\?pick=[^"]+)"/g)) picks.add(a[1].replace(/&amp;/g, '&'));
      }
    }
    const bad = [];
    for (const href of picks) {
      await page.goto(s.origin + href);
      if (!(await page.locator('#door-plan .step:visible').count())) bad.push(`${href}: no steps`);
    }
    assert.deepEqual(bad, []);
    await ctx.close();
  });
});
