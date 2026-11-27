#!/usr/bin/env node
// Save every government PDF the hub cites to the Internet Archive (#2079).
//
// Some local governments replace their PDFs instead of keeping them. The
// County Clerk posts only the newest draft of the Commission's minutes, always
// at one address, so each new draft overwrites the last. This script asks the
// Wayback Machine to keep a copy of each PDF cited in content/minutes/,
// content/agendas/ and content/pdf-pages/, then downloads that copy and
// records it only if it matches the live file byte for byte (SHA-256).
//
// The record is content/sources/gov-pdfs/saved-copies.yaml, the same shape as
// the County Health Rankings list (#1906). The PDFs themselves are never kept
// in this repo: the minutes name county employees, and the hub writes them as
// [name]. A Wayback link keeps names out of the repo.
//
//   node scripts/save-pdf-copies.mjs list            which cited PDFs have a saved copy
//   node scripts/save-pdf-copies.mjs run             save the ones not on the list yet
//   node scripts/save-pdf-copies.mjs run --retry     also try the not_saved ones again
//   node scripts/save-pdf-copies.mjs run --recheck   save them all again
//   node scripts/save-pdf-copies.mjs run --only draft.pdf
//   node scripts/save-pdf-copies.mjs watch           save a new copy of each
//                                                    overwritten address if it changed
//   node scripts/save-pdf-copies.mjs check           has any other saved PDF changed
//                                                    or gone? Saves the new file and
//                                                    writes a report (CHECK_REPORT)
//   node scripts/save-pdf-copies.mjs check --propose also puts each new file's
//                                                    verified entry in the list, so
//                                                    the workflow can show it as a diff
//
// Free services only: Save Page Now and the CDX lookup. We wait between
// requests to stay well inside the Internet Archive's limits, and back off on
// a 429. robots.txt is checked for each host before we read the live file; if
// it says no, we do not read it and do not ask the Archive to either.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { CONTENT_DIR } from '../src/lib/content.mjs';
import { robotsCheck } from '../src/lib/robots.mjs';
import { USER_AGENT } from '../src/lib/ingest.mjs';
import {
  citedPdfs, isPdfBytes, sha256, sha1Base32, cdxUrl, saveUrl, captureUrl, rawCaptureUrl,
  versionsUrl, parseCdx, newestMatching, timestampFromLocation, tsDate, fileNameOf, lastModifiedDate,
} from '../src/lib/wayback.mjs';

export const LIST_FILE = path.join(CONTENT_DIR, 'sources', 'gov-pdfs', 'saved-copies.yaml');
const today = () => new Date().toISOString().slice(0, 10);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Pauses, in ms. The Archive asks anonymous Save Page Now users to go slowly.
const PAUSE = { cdx: 1500, save: 15_000, backoff: 90_000 };

export function readList(file = LIST_FILE) {
  const data = fs.existsSync(file) ? YAML.parse(fs.readFileSync(file, 'utf8')) ?? {} : {};
  return { overwritten: data.overwritten ?? [], files: data.files ?? [], not_saved: data.not_saved ?? [] };
}

const HEADER = `# Saved copies of the government PDFs this site cites (#2079), kept by the
# Internet Archive's Wayback Machine. Made by site/scripts/save-pdf-copies.mjs.
# Same shape as content/sources/chr/saved-copies.yaml (#1906).
#
# Each copy was downloaded on its read date and its SHA-256 matched the live
# file byte for byte. The PDFs are not kept in this repo: the minutes name
# county employees, which the hub writes as [name].
#   url: the live address the site cites
#   file_name, bytes, sha256: of the live file on the read date
#   last_modified: the date the server gives for the file
#   archived_url: where the address redirects, if it does. That is the
#     address the Archive saved.
#   saved_copy: the Wayback capture, for people. For an overwritten address
#     it is the list of every saved version, since the newest capture may be a
#     later file than the one a record read.
#   saved_copy_raw: the capture as the original bytes, for scripts
#   captured: the date of that capture
# overwritten: addresses where each new file replaces the last. The daily
#   "Save overwritten PDFs" check (.github/workflows/save-pdfs.yml) saves a new
#   capture whenever the file there changes.
# not_saved: PDFs we cited but could not save, and why. Each needs a person.
`;

