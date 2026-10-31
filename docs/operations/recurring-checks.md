# Recurring checks: what runs on its own and what a person does

Started 2026-10-31 (#752, #718, #793, #863, sprint wave 3, #529). This page lists every recurring upkeep job that a free scheduled check now covers, and what is still a person's job. Nothing here publishes content: every job only opens or updates issues. Cost: $0 (GitHub's free runner, no Claude calls, no accounts or keys).

## One system: the daily Source check

Everything runs inside `.github/workflows/sources.yml` (daily, 11:41 UTC), one request at a time per site, robots.txt and Crawl-delay honored, at most 8 minutes per site.

| Job | What it reads | What it opens | Files |
|---|---|---|---|
| Source check (#16) | Every outside source in `content/` and on the built site | The standing "Source check" issue | `site/scripts/check-sources.mjs` |
| Food pantry watch (#166) | 17 pantry and meal pages | One "Food pantry or meal page changed" issue | `content/watch/food.yaml` |
| Community centers watch (#752) | BOPARC closures, events and center pages, county parks events, Westside and Senior Mons | One "Community center or park event page changed" issue | `content/watch/centers.yaml` |
| Sale and market watch (#718) | Moonlight Market, MRTC Handmade Market, Farmers Market dates | One "Sale or market date page changed" issue | `content/watch/secondhand.yaml` |
| Make it better watch (#793) | City vacancy list, Organizational Arts Grants, WV Public Art grants, WV Community Tree Grants | One "Make it better grant or seat page changed" issue | `content/watch/make-it-better.yaml` |
| Warming shelter watch (#863) | Local news shelter stories, city press releases. November 1 to March 31 only | One "Warming shelter source changed" issue | `content/watch/shelter.yaml` (#978, waits for David) |
| Weekly checklists | Nothing. It writes the week's to-do list for what a robot cannot read | One standing issue per lane, refreshed each week | `content/checklists/*.yaml`, `site/scripts/checklists.mjs` |

## The checklists

Each file in `content/checklists/` is one standing issue labeled `checklist` and `for:duet`. On the first run of each week (Monday), the step rewrites the issue body with that week's list, reopens it if it was closed, and adds a one-line comment so the person is notified. Other days it does nothing.

- **Community centers** (#752): the Dominion Post "Events and opportunities" and "Senior news" columns (a new address each week), and the Smithtown and Cheat Lake Google calendars (Google's robots.txt asks robots to stay out).
- **Sale and market dates** (#718): weekly sources that block robots or change every day, plus a computed list of sale and market dates that passed in the last 4 months (look for the next date). From January 2027, the first week of each quarter adds the shop re-check list, the same one `npm run secondhand-due` prints.
- **Make it better** (#793): weekly city vacancy list and agendas; in the first week of each month the monthly pages from `docs/operations/make-it-better-checks.md` and a computed list of entries that will say "may be out of date" within 30 days; in March and April the budget season and REAP items; in April 2027 the arts grant round.

Preview this week's lists with `npm run checklists` in `site/`. Add or change an item by editing the YAML; `npm run check-content` validates it.

## What still needs a person

- Reading every changed page or checklist item and writing the PR. Food, shelter and money PRs wait for David.
- Facebook-only sources (#459). Meta allows automated reading only through its API.
- Same-evening shelter status. The shelter watch runs once a morning; on a cold night a person confirms with the operator or 211 before the Tonight page (#862) says "open".
- The Adopt-A-Street program page (#710) and other city pages that refuse robots: read in a browser.

## Checked on 2026-10-31: past events and stale warnings

- **Past events do not show.** Every listing (calendar, month view, doors, community centers, markets, recycling, pulse, home page, Food today), the open data API and both .ics feeds keep only events whose last day is today or later, and the site rebuilds every morning (10:17 UTC). On 2026-10-31 there were 184 events (53 hand-written, the rest from feeds) and none had ended. If the morning build stops, the Health check and the upkeep notice (#497) cover it.
- **Stale warnings work and are tested.** Cards and source lines say "may be out of date" after 6 months, 90 days for Make it better entries (#791), and secondhand cards say "Not checked lately" after 4 months. `site/test/data.test.mjs` tests the rule. On 2026-10-31 no record was past its limit (the oldest checks are from October 2026), so no card shows the warning yet. The Make it better checklist now lists entries 30 days before they would.
