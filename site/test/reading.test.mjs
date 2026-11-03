// Reading grade (#833, #1621): scripts/check-reading.mjs counts only the prose a resident reads.
import test from 'node:test';
import assert from 'node:assert/strict';
import { grade, paragraphs, opening, fullText } from '../scripts/check-reading.mjs';

const page = (body) => `<html><body><main><h1>Title</h1>${body}</main></body></html>`;
const icon = '<svg viewBox="0 0 24 24"><path d="M3 5h18"></path></svg>';

test('an icon <path> is not read as a paragraph', () => {
  // Before #1621, "<path" matched the paragraph pattern and swallowed the button row up to the next </p>.
  const html = page(`<p>Call the clinic today.</p><div class="actions"><a class="btn">${icon}<span>Call 304-555-0100</span></a><a class="btn">${icon}<span>Directions</span></a></div><p>Bring your card.</p>`);
  assert.deepEqual(paragraphs(html), ['Call the clinic today.', 'Bring your card.']);
});

test('source lines, date chips and the Pass it on address are skipped', () => {
  const html = page('<p class="lede">Apply online or by phone.</p><p class="meta">Source: dohs.wv.gov. Checked against the source on November 3, 2026. Report a problem.</p><p class="date-chip">Mon, Nov 2</p><p class="pi-url">everythingmorgantown.org/snap/</p><p class="note">Keep your letter.</p>');
  assert.deepEqual(paragraphs(html), ['Apply online or by phone.', 'Keep your letter.']);
});

test('text only screen readers hear is left out', () => {
  const html = page('<p>Report it here<span class="sr-only"> (opens our fix form with the page name filled in)</span>.</p>');
  assert.deepEqual(paragraphs(html), ['Report it here .']);
});

test('text before the H1 does not count', () => {
  const html = '<main><p>Crisis strip text that sits above the title.</p><h1>Title</h1><p>The page itself.</p></main>';
  assert.deepEqual(paragraphs(html), ['The page itself.']);
});

test('a page with no <main> gives null', () => {
  assert.equal(paragraphs('<html><body><p>No main here.</p></body></html>'), null);
});

test('each paragraph ends a sentence', () => {
  assert.equal(fullText(['Where to go', 'Call first.', 'The state says:']), 'Where to go. Call first. The state says:.');
  assert.equal(fullText(['He said "yes."', '(See below.)']), 'He said "yes." (See below.)');
});

test('opening is the first two sentences of the first paragraph', () => {
  assert.equal(opening(['One. Two? Three.', 'Four.']), 'One. Two?');
  assert.equal(opening([]), '');
  // A closing quote mark or bracket after the period still ends the sentence (#1665).
  assert.equal(opening(['Most people can use it. The state says it "helps people get a tax break." It is free.']), 'Most people can use it. The state says it "helps people get a tax break."');
  assert.equal(opening(['Call the office (they help with forms.) Then wait. Then go.']), 'Call the office (they help with forms.) Then wait.');
});

test('grade: short plain text is low, long words are high, too short is null', () => {
  const plain = grade('Call the food bank. They are open on Monday. Bring a bag. You can come back next week.');
  const hard = grade('Eligibility determinations necessitate comprehensive documentation of household composition, verification of income, and residency information.');
  assert.ok(plain < 4, `plain ${plain}`);
  assert.ok(hard > 14, `hard ${hard}`);
  assert.equal(grade('Too short.'), null);
});

test('grade counts a sentence that ends in a quote mark or bracket (#1665)', () => {
  const plain = 'Most people can use it. The state says it helps people get a tax break. It is free to use for you.';
  assert.equal(grade('Most people can use it. The state says it "helps people get a tax break." It is free to use for you.'), grade(plain));
  assert.equal(grade("Most people can use it. The state says it \u201chelps people get a tax break.\u201d It is free to use for you."), grade(plain));
  assert.equal(grade('Most people can use it. The state says it (helps people get a tax break.) It is free to use for you.'), grade(plain));
});

test('a card with its button row grades near its own prose', () => {
  const card = `<article class="card"><h3>Food pantry</h3><p><strong>Who it's for:</strong> Anyone in Mon County who needs food.</p><p><strong>What to do:</strong> Come during open hours and bring a bag.</p><div class="actions"><a class="btn">${icon}<span>Call 304-555-0100<span class="sr-only">, Food pantry</span></span></a><a class="btn">${icon}<span>Website<span class="sr-only">: Food pantry</span></span></a><a class="btn">${icon}<span>Directions<span class="sr-only"> to 1 Main Street, Morgantown, WV 26505 (opens a map)</span></span></a></div><p class="meta">Sources: example.org/pantry , source for Food pantry. Checked against the source on November 1, 2026.</p></article>`;
  const ps = paragraphs(page(card));
  assert.equal(ps.length, 2);
  assert.ok(!ps.join(' ').includes('Directions'));
});
