// Fact text links (#122): web, phone and our own pages, nothing else.
import test from 'node:test';
import assert from 'node:assert/strict';
import { factHtml } from '../src/lib/facts.mjs';

test('links to our own pages get the base path', () => {
  assert.equal(factHtml('See [Flood zones](/flood-zone/#permit).', '/em'), 'See <a href="/em/flood-zone/#permit">Flood zones</a>.');
  assert.equal(factHtml('See [Septic](/septic-and-wells/).'), 'See <a href="/septic-and-wells/">Septic</a>.');
});

test('web and phone links still work', () => {
  assert.equal(factHtml('[Call](tel:+13045985131) or [read](https://example.org/a)'), '<a href="tel:+13045985131">Call</a> or <a href="https://example.org/a">read</a>');
});

test('other links and HTML stay plain text', () => {
  assert.equal(factHtml('[x](//example.org) [y](javascript:alert(1))'), '[x](//example.org) [y](javascript:alert(1))');
  assert.equal(factHtml('**Bold** <b>no</b>'), '<strong>Bold</strong> &lt;b&gt;no&lt;/b&gt;');
});
