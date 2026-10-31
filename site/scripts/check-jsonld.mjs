// Checks the schema.org JSON-LD on built pages (#37). Runs after `npm run build`.
// Every block must parse, every Event needs a name, a startDate and a location
// with an address (Google's required Event fields), and no Event may be made
// for a deadline (an entry with no place).
import fs from 'node:fs';
import path from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const html = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
  const p = path.join(dir, d.name);
  return d.isDirectory() ? html(p) : p.endsWith('.html') ? [p] : [];
});
const errors = [];
let pages = 0, nodes = 0, events = 0;
for (const file of html(dist)) {
  const where = path.relative(dist, file);
  const blocks = [...fs.readFileSync(file, 'utf8').matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
  if (blocks.length > 1) errors.push(`${where}: more than one JSON-LD block`);
  for (const [, text] of blocks) {
    let data;
    try { data = JSON.parse(text); } catch { errors.push(`${where}: JSON-LD does not parse`); continue; }
    pages++;
    if (data['@context'] !== 'https://schema.org') errors.push(`${where}: @context should be https://schema.org`);
    for (const n of data['@graph'] ?? []) {
      nodes++;
      if (!n['@type'] || !n.name) errors.push(`${where}: a node is missing @type or name`);
      if (n['@type'] === 'Event') {
        events++;
        if (!/^\d{4}-\d{2}-\d{2}/.test(n.startDate ?? '')) errors.push(`${where}: Event "${n.name}" needs a startDate`);
        if (!n.location?.address) errors.push(`${where}: Event "${n.name}" needs a location with an address`);
      }
      if (JSON.stringify(n).includes('—')) errors.push(`${where}: JSON-LD contains an em dash`);
    }
  }
}
if (errors.length) {
  console.error(`JSON-LD check failed (${errors.length}):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`JSON-LD check: ${pages} pages, ${nodes} items, ${events} in-person events.`);
