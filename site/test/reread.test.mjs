import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quoteProblems, rereadProof, bumpedSources, missingProof } from '../src/lib/reread.mjs';

test('quoteProblems accepts a short quote and refuses bad ones', () => {
  assert.deepEqual(quoteProblems(undefined), []);
  assert.deepEqual(quoteProblems('Open Monday to Friday, 9 a.m. to 4 p.m.'), []);
  assert.equal(quoteProblems('Open').length, 1);
  assert.equal(quoteProblems('word '.repeat(41)).length, 1);
  assert.equal(quoteProblems(42).length, 1);
  assert.equal(quoteProblems('one two\nthree four').length, 1);
});

test('rereadProof: a quote, a call on that day, or a program read', () => {
  assert.equal(rereadProof({ url: 'u', checked: '2026-11-14', quote: 'Food pantry open Tuesdays' }), 'quote');
  assert.equal(rereadProof({ url: 'u', checked: '2026-11-14' }, { phone_confirmed: '2026-11-14' }), 'call');
  assert.equal(rereadProof({ url: 'u', checked: '2026-11-14' }, { phone_confirmed: '2026-11-01' }), null);
  assert.equal(rereadProof({ url: 'u', checked: '2026-11-14', method: 'feed' }), 'program');
  assert.equal(rereadProof({ url: 'u', checked: '2026-11-14' }, { quote: 'the rule text here', _file: 'facts/x/y.yaml' }), 'quote');
  assert.equal(rereadProof({ url: 'u', checked: '2026-11-14' }), null);
});

test('bumpedSources finds moved dates and new sources, not unchanged ones', () => {
  const before = { sources: [{ url: 'a', checked: '2026-11-01' }, { url: 'b', checked: '2026-11-01' }] };
  const after = { sources: [{ url: 'a', checked: '2026-11-14' }, { url: 'b', checked: '2026-11-01' }, { url: 'c', checked: new Date('2026-11-14') }] };
  assert.deepEqual(bumpedSources(before, after).map((b) => [b.source.url, b.was, b.now]), [['a', '2026-11-01', '2026-11-14'], ['c', null, '2026-11-14']]);
});

test('missingProof lists only bumped sources with no proof', () => {
  const before = { sources: [{ url: 'a', checked: '2026-11-01' }, { url: 'b', checked: '2026-11-01' }] };
  const after = { sources: [{ url: 'a', checked: '2026-11-14', quote: 'Open Tuesdays 10 a.m.' }, { url: 'b', checked: '2026-11-14' }] };
  assert.deepEqual(missingProof(before, after), [{ url: 'b', was: '2026-11-01', now: '2026-11-14' }]);
});
