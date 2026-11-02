// Tonight (/tonight/): the warming shelter shows "open" only when the check is
// from today in Morgantown, on the phone's own clock. Anything older reads
// "Not confirmed for today". See src/pages/tonight.astro and src/lib/tonight.mjs.
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { setup, html, PHONE } from './lib.mjs';

const real = html('/tonight/');
const box = real.match(/<div id="tonight" class="note" data-checked="([^"]+)" data-status="([^"]+)">/);

// The built page with the status box swapped for a test status. The markup
// mirrors tonight.astro: a "fresh" line and a "stale" line, both in the HTML,
// and the page's own script picks one with the phone's clock.
function withStatus(status, checked) {
  const fresh = status === 'open' ? '<div data-when="fresh"><p><strong>Open tonight</strong></p></div>' : '<p data-when="fresh"><strong>Not open tonight</strong></p>';
  const stale = '<p data-when="stale" hidden><strong>Not confirmed for today.</strong></p>';
  return real.replace(box[0], `<div id="tonight" class="note" data-checked="${checked}" data-status="${status}">${fresh}${stale}`);
}

describe('tonight', () => {
  let s;
  before(async () => { s = await setup(); });
  after(async () => { await s?.close(); });

  async function at(time, body) {
    const ctx = await s.browser.newContext(PHONE);
    if (body) await ctx.route('**/tonight/', (r) => r.fulfill({ contentType: 'text/html', body }));
    const page = await ctx.newPage();
    await page.clock.setFixedTime(new Date(time));
    await page.goto(s.origin + '/tonight/');
    const shown = async (w) => page.locator(`#tonight [data-when="${w}"]`).first().isVisible().catch(() => false);
    const out = { fresh: await shown('fresh'), stale: await shown('stale'), text: await page.locator('#tonight').innerText() };
    await ctx.close();
    return out;
  }

  test('the built page never says open without a check from today', async () => {
    assert.ok(box, 'the status box is on /tonight/');
    const [, checked, status] = box;
    const dayAfter = new Date(`${checked}T17:00:00Z`);
    dayAfter.setUTCDate(dayAfter.getUTCDate() + 1);
    const later = await at(dayAfter);
    assert.doesNotMatch(later.text, /Open tonight/, 'a check from yesterday must not say open');
    if (status === 'not-announced') assert.match(later.text, /Not announced yet/);
    if (status === 'open' || status === 'closed-tonight') {
      assert.ok(later.stale && !later.fresh, 'an old check reads "Not confirmed for today"');
    }
  });

  const CASES = [
    // [what, phone clock (UTC), fresh shown?]
    ['the same afternoon', '2026-12-01T20:00:00Z', true],
    ['the next morning', '2026-12-02T13:00:00Z', false],
    ['10:30 p.m. the same night, already the next day in UTC', '2026-12-02T03:30:00Z', true],
    ['11:30 p.m. the night before', '2026-12-01T04:30:00Z', false],
  ];
  for (const status of ['open', 'closed-tonight']) {
    for (const [what, time, fresh] of CASES) {
      test(`${status}, checked Dec 1, phone clock ${what}: ${fresh ? 'shows tonight' : 'not confirmed'}`, async () => {
        const r = await at(time, withStatus(status, '2026-12-01'));
        assert.equal(r.fresh, fresh, 'tonight line');
        assert.equal(r.stale, !fresh, '"Not confirmed for today" line');
      });
    }
  }
});
