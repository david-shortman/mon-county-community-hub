// Saved copies of the government PDFs the hub cites (#2079).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONTENT_DIR } from '../src/lib/content.mjs';
import { savedCopy } from '../src/lib/saved-copies.mjs';
import {
  citedPdfs, looksLikePdfUrl, isPdfBytes, sha1Base32, parseCdx, newestMatching,
  timestampFromLocation, tsDate, fileNameOf, lastModifiedDate, rawCaptureUrl,
} from '../src/lib/wayback.mjs';
import { readList } from '../scripts/save-pdf-copies.mjs';

const DRAFT = 'https://monongaliacountyclerk.com/myfiles/drafts/draft.pdf';

test('PDF addresses are recognized by name, AgendaCenter and DocumentCenter', () => {
  assert.ok(looksLikePdfUrl(DRAFT));
  assert.ok(looksLikePdfUrl('https://www.monongaliacounty.gov/document_center/Agenda/x/AGENDA%20November%204,%202026.pdf?t=1'));
  assert.ok(looksLikePdfUrl('https://www.morgantownwv.gov/AgendaCenter/ViewFile/Minutes/_10062026-3898'));
  assert.ok(looksLikePdfUrl('https://www.morgantownwv.gov/DocumentCenter/View/1372/Code-Enforcement-Complaint-Process'));
  assert.ok(!looksLikePdfUrl('https://www.busride.org/6-gold-line'));
  assert.ok(!looksLikePdfUrl('https://www.morgantownwv.gov/AgendaCenter'));
  assert.ok(!looksLikePdfUrl('not a url'));
});

test('a PDF is known by its first bytes', () => {
  assert.ok(isPdfBytes(Buffer.from('%PDF-1.7\n')));
  assert.ok(!isPdfBytes(Buffer.from('<!doctype html>')));
});

test('the CDX digest is SHA-1 in base 32', () => {
  assert.equal(sha1Base32(Buffer.from('')), '3I42H3S6NNFQ2MSVX7XZKYAYSCX5QBYJ');
  assert.equal(sha1Base32(Buffer.from('abc')), 'VGMT4NSHA2AWVOR6EVYXQUGCNSONBWE5');
});

test('CDX rows, the newest match, and Save Page Now answers', () => {
  const rows = parseCdx([['timestamp', 'digest'], ['20240101000000', 'A'], ['20260213112327', 'B'], ['20250101000000', 'B']]);
  assert.equal(rows.length, 3);
  assert.equal(newestMatching(rows, 'B').timestamp, '20260213112327');
  assert.equal(newestMatching(rows, 'C'), null);
  assert.deepEqual(parseCdx([]), []);
  assert.equal(timestampFromLocation(`https://web.archive.org/web/20261121220510/${DRAFT}`), '20261121220510');
  assert.equal(timestampFromLocation(null), null);
  assert.equal(tsDate('20261121220510'), '2026-11-21');
  assert.equal(fileNameOf('https://irp.cdn-website.com/869937e9/files/uploaded/6+Gold+Line-4fa65455.pdf'), '6 Gold Line-4fa65455.pdf');
  assert.equal(lastModifiedDate('Sat, 21 Nov 2026 02:29:01 GMT'), '2026-11-21');
  assert.equal(lastModifiedDate('nonsense'), null);
});

const list = readList();
const cited = citedPdfs(CONTENT_DIR);

test('the County Clerk draft minutes file is watched as overwritten', () => {
  assert.ok(list.overwritten.includes(DRAFT));
  assert.ok(cited.has(DRAFT), 'draft.pdf is cited by a minutes record');
});

// A PDF cited since the last run is not an error: cloud sessions cannot reach
// the Archive, so the "Save overwritten PDFs" check saves it within six hours
// and opens an issue with the entry to add. This test only lists them.
test('every PDF cited in minutes, agendas and pdf-pages is saved or says why not', (t) => {
  const saved = new Set(list.files.map((f) => f.url));
  const notSaved = new Set(list.not_saved.map((f) => f.url));
  const missing = [...cited.keys()].filter((u) => !saved.has(u) && !notSaved.has(u));
  if (missing.length) t.diagnostic(`Not on the saved copies list yet (run \`node scripts/save-pdf-copies.mjs run\` in site/): ${missing.join(', ')}`);
  assert.ok(list.files.length > 0);
  for (const n of list.not_saved) assert.ok(n.reason && /^\d{4}-\d{2}-\d{2}$/.test(n.checked), `${n.url} needs a reason and a checked date`);
});

test('each saved copy records the file exactly', () => {
  for (const f of list.files) {
    assert.match(f.sha256, /^[0-9a-f]{64}$/, f.url);
    assert.ok(f.bytes > 0, f.url);
    assert.match(f.read, /^\d{4}-\d{2}-\d{2}$/, f.url);
    assert.match(f.captured, /^\d{4}-\d{2}-\d{2}$/, f.url);
    const ts = f.saved_copy_raw.match(/\/web\/(\d{14})id_\//)?.[1];
    assert.ok(ts, `${f.url} has a raw capture link`);
    assert.equal(f.saved_copy_raw, rawCaptureUrl(ts, f.archived_url ?? f.url));
    assert.ok(f.saved_copy.startsWith('https://web.archive.org/web/'), f.url);
    assert.equal(Boolean(f.overwritten), list.overwritten.includes(f.url), `${f.url} overwritten flag`);
    assert.equal(savedCopy(f.url)?.sha256, f.sha256, `${f.url} reaches the site's saved-copy lookup`);
  }
});

test('the change report is empty when nothing changed, and names records when something did', async () => {
  const { checkReport } = await import('../scripts/save-pdf-copies.mjs');
  assert.equal(checkReport([], cited), '');
  const url = 'https://example.gov/agenda.pdf';
  const report = checkReport([
    { kind: 'changed', url, read: '2026-11-21', saved_copy: `https://web.archive.org/web/20261121000000/${url}`, newCopy: `https://web.archive.org/web/20261122000000/${url}` },
    { kind: 'gone', url: 'https://example.gov/old.pdf', read: '2026-11-21', saved_copy: 'https://web.archive.org/web/1/x', reason: 'the live address answered HTTP 404' },
  ], new Map([[url, ['content/agendas/x.yaml']]]), '2026-11-22');
  assert.match(report, /found 2 that changed or went missing/);
  assert.match(report, /## Changed at the same address/);
  assert.match(report, /content\/agendas\/x\.yaml/);
  assert.match(report, /20261122000000/);
  assert.match(report, /## Gone or not a PDF any more/);
  assert.match(report, /HTTP 404/);
  assert.match(report, /no record cites it now/);
  assert.doesNotMatch(report, /—/);
});
