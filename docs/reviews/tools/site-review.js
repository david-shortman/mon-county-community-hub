// Design review helper. See docs/rubrics/README.md.
// Usage: build the site (cd site && npm run build), npm i axe-core@4.10.2 in any folder, then
//   node site-review.js <site/dist> <folder-with-node_modules> <output-folder>
// Serves the built site on localhost:4398 and, for each page at 320, 390 and 1280px in light
// and dark, writes report.json (axe results, sideways scroll, targets under 44px that are not
// inline links, headings, smallest text in main, hosts contacted, tab order at 390px light)
// and a first-screen screenshot. Edit `pages` below to change the scope.
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const [root, axeDir, out] = process.argv.slice(2);
const axeSrc = fs.readFileSync(axeDir + '/node_modules/axe-core/axe.min.js', 'utf8');
const types = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.json':'application/json','.wasm':'application/wasm','.woff2':'font/woff2'};
const srv = http.createServer((q, s) => { let f = path.join(root, decodeURIComponent(q.url.split('?')[0])); if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); if (!fs.existsSync(f)) { s.writeHead(404); return s.end(); } s.writeHead(200, {'content-type': types[path.extname(f)] || 'application/octet-stream'}); fs.createReadStream(f).pipe(s); }).listen(4398);
const pages = { home: '/', 'stay-tonight': '/stay-tonight/', care: '/care/', money: '/money/', 'living-here': '/living-here/', family: '/family/', topics: '/topics/', search: '/search/', calendar: '/calendar/', about: '/about/', 'utility-bills': '/utility-bills/', snap: '/snap/', recycling: '/recycling/' };
(async () => {
  const browser = await chromium.launch(); const report = {};
  for (const [name, p0] of Object.entries(pages)) for (const w of [320, 390, 1280]) for (const scheme of ['light', 'dark']) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 844 }, colorScheme: scheme }); const p = await ctx.newPage();
    const hosts = new Set(); p.on('request', r => hosts.add(new URL(r.url()).host));
    await p.goto('http://localhost:4398' + p0, { waitUntil: 'networkidle' });
    await p.addScriptTag({ content: axeSrc });
    const axe = await p.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice'] } })).violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, n: v.nodes.length, nodes: v.nodes.slice(0,4).map(n => n.target.join(' ') + ' :: ' + n.failureSummary.slice(0,160)) })));
    const info = await p.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const els = [...document.querySelectorAll('a,button,input,select,summary,label')].filter(a => a.getClientRects().length);
      const inline = a => a.tagName==='A' && a.parentElement && getComputedStyle(a).display==='inline' && a.parentElement.innerText.trim() !== a.innerText.trim();
      const small = els.filter(a => !inline(a)).map(a => { const r = a.getBoundingClientRect(); return { t: (a.innerText||a.getAttribute('aria-label')||a.tagName).trim().slice(0,40), w: Math.round(r.width), h: Math.round(r.height) }; }).filter(l => l.w > 0 && (l.h < 44 || l.w < 24));
      const heads = [...document.querySelectorAll('h1,h2,h3,h4')].map(h => h.tagName + ': ' + h.innerText.trim().slice(0,70));
      const fs = [...document.querySelectorAll('main *')].filter(e => e.childNodes.length && [...e.childNodes].some(n => n.nodeType===3 && n.textContent.trim())).map(e => parseFloat(getComputedStyle(e).fontSize)); const minFont = Math.min(...fs);
      const firstScreen = document.querySelector('main') ? document.querySelector('main').innerText.slice(0, 400) : '';
      return { title: document.title, overflow: document.documentElement.scrollWidth > vw, docH: document.documentElement.scrollHeight, small, heads, minFont, nH1: document.querySelectorAll('h1').length, text: document.querySelector('main')?.innerText || '', firstScreen };
    });
    const key = `${name}-${w}-${scheme}`;
    await p.screenshot({ path: `${out}/${key}.png`, fullPage: false });
    let tabs = [];
    if (w === 390 && scheme === 'light') { await p.reload(); for (let i = 0; i < 10; i++) { await p.keyboard.press('Tab'); tabs.push(await p.evaluate(() => { const a = document.activeElement; const o = getComputedStyle(a); return (a.innerText||a.tagName).trim().replace(/\s+/g,' ').slice(0,40) + ' | ' + o.outlineStyle + ' ' + o.outlineWidth; })); } }
    report[key] = { axe, ...info, hosts: [...hosts], tabs };
    if (w !== 390 || scheme !== 'light') delete report[key].text;
    await ctx.close();
  }
  fs.writeFileSync(out + '/report.json', JSON.stringify(report, null, 1));
  await browser.close(); srv.close();
})();
