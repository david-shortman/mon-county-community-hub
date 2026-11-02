// Tests for the calendar feed text (#108). Runs after `npm run build`.
// A summary with ; , \ and a line break must come out escaped the way
// RFC 5545 section 3.3.11 requires, and read back to the same text. The same
// check must catch the old bug from #77, where ';' was not escaped.
import fs from 'node:fs';
import { esc, icsDocument } from '../src/lib/ics.mjs';

const failures = [];
const expect = (ok, msg) => { if (!ok) failures.push(msg); };

// RFC 5545 text: ; and , must have a backslash before them (and \ itself is doubled).
const hasUnescaped = (v) => /(^|[^\\])(\\\\)*[;,]/.test(v);
const unescape = (v) => v.replace(/\\([;,nN\\])/g, (_, c) => (c === 'n' || c === 'N' ? '\n' : c));

const tricky = 'Pantry; bring ID, a bag, and C:\\path\nSecond line';
const event = {
  slug: 'test-semicolon-2026-01-01', title: tricky, starts: '2026-01-01', ends: '2026-01-01',
  org_name: 'Test, Inc.; Org', who_it_is_for: 'Anyone; really, anyone.', what_to_do: 'Go.', url: 'https://example.org/',
  sources: [{ url: 'https://example.org/', checked: '2026-01-01' }], place: '1 Main St, Morgantown, WV',
};
const doc = icsDocument([event]);

// Lines: CRLF, folded at 75 octets.
expect(doc.endsWith('\r\n') && !/[^\r]\n/.test(doc), 'lines must end in CRLF');
const raw = doc.split('\r\n');
expect(raw.every((l) => Buffer.byteLength(l, 'utf8') <= 75), 'a line is longer than 75 octets');
const lines = [];
for (const l of raw) { if (l.startsWith(' ') && lines.length) lines[lines.length - 1] += l.slice(1); else if (l) lines.push(l); }
const value = (name) => lines.find((l) => l.split(/[;:]/)[0] === name)?.replace(/^[^:]*:/, '');

for (const f of ['SUMMARY', 'DESCRIPTION', 'LOCATION']) expect(!hasUnescaped(value(f) ?? ''), `${f} has an unescaped ; or ,`);
expect(unescape(value('SUMMARY') ?? '') === tricky, `SUMMARY does not read back to the original text: ${value('SUMMARY')}`);
expect(unescape(value('LOCATION') ?? '') === event.place, 'LOCATION does not read back to the original text');

// The check above would have caught #77: the old code wrote '\;' in JavaScript, which is just ';'.
const oldEsc = (s) => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
expect(hasUnescaped(oldEsc(tricky)), 'the test no longer catches the old escape bug from #77');
expect(!hasUnescaped(esc(tricky)), 'esc() leaves a ; or , unescaped');

// RFC 7986 calendar name and refresh hint, next to the X-WR- lines.
expect(lines.some((l) => l.startsWith('NAME:')), 'missing NAME');
expect(lines.includes('REFRESH-INTERVAL;VALUE=DURATION:P1D'), 'missing REFRESH-INTERVAL');
expect(lines.some((l) => l.startsWith('X-WR-CALNAME:')), 'missing X-WR-CALNAME');
// UIDs stay <slug>@mon-county-community-hub so subscribers never see duplicates (#108).
expect(value('UID') === `${event.slug}@mon-county-community-hub`, 'UID format changed; subscribers would see every event twice');

// home.ics (#1051), as built: every event has a Due:, Season: or Tip: title
// (or the Event category for live items), a category, and a description that
// ends with its source and checked date. No event shows twice.
const homeFile = new URL('../dist/home.ics', import.meta.url);
if (fs.existsSync(homeFile)) {
  const text = fs.readFileSync(homeFile, 'utf8');
  expect(text.startsWith('BEGIN:VCALENDAR\r\n') && text.endsWith('END:VCALENDAR\r\n'), 'home.ics is not a whole calendar');
  expect(text.split('\r\n').every((l) => Buffer.byteLength(l, 'utf8') <= 75), 'home.ics has a line longer than 75 octets');
  const unfolded = text.replace(/\r\n /g, '');
  const events = unfolded.split('BEGIN:VEVENT').slice(1);
  expect(events.length >= 10, `home.ics has only ${events.length} events`);
  const uids = new Set();
  for (const ev of events) {
    const get = (name) => ev.split('\r\n').find((l) => l.split(/[;:]/)[0] === name)?.replace(/^[^:]*:/, '') ?? '';
    const summary = unescape(get('SUMMARY'));
    const cat = get('CATEGORIES');
    expect(['Due', 'Season', 'Tip', 'Event'].includes(cat), `home.ics: ${summary} has category "${cat}"`);
    if (cat !== 'Event') expect(summary.startsWith(`${cat}: `), `home.ics: "${summary}" should start with "${cat}: "`);
    expect(/Source: \S+ Checked: \d{4}-\d{2}-\d{2}$/.test(unescape(get('DESCRIPTION'))), `home.ics: ${summary} should end with its source and checked date`);
    const uid = get('UID');
    expect(!uids.has(uid), `home.ics lists ${uid} twice`);
    uids.add(uid);
  }
} else failures.push('dist/home.ics is missing (run npm run build first)');

if (failures.length) {
  console.error(`Calendar feed tests failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log('Calendar feed tests passed: escaping, folding, NAME, REFRESH-INTERVAL, UID and home.ics.');