export function writeList(list, file = LIST_FILE) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const out = {
    overwritten: [...list.overwritten].sort(),
    files: [...list.files].sort((a, b) => a.url.localeCompare(b.url)),
    not_saved: [...list.not_saved].sort((a, b) => a.url.localeCompare(b.url)),
  };
  fs.writeFileSync(file, HEADER + YAML.stringify(out, { lineWidth: 0 }));
}

// GET with our name, a robots.txt check before every hop, and the bytes back.
async function getLive(url) {
  let at = url;
  for (let hop = 0; hop < 6; hop++) {
    const rc = await robotsCheck(at, { userAgent: USER_AGENT });
    if (!rc.allowed) return { error: rc.reason, robots: true };
    if (rc.delay) await sleep(Math.min(rc.delay, 30) * 1000);
    let res;
    try {
      res = await fetch(at, { redirect: 'manual', headers: { 'User-Agent': USER_AGENT }, signal: AbortSignal.timeout(120_000) });
    } catch (err) {
      return { error: `could not reach ${new URL(at).host} (${err.cause?.code || err.message})` };
    }
    const next = res.status >= 300 && res.status < 400 && res.headers.get('location');
    if (next) { at = new URL(next, at).href; continue; }
    if (!res.ok) return { error: `the live address answered HTTP ${res.status}` };
    const buf = Buffer.from(await res.arrayBuffer());
    return { buf, finalUrl: at, lastModified: lastModifiedDate(res.headers.get('last-modified')) };
  }
  return { error: 'too many redirects' };
}

// An Archive request, with one long pause and retry on 429 or 5xx.
async function archiveFetch(url, opts = {}) {
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT }, signal: AbortSignal.timeout(180_000), ...opts });
      if (res.status !== 429 && res.status < 500) return res;
      console.log(`  Archive answered ${res.status}; waiting ${PAUSE.backoff / 1000}s`);
    } catch (err) {
      console.log(`  Archive request failed (${err.cause?.code || err.message}); waiting`);
    }
    await sleep(PAUSE.backoff);
  }
  return null;
}

async function cdxRows(url) {
  await sleep(PAUSE.cdx);
  const res = await archiveFetch(cdxUrl(url));
  if (!res?.ok) return [];
  try { return parseCdx(await res.json()); } catch { return []; }
}

// Ask Save Page Now for a capture. Returns its timestamp, or null.
async function requestSave(url) {
  await sleep(PAUSE.save);
  const res = await archiveFetch(saveUrl(url), { redirect: 'manual' });
  if (!res) return null;
  return timestampFromLocation(res.headers.get('location')) ?? timestampFromLocation(res.headers.get('content-location'));
}

async function downloadCapture(ts, url) {
  await sleep(PAUSE.cdx);
  const res = await archiveFetch(rawCaptureUrl(ts, url));
  if (!res?.ok) return null;
  return Buffer.from(await res.arrayBuffer());
}

// Save one address. Returns { entry } or { not_saved }.
export async function saveOne(url, { overwritten = false } = {}) {
  const checked = today();
  const live = await getLive(url);
  if (live.error) return { not_saved: { url, reason: live.error, checked } };
  if (!isPdfBytes(live.buf)) return { not_saved: { url, reason: 'the live address did not send a PDF', checked } };
  const want = sha256(live.buf);
  const digest = sha1Base32(live.buf);
  // Save the address the file is really at. Some sites redirect to another
  // host with spaces left unencoded, which Save Page Now cannot follow.
  const target = live.finalUrl;

  // A capture of this exact file may already exist. If so, use it and spare
  // Save Page Now a request.
  let ts = newestMatching(await cdxRows(target), digest)?.timestamp ?? null;
  let fresh = false;
  if (!ts) { ts = await requestSave(target); fresh = true; }
  if (!ts) return { not_saved: { url, reason: 'Save Page Now did not return a capture', checked } };

  const got = await downloadCapture(ts, target);
  if (!got) return { not_saved: { url, reason: `the capture ${ts} could not be downloaded`, checked } };
  if (sha256(got) !== want) {
    return { not_saved: { url, reason: `the ${fresh ? 'new' : 'existing'} capture ${ts} does not match the live file (SHA-256 differs)`, checked } };
  }
  const entry = {
    url,
    ...(target !== url ? { archived_url: target } : {}),
    file_name: fileNameOf(url),
    bytes: live.buf.length,
    sha256: want,
    ...(live.lastModified ? { last_modified: live.lastModified } : {}),
    read: checked,
    saved_copy: overwritten ? versionsUrl(target) : captureUrl(ts, target),
    saved_copy_raw: rawCaptureUrl(ts, target),
    captured: tsDate(ts),
    ...(overwritten ? { overwritten: true } : {}),
  };
  return { entry, fresh, ts };
}

