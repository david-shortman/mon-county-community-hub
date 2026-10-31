#!/usr/bin/env node
// Chronicle snapshot: screenshots of the live site plus project stats for one day.
//
// Usage (from the repo root or site/):
//   node site/scripts/chronicle.mjs [--date YYYY-MM-DD] [--stats-only] [--no-video]
//                                   [--sessions path/to/sessions.json] [--base URL]
//
// Writes to docs/chronicle/snapshots/<date>/:
//   home-390-light.webp ... about-1280-dark.webp   (3 pages x 2 widths x 2 themes)
//   walkthrough.mp4                                 (phone-size, under 30 seconds)
//   snapshot.json                                   (stats and file list)
//
// Days are UTC days, to match GitHub timestamps.
// Screenshots always show the site as it is right now, so for a past date use
// --stats-only. Stats come from `gh api` (works in GitHub Actions with GH_TOKEN)
// and from local git history (fetch main first for an up-to-date count).
// ffmpeg is used if present to make WebP and MP4; without it you get JPEG and WebM.

import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = 'david-shortman/mon-county-community-hub';
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const today = new Date().toISOString().slice(0, 10);
const date = opt('date', today);
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`Bad --date: ${date}`);
const base = opt('base', 'https://everythingmorgantown.org').replace(/\/$/, '');
const outDir = join(ROOT, 'docs', 'chronicle', 'snapshots', date);
mkdirSync(outDir, { recursive: true });

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'calendar', path: '/calendar/' },
  { name: 'about', path: '/about/' },
];
const WIDTHS = [390, 1280];
const THEMES = ['light', 'dark'];

const has = (cmd) => {
  try { execFileSync('which', [cmd], { stdio: 'ignore' }); return true; } catch { return false; }
};
const hasFfmpeg = has('ffmpeg');

function ffmpeg(input, output, extra) {
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', input, ...extra, output]);
  rmSync(input);
}

// ---------- Screenshots and video ----------

async function capture() {
  // require() honors NODE_PATH, so a globally installed Playwright works too.
  const { chromium } = createRequire(import.meta.url)('playwright');
  const browser = await chromium.launch();
  const shots = [];
  try {
    for (const page of PAGES) {
      for (const width of WIDTHS) {
        for (const theme of THEMES) {
          const ctx = await browser.newContext({
            viewport: { width, height: width < 600 ? 844 : 900 },
            deviceScaleFactor: 1,
            colorScheme: theme,
          });
          const tab = await ctx.newPage();
          await tab.goto(base + page.path, { waitUntil: 'load' });
          const stem = `${page.name}-${width}-${theme}`;
          const png = join(outDir, `${stem}.png`);
          await tab.screenshot({ path: png, fullPage: true });
          let file = `${stem}.png`;
          if (hasFfmpeg) {
            file = `${stem}.webp`;
            ffmpeg(png, join(outDir, file), ['-vf', 'crop=iw:min(ih\\,16000):0:0', '-c:v', 'libwebp', '-quality', '70', '-compression_level', '6']);
          } else {
            file = `${stem}.jpg`;
            await tab.screenshot({ path: join(outDir, file), fullPage: true, type: 'jpeg', quality: 70 });
            rmSync(png);
          }
          shots.push({ page: page.name, url: base + page.path, width, theme, file });
          await ctx.close();
        }
      }
    }

    // Walkthrough: land on home, open Deadlines, scroll, open About.
    const vidDir = join(outDir, '.video');
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      recordVideo: { dir: vidDir, size: { width: 390, height: 844 } },
    });
    const tab = await ctx.newPage();
    await tab.goto(base + '/', { waitUntil: 'load' });
    await tab.waitForTimeout(2500);
    await tab.getByRole('link', { name: 'Deadlines' }).first().click();
    await tab.waitForLoadState('load');
    await tab.waitForTimeout(1500);
    for (let i = 0; i < 8; i++) {
      await tab.mouse.wheel(0, 350);
      await tab.waitForTimeout(600);
    }
    await tab.waitForTimeout(800);
    await tab.getByRole('link', { name: 'About' }).first().click();
    await tab.waitForLoadState('load');
    await tab.waitForTimeout(2500);
    const raw = await tab.video().path();
    await ctx.close();
    let video;
    if (hasFfmpeg) {
      video = 'walkthrough.mp4';
      ffmpeg(raw, join(outDir, video), ['-t', '29', '-vf', 'fps=15', '-c:v', 'libx264', '-crf', '30', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an']);
    } else {
      video = 'walkthrough.webm';
      renameSync(raw, join(outDir, video));
    }
    rmSync(vidDir, { recursive: true, force: true });
    return { shots, video };
  } finally {
    await browser.close();
  }
}

// ---------- Stats ----------

