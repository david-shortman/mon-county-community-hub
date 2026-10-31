# Arts, culture and community event sources for the calendar

Last checked: 2026-10-30
For issue #218.

Each source below was fetched on 2026-10-30. "Tier" uses the three tiers in `content/README.md`: live feed, watched page, or hand-checked.

## Sources with a working machine feed

| Source | Feed | What we saw | Tier |
|---|---|---|---|
| Monongalia Arts Center (MAC) | Google Calendar iCal: `https://calendar.google.com/calendar/ical/56d22ade1ef4e02b8eddb9fe26435b043cfa785f0123a23adc4abf5c85ec826a%40group.calendar.google.com/public/basic.ics` (the calendar embedded on monartscenter.com) | HTTP 200, 715 events, 29 on or after Oct 31, 2026 (for example "Screen Printing course starts," Nov 7; "Acrylic Painting Workshop," Nov 9). Mostly classes, some paid. | Live feed |
| Morgantown Farmers Market | Google Calendar iCal: `https://calendar.google.com/calendar/ical/morgantownfarmersmarket%40gmail.com/public/basic.ics` (embedded on morgantownfarmersmarket.org) | HTTP 200, 50 events, 1 upcoming: "Morgantown Winter Farmers Market @ Mylan Park," Nov 21, 2026. | Live feed |
| Mylan Park | The Events Calendar JSON: `https://mylanpark.org/wp-json/tribe/events/v1/events` (same format as the Mountaineer Food Bank feed the site already reads) | HTTP 200, 18 upcoming events (for example "WV Pickleball Championships," Nov 5; "Shop Til' You Drop Craft Show," Nov 27). Mix of public events, ticketed events and private rentals. | Live feed, with a filter |

## Sources with a feed that does not carry event dates

| Source | Feed | Problem | Tier |
|---|---|---|---|
| The Metropolitan Theatre | RSS: `https://morgantownmet.com/events/feed/` | HTTP 200. Items are shows, but the RSS date is when the post was published, not the show date. Dates appear only in some titles, like "(11/03)." | Watched page |
| Morgantown Area Partnership (Main Street Morgantown) | `https://morgantownpartnership.com/events/feed/` and `/wp-json/tribe/...` | The events feed returned an almost empty RSS; the JSON route returned 404. The main feed carries news, not events. | Watched page |

## Sources with no usable feed today

| Source | Note | Tier |
|---|---|---|
| Arts Council of Greater Morgantown (artsgm.org) | Runs First Friday for the Arts monthly. No events JSON (404). | Watched page |
| Visit Mountaineer Country | Blocks automated reads ("Just a moment"). | Not usable by a robot |
| Morgantown Public Library | Blocked automated reads on 2026-10-30. | Re-check later |
| BOPARC (city parks) | No feed found on the home page. | Watched page |
| Monongalia County Parks and Recreation | Already a live feed (county calendar). | Live feed (done) |

Do not use listings from the Monongalia Historical Society. The WV Secretary of State shows it was dissolved on October 29, 2025 (`docs/research/inactive-orgs.md`).

## Filters each new feed would need

- **MAC:** many entries are paid classes. Keep the class name and say "See the event page for cost," as feed entries already do when a feed is silent.
- **Mylan Park:** skip private rentals and ticketed sports if the feed marks them; otherwise keep the title and link only.
- **Farmers market:** few events; the weekly market itself is not in the feed.

## Next steps

- #761: add adapters for the three live feeds.
- The Met, the Arts Council and Main Street go to page watching (#166).
