// Slow-phone load speed with Lighthouse (#1053). Free, no account, no API key.
// Runs Lighthouse's mobile test (a mid-range phone on a slow 4G connection,
// simulated: 150 ms round trip, about 1.6 Mbps, CPU 4 times slower) on five key
// pages of the live site, one run each, and saves the numbers as JSON for the
// weekly scorecard (scripts/scorecard.mjs).
//
// Usage (from site/): node scripts/lighthouse.mjs [--json out.json] [--base URL]
// Needs Chrome or Chromium: set CHROME_PATH if it is not found by itself.
// GitHub's ubuntu runners have Chrome installed.
//
// Warn only for now: it exits 0 even when a page is slower than the goal, and
// exits 1 only when Lighthouse could not run at all. Goal from #1053: the main
// content shows (LCP) in under 2.5 seconds on every page.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export const LIGHTHOUSE = 'lighthouse@13.5.0';
export const PAGES = [
  ['Home', '/'],
  ['Stay tonight', '/stay-tonight/'],
  ['Utility bills', '/utility-bills/'],
  ['Get through this month', '/money/'],
  ['Food help', '/help/food/'],
];
export const LCP_GOAL_MS = 2500;

const opt = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
};

// The numbers the scorecard needs from one Lighthouse report.
export function pick(lhr) {
  const a = lhr.audits;
  const ms = (id) => (a[id]?.numericValue == null ? null : Math.round(a[id].numericValue));
  return {
    lcp_ms: ms('largest-contentful-paint'),
    fcp_ms: ms('first-contentful-paint'),
    tbt_ms: ms('total-blocking-time'),
    cls: a['cumulative-layout-shift']?.numericValue == null ? null : Number(a['cumulative-layout-shift'].numericValue.toFixed(3)),
    score: lhr.categories?.performance?.score == null ? null : Math.round(lhr.categories.performance.score * 100),
    error: lhr.runtimeError?.message ?? null,
  };
}

async function main() {
  const base = opt('base', 'https://everythingmorgantown.org').replace(/\/$/, '');
  const out = opt('json');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lh-'));
  const pages = [];
  let settings = null;
  let version = null;
  for (const [name, route] of PAGES) {
    const file = path.join(tmp, 'report.json');
    let row = { name, route };
    try {
      execFileSync('npx', ['-y', LIGHTHOUSE, base + route, '--quiet', '--output=json', `--output-path=${file}`,
        '--only-categories=performance', '--chrome-flags=--headless=new --no-sandbox'], { stdio: ['ignore', 'ignore', 'pipe'], timeout: 180_000 });
      const lhr = JSON.parse(fs.readFileSync(file, 'utf8'));
      settings ??= { form_factor: lhr.configSettings.formFactor, throttling: lhr.configSettings.throttling, method: lhr.configSettings.throttlingMethod };
      version ??= lhr.lighthouseVersion;
      row = { ...row, ...pick(lhr) };
    } catch (e) {
      row.error = String(e.stderr || e.message).trim().split('\n').slice(-1)[0].slice(0, 200);
    }
    pages.push(row);
    const s = (n) => (n == null ? '?' : (n / 1000).toFixed(1));
    console.log(`${row.lcp_ms != null && row.lcp_ms <= LCP_GOAL_MS ? 'ok  ' : 'warn'}  ${name.padEnd(24)} main content ${s(row.lcp_ms)} s, blocking ${row.tbt_ms ?? '?'} ms, layout shift ${row.cls ?? '?'}${row.error ? `  (${row.error})` : ''}`);
  }
  const report = {
    about: 'Lighthouse mobile test (simulated slow 4G, mid-range phone) on five key pages of the live site. From site/scripts/lighthouse.mjs (#1053).',
    run: new Date().toISOString(),
    base,
    lighthouse: version,
    settings,
    goal: { lcp_ms: LCP_GOAL_MS },
    pages,
  };
  if (out) fs.writeFileSync(out, JSON.stringify(report, null, 1) + '\n');
  const ran = pages.filter((p) => p.lcp_ms != null);
  if (!ran.length) { console.error('lighthouse: no page could be measured'); process.exit(1); }
  const slow = ran.filter((p) => p.lcp_ms > LCP_GOAL_MS);
  console.log(`\n${ran.length - slow.length} of ${pages.length} pages show their main content in under ${LCP_GOAL_MS / 1000} s on slow 4G.${slow.length ? ' (warn only)' : ''}`);
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
