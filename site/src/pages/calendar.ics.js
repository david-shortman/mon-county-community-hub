// iCalendar feed of every entry that has not ended yet.
import { loadCalendarWithFeeds, todayYmd } from '../lib/content.mjs';

const esc = (s = '') => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
const compact = (d) => d.replaceAll('-', '');
const nextDay = (d) => { const x = new Date(`${d}T12:00:00Z`); x.setUTCDate(x.getUTCDate() + 1); return x.toISOString().slice(0, 10); };
// Lines over 75 octets must be folded (RFC 5545).
const fold = (line) => line.match(/.{1,73}/gu).join('\r\n ');

export async function GET() {
  const today = todayYmd();
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Mon County Community Hub//Deadlines//EN',
    'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:Mon County deadlines and dates', 'X-WR-TIMEZONE:America/New_York',
  ];
  for (const e of (await loadCalendarWithFeeds()).filter((e) => e.ends >= today)) {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${e.slug}@mon-county-community-hub`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${compact(e.starts)}`,
      `DTEND;VALUE=DATE:${compact(nextDay(e.ends))}`,
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
