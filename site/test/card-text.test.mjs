import test from 'node:test';
import assert from 'node:assert/strict';
import { sentences, foldText, longFields, foldExtras, labelPart } from '../src/lib/card-text.mjs';

const long = 'Call 304-555-0100 from 8 a.m. to 5 p.m. Monday to Friday. The office is at 12 Main St. in Morgantown. ' + 'Bring your ID and a bill with your name on it. '.repeat(6) + 'Ask about the fee.';

test('sentences do not split after a.m., p.m. or St.', () => {
  const s = sentences(long);
  assert.equal(s[0], 'Call 304-555-0100 from 8 a.m. to 5 p.m. Monday to Friday.');
  assert.equal(s[1], 'The office is at 12 Main St. in Morgantown.');
});

test('long text folds after two sentences and keeps every word', () => {
  const { short, rest } = foldText(long);
  assert.equal(short, 'Call 304-555-0100 from 8 a.m. to 5 p.m. Monday to Friday. The office is at 12 Main St. in Morgantown.');
  assert.ok(rest.startsWith('Bring your ID'));
  assert.equal(`${short} ${rest}`.replace(/\s+/g, ' '), long.trim().replace(/\s+/g, ' '));
});

test('short text and crisis text are never folded', () => {
  assert.equal(foldText('Call us. We help. Come in.').rest, '');
  assert.equal(foldText(long + ' In danger now? Call 911.').rest, '');
  assert.equal(foldText(long + ' Or call 988.').rest, '');
});

test('longFields names fields over the limit', () => {
  assert.deepEqual(longFields({ who_it_is_for: 'a b', what_to_do: long }).map((f) => f.field), ['what_to_do']);
});

test('long lists fold, short ones and crisis ones do not', () => {
  const item = 'Bring your ID and a bill with your name on it. '.repeat(3);
  assert.equal(foldExtras({ options: [item, item] }), true);
  assert.equal(foldExtras({ options: ['Gold Card', 'Medicare card'] }), false);
  assert.equal(foldExtras({ options: [item, item + ' Call 988.'] }), false);
});

test('labelPart finds a short label before a colon, not a time', () => {
  assert.deepEqual(labelPart('Passes: buy them here.'), { label: 'Passes', text: 'buy them here.' });
  assert.equal(labelPart('Open 9:30 to 5.').label, '');
  assert.equal(labelPart('No colon here.').label, '');
});
