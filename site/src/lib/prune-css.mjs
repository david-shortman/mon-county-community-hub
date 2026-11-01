// Drop inlined CSS rules that cannot match anything on the page (wave 8,
// slow phones). Astro scopes a component's styles with a
// data-astro-cid-<id> attribute, then often inlines the styles of dozens of
// components into every page. A rule whose every selector needs an element
// with a cid the page does not have can never apply, so it is removed.
// Everything else (global rules, @font-face, @keyframes, rules we cannot
// read) is kept as is. Elements a script adds later keep their cid only if
// they are copies of markup already on the page, as all of ours are.

// Split CSS text into top-level blocks: { head, body } for "x { ... }", or
// { text } for anything else. Handles nested braces, strings and comments.
function blocks(css) {
  const out = [];
  let i = 0;
  while (i < css.length) {
    let head = '';
    while (i < css.length && css[i] !== '{' && css[i] !== '}') {
      if (css[i] === ';' && head.trim().startsWith('@')) { out.push({ text: head + ';' }); head = ''; i++; continue; }
      if (css[i] === '"' || css[i] === "'") {
        const q = css[i]; let j = i + 1;
        while (j < css.length && css[j] !== q) j += css[j] === '\\' ? 2 : 1;
        head += css.slice(i, j + 1); i = j + 1; continue;
      }
      if (css.startsWith('/*', i)) { const j = css.indexOf('*/', i + 2); i = j < 0 ? css.length : j + 2; continue; }
      head += css[i++];
    }
    if (i >= css.length || css[i] === '}') { if (head.trim()) out.push({ text: head }); i++; continue; }
    // css[i] === '{': find the matching close.
    let depth = 0; const start = i;
    for (; i < css.length; i++) {
      const c = css[i];
      if (c === '"' || c === "'") { let j = i + 1; while (j < css.length && css[j] !== c) j += css[j] === '\\' ? 2 : 1; i = j; continue; }
      if (c === '{') depth++;
      else if (c === '}' && --depth === 0) break;
    }
    out.push({ head: head.trim(), body: css.slice(start + 1, i) });
    i++;
  }
  return out;
}

// Split a selector list on top-level commas.
function selectors(head) {
  const parts = []; let depth = 0; let cur = '';
  for (const c of head) {
    if (c === '(' || c === '[') depth++;
    if (c === ')' || c === ']') depth--;
    if (c === ',' && depth === 0) { parts.push(cur); cur = ''; } else cur += c;
  }
  parts.push(cur);
  return parts;
}

const CID = /data-astro-cid-([a-z0-9]+)/g;
// A cid inside :not(...) does not need the element, so it is ignored.
const dead = (sel, has) => {
  const ids = [...sel.replace(/:not\([^()]*\)/g, '').matchAll(CID)].map((m) => m[1]);
  return ids.length > 0 && ids.some((id) => !has.has(id));
};

export function pruneCss(css, has) {
  let out = '';
  for (const b of blocks(css)) {
    if (b.text !== undefined) { out += b.text; continue; }
    if (/^@(media|supports|layer|container)\b/.test(b.head)) {
      const inner = pruneCss(b.body, has);
      if (inner.trim()) out += `${b.head}{${inner}}`;
      continue;
    }
    if (b.head.startsWith('@')) { out += `${b.head}{${b.body}}`; continue; }
    if (selectors(b.head).every((s) => dead(s, has))) continue;
    out += `${b.head}{${b.body}}`;
  }
  return out;
}

// The cids used by elements in the page, outside <style>.
export function pageCids(html) {
  const markup = html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, '');
  return new Set([...markup.matchAll(/\sdata-astro-cid-([a-z0-9]+)/g)].map((m) => m[1]));
}

export function pruneHtml(html) {
  const has = pageCids(html);
  return html.replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/g, (all, open, css, close) => {
    const kept = pruneCss(css, has);
    return kept.trim() ? open + kept + close : '';
  });
}

// Astro integration: prune every built page once the build is done.
export function pruneCssIntegration() {
  return {
    name: 'prune-unused-css',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const fs = await import('node:fs');
        const path = await import('node:path');
        const { fileURLToPath } = await import('node:url');
        const root = fileURLToPath(dir);
        const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
          const p = path.join(d, e.name);
          return e.isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : [];
        });
        let before = 0; let after = 0;
        for (const f of walk(root)) {
          const html = fs.readFileSync(f, 'utf8');
          const out = pruneHtml(html);
          before += html.length; after += out.length;
          if (out !== html) fs.writeFileSync(f, out);
        }
        console.log(`prune-unused-css: removed ${((before - after) / 1024 / 1024).toFixed(1)} MB of unused inline CSS`);
      },
    },
  };
}
