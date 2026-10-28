// Design review helper. See docs/rubrics/README.md.
// Usage: npm i axe-core (in any folder), then
//   node site-review.js <folder-with-node_modules> <output-folder> [base-url]
// Writes report.json (axe results, headings, landmarks, small targets, tab order, page text)
// and full-page screenshots for each page at 390px and 1280px, light and dark.
const { chromium } = require('playwright');
const fs = require('fs');
const axeSrc = fs.readFileSync(process.argv[2] + '/node_modules/axe-core/axe.min.js', 'utf8');
const out = process.argv[3];
const B = process.argv[4] || 'https://david-shortman.github.io/mon-county-community-hub';
const pages = { home: '/', calendar: '/calendar/', about: '/about/' };
(async () => {
  const browser = await chromium.launch();
  const report = {};
  for (const [name, path] of Object.entries(pages)) {
    for (const w of [390, 1280]) for (const scheme of ['light', 'dark']) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 844 }, colorScheme: scheme });
      const p = await ctx.newPage();
      const resp = await p.goto(B + path, { waitUntil: 'networkidle' });
      await p.addScriptTag({ content: axeSrc });
      const axe = await p.evaluate(async () => { const r = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice'] } }); return r.violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, n: v.nodes.length, nodes: v.nodes.slice(0,4).map(n => ({t: n.target.join(' '), s: n.failureSummary})) })); });
      const info = await p.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const overflow = document.documentElement.scrollWidth > vw;
        const links = [...document.querySelectorAll('a,button,input,select')].map(a => { const r = a.getBoundingClientRect(); return { text: (a.innerText||a.getAttribute('aria-label')||'').trim().slice(0,50), w: Math.round(r.width), h: Math.round(r.height), href: a.getAttribute('href') }; });
        const small = links.filter(l => l.w > 0 && (l.h < 24 || l.w < 24));
        const heads = [...document.querySelectorAll('h1,h2,h3,h4')].map(h => h.tagName + ': ' + h.innerText.trim().slice(0,70));
        const landmarks = [...document.querySelectorAll('header,nav,main,footer,[role]')].map(e => e.tagName + (e.getAttribute('role')? '['+e.getAttribute('role')+']':'') + (e.getAttribute('aria-label')? '('+e.getAttribute('aria-label')+')':''));
        const skip = !!document.querySelector('a[href^="#"]');
        const cs = getComputedStyle(document.body);
        return { title: document.title, lang: document.documentElement.lang, overflow, docH: document.documentElement.scrollHeight, small, nLinks: links.length, heads, landmarks, skip, bg: cs.backgroundColor, fg: cs.color, fontSize: cs.fontSize, text: document.body.innerText };
      });
      const key = `${name}-${w}-${scheme}`;
      await p.screenshot({ path: `${out}/${key}.png`, fullPage: true });
      // keyboard: tab order
      const tabs = [];
      if (w === 1280 && scheme === 'light') {
        await p.reload();
        for (let i = 0; i < 12; i++) { await p.keyboard.press('Tab'); tabs.push(await p.evaluate(() => { const a = document.activeElement; const o = getComputedStyle(a); return (a.innerText||a.tagName).trim().slice(0,40) + ' | outline=' + o.outlineStyle + ' ' + o.outlineWidth; })); }
      }
      report[key] = { status: resp.status(), axe, ...info, tabs, text: (w===390 && scheme==='light') ? info.text : undefined };
      await ctx.close();
    }
  }
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  // zoom 200% / reflow at 320
  await p.setViewportSize({ width: 320, height: 640 }); await p.goto(B + '/calendar/');
  report.reflow320 = await p.evaluate(() => document.documentElement.scrollWidth);
  // 404 page
  const r404 = await p.goto(B + '/nope/'); report.notfound = { status: r404.status(), text: (await p.evaluate(() => document.body.innerText)).slice(0, 300) };
  await browser.close();
  fs.writeFileSync(out + '/report.json', JSON.stringify(report, null, 1));
})();
