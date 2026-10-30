# 2026-10-30: Works offline and can be added to the home screen (#150)

- **Considered:** many residents have spotty signal in the hills or pay for data by the gigabyte. The pages a person needs most (Help now, food today, the doors) should open with no signal once seen, and nobody should act on an old date without knowing it is old.
- **Chose:** a small service worker built with the site, with no library and no outside service. Cost: $0.
- **Shipped:**
  - `site/src/pages/sw.js.js` builds `/sw.js`. Pages try the network first; with no answer in 4 seconds or no network, the saved copy shows with a note at the top: "Saved copy from 12:43 a.m. on October 30, 2026. You are offline, so dates, hours and phone numbers may have changed since then." A page that is not saved yet shows Help now with a note saying so.
  - The first visit saves only Help now (about 9 KB), so first visits stay inside the weight budget. From the second page on, the home page, door pages, Dates and Food today are saved (about 85 KB once, then at most once a week). Data Saver keeps it to Help now. Everyone gets the same saved list, so it does not show which of those pages a person looked at.
  - `site/public/manifest.webmanifest` and icons drawn from our favicon (192, 512, maskable and Apple touch), with hill green theme colors for light and dark. `site/src/components/AppShell.astro` adds them to every page's head with a one-line script.
  - No accounts, no tracking, no push messages.
- **Tested** with Playwright in Chromium: saved pages and `?pick=` links open offline with the note, an unsaved page falls back to Help now, the note is gone once back online, pages work with the worker blocked, and no page errors. First visit to Stay tonight measured about 20 KB including the worker.
- **Scoreboard:** none directly.
