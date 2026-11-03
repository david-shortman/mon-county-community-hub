// Access and privacy promises (#1423). The Privacy, About and How this site
// works pages, and docs/accessibility.md, make promises that the code keeps.
// These tests fail if a later change breaks one. docs/operations/promise-checks.md
// lists every promise and the check that holds it.
// The first group reads the built HTML only (fast, in the smoke subset).
import fs from 'node:fs';
import path from 'node:path';
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import YAML from 'yaml';
import { pages, html, setup, PHONE, DIST, fullOnly } from './lib.mjs';

const ALL = pages().filter((p) => p !== '/404.html');
const CONTENT = new URL('../../content/', import.meta.url).pathname;

// Files from another site that a page may load. Each needs a reason.
const OFF_SITE_OK = [
  // The visit counter (#1352, #1384). Privacy page: "A simple visit counter".
  /^https:\/\/gc\.zgo\.at\/count\.js$/,
];
// Hosts the browser may contact while a page loads (the visit counter sends its count here).
const HOSTS_OK = ['gc.zgo.at', 'everythingmorgantown.goatcounter.com'];

const attr = (tag, name) => tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i'))?.slice(2).find((v) => v !== undefined);
const offSite = (u) => /^(https?:)?\/\//i.test(u ?? '') && !/^(https?:)?\/\/(www\.)?everythingmorgantown\.org\//i.test(u);

