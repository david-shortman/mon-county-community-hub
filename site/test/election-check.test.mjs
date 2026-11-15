// checkElection (#1365): optional fields for a city election (wave 19, #529).
import test from 'node:test';
import assert from 'node:assert/strict';
import { checkElection } from '../src/lib/elections.mjs';

const base = { slug: 'x', name: 'x', polls: '6:30 a.m. to 7:30 p.m.', results_url: 'https://example.gov/r', election_day: '2027-04-27', results_until: '2027-05-31', sources: [{ url: 'https://example.gov', checked: '2026-11-14' }] };

test('canvass and register_by may be left off', () => {
  assert.doesNotThrow(() => checkElection({ ...base }, 'x.yaml'));
});

test('a canvass, when given, must fall between Election Day and results_until', () => {
  assert.doesNotThrow(() => checkElection({ ...base, canvass: '2027-05-03' }, 'x.yaml'));
  assert.throws(() => checkElection({ ...base, canvass: '2027-04-20' }, 'x.yaml'), /election_day < canvass/);
  assert.throws(() => checkElection({ ...base, canvass: 'soon' }, 'x.yaml'), /canvass must be/);
});

test('results_until must come after Election Day', () => {
  assert.throws(() => checkElection({ ...base, results_until: '2027-04-27' }, 'x.yaml'), /election_day < results_until/);
});

test('office needs a name, an https url and a phone', () => {
  const office = { name: 'Town Clerk', url: 'https://example.gov/e', phone: '304-555-1234' };
  assert.doesNotThrow(() => checkElection({ ...base, office }, 'x.yaml'));
  assert.throws(() => checkElection({ ...base, office: { ...office, phone: '555' } }, 'x.yaml'), /office needs/);
  assert.throws(() => checkElection({ ...base, office: { ...office, url: 'http://example.gov' } }, 'x.yaml'), /office needs/);
});

test('provisional_lookup must be true or false', () => {
  assert.throws(() => checkElection({ ...base, provisional_lookup: 'no' }, 'x.yaml'), /provisional_lookup/);
});
