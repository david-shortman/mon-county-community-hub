// Small helpers shared by the feed adapters.

const NAMED = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '-', mdash: '\u2014', rsquo: "'", lsquo: "'", ldquo: '"', rdquo: '"', hellip: '...' };

export function decodeEntities(s = '') {
  return String(s)
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => NAMED[n.toLowerCase()] ?? m);
}

// Plain, single-line text: no HTML, no entities, no em dashes, no curly quotes.
export function plain(s = '') {
  return decodeEntities(String(s).replace(/<[^>]*>/g, ' '))
    .replace(/\s*\u2014\s*/g, ', ')
    .replace(/–/g, '-')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

export function slugify(s = '') {
  return plain(s).toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60).replace(/-+$/, '');
}

// YYYY-MM-DD for a moment, as seen in Eastern time.
export function easternYmd(date) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(date);
}

// "7 p.m.", "7:30 p.m." or "noon" from hours and minutes on a 24 hour
// clock, the same way as times elsewhere on the site (#51).
export function prettyTime(h, m) {
  const hour = Number(h);
  const min = Number(m);
  const suffix = hour < 12 ? 'a.m.' : 'p.m.';
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  if (hour === 12 && min === 0) return 'noon';
  if (hour === 0 && min === 0) return 'midnight';
  return `${h12}${min ? `:${String(min).padStart(2, '0')}` : ''} ${suffix}`;
}

export function addDays(ymd, n) {
  const d = new Date(`${ymd}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

// Keep entries from today through `days` ahead so snapshots stay small.
export function inWindow(entry, today, days = 365) {
  return entry.ends >= today && entry.starts <= addDays(today, days);
}

// "17:05" from hours and minutes, for an entry's start_time or end_time.
export const hhmm = (h, m) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

// The first sentences of a feed's own description, up to about `max` words,
// with web links taken out (the card has a Details button). Used for the short
// summary on event cards (#230). Returns '' when there is nothing to say.
// A feed's time looks real only on a quarter hour from 6 a.m. on; the county
// feed has some times like 1:00 or 11:18 that are not event times.
export const realTime = (t) => /^(0[6-9]|1\d|2[0-2]):(00|15|30|45)$/.test(t ?? '');
// A summary that only repeats the title says nothing new.
export const adds = (about, title) => about && !title.toLowerCase().includes(about.toLowerCase().replace(/[.!?]+$/, ''));
export function firstSentences(text = '', max = 40) {
  const clean = plain(text).replace(/https?:\/\/\S+/g, '').replace(/\s+/g, ' ').trim();
  const out = [];
  let words = 0;
  for (const s of clean.split(/(?<=[.!?]["')\]]*)\s+/)) {
    if (!s) continue;
    const n = s.trim().split(/\s+/).length;
    if (out.length && words + n > max) break;
    out.push(s.trim());
    words += n;
  }
  return out.join(' ');
}
