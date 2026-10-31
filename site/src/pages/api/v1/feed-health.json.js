// /api/v1/feed-health.json: how each live calendar feed did in this build
// (#71): live, snapshot (the live fetch failed and the saved copy was used)
// or skipped, with the entry count and fetch time. The Health check and
// anyone reusing the calendar can see a feed that breaks or goes quiet.
import { loadCalendarWithFeeds } from '../../../lib/content.mjs';
import { feedHealth } from '../../../lib/feeds/index.mjs';

export async function GET() {
  await loadCalendarWithFeeds();
  const body = { generated: new Date().toISOString(), feeds: feedHealth() };
  return new Response(JSON.stringify(body, null, 2) + '\n', { headers: { 'Content-Type': 'application/json' } });
}