// Every file a page asks the browser to load: scripts, styles, icons, images, frames, CSS url().
function loads(h) {
  const out = [];
  for (const [tag] of h.matchAll(/<(script|img|source|iframe|embed|video|audio|track|object|input)\b[^>]*>/gi)) {
    for (const a of ['src', 'data', 'poster']) { const v = attr(tag, a); if (v) out.push(v); }
    const set = attr(tag, 'srcset');
    if (set) out.push(...set.split(',').map((s) => s.trim().split(/\s+/)[0]));
  }
  for (const [tag] of h.matchAll(/<link\b[^>]*>/gi)) {
    const rel = (attr(tag, 'rel') ?? '').toLowerCase();
    if (/\b(stylesheet|preload|modulepreload|prefetch|preconnect|dns-prefetch|icon|apple-touch-icon|manifest)\b/.test(rel)) out.push(attr(tag, 'href'));
  }
  for (const [, u] of h.matchAll(/url\(\s*['"]?([^'")]+)/gi)) out.push(u);
  for (const [, u] of h.matchAll(/@import\s+(?:url\()?['"]?([^'");\s]+)/gi)) out.push(u);
  return out.filter(Boolean);
}

// Records that must never show Text this or Share (#555).
function privateTrace() {
  const out = [];
  for (const dir of ['resources', 'calendar', 'places']) {
    const d = path.join(CONTENT, dir);
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d, { recursive: true })) {
      if (!/\.ya?ml$/.test(f)) continue;
      const doc = YAML.parse(fs.readFileSync(path.join(d, f), 'utf8'));
      for (const r of Array.isArray(doc) ? doc : [doc]) if (r?.private_trace === true && r.slug) out.push(r);
    }
  }
  return out;
}

describe('privacy promises in the built pages', () => {
  test('Quick exit tells the next site nothing: rel="noreferrer" on every Quick exit link', () => {
    const bad = [];
    for (const p of ALL) {
      for (const [tag] of html(p).matchAll(/<a\b[^>]*id="quick-exit"[^>]*>/g)) {
        if (!/\brel="[^"]*\bnoreferrer\b/.test(tag)) bad.push(p);
      }
    }
    assert.deepEqual(bad, [], 'Quick exit links without rel="noreferrer"');
  });

  test('no page loads a font, script, style or image from another site, except the visit counter', () => {
    const bad = [];
    for (const p of ALL) {
      for (const u of loads(html(p))) if (offSite(u) && !OFF_SITE_OK.some((re) => re.test(u))) bad.push(`${p}: ${u}`);
    }
    // Style files are built into _astro/; they must not pull fonts or images from elsewhere either.
    const astro = path.join(DIST, '_astro');
    for (const f of fs.existsSync(astro) ? fs.readdirSync(astro) : []) {
      if (!f.endsWith('.css')) continue;
      for (const u of loads(fs.readFileSync(path.join(astro, f), 'utf8'))) if (offSite(u)) bad.push(`_astro/${f}: ${u}`);
    }
    assert.deepEqual([...new Set(bad)].slice(0, 20), [], 'off-site files. Self-host them, or add one to OFF_SITE_OK with a reason and say so on /privacy/');
  });

  test('our own code sets no cookies', () => {
    const bad = [];
    for (const p of ALL) if (/document\.cookie|cookieStore/.test(html(p))) bad.push(p);
    const astro = path.join(DIST, '_astro');
    for (const f of fs.existsSync(astro) ? fs.readdirSync(astro) : []) {
      if (f.endsWith('.js') && /document\.cookie|cookieStore/.test(fs.readFileSync(path.join(astro, f), 'utf8'))) bad.push(`_astro/${f}`);
    }
    for (const f of ['sw.js']) if (fs.existsSync(path.join(DIST, f)) && /document\.cookie|cookieStore/.test(fs.readFileSync(path.join(DIST, f), 'utf8'))) bad.push(f);
    assert.deepEqual(bad, []);
  });

  test('no page asks for a name, email, phone, address or password, and no form sends anything to a server', () => {
    // About: "This site has no sign-up forms and takes no payments. It never asks for your name."
    // The fix form is run by Tally on its own site, and is linked, not built in.
    const bad = [];
    for (const p of ALL) {
      const h = html(p);
      for (const [tag] of h.matchAll(/<form\b[^>]*>/gi)) {
        const method = (attr(tag, 'method') ?? 'get').toLowerCase();
        const action = attr(tag, 'action') ?? '';
        if (method !== 'get' && method !== 'dialog') bad.push(`${p}: a form that sends with ${method}`);
        if (offSite(action)) bad.push(`${p}: a form that sends to ${action}`);
      }
      for (const [tag] of h.matchAll(/<input\b[^>]*>/gi)) {
        const type = (attr(tag, 'type') ?? 'text').toLowerCase();
        const words = `${attr(tag, 'name') ?? ''} ${attr(tag, 'autocomplete') ?? ''}`.toLowerCase();
        if (['email', 'tel', 'password'].includes(type) || /\b(name|given-name|family-name|email|phone|tel|street-address|address-line1|postal-code|cc-number)\b/.test(words)) {
          bad.push(`${p}: ${tag.slice(0, 80)}`);
        }
      }
    }
    assert.deepEqual(bad, []);
  });

  test('domestic and sexual violence listings never show Text this, Print this or Share, and their pages have Quick exit', () => {
    const records = privateTrace();
    assert.ok(records.length >= 3, 'expected the private_trace listings in content/');
    const bad = [];
    const seen = new Set();
    for (const p of ALL) {
      const h = html(p);
      for (const r of records) {
        const at = h.indexOf(`id="${r.slug}"`);
        if (at >= 0) {
          seen.add(r.slug);
          const card = h.slice(at, h.indexOf('</article>', at));
          if (card.includes('class="pass-it-on"')) bad.push(`${p}#${r.slug}: has the Pass it on row`);
          // Privacy page: "Their pages have Quick exit instead" (#1422).
          if (!h.includes('id="quick-exit"')) bad.push(`${p}#${r.slug}: the page has no Quick exit`);
        }
        // Wherever it appears, no text message or share button carries its title.
        const enc = encodeURIComponent(r.title);
        if (h.includes(`body=${enc}`)) bad.push(`${p}: a Text this link for ${r.slug}`);
        if (h.includes(`data-title="${r.title.replace(/&/g, '&amp;')}"`)) bad.push(`${p}: a Share button for ${r.slug}`);
      }
    }
    assert.deepEqual(bad, []);
    const missing = records.filter((r) => !seen.has(r.slug)).map((r) => r.slug);
    assert.deepEqual(missing, [], 'private_trace listings that no page shows (the check above would pass with nothing to check)');
  });

  test('"Skip to main content" is the first thing in every page, and #main exists', () => {
    // docs/accessibility.md: "Skip to main content" is the first Tab stop on every page.
    const bad = ALL.filter((p) => p.startsWith('/embed/') ? false : !/<body[^>]*>\s*<a class="skip" href="#main">Skip to main content<\/a>/.test(html(p)) || !/<main[^>]*\bid="main"/.test(html(p)));
    assert.deepEqual(bad, []);
  });

  test('the saved offline list is the same for everyone, names the pages About lists, and expires on the promised clock', () => {
    // About: "your browser keeps copies of the Help now page, the pages for a hard moment
    // (Tonight, food help, utility bills, after a storm, mental health, drugs and alcohol,
    // protective orders), the home page, the main topic pages and Dates ... after 3 days
    // for pages that change daily, 30 days for the hard moment pages, and 90 days for the rest."
    const sw = fs.readFileSync(path.join(DIST, 'sw.js'), 'utf8');
    const list = (name) => JSON.parse(sw.match(new RegExp(`const ${name} = (\\[.*?\\]);`))[1]);
    const hard = list('HARD');
    const first = list('SAVE_FIRST');
    for (const p of ['/stay-tonight/', '/tonight/', '/help/food/', '/utility-bills/', '/after-a-storm/', '/mental-health/', '/drugs-and-alcohol/', '/protective-orders/']) {
      assert.ok(hard.includes(p), `the hard-moment list should save ${p}`);
    }
    assert.ok(first.includes('/'), 'the second list should save the home page');
    assert.ok(first.includes('/calendar/'), 'the second list should save Dates');
    // The same for everyone: fixed lists of site paths, built into the file, with no per-person parts.
    for (const u of [...hard, ...first]) assert.match(u, /^\/[a-z0-9/-]*$/, `saved list entry ${u}`);
    assert.doesNotMatch(sw, /localStorage|indexedDB|clients\.matchAll|postMessage\(|navigator\.userAgent|Math\.random/, 'the worker should not build a list per person');
    assert.match(sw, /if \(DAILY\.includes\(p\)\) return 3;/);
    assert.match(sw, /if \(HARD\.includes\(p\)\) return 30;/);
    assert.match(sw, /return 90;\n\}/);
    // Saved copies are not sent anywhere: the worker only handles this site's own requests.
    assert.match(sw, /if \(url\.origin !== self\.location\.origin\) return;/);
  });
});

describe('access promises in a browser', { skip: fullOnly }, () => {
  let s;
  before(async () => { s = await setup(); });
  after(async () => { await s?.close(); });

  // Pages that use the most moving parts: the scroll story, the calendar, a door page, Help now.
  const SAMPLE = ['/', '/how-it-works/', '/stay-tonight/', '/calendar/', '/help/food/', '/recycling/', '/how-we-are-doing/'].filter((p) => ALL.includes(p));

  async function context(opts = {}) {
    const ctx = await s.browser.newContext({ ...PHONE, ...opts });
    const away = [];
    // Never really contact the counter from a test; just note what was asked for.
    await ctx.route((u) => !u.href.startsWith(s.origin), (route) => { away.push(new URL(route.request().url()).host); return route.abort(); });
    return { ctx, away };
  }

  test('pages contact no other site except the visit counter, and set no cookies', async () => {
    const { ctx, away } = await context();
    const page = await ctx.newPage();
    for (const p of SAMPLE) await page.goto(s.origin + p, { waitUntil: 'load' });
    await page.waitForTimeout(500);
    const other = [...new Set(away)].filter((h) => !HOSTS_OK.includes(h));
    assert.deepEqual(other, [], 'sites contacted while loading pages');
    assert.deepEqual(await ctx.cookies(), []);
    await ctx.close();
  });

  test('with reduced motion on, nothing animates and nothing scrolls smoothly', async () => {
    const { ctx } = await context({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    const bad = [];
    for (const p of SAMPLE) {
      await page.goto(s.origin + p, { waitUntil: 'load' });
      await page.mouse.wheel(0, 1500);
      await page.waitForTimeout(200);
      const r = await page.evaluate(() => ({
        moving: document.getAnimations().filter((a) => a.playState === 'running').length,
        smooth: getComputedStyle(document.documentElement).scrollBehavior === 'smooth',
      }));
      if (r.moving) bad.push(`${p}: ${r.moving} animation(s) running`);
      if (r.smooth) bad.push(`${p}: smooth scrolling`);
    }
    assert.deepEqual(bad, []);
    await ctx.close();
  });

  test('the scroll story reads as a plain numbered list with scripts off', async () => {
    const { ctx } = await context({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(s.origin + '/how-it-works/');
    const r = await page.evaluate(() => {
      const sec = document.getElementById('flow-explainer');
      const steps = [...sec.querySelectorAll('ol.flow > li')];
      return {
        live: sec.classList.contains('is-live'),
        stage: getComputedStyle(sec.querySelector('.stage')).display,
        steps: steps.length,
        headings: steps.filter((li) => li.querySelector('h3')?.offsetHeight > 0).length,
        drawings: steps.filter((li) => li.querySelector('.snap')?.offsetHeight > 0).length,
      };
    });
    assert.equal(r.live, false);
    assert.equal(r.stage, 'none', 'the moving drawing should be hidden without script');
    assert.equal(r.steps, 7);
    assert.equal(r.headings, 7, 'every step heading shows');
    assert.equal(r.drawings, 7, 'every step shows its own still drawing');
    await ctx.close();
  });

  test('"Turn off motion" stops the scroll story', async () => {
    const { ctx } = await context();
    const page = await ctx.newPage();
    await page.goto(s.origin + '/how-it-works/');
    const btn = page.locator('#flow-explainer .motion-toggle');
    assert.equal(await page.locator('#flow-explainer.is-live').count(), 1, 'the story moves before the switch');
    await btn.click();
    assert.equal(await btn.innerText(), 'Turn on motion');
    const r = await page.evaluate(() => {
      const sec = document.getElementById('flow-explainer');
      return {
        live: sec.classList.contains('is-live'),
        off: document.documentElement.hasAttribute('data-motion-off'),
        stage: getComputedStyle(sec.querySelector('.stage')).display,
      };
    });
    assert.deepEqual(r, { live: false, off: true, stage: 'none' });
    // Remembered on this phone only: a reload keeps it off.
    await page.reload();
    assert.equal(await page.locator('#flow-explainer.is-live').count(), 0);
    await ctx.close();
  });
});
