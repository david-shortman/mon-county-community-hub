# Watch plan: winter warming shelter sources

Issue #863, building on #219 and the Tonight page (#862). Written 2026-10-31.

Warming shelter news comes out late and in pieces: a funding vote, a site, an opening date, then "open tonight" on cold nights. Today a person checks once a week (#219). This plan adds a daily robot check, November 1 to March 31, that tells a person when a source moved. It never changes the site.

## How it works

It is one more watch list inside the daily Source check, the same system as the pantry watch ([plan](2026-10-31-pantry-watch.md)). No new workflow.

1. **The list.** [`content/watch/shelter.yaml`](../../content/watch/shelter.yaml) names each source and the part of the page to compare.
2. **The season.** The list has `season: 11-01 to 03-31` (Morgantown dates). Outside it the list is skipped, and its saved state is dropped, so each winter starts fresh.
3. **The words.** The list has `words` such as "warming shelter", "code blue" and "open tonight". They do two things:
   - On the **first check of the season** (November 1), a page that already mentions one of them opens the issue, so a person starts the winter with a fresh read.
   - On **every change**, the issue shows the lines around each word ("Mentions: ..."), so the person can tell a shelter story from a gingerbread contest without opening the page.
4. **What counts as a change.** The watched part of the page (the story list, between `start` and `end`) changed. A page that could not be read is not a change.
5. **What happens.** One issue, "Warming shelter source changed: re-check before changing the site", labeled `source-changed` and `for:duet`. Later changes are added as comments while it is open. The issue carries this list's own instructions (`todo`), not the pantry ones.
6. **What a person does.** Read the source. If it says the shelter is open or gives a date, place, hours or rules, confirm it with a same-day source (the operator, 211, or a same-day news report), then update `content/tonight/warming-shelter.yaml` (once #862 merges) or the dated line on `/stay-tonight/` in a PR. Shelter PRs wait for David. Close the issue when done.

**Never auto-publish.** The job can write issues only. It has no write access to the repo, so it cannot mark a shelter open. The Tonight page shows "Open" only when a person's check is from today (#862).

## The sources

Checked 2026-10-31. Every marker was tested against the live page that day.

| Source | Kind | Why |
|---|---|---|
| Dominion Post `warming-shelter` tag page | page | Local news lists each shelter story here, newest first |
| Dominion Post `hazels-house-of-hope` tag page | page | The planned site for this winter, per August 2026 reports |
| WAJR search for "warming shelter" | page | Local radio news, newest first. robots.txt allows it |
| City of Morgantown News Flash | page | City press releases. Every new release changes it; the Mentions lines show whether it is about the shelter |
| Catholic Charities WV, Grace Shelter page | blocked | The planned operator. The site resets automated connections, so a person checks it |

Not watched, and why:

- **Facebook posts** by the operator or the city: Meta allows automated reading only through its API (#166). A person checks them.
- **211:** a phone and chat service, not a page with shelter status.
- **Hazel's House of Hope's own site** (`hazelshouseofhope.org`): on 2026-10-31 it showed only a default "Hello world!" post, nothing about the shelter.
- **County news:** the county site has no news list we could find for robots. County Commission votes show up in the news sources above.
- **"Code blue":** Mon County has no published code blue alert page that we found. The word is on the list in case a source starts using it.

## How often

- **Daily**, inside the Source check (11:41 UTC, about 7:41 a.m. in Morgantown). That is enough to catch an announcement. It is not a same-evening status check: on a cold night, a person still confirms "open tonight" with the operator or 211 before updating the page.
- **Weekly**, the person's own read for #219 continues until the shelter opens.

## Politeness and cost

Four extra pages a day on three sites, one request at a time per site, robots.txt and Crawl-delay honored (the city asks for 10 seconds). Cost: $0, on the free GitHub runner, with no Claude calls, accounts or keys.
