import fs from 'node:fs'; import path from 'node:path';
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.html') ? [path.join(d, e.name)] : []);
const bad = new Set(); const metas = new Set();
for (const f of walk('dist')) {
  const h = fs.readFileSync(f, 'utf8');
  for (const m of h.matchAll(/<a[^>]*class="btn[^"]*"[^>]*>([\s\S]*?)<\/a>/g)) { const t = m[1].replace(/<span class="sr-only">[\s\S]*?<\/span>/g,'').replace(/<[^>]+>/g, '').trim(); if (/\b[a-z0-9-]+\.(org|com|gov|net|edu|us)\b/i.test(t)) bad.add(f + ': ' + t); }
  for (const m of h.matchAll(/<p class="meta"[^>]*>([\s\S]*?)<\/p>/g)) metas.add(m[1].replace(/<span class="sr-only">[\s\S]*?<\/span>/g,'').replace(/<[^>]+>/g, '').replace(/\s+/g,' ').trim());
}
console.log('BAD BUTTONS', [...bad]); console.log([...metas].slice(0, 400).join('\n'));