function gh(path) {
  const out = execFileSync('gh', ['api', '--paginate', path], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  // --paginate concatenates JSON arrays as "][": join them.
  return JSON.parse(out.replace(/\]\s*\[/g, ','));
}

function git(...a) {
  return execFileSync('git', a, { cwd: ROOT, encoding: 'utf8' }).trim();
}

function stats() {
  const dayStart = `${date}T00:00:00Z`;
  const dayEnd = `${date}T23:59:59Z`;
  const onDay = (t) => t && t >= dayStart && t <= dayEnd;
  const byEnd = (t) => t && t <= dayEnd;

  const items = gh(`repos/${REPO}/issues?state=all&per_page=100`).filter((x) => byEnd(x.created_at));
  const issues = items.filter((x) => !x.pull_request);
  const prs = items.filter((x) => x.pull_request);
  const merged = (p) => p.pull_request.merged_at;
  const openAtEnd = (x) => !x.closed_at || x.closed_at > dayEnd;

  // Labels are read as they are now; GitHub does not keep label history in this API.
  const openByLabel = {};
  for (const x of items.filter(openAtEnd)) {
    for (const l of x.labels.length ? x.labels : [{ name: '(none)' }]) {
      openByLabel[l.name] = (openByLabel[l.name] || 0) + 1;
    }
  }

  let ref = null;
  if (existsSync(join(ROOT, '.git'))) {
    try { git('rev-parse', '--verify', '-q', 'origin/main'); ref = 'origin/main'; } catch { ref = 'HEAD'; }
  }
  let commits = null;
  let calendarEntries = null;
  if (ref) {
    const log = git('log', ref, '--format=%H %cI %s', `--until=${dayEnd}`);
    const lines = log ? log.split('\n') : [];
    const dayLines = lines.filter((l) => {
      const t = new Date(l.split(' ')[1]).toISOString();
      return onDay(t);
    });
    commits = { onDay: dayLines.length, total: lines.length };
    const head = lines[0]?.split(' ')[0];
    if (head) {
      const tree = git('ls-tree', '--name-only', `${head}:content/calendar`).split('\n').filter((f) => /\.ya?ml$/.test(f));
      calendarEntries = tree.length;
    }
  }

  const list = (xs) => xs.map((x) => ({ number: x.number, title: x.title, url: x.html_url }));
  return {
    day: {
      issuesOpened: issues.filter((x) => onDay(x.created_at)).length,
      issuesClosed: issues.filter((x) => onDay(x.closed_at)).length,
      prsOpened: prs.filter((x) => onDay(x.created_at)).length,
      prsMerged: list(prs.filter((x) => onDay(merged(x)))),
      prsClosedUnmerged: prs.filter((x) => onDay(x.closed_at) && !merged(x)).length,
      commitsToMain: commits?.onDay ?? null,
    },
    totals: {
      issues: issues.length,
      issuesOpen: issues.filter(openAtEnd).length,
      prs: prs.length,
      prsMerged: prs.filter((x) => byEnd(merged(x))).length,
      prsOpen: prs.filter(openAtEnd).length,
      commitsToMain: commits?.total ?? null,
      calendarEntries,
    },
    openByLabel: Object.fromEntries(Object.entries(openByLabel).sort((a, b) => b[1] - a[1])),
    waitingOnDavid: list(items.filter((x) => openAtEnd(x) && x.labels.some((l) => l.name === 'for:david'))),
  };
}

// ---------- Main ----------

const snapshotPath = join(outDir, 'snapshot.json');
const previous = existsSync(snapshotPath) ? JSON.parse(readFileSync(snapshotPath, 'utf8')) : {};

let sessions = previous.sessions ?? [];
const sessionsFile = opt('sessions');
if (sessionsFile) sessions = JSON.parse(readFileSync(resolve(sessionsFile), 'utf8'));

let media = { shots: previous.screenshots ?? [], video: previous.video ?? null };
if (!flag('stats-only')) {
  if (date !== today) {
    console.warn(`Note: screenshots show the site as it is now (${today}), not ${date}. Use --stats-only for past dates.`);
  }
  media = await capture();
  if (flag('no-video') && media.video) {
    rmSync(join(outDir, media.video));
    media.video = null;
  }
}

let statsData = previous.stats ?? null;
try {
  statsData = stats();
} catch (err) {
  console.warn(`Could not collect GitHub stats (${err.message.split('\n')[0]}). Keeping previous stats if any.`);
}

const sizeKB = readdirSync(outDir).reduce((s, f) => s + statSync(join(outDir, f)).size, 0) / 1024;

const snapshot = {
  date,
  capturedAt: new Date().toISOString(),
  site: base + '/',
  repo: `https://github.com/${REPO}`,
  note: 'Days are UTC. Screenshots show the live site at capturedAt. Open-by-label counts use current labels.',
  screenshots: media.shots,
  video: media.video,
  stats: statsData,
  sessions,
  sizeKB: Math.round(sizeKB),
};
writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2) + '\n');
console.log(`Wrote ${snapshotPath} (${media.shots.length} screenshots, video: ${media.video ?? 'none'}, folder about ${Math.round(sizeKB)} KB)`);
