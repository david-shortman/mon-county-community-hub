// The source order report (#1092, docs/playbook/source-order.md). Lists the
// listings that rest only on news stories or directories (tiers 3 and 4 in
// content/source-tiers.yaml), top-tier ones first. Warns, never fails.
// Usage (from site/): node scripts/check-source-tiers.mjs [--all] [--md]
//   --all  also lists listings with at least one news or directory source
//   --md   prints a Markdown table, for an issue or a doc
import { loadDir, loadCalendar, isTopTier } from '../src/lib/content.mjs';
import { loadSourceTiers, lowerTierOnly, tierOf } from '../src/lib/source-tiers.mjs';

const args = new Set(process.argv.slice(2));
const tiers = loadSourceTiers();
const records = [
  ...['orgs', 'resources', 'secondhand', 'boards', 'places'].flatMap((d) => loadDir(d, { withHidden: true })),
  ...loadCalendar({ withHidden: true }),
];

const rows = [];
for (const r of records) {
  const urls = (r.sources ?? []).map((s) => s?.url).filter(Boolean);
  const found = urls.map((u) => tierOf(u, tiers, r._file));
  const only = lowerTierOnly(r, tiers);
  if (!only && !(args.has('--all') && found.some(Boolean))) continue;
  rows.push({ file: r._file, only: !!only, top: isTopTier(r), tiers: [...new Set(found.filter(Boolean))], count: urls.length });
}
rows.sort((a, b) => (b.only - a.only) || (b.top - a.top) || a.file.localeCompare(b.file));

const onlyN = rows.filter((r) => r.only).length;
if (args.has('--md')) {
  console.log('| Listing | Top tier | Rests only on | Lower-tier sources |');
  console.log('|---|---|---|---|');
  for (const r of rows) console.log(`| \`content/${r.file}\` | ${r.top ? 'yes' : 'no'} | ${r.only ? 'yes' : 'no'} | ${r.tiers.join(', ')} |`);
} else {
  for (const r of rows) console.log(`${r.only ? 'only' : 'some'}  ${r.top ? 'top-tier ' : '         '} content/${r.file} (${r.tiers.join(', ')})`);
}
console.log(`\n${onlyN} of ${records.length} listings rest only on news or directory sources.`);
