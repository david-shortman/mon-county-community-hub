// Keep phone numbers in running text on one line (QA sweep 2, #529).
// #1552 kept tel: and sms: links whole, but numbers written in a sentence
// ("call 1-877-322-8228") still broke at a hyphen on phones: 192 splits on
// 96 pages at 390px on November 3, 2026. After the build, this wraps each
// number in the text of a page in <span class="nowrap">, the class Base and
// Embed already define. Tags, attributes, scripts, styles and numbers already
// inside a tel: or sms: link are left alone. Inside a button, .btn .nowrap
// wraps normally, so button labels still fit.

// 1-800-642-8589, 304-285-3175, (304) 598-5181, 304.293.4897, letter numbers
// like 304-291-RIDE, and the 211 text line 898-211.
const PHONE = /(?<![\w-])(?:1[- ])?(?:\(\d{3}\) ?|\d{3}[-.])\d{3}[-.](?:\d{4}|[A-Z]{4})(?![\w-])|(?<![\w-])898-211(?![\w-])/g;
const SKIP = new Set(['script', 'style', 'textarea', 'title', 'head', 'svg', 'pre', 'code', 'option']);

export function keepPhones(html) {
  if (!/\.nowrap\s*\{/.test(html)) return html; // no class to lean on
  const parts = html.split(/(<!--[\s\S]*?-->|<[^>]+>)/);
  const skip = [];
  let inLink = 0;
  let prevTag = '';
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (i % 2 === 1) {
      if (p.startsWith('<!--')) continue;
      const m = p.match(/^<(\/?)([a-zA-Z][\w-]*)/);
      if (!m) continue;
      const close = m[1] === '/';
      const name = m[2].toLowerCase();
      if (SKIP.has(name) && !p.endsWith('/>')) {
        if (close) { if (skip.length && skip[skip.length - 1] === name) skip.pop(); } else skip.push(name);
      }
      if (name === 'a') {
        if (close) inLink = Math.max(0, inLink - 1);
        else if (/\shref="(tel|sms):/i.test(p)) inLink++;
      }
      prevTag = p;
      continue;
    }
    if (!p || skip.length || inLink) continue;
    if (/^<span class="nowrap"/.test(prevTag)) continue; // already kept whole
    parts[i] = p.replace(PHONE, (n) => `<span class="nowrap">${n}</span>`);
  }
  return parts.join('');
}

// Astro integration: runs on every built page once the build is done.
export function keepPhonesIntegration() {
  return {
    name: 'keep-phones-whole',
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
        let changed = 0;
        for (const f of walk(root)) {
          const html = fs.readFileSync(f, 'utf8');
          const out = keepPhones(html);
          if (out !== html) { fs.writeFileSync(f, out); changed++; }
        }
        console.log(`keep-phones-whole: kept phone numbers on one line on ${changed} pages`);
      },
    },
  };
}