function upsert(list, url, result) {
  list.files = list.files.filter((f) => f.url !== url);
  list.not_saved = list.not_saved.filter((f) => f.url !== url);
  if (result.entry) list.files.push(result.entry);
  else list.not_saved.push(result.not_saved);
}

async function run(args) {
  const recheck = args.includes('--recheck');
  const retry = recheck || args.includes('--retry');
  const only = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;
  const list = readList();
  const cited = citedPdfs(CONTENT_DIR);
  const have = new Set([...list.files, ...(retry ? [] : list.not_saved)].map((f) => f.url));
  const todo = [...cited.keys()].filter((u) => (only ? u.includes(only) : recheck || !have.has(u)));
  console.log(`${cited.size} PDFs cited; ${todo.length} to save.`);
  let n = 0;
  for (const url of todo) {
    n++;
    console.log(`[${n}/${todo.length}] ${url}`);
    const result = await saveOne(url, { overwritten: list.overwritten.includes(url) });
    upsert(list, url, result);
    console.log(result.entry ? `  saved: ${result.entry.saved_copy_raw}${result.fresh ? ' (new capture)' : ' (existing capture)'}` : `  not saved: ${result.not_saved.reason}`);
    writeList(list); // after each one, so a stopped run keeps its work
  }
  // Drop entries no record cites any more, except the overwritten addresses.
  list.files = list.files.filter((f) => cited.has(f.url) || list.overwritten.includes(f.url));
  list.not_saved = list.not_saved.filter((f) => cited.has(f.url));
  writeList(list);
  console.log(`Done. ${list.files.length} saved, ${list.not_saved.length} not saved. See ${path.relative(process.cwd(), LIST_FILE)}.`);
}

// For each overwritten address: if the live file is not in the Archive yet,
// save it. Writes nothing to the repo; the Archive's own list of versions is
// the record. Prints a summary for the Actions run page.
async function watch() {
  const list = readList();
  const lines = ['## Save overwritten PDFs', ''];
  let failed = 0;
  for (const url of list.overwritten) {
    const live = await getLive(url);
    if (live.error || !isPdfBytes(live.buf)) {
      failed++;
      lines.push(`- ${url}: not checked (${live.error ?? 'the live address did not send a PDF'})`);
      continue;
    }
    const digest = sha1Base32(live.buf);
    const hit = newestMatching(await cdxRows(live.finalUrl), digest);
    if (hit) {
      lines.push(`- ${url}: unchanged, already saved ${tsDate(hit.timestamp)} (SHA-256 ${sha256(live.buf).slice(0, 12)})`);
      continue;
    }
    const result = await saveOne(url, { overwritten: true });
    if (result.entry) lines.push(`- ${url}: **new version saved**, ${captureUrl(result.ts, live.finalUrl)} (SHA-256 ${result.entry.sha256.slice(0, 12)}, ${result.entry.bytes} bytes)`);
    else { failed++; lines.push(`- ${url}: changed, but not saved (${result.not_saved.reason})`); }
  }
  lines.push('', `Every saved version: ${list.overwritten.map(versionsUrl).join(', ')}`);
  const text = lines.join('\n');
  console.log(text);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, text + '\n');
  if (failed) process.exitCode = 1;
}

