// Simulated resident walkthroughs at phone width (#529, sprint wave 6).
// Made-up tasks, not real residents: never report these as resident feedback.
//
// Usage, from the repo root, with the built site served on port 4321:
//   (cd site/dist && python3 -m http.server 4321 &)
//   node content/findability/walkthroughs/walk.js content/findability/walkthroughs/tasks.yaml [--after] [w01 w02 ...]
// Writes raw measures as JSON to $OUT (default walkthroughs-raw.json in the
// current folder). score.py turns them into scores.
//
// For each task: taps the path from the home page at 390 by 844 (on a door
// page it ticks the choice and presses "Show my steps" when the link sits
// behind it), records how far down each link sits, then reads the answer page:
// where the answer starts, checked dates, outside source links, phone links,
// and a rough reading grade. Then it runs both searches on /search/ and
// records where the answer page ranks. --after uses after_path when a task has one.
// Needs Playwright (pre-installed in cloud sessions) and npm ci in site/.
const fs = require('fs');
const path = require('path');
const { createRequire } = require('module');
const { chromium } = require('playwright');
const YAML = createRequire(path.join(__dirname, '../../../site/package.json'))('yaml');
const BASE = process.env.BASE || 'http://localhost:4321';
const H = 844;
const args = process.argv.slice(3);
const AFTER = args.includes('--after');
const only = args.filter((a) => a !== '--after');
const tasks = YAML.parse(fs.readFileSync(process.argv[2], 'utf8')).map((t) => (AFTER && t.after_path ? { ...t, targets: [{ ...t.targets[0], ...t.after_path }] } : t));
const MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December';
const TODAY = new Date(process.env.TODAY || new Date().toISOString().slice(0, 10)); // set TODAY=YYYY-MM-DD to match a run date
const JARGON = ['LIEAP','WV PATH','DoHS','DHHR','FRN','waiver','ALICE','HSDS','eligibility','MCO','prior authorization','SSI','SSDI','Title','ADRC','NEMT','PATH','WIC','CHIP','ACA','VITA','paratransit','deviation','respite','homestead'];
function syl(w){w=w.toLowerCase().replace(/[^a-z]/g,'');if(!w)return 0;if(w.length<=3)return 1;w=w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/,'').replace(/^y/,'');const m=w.match(/[aeiouy]{1,2}/g);return m?m.length:1;}
function grade(t){const s=Math.max(1,(t.match(/[.!?](\s|$)/g)||[]).length);const ws=t.match(/[A-Za-z][A-Za-z'-]*/g)||[];if(ws.length<20||ws.length/s>40)return null;const y=ws.reduce((n,w)=>n+syl(w),0);return Math.round((0.39*(ws.length/s)+11.8*(y/ws.length)-15.59)*10)/10;}
const pathOf = (u) => { try { const x = new URL(u, BASE); return x.pathname; } catch { return u; } };

async function visibleLink(page, href) {
  return page.evaluate((href) => {
    const as = [...document.querySelectorAll('a')].filter(a => a.getAttribute('href') === href);
    for (const a of as) {
      const r = a.getBoundingClientRect();
      const st = getComputedStyle(a);
      if (r.width > 0 && r.height > 0 && st.visibility !== 'hidden') {
        return { text: a.innerText.replace(/\s+/g, ' ').trim().slice(0, 90), screen: Math.floor((r.top + scrollY) / innerHeight), inMain: !!a.closest('main') };
      }
    }
    return as.length ? { hidden: true, count: as.length } : null;
  }, href);
}

async function analyze(page, url, marker) {
  const resp = await page.goto(BASE + url, { waitUntil: 'load' });
  await page.waitForTimeout(150);
  const info = await page.evaluate(({ marker, MONTHS }) => {
    const main = document.querySelector('main') || document.body;
    const text = main.innerText;
    const h1 = (document.querySelector('h1') || {}).innerText || '';
    let at = -1, y = null, hashScreen = null;
    if (location.hash) { const el = document.getElementById(location.hash.slice(1)); if (el) { const r = el.getBoundingClientRect(); hashScreen = Math.floor((r.top + scrollY) / innerHeight); } }
    const re = new RegExp(marker, 'i');
    const m = text.match(re); if (m) at = m.index;
    // screen of first visible element containing the marker
    const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
    let n; while ((n = walker.nextNode())) { if (re.test(n.textContent)) { const el = n.parentElement; const r = el.getBoundingClientRect(); if (r.height > 0) { y = Math.floor((r.top + scrollY) / innerHeight); break; } } }
    const dates = [...text.matchAll(new RegExp('(?:[Cc]hecked|verified|[Uu]pdated)[^.\\n]{0,20}?((?:' + MONTHS + ') \\d{1,2}, 20\\d\\d)', 'g'))].map(x => x[1]);
    const links = [...main.querySelectorAll('a[href]')].filter(a => a.getBoundingClientRect().height > 0);
    const ext = links.filter(a => /^https?:/.test(a.getAttribute('href')) && !/everythingmorgantown|tally\.so|google\.com\/maps/.test(a.href));
    const tel = links.filter(a => a.getAttribute('href').startsWith('tel:')).map(a => a.getAttribute('href').slice(4));
    const internal = links.filter(a => a.getAttribute('href').startsWith('/')).map(a => a.getAttribute('href'));
    return { h1, words: (text.match(/\S+/g) || []).length, wordsBefore: at < 0 ? null : (text.slice(0, at).match(/\S+/g) || []).length,
      markerScreen: y, hashScreen, dates, ext: ext.length, tel: [...new Set(tel)].slice(0, 8), internal: [...new Set(internal)],
      excerpt: at < 0 ? text.slice(0, 900) : text.slice(Math.max(0, at - 200), at + 900),
      hscroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1 };
  }, { marker, MONTHS });
  info.status = resp && resp.status();
  const ds = info.dates.map(d => new Date(d)).filter(d => !isNaN(d));
  info.oldestCheckedDays = ds.length ? Math.round((TODAY - Math.min(...ds)) / 864e5) : null;
  info.newestCheckedDays = ds.length ? Math.round((TODAY - Math.max(...ds)) / 864e5) : null;
  info.grade = grade(info.excerpt.replace(/\n+/g, '. '));
  info.jargon = JARGON.filter(j => new RegExp('\\b' + j + '\\b').test(info.excerpt));
  delete info.dates;
  return info;
}

async function search(page, q) {
  await page.goto(BASE + '/search/#q=' + encodeURIComponent(q), { waitUntil: 'load' });
  await page.waitForFunction(() => { const s = document.getElementById('search-status').textContent; return s && !/Searching/.test(s); }, null, { timeout: 15000 }).catch(() => {});
  return page.evaluate(() => ({ status: document.getElementById('search-status').textContent,
    results: [...document.querySelectorAll('#search-results li a')].map(a => ({ url: new URL(a.href).pathname, title: a.textContent.trim() })) }));
}

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: H }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const out = [];
  for (const t of tasks) {
    if (only.length && !only.includes(t.id)) continue;
    const r = { id: t.id, task: t.task, targets: [], searches: [] };
    for (const tg of t.targets) {
      const steps = []; let cur = '/'; let broken = null;
      for (const href of tg.path) {
        await page.goto(BASE + cur, { waitUntil: 'load' });
        let l = await visibleLink(page, href);
        let taps = 1;
        // Prefer the door's choice list when the plain link is hidden or far down.
        if (l && (l.hidden || l.screen > 2)) {
          // A door page: tick the matching choice and press "Show my steps", like a resident.
          const idx = await page.evaluate((href) => [...document.querySelectorAll('#door-links a')].findIndex(a => a.getAttribute('href') === href), href);
          if (idx >= 0 && await page.locator('#door-pick').isVisible()) {
            await page.locator('#door-pick input[type=checkbox]').nth(idx).check();
            await page.locator('#door-pick button[type=submit]').click();
            await page.waitForTimeout(300);
            const l2 = await visibleLink(page, href);
            if (l2 && !l2.hidden && (l.hidden || l2.screen + 1 < l.screen)) { l = { ...l2, viaPicker: true }; taps = 3; }
          }
        }
        steps.push({ from: cur, href, taps, ...(l || { missing: true }) });
        if (!l || l.hidden) { broken = broken || `${href} not visible on ${cur}`; }
        cur = href;
      }
      const a = await analyze(page, tg.url, tg.marker);
      r.targets.push({ url: tg.url, clicks: steps.reduce((n, x) => n + (x.taps || 1), 0), steps, broken, answer: a });
    }
    for (const q of t.searches) {
      const s = await search(page, q);
      const tpaths = t.targets.map(x => pathOf(x.url));
      const rank = s.results.findIndex(x => tpaths.includes(x.url));
      r.searches.push({ q, count: s.results.length, rank: rank < 0 ? null : rank + 1, top3: s.results.slice(0, 3).map(x => x.url), status: s.status });
    }
    out.push(r);
    process.stderr.write(t.id + ' ');
  }
  fs.writeFileSync(process.env.OUT || 'walkthroughs-raw.json', JSON.stringify(out, null, 1));
  await b.close();
})();
