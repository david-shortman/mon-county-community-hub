# Automated reads: robots.txt and terms

Everything the site reads on its own follows one rule, set first for the weekly checklists in #1009 and applied to every automated read in sprint wave 7 (#529):

**Read a page automatically only when the site's robots.txt allows it and its terms do not forbid it. Never work around a block. If a source says no, a person reads it instead, or we leave it out.**

Google Calendar feeds are never read automatically: `calendar.google.com/robots.txt` allows only the home page.

## How the code follows it

- **One check, shared.** [`site/src/lib/robots.mjs`](../../site/src/lib/robots.mjs) reads each site's robots.txt once per run and says whether a path is allowed. Rules for our name (`MonCountyCommunityHub`) win over rules for `*`. Rules aimed at other robots (for example `ClaudeBot` or `GPTBot`) do not apply to us, but nothing here pretends to be another robot either.
- **When unsure, do not read.** A path is skipped if a rule matches it as written, or if it only matches when upper and lower case are ignored. Many local sites run on servers where `/iCalendar/` and `/icalendar/` are the same page.
- **Missing or unreadable robots.txt** (RFC 9309): no robots.txt (a 4xx answer) means everything is allowed. A robots.txt we cannot get (a 5xx answer, a timeout, a dropped connection) means we read nothing on that site in that run. A robots.txt that comes back as an HTML page has no rules.
- **The fetch helper checks before every read.** `fetchWithRetry` in [`site/src/lib/ingest.mjs`](../../site/src/lib/ingest.mjs) (the shared helper from #930) runs the check first and follows redirects one at a time, checking each address. A disallowed path throws `RobotsDisallowed` and is never requested. Calendar feeds, meetings, live numbers and the weather all use it.
- **Feed health says why.** A feed that robots.txt blocks falls back to its saved copy, and `/api/v1/feed-health.json` shows the reason in `error` with `robots_txt_disallows: true`. A feed turned off on purpose shows `status: "off"`.
- **The other readers** use the same module: the daily Source check and the page watchers that ride on it (`site/scripts/check-sources.mjs`; pantry, centers, sales, shelter and Make it better watch lists), the Health check's feed and link checks (`site/scripts/health.mjs`), 311 totals (`check-311.mjs`) and County Health Rankings numbers (`update-chr-indicators.mjs`).
- **Tests:** [`site/test/robots.test.mjs`](../../site/test/robots.test.mjs), run by `npm test` after every build.

## When a source says no

1. Switch to an allowed official source if there is one (the organization's own site, or an official feed its robots.txt allows).
2. If there is none, turn the reader off. For a calendar feed, add `off: { since, reason }` to the adapter. The site keeps its saved events, each still showing the day it was checked, and drops each one when its date passes. Nothing past lingers.
3. Add the source to a weekly checklist in `content/checklists/` with `person: true`, so a person reads it (see [`recurring-checks.md`](recurring-checks.md)).
4. Log a discovery in [`docs/discoveries/`](../discoveries/) if it leaves a gap.

Adding a new automated reader: use `fetchWithRetry`, or call `robotsCheck` before any other `fetch`, and run `node scripts/robots-audit.mjs` in `site/` to see the result.

## What changed on 2026-11-01

| Reader | Before | Now |
|---|---|---|
| Monongalia Arts Center calendar feed | Google Calendar feed | **Off.** Saved events stay until their dates pass. A person reads the calendar on the weekly centers checklist. The center's own site dropped our connection, so no other feed was found. |
| Morgantown Farmers Market calendar feed | Google Calendar feed | **Off.** The saved winter market date stays until it passes. A person reads the market's Markets page (robots.txt allows it; it lists seasons in plain text, not as a feed) on the weekly sale dates checklist. |
| City of Morgantown calendar feed | `common/modules/iCalendar/` | **Blocked by robots.txt** since 2026-10-21 (`Disallow: /common/modules/icalendar/`). The site uses the saved copy, so past events drop and no new ones arrive. A person reads `calendar.aspx` on the weekly centers checklist. |
| Unemployment rate (BLS) | `api.bls.gov` | **Blocked by robots.txt** (`Disallow: /`). The site shows the saved number with the date it was read. `data.bls.gov` also says `Disallow: /`, and `www.bls.gov` and `download.bls.gov` refuse automated reads. |
| Weather in the header | `api.weather.gov` (`Disallow: /`) | **Switched** to the forecast page's JSON on `forecast.weather.gov`, which has no robots.txt. Same NWS forecast for downtown. |

## Per-host results

From `node scripts/robots-audit.mjs` in `site/`. Rerun it to refresh this table. It lists only addresses the code reads; pages people visit by link are not read.

Checked 2026-11-01.

| Reader | Address | robots.txt |
|---|---|---|
| Calendar feed: deckers-creek | `deckerscreek.org/events.ics` | allowed |
| Calendar feed: monongalia-arts-center | `calendar.google.com/calendar/ical/56d22ade1ef4e02b8eddb9fe2...` | **not allowed** (Disallow: /), turned off 2026-11-01 |
| Calendar feed: monongalia-county | `www.monongaliacounty.gov/_assets_/plugins/revizeCalendar/calendar_data_handler.php` | allowed |
| Calendar feed: morgantown-city | `www.morgantownwv.gov/common/modules/iCalendar/iCalendar.aspx` | **not allowed** (Disallow: /common/modules/icalendar/) |
| Calendar feed: morgantown-farmers-market | `calendar.google.com/calendar/ical/morgantownfarmersmarket%4...` | **not allowed** (Disallow: /), turned off 2026-11-01 |
| Calendar feed: morgantown-library | `events.mympls.org/ical_subscribe.php` | allowed |
| Calendar feed: mountaineer-food-bank | `mountaineerfoodbank.org/wp-json/tribe/events/v1/events` | allowed |
| Calendar feed: mylan-park | `mylanpark.org/wp-json/tribe/events/v1/events` | allowed |
| Meetings: morgantown-agendacenter | `www.morgantownwv.gov/AgendaCenter` | allowed |
| Meetings: monongalia-county-commission | `www.monongaliacounty.gov/commission/meeting_schedule/index.php` | allowed |
| Live number: bls-laus-monongalia | `api.bls.gov/publicAPI/v1/timeseries/data/LAUCN540610000000003` | **not allowed** (Disallow: /) |
| Live number: cdc-places-monongalia | `data.cdc.gov/resource/swc5-untb.json` | allowed |
| Weather in the header | `forecast.weather.gov/MapClick.php` | allowed |
| 311 totals | `seeclickfix.com/api/v2/places` | allowed |
| 311 totals | `seeclickfix.com/api/v2/issues` | allowed |
| County Health Rankings numbers | `www.countyhealthrankings.org/sites/default/files/media/document/analytic_data2025_v3.csv` | allowed |
| County Health Rankings numbers | `www.countyhealthrankings.org/sites/default/files/media/document/chr_trends_csv_2025.csv` | allowed |
| Page watch: centers | `www.boparc.org/public-notices--parkfacility-closures.html` | allowed |
| Page watch: centers | `www.boparc.org/events--activities.html` | allowed |
| Page watch: centers | `www.boparc.org/marilla-recreation-center.html` | allowed |
| Page watch: centers | `www.boparc.org/wiles-hill-community-center.html` | allowed |
| Page watch: centers | `www.boparc.org/dorseys-knob-lodge.html` | allowed |
| Page watch: centers | `www.monongaliacounty.gov/parks_and_rec_events/` | allowed |
| Page watch: centers | `www.westoverwv.org/westside-senior-center` | allowed |
| Page watch: centers | `www.seniormons.org/blank-4` | allowed |
| Page watch: food | `motownchristianhelp.com/contact-us/` | allowed |
| Page watch: food | `motownchristianhelp.com/programs/` | allowed |
| Page watch: food | `www.srsh.org/` | allowed |
| Page watch: food | `www.srsh.org/faq` | allowed |
| Page watch: food | `www.srsh.org/free-market` | allowed |
| Page watch: food | `www.stmarystarcity.com/st--ursula` | allowed |
| Page watch: food | `morgantown.salvationarmypotomac.org/morgantown/how-we-help` | allowed |
| Page watch: food | `www.morgantowncommunitykitchen.com/` | allowed |
| Page watch: food | `www.seniormons.org/blank` | allowed |
| Page watch: food | `morgantownwvmow.org/` | allowed |
| Page watch: food | `moncountyfamilysupportcenter.org/food-pantry/` | allowed |
| Page watch: food | `www.firstpresmorgantown.org/community-missions` | allowed |
| Page watch: food | `www.pantryplusmore.org/mobile-food-giveaways/` | allowed |
| Page watch: food | `mountaineerfoodbank.org/food-pantries/` | allowed |
| Page watch: food | `www.unitedwaympc.org/food-hunger` | allowed |
| Page watch: food | `www.unitedwaympc.org/sites/unitedwaympc/files/Monongalia%20C...` | allowed |
| Page watch: food | `www.morgantownwv.gov/708/PATHWAYS-to-Help` | allowed |
| Page watch: make-it-better | `www.morgantownwv.gov/210/Volunteer-Opportunities` | allowed |
| Page watch: make-it-better | `ycfwv.org/arts-fund-grants/` | allowed |
| Page watch: make-it-better | `wvculture.org/agencies/arts/grants/` | allowed |
| Page watch: make-it-better | `wvforestry.com/urban-forestry` | allowed |
| Page watch: secondhand | `www.wvmoonlightmarket.com/` | allowed |
| Page watch: secondhand | `montrails.org/mrtc-handmade-market` | allowed |
| Page watch: secondhand | `morgantownfarmersmarket.org/markets.html` | allowed |
| Page watch: shelter | `www.dominionpost.com/tag/warming-shelter/` | allowed |
| Page watch: shelter | `www.dominionpost.com/tag/hazels-house-of-hope/` | allowed |
| Page watch: shelter | `wajr.com/` | allowed |
| Page watch: shelter | `www.morgantownwv.gov/CivicAlerts.aspx` | allowed |

Notes on the results:

- `events.mympls.org` asks for a 10 second pause between reads and `seeclickfix.com` for 15. Each run makes one or two reads there, well inside that.
- `seeclickfix.com` disallows `/issues` and `.json` addresses, and `ClaudeBot`. Our 311 reads use `/api/v2/...` under our own name, which its rules allow.
- `www.morgantownwv.gov` asks AI crawlers (a named list) to stay out of `/calendar.aspx` and `/CivicAlerts.aspx`. Those rules are not for our name, so the shelter watch still reads `CivicAlerts.aspx`.
- Some watched pages allow robots in robots.txt but refuse automated reads anyway (WV Forestry, WV arts grants). Those carry `person: true` on their checklists (#1009).
- `www.monongaliacounty.gov` has no robots.txt (404), so everything is allowed.

## Terms

robots.txt is the main signal. We also respect terms we know of: BLS says bot activity that does not follow its usage policy is not allowed, so with its robots.txt saying no we do not read it. If a site's terms forbid automated reads, treat it the same as a robots.txt block.
