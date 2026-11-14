// Election runway (#1383): the health check warns when no election file runs
// past today plus 60 days.
import test from 'node:test';
import assert from 'node:assert/strict';
import { electionRunway, runwayLine } from '../src/lib/elections.mjs';

const e = (slug, day, until) => ({ slug, name: slug, election_day: day, canvass: day, results_until: until });
const general = e('general', '2026-11-03', '2026-11-30');
const primary = e('primary', '2028-05-12', '2028-06-15');

test('a file that runs past the window is fine', () => {
  const r = electionRunway('2026-08-01', [general]);
  assert.equal(r.short, false);
  assert.equal(r.next.slug, 'general');
  assert.match(runwayLine(r), /cover \/vote\/ through November 30, 2026/);
});

test('warns within 60 days of the last results_until', () => {
  const r = electionRunway('2026-11-14', [general]);
  assert.equal(r.short, true);
  assert.equal(r.next, null);
  assert.match(runwayLine(r), /stops showing on November 30, 2026/);
});

test('says when the last file has already run out', () => {
  assert.match(runwayLine(electionRunway('2026-12-05', [general])), /stopped showing on November 30, 2026/);
});

test('a later file clears the warning and is named as next', () => {
  const r = electionRunway('2026-11-14', [general, primary]);
  assert.equal(r.short, false);
  assert.equal(r.next.slug, 'primary');
  assert.equal(electionRunway('2026-10-01', [general, primary]).next.slug, 'general');
});

test('no files at all is a warning', () => {
  const r = electionRunway('2026-11-14', []);
  assert.equal(r.short, true);
  assert.match(runwayLine(r), /No election file/);
});
