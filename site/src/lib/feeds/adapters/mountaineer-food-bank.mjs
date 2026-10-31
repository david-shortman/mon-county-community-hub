// Mountaineer Food Bank mobile pantry dates in Monongalia County, from the
// food bank's public events API (The Events Calendar plugin for WordPress).
// Human page: https://mountaineerfoodbank.org/food-pantries/
import { plain, realTime } from '../util.mjs';

const SITE = 'https://mountaineerfoodbank.org';

export default {
  id: 'mountaineer-food-bank',
  name: 'Mountaineer Food Bank pantry calendar',
  org_name: 'Mountaineer Food Bank',
  page_url: `${SITE}/food-pantries/`,
  // The feed URL needs today's date so it only returns upcoming pantries.
  feedUrl(today) {
    return `${SITE}/wp-json/tribe/events/v1/events?categories=monongalia-county&per_page=50&start_date=${today}`;
  },
  format: 'json',

  parse(data) {
    const out = [];
    for (const ev of data?.events ?? []) {
      // Only pantries the food bank files under Monongalia County.
      if (!(ev.categories ?? []).some((c) => c.slug === 'monongalia-county')) continue;
      const starts = String(ev.start_date ?? '').slice(0, 10);
      const ends = String(ev.end_date ?? '').slice(0, 10) || starts;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(starts)) continue;
      // Times from the feed (#230), for a single-day pantry with a set time.
      const t0 = String(ev.start_date ?? '').slice(11, 16);
      const t1 = String(ev.end_date ?? '').slice(11, 16);
      const oneDay = (ends || starts) === starts && !ev.all_day;
      const times = oneDay && realTime(t0) ? { start_time: t0, ...(realTime(t1) && t1 > t0 ? { end_time: t1 } : {}) } : {};
      const v = Array.isArray(ev.venue) ? null : ev.venue;
      const place = v?.venue ? plain([v.venue, v.city].filter(Boolean).join(', ')) : '';
      // A full place for the Directions button, only when the feed gives a city.
      // The food bank's own feed is the source for this address.
      const mapPlace = v?.venue && v?.city ? plain([v.venue, v.address, v.city, v.state || 'WV'].filter(Boolean).join(', ')) : '';
      out.push({
        title: 'Mountaineer Food Bank mobile pantry in Monongalia County',
        // Same pattern as hand-written pantry entries, so a hand-checked
        // entry for the same day wins.
        slug: `mfb-mobile-pantry-${starts}`,
        starts,
        ends: ends < starts ? starts : ends,
        org_name: 'Mountaineer Food Bank',
        who_it_is_for: 'Listed by the food bank for Monongalia County.',
        what_to_do: place ? `At ${place}.` : "The food bank's event page has the place.",
        ...times,
        url: ev.url || `${SITE}/food-pantries/`,
        topics: ['food'],
        ...(mapPlace ? { place: mapPlace } : {}),
      });
    }
    return out;
  },
};
