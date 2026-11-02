// Builds iCalendar (RFC 5545) text for the full feed and for single events.
export const esc = (s = '') => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
const compact = (d) => d.replaceAll('-', '');
const nextDay = (d) => { const x = new Date(`${d}T12:00:00Z`); x.setUTCDate(x.getUTCDate() + 1); return x.toISOString().slice(0, 10); };
// Lines over 75 octets (bytes, not characters) must be folded. Never split a character.
const enc = new TextEncoder();
function fold(line) {
  const out = [];
  let cur = '', bytes = 0, limit = 75;
  for (const ch of line) {
    const n = enc.encode(ch).length;
    if (bytes + n > limit) { out.push(cur); cur = ''; bytes = 0; limit = 74; } // continuation lines start with a space
    cur += ch; bytes += n;
  }
  out.push(cur);
  return out.join('\r\n ');
}

// US Eastern rules in force since 2007, so timed events land at the right local time.
const VTIMEZONE = [
  'BEGIN:VTIMEZONE', 'TZID:America/New_York',
  'BEGIN:DAYLIGHT', 'TZOFFSETFROM:-0500', 'TZOFFSETTO:-0400', 'TZNAME:EDT', 'DTSTART:20070311T020000', 'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU', 'END:DAYLIGHT',
  'BEGIN:STANDARD', 'TZOFFSETFROM:-0400', 'TZOFFSETTO:-0500', 'TZNAME:EST', 'DTSTART:20071104T020000', 'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU', 'END:STANDARD',
  'END:VTIMEZONE',
];

function vevent(e, stamp) {
  // Single-day entries with a start_time become timed events in Eastern time.
  const timed = e.start_time && e.starts === e.ends;
  const local = (d, t) => `${compact(d)}T${t.replace(':', '')}00`;
  const lines = [
    'BEGIN:VEVENT',
    `UID:${e.slug}@mon-county-community-hub`,
    `DTSTAMP:${stamp}`,
    ...(timed
      ? [`DTSTART;TZID=America/New_York:${local(e.starts, e.start_time)}`, ...(e.end_time ? [`DTEND;TZID=America/New_York:${local(e.starts, e.end_time)}`] : [])]
      : [`DTSTART;VALUE=DATE:${compact(e.starts)}`, `DTEND;VALUE=DATE:${compact(nextDay(e.ends))}`]),
    `SUMMARY:${esc(e.title)}`,
    `DESCRIPTION:${esc(e.ics_description ?? `${e.who_it_is_for} ${e.what_to_do} ${e.feed ? `Listed by ${e.org_name}.` : `Run by ${e.org_name}.`} Check the source before you go: ${e.sources?.[0]?.url ?? e.url}`)}`,
  ];
  // Optional categories, like Due, Season or Tip in home.ics (#1051).
  if (e.ics_categories?.length) lines.push(`CATEGORIES:${e.ics_categories.map(esc).join(',')}`);
  if (e.place) lines.push(`LOCATION:${esc(e.place)}`);
  lines.push(`URL:${e.url}`, 'TRANSP:TRANSPARENT', 'END:VEVENT');
  return lines;
}

export function icsDocument(events, name = 'Mon County deadlines and dates', { description } = {}) {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Everything Morgantown//Deadlines//EN',
    'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', `X-WR-CALNAME:${esc(name)}`, 'X-WR-TIMEZONE:America/New_York',
    // RFC 7986 names and refresh hint, for apps that skip the X-WR- lines (#108).
    `NAME:${esc(name)}`, 'REFRESH-INTERVAL;VALUE=DURATION:P1D', 'X-PUBLISHED-TTL:P1D',
    ...(description ? [`DESCRIPTION:${esc(description)}`, `X-WR-CALDESC:${esc(description)}`] : []),
    ...VTIMEZONE,
    ...events.flatMap((e) => vevent(e, stamp)),
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}

export const icsResponse = (body) => new Response(body, { headers: { 'Content-Type': 'text/calendar; charset=utf-8' } });
