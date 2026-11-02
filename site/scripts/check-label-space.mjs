// Checks built pages for a bold label with no space after it, like
// "<strong>Cost:</strong>Free." (#1072). Astro drops the space in
// `<strong>Cost:</strong> {value}`, so write `<strong>Cost:</strong>{' '}{value}`.
// Runs after `npm run build`.
import fs from 'node:fs';
import path from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const html = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
  const p = path.join(dir, d.name);
  return d.isDirectory() ? html(p) : p.endsWith('.html') ? [p] : [];
});
// A label ending in ":" or "." right before a letter or digit.
const BAD = /[:.]<\/(strong|b)>(?=[A-Za-z0-9])/g;
const errors = [];
for (const file of html(dist)) {
  const where = path.relative(dist, file);
  const text = fs.readFileSync(file, 'utf8');
  const hits = [...text.matchAll(BAD)];
  if (!hits.length) continue;
  const at = hits[0].index;
  errors.push(`${where}: no space after a bold label (${hits.length}x), near "${text.slice(Math.max(0, at - 30), at + 30).replace(/\s+/g, ' ')}"`);
}
if (errors.length) {
  console.error(`check-label-space: ${errors.length} page(s) have a bold label with no space after it. Write <strong>Label:</strong>{' '}{value}.`);
  for (const e of errors.slice(0, 40)) console.error('  ' + e);
  process.exit(1);
}
console.log('check-label-space: ok');
