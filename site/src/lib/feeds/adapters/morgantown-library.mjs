// Morgantown Public Library System events, from the library's LibCal iCal feed
// (#107). The calendar page is https://events.mympls.org/calendar/events.
//
// The feed lists every program at every branch, and most are weekly
// storytimes and clubs. Those would bury the dates page, so we keep one-time
// events and closures, and leave out anything the feed repeats 3 or more times
// (the families page is the place for regular programs). We never read the
// ORGANIZER field, which names library staff.
import { parseIcs, readIcsDate } from '../ical.mjs';
import { plain, slugify, prettyTime, addDays } from '../util.mjs';

const SITE = 'https://events.mympls.org';
const REPEATS = 3;
const FAMILY = /story ?time|toddler|baby|babies|kids?\b|children|teen|tween|pre-?k|preschool|family|lego/i;

// "Meeting Room A, Morgantown Public Library" stays; "Cheat Area Public
// Library, Cheat Area Public Library" becomes one name.
function place(loc) {
  const parts = plain(loc).split(/\s*,\s*/).filter(Boolean);
  const names = [...new Set(parts)].join(', ');
  return /^system wide$/i.test(names) ? 'all library branches' : names;
}

export default {
  id: 'morgantown-library',
  name: 'Morgantown Public Library System calendar',
  org_name: 'Morgantown Public Library System',
  page_url: `${SITE}/calendar/events`,
  feed_url: `${SITE}/ical_subscribe.php?src=p&cid=17544`,
  format: 'text',

  parse(text) {
    const events = parseIcs(text);
    const count = new Map();
    for (const ev of events) {
      const t = plain(ev.SUMMARY?.value).toLowerCase();
      count.set(t, (count.get(t) ?? 0) + 1);
    }
    const out = [];
    for (const ev of events) {
      const raw = plain(ev.SUMMARY?.value);
      const start = readIcsDate(ev.DTSTART);
      if (!raw || !start) continue;
      if (/^test\b/i.test(raw)) continue; // staff test entries
      const closed = /\bclosed\b/i.test(raw);
      if (!closed && count.get(raw.toLowerCase()) >= REPEATS) continue;

      const end = readIcsDate(ev.DTEND);
      let ends = end?.ymd ?? start.ymd;
      if (end?.allDay && ends > start.ymd) ends = addDays(ends, -1);
      if (ends < start.ymd) ends = start.ymd;

      const where = place(ev.LOCATION?.value);
      const online = /virtual/i.test(ev.CATEGORIES?.value ?? '');
      const title = closed && where && !raw.toLowerCase().includes(where.toLowerCase()) ? `${raw.replace(/^Library Closed$/i, 'Library closed')}: ${where}` : raw;
      const id = (ev.UID?.value ?? '').match(/(\d+)\s*$/)?.[1];
      const url = /^https:\/\/events\.mympls\.org\/event\/\d+$/.test(ev.URL?.value?.trim() ?? '') ? ev.URL.value.trim() : `${SITE}/calendar/events`;
      // A 00:00 start is a placeholder in this feed, not a real time.
      const timed = !start.allDay && (start.hour || start.minute);
      const time = timed ? `Starts at ${prettyTime(start.hour, start.minute)}` : '';
      const whereText = online ? 'Online' : where && `at ${where}`;
      const lead = closed ? '' : [time, whereText].filter(Boolean).join(' ');

      out.push({
        title,
        slug: `mpls-${slugify(raw)}${id ? `-${id}` : ''}-${start.ymd}`,
        starts: start.ymd,
        ends,
        org_name: 'Morgantown Public Library System',
        who_it_is_for: 'Listed on the Morgantown Public Library System calendar.',
        what_to_do: `${lead ? `${lead}. ` : ''}See the event page for details.`,
        url,
        topics: FAMILY.test(raw) ? ['family'] : ['community'],
      });
    }
    return out;
  },
};
