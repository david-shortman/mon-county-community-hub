// City of Morgantown main calendar, from the city's CivicPlus iCalendar feed.
// Feed list: https://www.morgantownwv.gov/iCalendar.aspx
import { parseIcs, readIcsDate } from '../ical.mjs';
import { plain, slugify, prettyTime, addDays } from '../util.mjs';

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
      const time = start.allDay ? '' : `Starts at ${prettyTime(start.hour, start.minute)}`;
      const whenWhere = [time, where && `${time ? 'at' : 'Location:'} ${where}`].filter(Boolean).join(' ');
      const isMeeting = /meeting|council|commission|board|authority|committee|agency/i.test(title);

      out.push({
        title,
        slug: `morgantown-${slugify(title).replace(/^morgantown-/, '')}-${start.ymd}`,
        starts: start.ymd,
        ends,
        org_name: 'City of Morgantown',
        who_it_is_for: 'Listed on the City of Morgantown calendar.',
        what_to_do: `${whenWhere ? `${whenWhere}. ` : ''}See the event page for details.`,
        url,
        topics: isMeeting ? ['government'] : ['community'],
      });
    }
    return out;
  },
};
