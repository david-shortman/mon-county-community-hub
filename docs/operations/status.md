# Health status

Latest health check run by hand. The newest run is at the top. For what each check means and who reacts, see [the runbook](README.md).

## 2026-10-28 baseline

**Overall: FAIL.** The site itself is fine for residents today. The pipeline is down: no GitHub Actions run has started since about 04:15 UTC, so nothing merged after that is reaching the site.

- **Site:** up. All pages return 200, missing pages return 404, `calendar.ics` parses with 7 upcoming events, 11 of 12 outbound links work (see below), no basic accessibility problems, no content past its re-check date.
- **Pipeline:** every Site and Claude workflow run since about 04:15 UTC ends in `startup_failure` before any step runs (100 of the last 100 runs on `main`). The last good deploy was at 03:59 UTC. Eight PRs merged after that (#32, #43, #52, #45, #57, #54, #53, #78) are not live yet. The `main-deployed` check below shows OK only because it waits 30 minutes before flagging a commit; it will turn FAIL on the next run. Tracked in #66 (`for:david`), with an open incident in [`incidents/2026-10-28-actions-startup-failure.md`](incidents/2026-10-28-actions-startup-failure.md).
- **Warnings:** four open PRs have merge conflicts (#68, #65, #34, #29). Three of them conflict in `docs/build-log.md` and three in `docs/decisions.md`, since every PR adds to the top of those files. The `up-next` queue is empty. One link (the city election page) reset the connection once; it worked on the run before, so it is likely a blip.
- **Found by reading the code:** `calendar.ics` does not escape semicolons in event text. No current entry has one, but feed entries could. Filed as #77 (`for:code`, `bug`). The health check now flags it.
- **Live feeds** (#31, merged in #53 but not yet deployed): all 3 feed sources respond.

<details>
<summary>Full report</summary>

### Health: FAIL

Checked 2026-10-28T04:37:08.515Z against https://david-shortman.github.io/mon-county-community-hub/ and david-shortman/mon-county-community-hub.

| Status | Check | Area | Summary | Who reacts |
|---|---|---|---|---|
| FAIL | actions-main | pipeline | Latest run is failing for: Site (startup_failure), Claude (startup_failure). 100 of 100 runs on main failed in the last 24 hours. | David (repo or account Actions settings) |
| WARN | links | product | 0 broken and 1 unverified of 12 outbound links. | Claude Code (fix the link), Duet (find the new page) |
| WARN | prs-conflicts | pipeline | 4 PRs have merge conflicts. | PR author (rebase, keep every build-log entry) |
| WARN | up-next-queue | pipeline | The up-next queue is empty (29 unclaimed for:code issues could be queued). | Duet or the daily run (pick and label the next issue) |
| OK | site-up | product | Home page returns 200. |  |
| OK | pages-200 | product | All 3 site pages return 200. |  |
| OK | not-found | product | Missing pages return 404. |  |
| OK | deploy-fresh | product | Live site was built 2026-10-27. |  |
| OK | ics-parses | product | calendar.ics parses with 7 events. |  |
| OK | ics-entries | product | 7 upcoming events in the feed, 6 start after 2026-11-11. |  |
| OK | content-recheck | product | No entries past their re-check date (0 due within 30 days). |  |
| OK | content-upcoming | product | 5 hand-checked entries are in the next 62 days on main. |  |
| OK | feeds | product | All 3 live feeds respond. |  |
| OK | a11y-basic | product | No basic accessibility problems (lang, title, one h1, alt text, link text, heading order). |  |
| OK | deploy-age | pipeline | Last successful Site deploy was 0.6 hours ago. |  |
| OK | main-deployed | pipeline | Everything merged to main is live. |  |
| OK | prs-old | pipeline | 4 open PRs, none older than 3 days. |  |
| OK | issues-stuck | pipeline | No in-progress issues have gone quiet. |  |
| OK | for-david | pipeline | 6 open issues wait for David. |  |
| OK | daily-run | pipeline | Newest build-log entry is from 2026-10-28. |  |

#### Details

**actions-main**

- Site: https://github.com/david-shortman/mon-county-community-hub/actions/runs/40633191222
- Claude: https://github.com/david-shortman/mon-county-community-hub/actions/runs/40633067870

**links**

- unverified: https://morgantownwv.gov/313/Election-Information (ECONNRESET) on calendar/morgantown-city-council-election-2027.yaml

**prs-conflicts**

- #68 Propose the Chronicle workflow: daily snapshots and weekly dispatch (for:david)
- #65 Findability baseline: 32 resident questions, first scores, scoreboard
- #34 Propose a work pipeline and a Claude review gate (for:david)
- #29 Write Duet's role into COORDINATION.md (for:david)
- shared conflict file: docs/build-log.md in 3 PRs
- shared conflict file: docs/decisions.md in 3 PRs

</details>
