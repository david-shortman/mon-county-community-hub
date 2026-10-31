// Source benchmark: the automatic measures (#183, #184).
//
// Usage:
//   node content/findability/benchmark/measure.js              measure every source in tasks.yaml
//   node content/findability/benchmark/measure.js --hub-only   measure only our own pages (the weekly run)
//   node content/findability/benchmark/measure.js q02 q26      measure only these needs
//
// Prints one JSON line per source. Copy the numbers into the run file
// (content/findability/benchmark/YYYY-MM-DD.yaml) under each source's `auto:`.
//
// Web pages load at 390px wide on a throttled mobile connection (see NETWORK).
// For each page it reports: bytes transferred, seconds until the answer text is
// on screen, how many screens down the answer sits, words before the answer,
// sideways scroll, and the reading grade of the answer text.
// For a PDF it reports: file size, page count, the page the answer is on, words
// before the answer, the Last-Modified date and the SHA-256, so we notice a new
// edition. PDFs need `pdftotext` and `pdfinfo` (poppler-utils). The PDF is read
// in memory and a temp folder only; it is never saved in the repo.
//
// Some sites block automated browsers. Then the line says "blocked": check the
// page by hand and write "blocked, checked by hand" in the run file. Never guess.
// Needs Playwright with Chromium and the yaml package (npm ci in site/).
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const { createRequire } = require('module');
const { chromium } = require('playwright');
const YAML = createRequire(path.join(__dirname, '../../../site/package.json'))('yaml');

// Lighthouse's "slow 4G" mobile profile: 150 ms round trip, 1.6 Mbps down, 750 Kbps up.
const NETWORK = { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 };
const VIEWPORT = { width: 390, height: 844 };
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

const words = (s) => (s.match(/\S+/g) || []).length;
const norm = (s) => s.replace(/\s+/g, ' ').toLowerCase();

