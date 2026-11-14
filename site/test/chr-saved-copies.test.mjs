// The County Health Rankings reader falls back to the saved copy when the
// live file is gone (#1906), and every file the site cites has a saved copy.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { readChrFile } from '../scripts/update-chr-indicators.mjs';
import { savedCopy, savedCopies } from '../src/lib/saved-copies.mjs';
import { CONTENT_DIR } from '../src/lib/content.mjs';

const LIVE = 'https://www.countyhealthrankings.org/sites/default/files/media/document/example.csv';
const RAW = 'https://web.archive.org/web/20260101000000id_/' + LIVE;
const BODY = 'statecode,countycode\n54,061\n';
const entry = (sha256 = crypto.createHash('sha256').update(BODY).digest('hex')) => ({ url: LIVE, file_name: 'example.csv', sha256, saved_copy: RAW.replace('id_', ''), saved_copy_raw: RAW, captured: '2026-01-01' });
const allow = async () => ({ allowed: true });
const fakeFetch = (answers) => async (u) => {
  const a = answers[u];
  if (a instanceof Error) throw a;
  return { ok: a.status === 200, status: a.status, arrayBuffer: async () => Buffer.from(a.body ?? '') };
};

test('reads the live file when it is there', async () => {
  const notes = [];
  const buf = await readChrFile(LIVE, { fetchImpl: fakeFetch({ [LIVE]: { status: 200, body: BODY } }), robots: allow, lookup: () => entry(), notes });
  assert.equal(buf.toString(), BODY);
  assert.deepEqual(notes, []);
});

test('falls back to the saved copy when the live file is gone, and says so', async () => {
  for (const live of [{ status: 404 }, { status: 503 }, new Error('fetch failed')]) {
    const notes = [];
    const buf = await readChrFile(LIVE, { fetchImpl: fakeFetch({ [LIVE]: live, [RAW]: { status: 200, body: BODY } }), robots: allow, lookup: () => entry(), notes });
    assert.equal(buf.toString(), BODY);
    assert.equal(notes.length, 1);
    assert.match(notes[0], /live file unavailable.*saved copy from 2026-01-01.*checksum matches/);
  }
});

test('refuses a saved copy whose checksum does not match', async () => {
  await assert.rejects(
    readChrFile(LIVE, { fetchImpl: fakeFetch({ [LIVE]: { status: 404 }, [RAW]: { status: 200, body: 'changed' } }), robots: allow, lookup: () => entry() }),
    /does not match the recorded checksum/,
  );
});

test('with no saved copy, the live error stands', async () => {
  await assert.rejects(readChrFile(LIVE, { fetchImpl: fakeFetch({ [LIVE]: { status: 404 } }), robots: allow, lookup: () => null }), /404/);
});

test('never reads a saved copy that robots.txt blocks', async () => {
  const asked = [];
  const robots = async (u) => { asked.push(u); return u.startsWith('https://web.archive.org/') ? { allowed: false, reason: 'blocked' } : { allowed: true }; };
  await assert.rejects(readChrFile(LIVE, { fetchImpl: fakeFetch({ [LIVE]: { status: 404 } }), robots, lookup: () => entry() }), /blocked/);
  assert.deepEqual(asked, [LIVE, RAW]);
});

test('every County Health Rankings file the indicators read has a saved copy with a checksum', () => {
  const dir = path.join(CONTENT_DIR, 'indicators');
  for (const f of fs.readdirSync(dir).filter((x) => /\.ya?ml$/.test(x))) {
    const ind = YAML.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    if (!ind.chr) continue;
    for (const s of ind.sources.filter((x) => x.url.includes('countyhealthrankings.org/sites/'))) {
      const c = savedCopy(s.url);
      assert.ok(c, `${f}: no saved copy for ${s.url}`);
      assert.match(c.sha256, /^[0-9a-f]{64}$/, `${f}: ${s.url}`);
      assert.ok(c.saved_copy_raw.startsWith('https://web.archive.org/web/') && c.saved_copy_raw.includes('id_/' + s.url), `${f}: ${s.url}`);
    }
  }
  // The needs register cites the same files (and the county page).
  for (const f of fs.readdirSync(path.join(CONTENT_DIR, 'needs')).filter((x) => /\.ya?ml$/.test(x))) {
    const text = fs.readFileSync(path.join(CONTENT_DIR, 'needs', f), 'utf8');
    for (const u of text.match(/https:\/\/www\.countyhealthrankings\.org\/(sites\/default\/files\/media\/document\/[^\s"']+|health-data\/west-virginia\/monongalia)(?=[\s"']|$)/gm) ?? []) assert.ok(savedCopy(u), `${f}: no saved copy for ${u}`);
  }
  for (const c of savedCopies().values()) assert.ok(c.saved_copy.startsWith('https://web.archive.org/web/') && c.saved_copy.endsWith(c.url), c.url);
});
