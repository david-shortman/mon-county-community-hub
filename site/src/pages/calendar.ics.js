// iCalendar feed of every entry that has not ended yet.
import { loadCalendarWithFeeds, todayYmd } from '../lib/content.mjs';

const esc = (s = '') => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
const compact = (d) => d.replaceAll('-', '');
const nextDay = (d) => { const x = new Date(`${d}T12:00:00Z`); x.setUTCDate(x.getUTCDate() + 1); return x.toISOString().slice(0, 10); };
// Lines over 75 octets must be folded (RFC 5545).
const fold = (line) => line.match(/.{1,73}/gu).join('\r\n ');

// US Eastern rules in force since 2007, so timed events land at the right local time.
const VTIMEZONE = [
  'BEGIN:VTIMEZONE', 'TZID:America/New_York',
  'BEGIN:DAYLIGHT', 'TZOFFSETFROM:-0500', 'TZOFFSETTO:-0400', 'TZNAME:EDT', 'DTSTART:20070311T020000', 'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU', 'END:DAYLIGHT',
  'BEGIN:STANDARD', 'TZOFFSETFROM:-0400', 'TZOFFSETTO:-0500', 'TZNAME:EST', 'DTSTART:20071104T020000', 'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU', 'END:STANDARD',
  'END:VTIMEZONE',
];

export async function GET() {
  const today = todayYmd();
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Mon County Community Hub//Deadlines//EN',
    'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:Mon County deadlines and dates', 'X-WR-TIMEZONE:America/New_York',
    ...VTIMEZONE,
  ];
  for (const e of (await loadCalendarWithFeeds()).filter((e) => e.ends >= today)) {
    const timed = e.start_time && e.starts === e.ends;
    const local = (d, t) => `${compact(d)}T${t.replace(':', '')}00`;
    lines.push(
      'BEGIN:VEVENT',
      `UID:${e.slug}@mon-county-community-hub`,
      `DTSTAMP:${stamp}`,
      ...(timed
        ? [`DTSTART;TZID=America/New_York:${local(e.starts, e.start_time)}`, ...(e.end_time ? [`DTEND;TZID=America/New_York:${local(e.starts, e.end_time)}`] : [])]
        : [`DTSTART;VALUE=DATE:${compact(e.starts)}`, `DTEND;VALUE=DATE:${compact(nextDay(e.ends))}`]),
      `SUMMARY:${esc(e.title)}`,
      `DESCRIPTION:${esc(`${e.who_it_is_for} ${e.what_to_do} ${e.feed ? `Listed by ${e.org_name}.` : `Run by ${e.org_name}.`} Check the source before you go: ${e.sources[0]?.url ?? e.url}`)}`,
      `URL:${e.url}`,
      'TRANSP:TRANSPARENT',
      'END:VEVENT',
    );
  }
  lines.push('END:VCALENDAR');
  return new Response(lines.map(fold).join('\r\n') + '\r\n', { headers: { 'Content-Type': 'text/calendar; charset=utf-8' } });
}
