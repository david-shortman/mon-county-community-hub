# Warming shelter: one source for /tonight/ and /stay-tonight/

**Issue:** #219 (sprint wave, #529)

**The problem.** /stay-tonight/ had a hard-coded "Winter warming shelter" box that said "Last checked October 31, 2026". /tonight/ reads `content/tonight/warming-shelter.yaml`, which the weekly refresh updates. The box never moved, so it went stale.

**What changed:**

- The /stay-tonight/ box now reads the same file as /tonight/ (`loadTonight()` in `site/src/lib/tonight.mjs`). One refresh updates both pages, the text and the checked date. The box spells out only "not announced" and "season over". When the season is running, it sends people to /tonight/, which checks the date again on the phone, so a page saved from an earlier day never says "open" here.
- The checked date wording ("November 15, 2026 at 9:30 a.m.") is one helper, `checkedWhen()`, used by both pages.
- New warning in `npm run check-content`: from November 1 to March 31, if the status was last checked more than 7 days ago, it says so (`tonightStaleness()`). It warns and does not fail. Tests: `site/test/tonight.test.mjs`.
- `content/tonight/warming-shelter.yaml` re-checked on November 15, 2026. Still "not announced". The note now also says Catholic Charities West Virginia has not posted an opening date. Sources: Catholic Charities' news page (official), and the WAJR (August 24) and Dominion Post (August 25) reports as background, each named as news.
- The shelter watch list (`content/watch/shelter.yaml`) now also watches Catholic Charities' news page and Hazel's House of Hope's own warming shelter page.
- New listing: the Rainbow House, Project Rainbow's emergency shelter (22 beds, open 24/7), from the City of Morgantown's PATHWAYS to Help page. It shows on /stay-tonight/ under "A bed tonight".

**What the sources said on November 15, 2026:**

| Source | What it says about this winter's warming shelter |
|---|---|
| Catholic Charities WV (news, press releases, Grace Shelter, locations, search) | Nothing. Newest news post is October 28, 2026, about benefits enrollment. |
| City of Morgantown News Flash | Nothing. Newest release November 12, 2026. |
| City Council minutes (in the August 25 and September 1, 2026 agenda packets) | August 11: "a warming shelter decision is expected at the next MCR board meeting." August 25: the MCR met "to discuss hosting a warming shelter at Hazel's House, pending adequate funding ... with an anticipated opening on November 15." Nothing later in the agendas and minutes read. |
| Monongalia County Commission agendas | The four August regular meeting agendas answer 404. The 26 others from August to November 18 do not mention it. No 2026 minutes are posted. |
| Hazel's House of Hope (hazelshousewv.com) | Its warming shelter page still describes the 2022 to 2023 season. |
| WV Coalition to End Homelessness | Nothing. It ran last winter's shelter on West Run Road, which has since closed and been sold (see `docs/research/inactive-orgs.md`). |
| Salvation Army Morgantown, Milan Puskar Health Right, MECCA 911, Fairmont-Morgantown Housing Authority | Nothing about a warming shelter. |
| Morgantown Housing Authority | Not read: its robots.txt could not be read, so the site's reader read nothing there. |
| WV 211 search | Loads results by script, so a person has to search it. |
| WAJR, The Dominion Post (news, background only) | Nothing newer than August 24 and 25, 2026. |

The discovery is in `docs/discoveries/2026-11-15-warming-shelter-plan-not-on-official-pages.md`. Leads we could not confirm are in a needs-verification issue.

Cost: $0.
