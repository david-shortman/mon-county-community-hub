// Listing facts the Source check looks for on their sources (#1074).
import test from 'node:test';
import assert from 'node:assert/strict';
import { normText, addressNeedle, moneyNeedles, quoteNeedle, factChecksFor, pageForms, pageHas } from '../src/lib/fact-compare.mjs';
import { missingFacts } from '../scripts/check-sources.mjs';

const isUrl = (u) => /^https?:\/\//.test(u ?? '');

test('normText drops punctuation and writes money one way', () => {
  assert.equal(normText('Fares: $0.75, $1.00 and $1,200!'), ' fares $.75 $1 and $1200 ');
});

test('addressNeedle takes the number and first street word, skipping directions', () => {
  assert.equal(addressNeedle('200 M-Tec Dr, Morgantown, WV'), ' 200 m ');
  assert.equal(addressNeedle('799 East Brockway Avenue, Morgantown, WV'), ' 799 brockway ');
  assert.equal(addressNeedle('PO Box 5, Morgantown, WV'), null);
  assert.equal(addressNeedle(undefined), null);
});

test('an address matches the page however the direction is written', () => {
  const n = addressNeedle('799 East Brockway Avenue, Morgantown, WV');
  assert.ok(pageHas(pageForms('Visit us at 799 E. Brockway Ave.'), n));
  assert.ok(pageHas(pageForms('799 Brockway Avenue'), n));
  assert.ok(!pageHas(pageForms('Visit us at 798 Brockway Ave.'), n));
});

test('money needles match $1 and $1.00 alike, but not $10', () => {
  const [one] = moneyNeedles('$1.00 a ride');
  assert.ok(pageHas(pageForms('Fare: $1'), one));
  assert.ok(pageHas(pageForms('Fare: $1.00.'), one));
  assert.ok(!pageHas(pageForms('Fare: $10'), one));
  assert.deepEqual(moneyNeedles('Free'), []);
});

test('a quote is found despite curly quotes and line breaks', () => {
  const n = quoteNeedle('Pantry hours: Tuesdays, 10 a.m. to 1 p.m.');
  assert.ok(pageHas(pageForms('<p>Pantry hours:\nTuesdays &ndash; 10 a.m. to 1 p.m.</p>'.replace(/<[^>]+>/g, ' ')), n));
  assert.equal(quoteNeedle('Hi'), null);
});

test('factChecksFor: quotes only on their own source; address and money on all', () => {
  const rec = { cost: '$5', contact: { place: '1 Main St, Morgantown, WV' }, sources: [{ url: 'https://a.org/x', quote: 'Open every Tuesday morning' }, { url: 'https://b.org/y' }] };
  const checks = factChecksFor(rec, ['https://a.org/x', 'https://b.org/y'], isUrl);
  assert.deepEqual(checks.map((c) => [c.kind, c.urls.length]), [['quote', 1], ['address', 2], ['money', 2]]);
});

test('missingFacts judges only when every source was fetched, none is a PDF, and no site blocked us', () => {
  const f = { file: 'content/x.yaml', name: 'X', kind: 'money', value: '$5', needle: ' $5 ', urls: ['https://a.org/x', 'https://b.org/y'] };
  const html = (facts) => ({ state: 'ok', kind: 'html', facts });
  assert.equal(missingFacts([f], new Map([['https://a.org/x', html([])], ['https://b.org/y', html([])]])).length, 1);
  assert.equal(missingFacts([f], new Map([['https://a.org/x', html([])], ['https://b.org/y', html([' $5 '])]])).length, 0);
  assert.equal(missingFacts([f], new Map([['https://a.org/x', html([])]])).length, 0, 'one source not fetched this run');
  assert.equal(missingFacts([f], new Map([['https://a.org/x', html([])], ['https://b.org/y', { state: 'ok', kind: 'pdf' }]])).length, 0, 'a PDF may hold it');
  assert.equal(missingFacts([f], new Map([['https://a.org/x', html([])], ['https://b.org/y', { state: 'unverified' }]])).length, 0, 'a site blocked us');
});
