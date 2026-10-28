// Fetches every live calendar feed and saves the results to
// src/lib/feeds/snapshots/. Commit the changed files so the site has a
// recent copy to fall back on if a feed is down at build time.
import { loadFeedEntries } from '../src/lib/feeds/index.mjs';
import { todayYmd } from '../src/lib/content.mjs';

const entries = await loadFeedEntries({ today: todayYmd(), live: true, save: true });
console.log(`Saved ${entries.length} feed entries.`);
