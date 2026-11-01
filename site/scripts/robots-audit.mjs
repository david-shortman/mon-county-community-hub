// Lists every address the site reads on its own and whether that site's
// robots.txt lets us read it (#529). Prints a Markdown table for
// docs/operations/automated-reads.md. Reads each robots.txt once, nothing else.
//
// Usage (from site/): node scripts/robots-audit.mjs
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { CONTENT_DIR } from '../src/lib/content.mjs';
import { robotsCheck } from '../src/lib/robots.mjs';
import { USER_AGENT } from '../src/lib/ingest.mjs';
import { ADAPTERS } from '../src/lib/feeds/index.mjs';
import { SOURCES as MEETINGS } from '../src/lib/meetings/index.mjs';
import { SOURCES as INDICATORS } from '../src/lib/live-indicators/index.mjs';
import { WEATHER_API } from '../src/lib/weather.mjs';

const today = new Date().toISOString().slice(0, 10);
const reads = [];
const add = (reader, url, note = '') => reads.push({ reader, url, note });

for (const a of ADAPTERS) add(`Calendar feed: ${a.id}`, a.feedUrl ? a.feedUrl(today) : a.feed_url, a.off ? `turned off ${a.off.since}` : '');
for (const m of MEETINGS) add(`Meetings: ${m.id}`, m.page_url);
for (const i of INDICATORS) add(`Live number: ${i.id}`, i.feed_url);
add('Weather in the header', WEATHER_API);
// scripts/check-311.mjs (runs on GitHub Actions, #881).
add('311 totals', 'https://seeclickfix.com/api/v2/places?address=Morgantown%2C+WV');
add('311 totals', 'https://seeclickfix.com/api/v2/issues?place_url=morgantown');
// scripts/update-chr-indicators.mjs: the data files named in content/indicators/.
const chr = new Set();
for (const f of fs.readdirSync(path.join(CONTENT_DIR, 'indicators'))) {
  const doc = YAML.parse(fs.readFileSync(path.join(CONTENT_DIR, 'indicators', f), 'utf8'));
  if (doc?.chr) for (const s of (doc.sources ?? []).slice(0, 2)) chr.add(s.url);
}
for (const u of chr) add('County Health Rankings numbers', u);
// Page watchers ride on the daily Source check (scripts/check-sources.mjs).
for (const f of fs.readdirSync(path.join(CONTENT_DIR, 'watch')).filter((x) => x.endsWith('.yaml'))) {
  const doc = YAML.parse(fs.readFileSync(path.join(CONTENT_DIR, 'watch', f), 'utf8'));
  for (const e of doc.pages ?? doc.items ?? doc.entries ?? []) {
    if (!e?.url || !['page', 'pdf', undefined].includes(e.kind)) continue;
    add(`Page watch: ${doc.group ?? f.replace('.yaml', '')}`, e.url);
  }
}

const rows = [];
for (const r of reads) {
  const c = await robotsCheck(r.url, { userAgent: USER_AGENT });
  const u = new URL(r.url);
  const rule = c.reason?.match(/\(Disallow: [^)]*\)/)?.[0];
  const result = c.allowed ? 'allowed' : `**not allowed** ${rule ?? `(${c.reason})`}`;
  const shown = u.pathname.length > 60 ? `${u.pathname.slice(0, 40)}...` : u.pathname;
  rows.push(`| ${r.reader} | \`${u.host}${shown}\` | ${result}${r.note ? `, ${r.note}` : ''} |`);
}
console.log(`Checked ${today}.\n\n| Reader | Address | robots.txt |\n|---|---|---|\n${rows.join('\n')}`);
