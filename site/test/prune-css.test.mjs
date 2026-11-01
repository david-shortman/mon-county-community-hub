// Tests for src/lib/prune-css.mjs: unused component CSS is dropped, and
// nothing a page could use is touched.
import test from 'node:test';
import assert from 'node:assert/strict';
import { pruneCss, pruneHtml } from '../src/lib/prune-css.mjs';

const has = new Set(['aaa']);

test('drops rules for components the page does not have', () => {
  assert.equal(pruneCss('.x[data-astro-cid-bbb]{color:red}.y[data-astro-cid-aaa]{color:blue}', has), '.y[data-astro-cid-aaa]{color:blue}');
});

test('keeps global rules, at-rules and mixed selector lists', () => {
  const css = 'body{margin:0}@font-face{font-family:"A";src:url("data:font/woff2;base64,{}")}.x[data-astro-cid-bbb],.g{color:red}@keyframes k{from{opacity:0}to{opacity:1}}';
  assert.equal(pruneCss(css, has), css);
});

test('prunes inside @media and drops it when empty', () => {
  assert.equal(pruneCss('@media (min-width:40em){.x[data-astro-cid-bbb]{color:red}}@media print{.y[data-astro-cid-aaa]{color:blue}}', has), '@media print{.y[data-astro-cid-aaa]{color:blue}}');
});

test('keeps strings with braces and attribute selectors with commas', () => {
  const css = '.q[data-astro-cid-aaa]::before{content:"}{"}a[title="a,b"][data-astro-cid-aaa]{color:red}';
  assert.equal(pruneCss(css, has), css);
});

test('reads the cids from the markup, not from the styles', () => {
  const html = '<style>.x[data-astro-cid-bbb]{color:red}.y[data-astro-cid-aaa]{color:blue}</style><p data-astro-cid-aaa>Hi</p>';
  assert.equal(pruneHtml(html), '<style>.y[data-astro-cid-aaa]{color:blue}</style><p data-astro-cid-aaa>Hi</p>');
});
