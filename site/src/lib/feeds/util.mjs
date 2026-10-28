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

// "7:00 p.m." from hours and minutes on a 24 hour clock.
export function prettyTime(h, m) {
  const hour = Number(h);
  const suffix = hour < 12 ? 'a.m.' : 'p.m.';
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  if (hour === 12 && Number(m) === 0) return 'noon';
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
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
