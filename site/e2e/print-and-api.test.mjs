// Print views and the public API files.
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { setup, pages, html, SITE, SMOKE } from './lib.mjs';

// [page, what must print]. Make a list prints only the list, once places are picked.
const PRINTED = [
  ['/file-today/', 'main h1'], ['/stay-tonight/', 'main h1'], ['/care/', 'main h1'], ['/utility-bills/', 'main h1'], ['/calendar/', 'main h1'],
  ['/make-a-list/?pick=wv-211&pick=mon-county-4h', '#mal-list li[data-slug="wv-211"]'],
];

describe('print views', () => {
  let s;
  before(async () => { s = await setup(); });
  after(async () => { await s?.close(); });

  test('printing hides the menus and the crisis strip and keeps the page', async () => {
    const ctx = await s.browser.newContext({ viewport: { width: 800, height: 1000 } });
    const page = await ctx.newPage();
    await page.emulateMedia({ media: 'print' });
    const bad = [];
    for (const [p, keep] of SMOKE ? PRINTED.slice(0, 2) : PRINTED) {
      await page.goto(s.origin + p);
      for (const sel of ['header.site', 'nav.main', 'footer.site', '.crisis-strip', '.skip']) {
        if (await page.locator(sel).first().isVisible().catch(() => false)) bad.push(`${p}: ${sel} shows when printed`);
      }
      if (!(await page.locator(keep).first().isVisible())) bad.push(`${p}: ${keep} does not print`);
    }
    assert.deepEqual(bad, []);
    await ctx.close();
  });

  test('pages print to paper without errors', { skip: SMOKE && 'full suite only (E2E_SMOKE=1)' }, async () => {
    const ctx = await s.browser.newContext();
    const page = await ctx.newPage();
    for (const p of ['/file-today/', '/print/cards/']) {
      await page.goto(s.origin + p);
      const pdf = await page.pdf({ format: 'Letter' });
      assert.ok(pdf.length > 5000, `${p} printed to an empty file`);
    }
    await ctx.close();
  });

  test('every printout on /print/ opens', async () => {
    const ctx = await s.browser.newContext();
    const page = await ctx.newPage();
    await page.goto(s.origin + '/print/');
    const links = [...new Set(await page.locator('main a[href^="/print/"]').evaluateAll((as) => as.map((a) => a.getAttribute('href').split('#')[0])))];
    assert.ok(links.length > 5, `only ${links.length} printouts listed`);
    const bad = [];
    for (const href of SMOKE ? links.slice(0, 3) : links) {
      const r = await page.goto(s.origin + href);
      if (r.status() !== 200) { bad.push(`${href}: HTTP ${r.status()}`); continue; }
      if (!(await page.locator('h1').first().textContent()).trim()) bad.push(`${href}: no heading`);
    }
    assert.deepEqual(bad, []);
    await ctx.close();
  });
});

describe('public API files', () => {
  let s;
  before(async () => { s = await setup(); });
  after(async () => { await s?.close(); });
  const local = (u) => u.replace(SITE, s.origin);

  test('index.json lists types whose files load and match their counts', async () => {
    const index = await (await fetch(s.origin + '/api/v1/index.json')).json();
    assert.equal(index.api_version, 'v1');
    assert.ok(index.types.length >= 3);
    const bad = [];
    for (const t of index.types) {
      const r = await fetch(local(t.list_url));
      if (r.status !== 200) { bad.push(`${t.name}: list HTTP ${r.status}`); continue; }
      const body = await r.json();
      const items = Array.isArray(body) ? body : body.items ?? body.data ?? body[t.name] ?? [];
      if (items.length !== t.count) bad.push(`${t.name}: index says ${t.count}, list has ${items.length}`);
      // The first and last records load from the record address.
      for (const it of [items[0], items.at(-1)].filter(Boolean)) {
        const slug = it.slug ?? it.id;
        const rr = await fetch(local(t.record_url_template.replace(/\{(slug|id)\}/, slug)));
        if (rr.status !== 200) bad.push(`${t.name}/${slug}: record HTTP ${rr.status}`);
        else await rr.json().catch(() => bad.push(`${t.name}/${slug}: record is not JSON`));
      }
    }
    for (const u of [index.openapi_url, index.feed_health_url]) {
      const r = await fetch(local(u));
      if (r.status !== 200) bad.push(`${u}: HTTP ${r.status}`);
    }
    assert.deepEqual(bad, []);
  });

  test('every JSON file under /api/ parses', { skip: SMOKE && 'full suite only (E2E_SMOKE=1)' }, async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const root = new URL('../dist/api/', import.meta.url).pathname;
    const bad = [];
    let n = 0;
    (function walk(d) {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, e.name);
        if (e.isDirectory()) walk(p);
        else if (e.name.endsWith('.json')) { n++; try { JSON.parse(fs.readFileSync(p, 'utf8')); } catch { bad.push(path.relative(root, p)); } }
      }
    })(root);
    assert.ok(n > 100, `only ${n} API files`);
    assert.deepEqual(bad, []);
  });

  test('the data page links to the API', () => {
    assert.ok(pages().includes('/data/'));
    assert.match(html('/data/'), /href="[^"]*\/api\/v1\/index\.json"/);
  });
});
