// Mountaineer Food Bank mobile pantry dates in Monongalia County, from the
// food bank's public events API (The Events Calendar plugin for WordPress).
// Human page: https://mountaineerfoodbank.org/food-pantries/
import { plain } from '../util.mjs';

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
      const v = Array.isArray(ev.venue) ? null : ev.venue;
      const place = v?.venue ? plain([v.venue, v.city].filter(Boolean).join(', ')) : '';
      out.push({
        title: 'Mountaineer Food Bank mobile pantry in Monongalia County',
        // Same pattern as hand-written pantry entries, so a hand-checked
        // entry for the same day wins.
        slug: `mfb-mobile-pantry-${starts}`,
        starts,
        ends: ends < starts ? starts : ends,
        org_name: 'Mountaineer Food Bank',
        who_it_is_for: 'Listed by the food bank for Monongalia County.',
        what_to_do: `${place ? `Location: ${place}. ` : ''}See the event page for the time and place.`,
        url: ev.url || `${SITE}/food-pantries/`,
        topics: ['food'],
      });
    }
    return out;
  },
};
