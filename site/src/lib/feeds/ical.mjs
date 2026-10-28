// A small iCalendar (RFC 5545) reader. Enough for public event feeds:
// unfolds lines, reads VEVENT properties and their parameters, and
// unescapes text. It does not expand RRULE repeats.

function unescapeText(v) {
  return v.replace(/\\n/gi, '\n').replace(/\\([,;\\])/g, '$1');
}

export function parseIcs(text) {
  const lines = String(text).replace(/\r\n/g, '\n').replace(/\n[ \t]/g, '').split('\n');
  const events = [];
  let cur = null;
  let depth = 0; // nested components inside a VEVENT (like VALARM) are skipped
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') { cur = {}; depth = 0; continue; }
    if (!cur) continue;
    if (line === 'END:VEVENT') { events.push(cur); cur = null; continue; }
    if (line.startsWith('BEGIN:')) { depth++; continue; }
    if (line.startsWith('END:')) { depth--; continue; }
    if (depth > 0) continue;
    const colon = line.indexOf(':');
    if (colon < 0) continue;
    const [name, ...paramParts] = line.slice(0, colon).split(';');
    const params = Object.fromEntries(paramParts.map((p) => p.split('=')).map(([k, v]) => [k.toUpperCase(), v]));
    cur[name.toUpperCase()] = { value: unescapeText(line.slice(colon + 1)), params };
  }
  return events;
}

// Reads a DTSTART or DTEND property into parts.
// Returns { ymd, hour, minute, allDay } in the feed's own local time.
// Times in UTC (ending in Z) are moved to Eastern time.
export function readIcsDate(prop) {
  if (!prop) return null;
  const v = prop.value.trim();
  const m = v.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z?))?$/);
  if (!m) return null;
  const [, y, mo, d, h, mi, s, z] = m;
  if (!h || prop.params.VALUE === 'DATE') return { ymd: `${y}-${mo}-${d}`, allDay: true };
  if (z) {
    const date = new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +s));
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
        .formatToParts(date).map((p) => [p.type, p.value]),
    );
    return { ymd: `${parts.year}-${parts.month}-${parts.day}`, hour: +parts.hour, minute: +parts.minute, allDay: false };
  }
  return { ymd: `${y}-${mo}-${d}`, hour: +h, minute: +mi, allDay: false };
}
