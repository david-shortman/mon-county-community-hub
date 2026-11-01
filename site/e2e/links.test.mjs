// Link and anchor check: every link and asset on every built page points to a
// file that exists in dist/, and every #anchor names an id on the page it
// points to. Reads the HTML only, so it needs no browser and runs in the smoke
// subset too. Links to everythingmorgantown.org count as internal.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { DIST, SITE, pages, html } from './lib.mjs';

const ENT = { '&amp;': '&', '&quot;': '"', '&#39;': "'", '&lt;': '<', '&gt;': '>' };
const unescape = (s) => s.replace(/&(amp|quot|#39|lt|gt);/g, (m) => ENT[m]);
// Fragments that are app state, not anchors: the search page's #q=words, and text fragments.
const notAnchor = (f) => f.includes('=') || f.startsWith(':~:');

// Known breaks with a fix waiting in an open PR. They print a note instead of
// failing. Remove each line once its PR merges.
const WAITING = [
  [/^\/404\.html: <link href="https:\/\/everythingmorgantown\.org\/404\/">/, '#938 (the 404 page gets no canonical link)'],
];

const ids = new Map();
function idsOf(p) {
  if (!ids.has(p)) {
    const h = html(p);
    ids.set(p, new Set([...h.matchAll(/\s(?:id|name)="([^"]+)"/g)].map((m) => unescape(m[1]))));
  }
  return ids.get(p);
}

// The page path a URL path serves, or null when nothing in dist/ answers it.
function target(urlPath) {
  let p;
  try { p = decodeURIComponent(urlPath); } catch { return null; }
  const file = path.join(DIST, p);
  if (!file.startsWith(DIST)) return null;
  if (p.endsWith('/')) return fs.existsSync(path.join(file, 'index.html')) ? p : null;
  if (fs.existsSync(file) && fs.statSync(file).isFile()) return p;
  if (fs.existsSync(path.join(file, 'index.html'))) return p + '/';
  return null;
}

test('every internal link, asset and #anchor resolves', () => {
  const broken = [];
  const all = pages();
  for (const from of all) {
    const h = html(from)
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '') // links built in scripts are not real until they run
      .replace(/<!--[\s\S]*?-->/g, '');
    const base = new URL(from, SITE);
    for (const m of h.matchAll(/<(a|link|img|script|source|iframe|form|use)\b[^>]*?\s(href|src|action|srcset)="([^"]*)"/g)) {
      const [, tag, attr, raw] = m;
      let refs = [unescape(raw).trim()];
      if (attr === 'srcset') refs = refs[0].split(',').map((s) => s.trim().split(/\s+/)[0]);
      for (const ref of refs) {
        if (!ref || /^(mailto|tel|sms|data|javascript|webcal):/i.test(ref)) continue;
        let u;
        try { u = new URL(ref, base); } catch { broken.push(`${from}: bad URL ${ref}`); continue; }
        if (u.origin !== SITE) continue;
        // <link rel="canonical"> and friends may point at the live site; they still must exist.
        const to = target(u.pathname);
        if (!to) { broken.push(`${from}: <${tag} ${attr}="${ref}"> points to a page that does not exist`); continue; }
        const frag = decodeURIComponent(u.hash.slice(1));
        if (!frag || notAnchor(frag) || !to.endsWith('/') && !to.endsWith('.html')) continue;
        if (!idsOf(to).has(frag)) broken.push(`${from}: link to ${to}#${frag}, but that page has no id="${frag}"`);
      }
    }
  }
  const failing = broken.filter((b) => {
    const wait = WAITING.find(([re]) => re.test(b));
    if (wait) console.log(`note: ${b} (fix waiting: ${wait[1]})`);
    return !wait;
  });
  assert.ok(all.length > 100, `expected the full site in dist/, found ${all.length} pages`);
  assert.deepEqual(failing, [], `${failing.length} broken links or anchors:\n  ${failing.slice(0, 80).join('\n  ')}`);
});
