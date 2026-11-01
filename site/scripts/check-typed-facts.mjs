// Typed facts on high-stakes pages (#1064). Warns, never fails.
// Lists phone numbers, dollar amounts and dates written straight into
// high-stakes page files (the rules in scripts/high-stakes-rules.mjs) instead
// of coming from a content record. Records get checked dates and stale
// warnings; text typed into a page gets neither, which is how last season's
// LIEAP dates stayed on /utility-bills/ after the record was updated (#1056).
// Fix by reading the fact from its record, or leave it if it has to be typed.
// Usage (from site/): node scripts/check-typed-facts.mjs [--list]
//   --list prints every line; without it, one line per file with counts.
import fs from 'node:fs';
import path from 'node:path';
import { pageHit } from './high-stakes-rules.mjs';

const MONTH = '(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sept?|Oct|Nov|Dec)\\.?';
const KINDS = [
  ['phone', /\b(?:1-)?\d{3}-\d{3}-\d{4}\b|\(\d{3}\)\s?\d{3}-\d{4}|tel:\+?1?\d{10}\b/g],
  ['money', /\$\d[\d,]*(?:\.\d{2})?/g],
  ['date', new RegExp(`\\b${MONTH} \\d{1,2}(?:st|nd|rd|th)?\\b(?:, \\d{4})?|\\b20\\d{2}-\\d{2}-\\d{2}\\b`, 'g')],
];
// Short crisis and relay numbers are fine to type: they never change.
const OK = /^(?:911|988|211|898-211|7-1-1|838255)$/;

// Lines that say a date or fact is not out yet. These go stale with no
// warning when the source posts it (the LIEAP line in #1056). A line that
// shows the words only when a record says so (`status === ... &&`) is not
// typed text, so it is left out.
export const NOT_YET = /\bnot\s+(?:been\s+)?(?:out|posted|announced|published|released|set)\s+yet\b|\bnot\s+yet\s+(?:been\s+)?(?:out|posted|announced|published|released|set)\b/i;
const fromRecord = (line) => /&&[^&]*$/.test(line.split(NOT_YET)[0]);

// Every high-stakes page file (repo-relative path), with why it is high
// stakes and its typed facts. Run from site/.
export function scanTypedFacts() {
  const root = path.resolve('..');
  const files = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.astro')) files.push(p);
    }
  })(path.resolve('src/pages'));
  for (const c of ['CrisisStrip.astro', 'CrisisLine.astro']) files.push(path.resolve('src/components', c));
  const found = [];
  for (const abs of files) {
    if (!fs.existsSync(abs)) continue;
    const rel = path.relative(root, abs).split(path.sep).join('/');
    const text = fs.readFileSync(abs, 'utf8');
    const why = pageHit(rel, text);
    if (!why) continue;
    const hits = [];
    const notYet = [];
    text.split('\n').forEach((line, i) => {
      const t = line.trim();
      // Comments and imports are not shown to residents.
      if (t.startsWith('//') || t.startsWith('import ') || t.startsWith('*') || t.startsWith('{/*')) return;
      for (const [kind, re] of KINDS) {
        for (const m of line.matchAll(re)) if (!OK.test(m[0])) hits.push({ line: i + 1, kind, text: m[0] });
      }
      if (NOT_YET.test(line) && !fromRecord(line)) {
        // Just the sentence that says it, without tags.
        const plain = t.replace(/<[^>]+>/g, '').replace(/\{[^}]*\}/g, '').replace(/\s+/g, ' ');
        const sentence = plain.split(/(?<=[.!?])\s+/).find((x) => NOT_YET.test(x)) ?? plain;
        notYet.push({ line: i + 1, text: sentence.slice(0, 200) });
      }
    });
    found.push({ rel, why, hits, notYet });
  }
  return found;
}

// The ten digits of a phone number as typed, or null for short numbers.
export const phoneDigits = (s) => {
  const d = s.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
  return d.length === 10 ? d : null;
};

// Run as a script (not imported by the scorecard).
if (import.meta.url === `file://${process.argv[1]}`) {
  const list = process.argv.includes('--list');
  const found = scanTypedFacts().filter((f) => f.hits.length);
  const total = found.reduce((n, f) => n + f.hits.length, 0);
  console.log(`\nTyped facts on high-stakes pages (warn only): ${total} in ${found.length} file(s). Read these from a record where you can (#1064).`);
  for (const f of found) {
    const by = (k) => f.hits.filter((h) => h.kind === k).length;
    console.log(`  warning: ${f.rel} (${f.why}): ${by('phone')} phone, ${by('money')} money, ${by('date')} date`);
    if (list) for (const h of f.hits) console.log(`    ${f.rel}:${h.line} ${h.kind} ${h.text}`);
  }
}
