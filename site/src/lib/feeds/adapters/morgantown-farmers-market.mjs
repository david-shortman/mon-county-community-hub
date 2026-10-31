// Morgantown Farmers Market dates, from the market's public Google Calendar
// (#761). Human page: https://morgantownfarmersmarket.org/
//
// The calendar also holds old social media reminders from 2014; those are
// long past, so the date window drops them. Markets that repeat show only the
// first date the feed gives, with a note; we never expand repeat rules.
import { parseIcs, readIcsDate } from '../ical.mjs';
import { plain, slugify, addDays, hhmm, realTime } from '../util.mjs';

const SITE = 'https://morgantownfarmersmarket.org';

export default {
  id: 'morgantown-farmers-market',
  name: 'Morgantown Farmers Market calendar',
  org_name: 'Morgantown Farmers Market',
  page_url: `${SITE}/`,
  feed_url: 'https://calendar.google.com/calendar/ical/morgantownfarmersmarket%40gmail.com/public/basic.ics',
  format: 'text',

  parse(text) {
    const out = [];
    for (const ev of parseIcs(text)) {
      const title = plain(ev.SUMMARY?.value);
      const start = readIcsDate(ev.DTSTART);
      if (!title || !start) continue;
      // Only market days, not the market's social media reminders.
      if (!/market/i.test(title) || /\bpost\b|reminder|tweet/i.test(title)) continue;
      const end = readIcsDate(ev.DTEND);
      let ends = end?.ymd ?? start.ymd;
      if (end?.allDay && ends > start.ymd) ends = addDays(ends, -1);
      if (ends < start.ymd) ends = start.ymd;
      const oneDay = ends === start.ymd;
      const t = !start.allDay ? hhmm(start.hour, start.minute) : '';
      const times = oneDay && realTime(t) ? { start_time: t } : {};
      const where = plain(ev.LOCATION?.value);
      const repeats = ev.RRULE ? ' The market repeats; check its site for later dates.' : '';
      out.push({
        title,
        slug: `mfm-${slugify(title)}-${start.ymd}`,
        starts: start.ymd,
        ends,
        ...times,
        org_name: 'Morgantown Farmers Market',
        // The market's descriptions speak as "us", so cards use a plain line instead.
        who_it_is_for: 'Listed on the Morgantown Farmers Market calendar.',
        what_to_do: `${where ? `At ${where}.` : "See the market's site for the place."}${repeats}`,
        url: `${SITE}/`,
        topics: ['market'],
        ...(where ? { place: where } : {}),
      });
    }
    return out;
  },
};
