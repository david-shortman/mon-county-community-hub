// Warns when a calendar item uses meeting, program or legal jargon without
// saying what it means (#103, plain language rules PL4 and PL5 in
// docs/rubrics/plain-language.md). A resident who sees "first reading",
// "consent agenda" or "LIEAP" on a card should not have to look it up.
//
// How it works: for each hand-checked item in content/calendar/ that has not
// ended, read its title, who_it_is_for and what_to_do. For each word in TERMS
// that shows up, look for a plain explanation somewhere in those fields:
// - the term right before a parenthesis: "LIEAP (heating bill help)"
// - the term inside a parenthesis after plain words: "heating bill help (LIEAP)"
// - the term followed by "is", "are", "means" or ", which": "A variance is ..."
// - "In a <term>," at the start of an explaining sentence
// The org name counts too, since it often spells out an acronym.
// A term with no explanation gets a warning. A legal citation in the card text
// ("W. Va. Code 11A-1-3") gets a warning too: the law goes on the source line.
//
// Warning only: it never fails the build. Fix a warning by explaining the
// word in the same line, in a few plain words, and keep every date, time,
// place and official name exact. The meeting words are also explained on
// /meetings/how-to-read-an-agenda/.
//
// Usage (from site/): node scripts/check-calendar-jargon.mjs [--self-test]
// Also run by npm run check-content, which runs the self-test first.
// Exit codes: 0 always for the check; 1 only when the self-test fails.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

// Words a resident may not know. Add new ones in alphabetical order.
// Each is matched as a whole word or phrase, any case, unless `exact` is set
// (for short acronyms that are also common words).
export const TERMS = [
  { term: 'condemnation' },
  { term: 'consent agenda' },
  { term: 'DEP', exact: true },
  { term: 'DoHS', exact: true },
  { term: 'easement', forms: 'easements?' },
  { term: 'executive session' },
  { term: 'fiduciary' },
  { term: 'first reading' },
  { term: 'homestead exemption', forms: 'homestead (property tax )?exemption' },
  { term: 'LIEAP', exact: true, forms: '(Pre-)?LIEAP' },
  { term: 'levy estimate', forms: 'levy estimates?' },
  { term: 'Marketplace', exact: true },
  { term: 'MCHD', exact: true },
  { term: 'MPO', exact: true },
  { term: 'NRCS', exact: true },
  { term: 'ordinance', forms: 'ordinances?' },
  { term: 'public hearing' },
  { term: 'quorum' },
  { term: 'REAP', exact: true },
  { term: 'right-of-way' },
  { term: 'second reading' },
  { term: 'TIF', exact: true },
  { term: 'variance', forms: 'variances?' },
  { term: 'ward', forms: 'wards?' },
  { term: 'work session' },
];

// A legal citation in the card text: "W. Va. Code 11A-1-3", "WV Code § 7-7-6b".
const CITATION = /\b(W\.\s?Va\.|WV|West Virginia)\s+Code\b/;
const FIELDS = ['title', 'who_it_is_for', 'what_to_do'];

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const pattern = (t) => t.forms ?? esc(t.term);

// The terms in `text` that have no plain explanation in it or in `context`
// (the org name, which often spells out an acronym: "... Service (NRCS)").
export function unexplained(text, context = '') {
  const s = `${text ?? ''}\n${context ?? ''}`;
  const out = [];
  for (const t of TERMS) {
    const flags = t.exact ? '' : 'i';
    const w = `(?<![\\w-])(${pattern(t)})(?![\\w-])`;
    if (!new RegExp(w, flags).test(String(text ?? ''))) continue;
    const explained = [
      new RegExp(`${w}\\s*\\(`, flags),                              // LIEAP (heating bill help)
      new RegExp(`\\([^()]*${w}[^()]*\\)`, flags),                    // heating bill help (LIEAP)
      new RegExp(`${w}\\s+(is|are|means|mean)\\b`, flags),            // A variance is ...
      new RegExp(`${w},\\s+(which|a|an|the)\\b`, flags),              // ordinance, a city law
      new RegExp(`\\bIn an? ${w},`, flags),                           // In a levy estimate, ...
    ].some((re) => re.test(s));
    if (!explained) out.push(t.term);
  }
  return out;
}

// Every warning for one calendar item, as plain strings.
export function itemWarnings(item) {
  const text = FIELDS.map((f) => item?.[f] ?? '').join('\n');
  const out = unexplained(text, item?.org_name).map((t) => `uses "${t}" without saying what it means`);
  const card = ['who_it_is_for', 'what_to_do'].map((f) => item?.[f] ?? '').join('\n');
  if (CITATION.test(card)) out.push('cites a law in the card text; the law belongs on the source line');
  return out;
}

function selfTest() {
  const cases = [
    // [text, expected unexplained terms]
    ['Pre-LIEAP heating bill help applications', ['LIEAP']],
    ['Heating bill help (LIEAP) applications open', []],
    ['LIEAP (help paying heating bills) opens', []],
    ['The ordinance gets its first reading.', ['first reading', 'ordinance']],
    ['A first reading (the first of two times a law is read) of an ordinance, a city law.', []],
    ['A variance is permission to set aside a zoning rule.', []],
    ['In a levy estimate, each body lists the money it expects.', []],
    ['Apply online. Funding is limited.', []],
    ['The Marketplace (HealthCare.gov, the federal site) opens.', []],
    ['the marketplace on High Street', []], // exact: a plain market is fine
    ['a TIFF image of the map', []],        // whole word only
    ['Bring it to the DEP office.', ['DEP']],
    ['Council meets in a work session.', ['work session']],
  ];
  let bad = 0;
  for (const [text, want] of cases) {
    const got = unexplained(text);
    if (JSON.stringify(got) !== JSON.stringify(want)) {
      bad++;
      console.error(`self-test: "${text}" gave ${JSON.stringify(got)}, wanted ${JSON.stringify(want)}`);
    }
  }
  const law = itemWarnings({ title: 'Taxes due', what_to_do: 'These dates come from state law (W. Va. Code 11A-1-3).' });
  if (!law.some((w) => w.includes('source line'))) { bad++; console.error('self-test: a law citation in what_to_do was not flagged'); }
  const ok = itemWarnings({ title: 'Last day to apply to NRCS', org_name: 'USDA Natural Resources Conservation Service (NRCS)', what_to_do: 'These dates come from state law.' });
  if (ok.length) { bad++; console.error(`self-test: a plain item was flagged: ${ok.join('; ')}`); }
  if (bad) { console.error(`check-calendar-jargon: self-test failed (${bad})`); process.exit(1); }
  console.log(`check-calendar-jargon: self-test ok (${cases.length + 2} cases)`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--self-test')) selfTest();
  else {
    const dir = fileURLToPath(new URL('../../content/calendar/', import.meta.url));
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
    const day = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v ?? ''));
    let n = 0;
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.yaml')).sort()) {
      const item = yaml.load(fs.readFileSync(path.join(dir, f), 'utf8'));
      if (day(item?.ends ?? item?.starts) < today) continue; // already off the site
      for (const w of itemWarnings(item)) { n++; console.warn(`warning: calendar/${f}: ${w}`); }
    }
    if (n) console.warn(`check-calendar-jargon: ${n} warning(s). Explain each word in a few plain words in the same line (#103). Warnings do not fail the build.`);
    else console.log('check-calendar-jargon: ok');
  }
}
