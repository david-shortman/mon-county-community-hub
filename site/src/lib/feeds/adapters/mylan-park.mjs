// Mylan Park events, from the park's public events API (The Events Calendar
// plugin for WordPress, same as the Mountaineer Food Bank adapter) (#761).
// Human page: https://mylanpark.org/events/
//
// The park hosts many outside groups' events (sports meets, shows, markets).
// Cards say where it was listed and send people to the event page for
// tickets and cost, since the feed does not always say.
import { plain, slugify, hhmm, realTime } from '../util.mjs';

const SITE = 'https://mylanpark.org';
const MARKET = /market|craft show|flea|bazaar/i;

export default {
  id: 'mylan-park',
  name: 'Mylan Park events calendar',
  org_name: 'Mylan Park',
  page_url: `${SITE}/events/`,
  feedUrl(today) {
    return `${SITE}/wp-json/tribe/events/v1/events?per_page=50&start_date=${today}`;
  },
  format: 'json',

  parse(data) {
    const out = [];
    for (const ev of data?.events ?? []) {
      // Titles sometimes end with the date ("Craft Show / Nov 27, 2026").
      const title = plain(ev.title).replace(/\s*\/\s*[A-Z][a-z]{2} \d{1,2}, \d{4}$/, '');
      const starts = String(ev.start_date ?? '').slice(0, 10);
      const ends0 = String(ev.end_date ?? '').slice(0, 10) || starts;
      if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(starts)) continue;
      if (/postponed|cancel+ed/i.test(title)) continue;
      const ends = ends0 < starts ? starts : ends0;
      const t = !ev.all_day ? String(ev.start_date).slice(11, 16) : '';
      const times = ends === starts && realTime(t) ? { start_time: t } : {};
      const v = Array.isArray(ev.venue) ? null : ev.venue;
      const where = plain(v?.venue ?? '');
      out.push({
        title,
        slug: `mylan-${slugify(title)}-${starts}`,
        starts,
        ends,
        ...times,
        org_name: 'Mylan Park',
        who_it_is_for: 'Listed on the Mylan Park events calendar.',
        what_to_do: `${where ? `At ${where}, Mylan Park. ` : ''}See the event page for times, tickets and cost.`,
        url: ev.url || `${SITE}/events/`,
        topics: MARKET.test(title) ? ['market'] : ['community'],
      });
    }
    return out;
  },
};