// For every saved PDF that is not an overwritten address: is the live file
// still the one we saved? A file can be replaced at the same address (an
// amended agenda, a new fee schedule), or taken down. A changed file gets a
// new capture, so both versions are kept, but the list keeps the copy the
// record was read from: a person should re-read the record, then record the
// new file. With --propose (the workflow uses it), the new file's entry is
// written to the list when its capture matched the live file byte for byte;
// the workflow turns that change into the "Record new saved copies" issue, and
// a session applies it once the record matches the new file (#2121). Without
// --propose it writes nothing to the repo.
// The report goes to stdout, the Actions summary, and the CHECK_REPORT file
// (empty when nothing changed), which the workflow turns into an issue.
export function checkReport(rows, cited, date = today(), { proposed = false } = {}) {
  if (!rows.length) return '';
  const by = (url) => (cited.get(url) ?? []).map((f) => `\`${f}\``).join(', ') || 'no record cites it now';
  const out = [`The daily check of saved PDFs (${date}, #2079) found ${rows.length} that changed or went missing since we saved them. The saved copy we recorded is still the file each record was read from.`, ''];
  const changed = rows.filter((r) => r.kind === 'changed');
  const gone = rows.filter((r) => r.kind === 'gone');
  if (changed.length) {
    const record = proposed
      ? 'Then apply the entry for the new file from the "Record new saved copies" issue, in the same PR or after it. That issue has it when the new capture matched the live file.'
      : 'Then run `node scripts/save-pdf-copies.mjs run --only <url>` in `site/` on a machine that can reach web.archive.org to record the new file.';
    out.push('## Changed at the same address', '', `Re-read each record against the new file and fix anything that changed. ${record} Until the entry is recorded, this check reports the file again each day.`, '');
    for (const r of changed) out.push(`- ${r.url}\n  - Read ${r.read}, saved copy: ${r.saved_copy}\n  - New file: ${r.newCopy ? r.newCopy : `not saved (${r.newError})`}\n  - Cited by: ${by(r.url)}`);
    out.push('');
  }
  if (gone.length) {
    out.push('## Gone or not a PDF any more', '', 'Find where the file moved, or say on the page that it is no longer posted. The saved copy still works.', '');
    for (const r of gone) out.push(`- ${r.url}: ${r.reason}\n  - Saved copy: ${r.saved_copy}\n  - Cited by: ${by(r.url)}`);
    out.push('');
  }
  return out.join('\n');
}

async function check(args = []) {
  const propose = args.includes('--propose');
  const list = readList();
  const cited = citedPdfs(CONTENT_DIR);
  const rows = [];
  let same = 0, skipped = 0;
  for (const f of list.files.filter((x) => !x.overwritten)) {
    await sleep(2000);
    const live = await getLive(f.url);
    const base = { url: f.url, read: f.read, saved_copy: f.saved_copy };
    if (live.robots) { skipped++; console.log(`skip  ${f.url}: ${live.error}`); continue; }
    // A site that is down for a moment is not a file that is gone: only a
    // clear answer counts (an HTTP error, or a page that is not a PDF).
    if (live.error && /could not reach/.test(live.error)) { skipped++; console.log(`skip  ${f.url}: ${live.error}`); continue; }
    if (live.error || !isPdfBytes(live.buf)) { rows.push({ ...base, kind: 'gone', reason: live.error ?? 'the address no longer sends a PDF' }); console.log(`GONE  ${f.url}`); continue; }
    if (sha256(live.buf) === f.sha256) { same++; continue; }
    console.log(`NEW   ${f.url}`);
    const result = await saveOne(f.url);
    rows.push({ ...base, kind: 'changed', newCopy: result.entry ? captureUrl(result.ts, result.entry.archived_url ?? f.url) : null, newError: result.not_saved?.reason });
    // Only a verified capture replaces the entry; a failed save keeps the old one.
    if (propose && result.entry) upsert(list, f.url, result);
  }
  if (propose) writeList(list);
  const report = checkReport(rows, cited, today(), { proposed: propose });
  const summary = `## Saved PDFs check\n\n${same} unchanged, ${rows.length} changed or gone, ${skipped} not checked this run.\n\n${report}`;
  console.log(summary);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary + '\n');
  if (process.env.CHECK_REPORT) fs.writeFileSync(process.env.CHECK_REPORT, report);
}

function listCmd() {
  const list = readList();
  const saved = new Map(list.files.map((f) => [f.url, f]));
  const missing = new Map(list.not_saved.map((f) => [f.url, f]));
  for (const [url, by] of citedPdfs(CONTENT_DIR)) {
    const s = saved.get(url);
    console.log(`${s ? 'saved  ' : missing.has(url) ? 'NOT    ' : 'todo   '} ${url}  (${by.length} record${by.length > 1 ? 's' : ''})${s ? `  ${s.captured}` : missing.has(url) ? `  ${missing.get(url).reason}` : ''}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [cmd = 'list', ...args] = process.argv.slice(2);
  if (cmd === 'run') await run(args);
  else if (cmd === 'watch') await watch();
  else if (cmd === 'check') await check(args);
  else if (cmd === 'list') listCmd();
  else { console.error(`Unknown command: ${cmd}. Use list, run, watch or check.`); process.exitCode = 2; }
}
