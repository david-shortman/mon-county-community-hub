import { test } from 'node:test';
import assert from 'node:assert/strict';
import { claimsFor, packetMd, parseTable, verdict } from '../src/lib/second-check.mjs';

const rec = {
  _file: 'resources/x.yaml', title: 'Food pantry', org: 'example-org', hours: 'Tuesdays 10 a.m. to 1 p.m.',
  contact: { phone: '304-555-0100', place: '1 Main St, Morgantown, WV', url: 'https://example.org/pantry' },
  who_it_is_for: 'Anyone in the county. See https://example.org/rules for the rules.',
  sources: [{ url: 'https://example.org/pantry', checked: '2026-11-14' }],
};

test('claimsFor lists fields with no links and no sources', () => {
  const c = claimsFor(rec);
  assert.deepEqual(c.claims.map((x) => x.field), ['Hours', 'Phone', "Who it's for", 'Address']);
  const md = packetMd([c]);
  assert.ok(!md.includes('example.org'), 'no source or link in the packet');
  assert.ok(!md.includes('resources/x.yaml'), 'no file path in the packet');
  assert.match(md, /\[link removed\]/);
});

const table = (rows) => `Some text\n\n## Second check\n\n| Field | Claim | Result (confirmed, changed, not found) | Owner's source URL | Checked |\n|---|---|---|---|---|\n${rows.join('\n')}\n\n## Other\n| a | b | c | d | e |`;

test('parseTable reads only the Second check table and skips empty template rows', () => {
  const rows = parseTable(table(['| Hours | Tue 10 a.m. | confirmed | https://example.org | 2026-11-14 |', '| Phone | | | | |']));
  assert.equal(rows.length, 2);
  assert.equal(rows[0].result, 'confirmed');
});

test('verdict: all confirmed with URL and date passes; changed, not found or blank fails', () => {
  const ok = '| Hours | Tue 10 a.m. | Confirmed | https://example.org | 2026-11-14 |';
  assert.equal(verdict(parseTable(table([ok, '| Phone | | | | |']))).ok, true);
  assert.equal(verdict(parseTable(table([ok, '| Phone | 304-555-0100 | changed | https://example.org | 2026-11-14 |']))).ok, false);
  assert.equal(verdict(parseTable(table(['| Cost | Free | not found | | 2026-11-14 |']))).ok, false);
  assert.equal(verdict(parseTable(table(['| Cost | Free | confirmed | | 2026-11-14 |']))).ok, false);
  assert.equal(verdict(parseTable(table(['| Cost | Free | | | |']))).ok, false);
  assert.equal(verdict(parseTable('no table here')).ok, false);
});

test('verdict with the packet: every claim needs its own confirmed row', () => {
  const expected = [claimsFor(rec)];
  const rows = expected[0].claims.map((c) => `| ${c.field} | ${c.claim.replace(/\|/g, '/')} | confirmed | https://example.org/pantry | 2026-11-14 |`);
  assert.equal(verdict(parseTable(table(rows)), expected).ok, true);
  const partial = verdict(parseTable(table(rows.slice(1))), expected);
  assert.equal(partial.ok, false);
  assert.match(partial.problems.join(' '), /has no row/);
});

test('parseTable reads tables under record headings, as packetMd writes them (#1886)', () => {
  const two = { ...rec, title: 'Clothing closet', hours: 'Fridays 9 a.m.', contact: {}, who_it_is_for: null };
  const items = [claimsFor(rec), claimsFor(two)];
  // The checker fills in the packet's own tables and posts them under "## Second check".
  const filled = packetMd(items).split('\n').slice(packetMd(items).split('\n').findIndex((l) => l.startsWith('## ')))
    .map((l) => l.replace(/\| \| \| \|$/, '| confirmed | https://example.org/pantry | 2026-11-14 |'));
  const comment = ['## Second check', '', ...filled, '', '## Claude review', '| Rubric | Score | Notes | x | y |', '|---|---|---|---|---|', '| TR1 | pass | ok | x | y |'].join('\n');
  const rows = parseTable(comment);
  assert.equal(rows.length, items[0].claims.length + items[1].claims.length, 'rows from every record, none from the review table');
  assert.ok(rows.every((r) => r.result === 'confirmed'));
  assert.equal(verdict(rows, items).ok, true);
});