// Flesch-Kincaid grade level. Rough, but the same every run.
function syllables(w) {
  w = w.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  const m = w.match(/[aeiouy]{1,2}/g);
  return m ? m.length : 1;
}
function grade(text) {
  const sentences = Math.max(1, (text.match(/[.!?](\s|$)/g) || []).length);
  const ws = text.match(/[A-Za-z][A-Za-z'-]*/g) || [];
  if (ws.length < 20) return null;
  // Lists of names and numbers have no sentences; a grade means nothing there.
  if (ws.length / sentences > 40) return null;
  const syl = ws.reduce((n, w) => n + syllables(w), 0);
  return Math.round((0.39 * (ws.length / sentences) + 11.8 * (syl / ws.length) - 15.59) * 10) / 10;
}
// The answer text: from the marker on, about 120 words.
function answerText(full, at) {
  return full.slice(at).split(/\s+/).slice(0, 120).join(' ');
}

async function measureWeb(browser, src) {
  const ctx = await browser.newContext({ viewport: VIEWPORT, isMobile: true, hasTouch: true, userAgent: UA });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Network.emulateNetworkConditions', NETWORK);
  let bytes = 0;
  cdp.on('Network.loadingFinished', (e) => { bytes += e.encodedDataLength || 0; });
  const out = { url: src.url };
  try {
    const t0 = Date.now();
    const resp = await page.goto(src.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    out.status = resp && resp.status();
    const marker = src.answer_text;
    let seen = null;
    if (marker) {
      try {
        await page.getByText(marker, { exact: false }).first().waitFor({ state: 'visible', timeout: 30000 });
        seen = (Date.now() - t0) / 1000;
      } catch { /* not found; reported below */ }
    }
    await page.waitForLoadState('load', { timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(1000);
    const r = await page.evaluate((m) => {
      const text = document.body.innerText || '';
      const at = m ? text.replace(/\s+/g, ' ').toLowerCase().indexOf(m.replace(/\s+/g, ' ').toLowerCase()) : -1;
      let top = null;
      if (m) {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const needle = m.toLowerCase();
        while (walker.nextNode()) {
          const n = walker.currentNode;
          if (n.textContent.toLowerCase().includes(needle.slice(0, 40)) && n.parentElement && n.parentElement.offsetParent !== null) {
            top = n.parentElement.getBoundingClientRect().top; // from where the page opens (an #anchor jumps)
            break;
          }
        }
      }
      return { title: document.title, text, at, top, scrollWidth: document.documentElement.scrollWidth };
    }, marker || null);
    const flat = r.text.replace(/\s+/g, ' ');
    const blockedHint = /access denied|attention required|are you a robot|captcha|request blocked|forbidden/i.test(r.title + ' ' + flat.slice(0, 500));
    Object.assign(out, {
      title: r.title,
      kb: Math.round(bytes / 102.4) / 10,
      words_on_page: words(flat),
      horizontal_scroll: r.scrollWidth > VIEWPORT.width + 10,
    });
    if (marker) {
      out.answer_found = r.at >= 0;
      if (r.at >= 0) {
        out.words_before_answer = words(flat.slice(0, r.at));
        out.seconds_to_answer = seen;
        out.screens_down = r.top == null ? null : Math.floor(r.top / VIEWPORT.height);
        out.reading_grade = grade(answerText(flat, r.at));
      }
    }
    if (blockedHint || (out.status && out.status >= 400)) out.blocked = true;
  } catch (e) {
    out.error = String(e).slice(0, 200);
    out.blocked = true;
  }
  await ctx.close();
  return out;
}

async function measurePdf(src) {
  const out = { url: src.url, pdf: true };
  try {
    const res = await fetch(src.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    out.status = res.status;
    if (!res.ok) { out.blocked = true; return out; }
    const buf = Buffer.from(await res.arrayBuffer());
    out.kb = Math.round(buf.length / 102.4) / 10;
    out.last_modified = res.headers.get('last-modified');
    out.sha256 = crypto.createHash('sha256').update(buf).digest('hex');
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bench-'));
    const file = path.join(dir, 'source.pdf');
    fs.writeFileSync(file, buf);
    try {
      const info = execFileSync('pdfinfo', [file]).toString();
      out.pages = Number((info.match(/^Pages:\s+(\d+)/m) || [])[1]) || null;
      const pages = [];
      for (let i = 1; i <= (out.pages || 0); i++) pages.push(execFileSync('pdftotext', ['-f', String(i), '-l', String(i), file, '-']).toString());
      out.words_on_page = pages.reduce((n, p) => n + words(p), 0);
      if (src.answer_text) {
        const m = norm(src.answer_text);
        let before = 0;
        out.answer_found = false;
        for (let i = 0; i < pages.length; i++) {
          const flat = norm(pages[i]);
          const at = flat.indexOf(m);
          if (at >= 0) {
            out.answer_found = true;
            out.answer_page = i + 1;
            out.words_before_answer = before + words(flat.slice(0, at));
            out.reading_grade = grade(answerText(pages[i].replace(/\s+/g, ' '), pages[i].replace(/\s+/g, ' ').toLowerCase().indexOf(m)));
            break;
          }
          before += words(flat);
        }
      }
    } catch (e) {
      out.note = 'pdftotext or pdfinfo missing; size, date and hash only';
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
    out.horizontal_scroll = true; // a letter-size PDF page does not reflow at 390px
  } catch (e) {
    out.error = String(e).slice(0, 200);
    out.blocked = true;
  }
  return out;
}

(async () => {
  const args = process.argv.slice(2);
  const hubOnly = args.includes('--hub-only');
  const only = args.filter((a) => /^q\d+$/.test(a));
  const tasks = YAML.parse(fs.readFileSync(path.join(__dirname, 'tasks.yaml'), 'utf8'), { merge: true });
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch({ proxy });
  for (const need of tasks.needs) {
    if (only.length && !only.includes(need.id)) continue;
    for (const src of need.sources) {
      if (hubOnly && src.kind !== 'ours') continue;
      if (!src.url || src.covered === false) {
        console.log(JSON.stringify({ need: need.id, source: src.name, kind: src.kind, covered: false }));
        continue;
      }
      if (src.blocked) {
        console.log(JSON.stringify({ need: need.id, source: src.name, kind: src.kind, url: src.url, blocked: true, note: 'blocks automated browsers: check by hand' }));
        continue;
      }
      const r = src.url.toLowerCase().split('?')[0].endsWith('.pdf') ? await measurePdf(src) : await measureWeb(browser, src);
      console.log(JSON.stringify({ need: need.id, source: src.name, kind: src.kind, ...r }));
    }
  }
  await browser.close();
})();
