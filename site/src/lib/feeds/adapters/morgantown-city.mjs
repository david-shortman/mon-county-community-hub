// City of Morgantown main calendar, from the city's CivicPlus iCalendar feed.
// Feed list: https://www.morgantownwv.gov/iCalendar.aspx
import { parseIcs, readIcsDate } from '../ical.mjs';
import { plain, slugify, addDays, hhmm, firstSentences, realTime, adds } from '../util.mjs';

const SITE = 'https://www.morgantownwv.gov';

export default {
  id: 'morgantown-city',
  name: 'City of Morgantown calendar',
  org_name: 'City of Morgantown',
  page_url: `${SITE}/calendar.aspx`,
  feed_url: `${SITE}/common/modules/iCalendar/iCalendar.aspx?catID=14&feed=calendar`,
  format: 'text',

  parse(text) {
    const out = [];
    for (const ev of parseIcs(text)) {
      const title = plain(ev.SUMMARY?.value);
      const start = readIcsDate(ev.DTSTART);
      if (!title || !start) continue;
      const end = readIcsDate(ev.DTEND);
      let ends = end?.ymd ?? start.ymd;
      // All-day DTEND is the day after the last day.
      if (end?.allDay && ends > start.ymd) ends = addDays(ends, -1);
      if (ends < start.ymd) ends = start.ymd;

      const uid = ev.UID?.value?.trim() ?? '';
      const url = /^\d+$/.test(uid) ? `${SITE}/Calendar.aspx?EID=${uid}` : `${SITE}/calendar.aspx`;
      // Locations look like "Room - 300 Spruce Street Morgantown WV 26505".
      const where = plain(ev.LOCATION?.value).split(/\s+-\s+|^-\s*/).filter(Boolean).join(', ');
      // A short summary from the city's own description, when it has one (#230).
      const about = firstSentences(ev.DESCRIPTION?.value);
      // Times go in start_time and end_time, so the card shows them by the date.
      const oneDay = ends === start.ymd;
      const times = !start.allDay && oneDay && realTime(hhmm(start.hour, start.minute)) ? { start_time: hhmm(start.hour, start.minute) } : {};
      // Only the start time: the city's end times are placeholders (11:59 p.m.,
      // or a set length like three hours), not when a meeting ends.
      const isMeeting = /meeting|council|commission|board|authority|committee|agency/i.test(title);

      out.push({
        title,
        slug: `morgantown-${slugify(title).replace(/^morgantown-/, '')}-${start.ymd}`,
        starts: start.ymd,
        ends,
        org_name: 'City of Morgantown',
        who_it_is_for: adds(about, title) ? about : 'Listed on the City of Morgantown calendar.',
        what_to_do: where ? `At ${where}.` : "The city's event page has the details.",
        ...times,
        url,
        topics: isMeeting ? ['government'] : ['community'],
      });
    }
    return out;
  },
};
