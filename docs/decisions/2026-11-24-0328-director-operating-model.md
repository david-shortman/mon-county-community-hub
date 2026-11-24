# David reviews initiatives and samples, not every item

- **Date:** 2026-11-24 (proposed; takes effect when David merges the PR)
- **Decided by:** David, from #2099
- **Decision:** David stops approving changes one at a time. He sets the rules, approves each initiative's plan, and spot-checks 5 merged high-stakes PRs a week. High-stakes content merges after an independent second check instead of waiting for him. His queue has a cap of 10 open PRs, a short list of at most 10 items a week, and a 14-day deadline after which the recommended answer applies (except outside contact, money, accounts, secrets, rule changes and legal holds). Verification calls go on a call list, not to David. The rules are in `docs/COORDINATION.md` under "When a PR waits for David", "Keeping David's queue small" and "Initiatives".
- **Why:** On Nov 23 there were 280 open issues and 53 open PRs. 179 items waited on David (#2091), the oldest from Oct 28. Last week's list (#2049) got no answers. 50 of the 53 open PRs were waiting on David, and 32 of them had been open since Nov 14. Agents produce high-stakes work much faster than one person can read it, so approving each item is now the main thing slowing the project down. Ready help pages on SNAP, WIC, housing and health care have sat unpublished for 9 days. A second check by a different session, followed by David's spot-check, still catches errors without putting him in front of every change.
- **Cost:** $0. Second checks add about one short session per high-stakes PR.
- **Limits:** Crisis line numbers, the crisis strip and tonight's shelter status still wait for David. So does anything that speaks for the project, including blog posts. If spot-checks find a serious error two weeks in a row, high-stakes PRs go back to waiting for David until the retro finds the cause.

## Starting initiatives

Each becomes a GitHub milestone. David approves or edits each plan once.

| # | Initiative | Goal | What is open now |
|---|---|---|---|
| 1 | Get found | People who search for help find our answer pages | #89 search engine accounts, #1727 `www` warning, findability checks |
| 2 | Getting through the month | Plain, sourced help pages for housing, food, money, benefits and health care | About 30 PRs, such as #1868, #1871, #1876, #1948 and #2005 |
| 3 | Fact checking | Every fact on the site is confirmed on a current official page | About 120 `needs-verification` issues, #165 who makes calls, #1850 second-check rules |
| 4 | Partners and shared data | Local groups use, link to or share data with the hub | #23, #24, #26, #922, #1353, #1937 |
| 5 | Public voice | People understand what the project is and how it works | Blog PRs #1811, #1817, #1825, #1835, #1841; #1870; Chronicle |
| 6 | Explore and tools | People can browse, save and print what fits them | Topics explorer PRs #2036 to #2041, town pages #1899, #1916, MCP server #1370 |
| 7 | Local government | Residents can follow what their councils and commission decide | Agenda guides, #2084 meeting records |
| 8 | Upkeep | The pipeline stays healthy and cheap | Process PRs #2050, #2051, #2052, #2092, #2093; daily re-checks; scorecard |

Items on `hold: legal` (#99, #400, #403, #408, #410) stay paused and are not an active initiative.

## Switching over

After David merges the rules PR, these follow-up PRs make the tools match. Rule and settings changes among them still wait for David. The rest merge on their own.

1. `site/scripts/high-stakes.mjs` labels the narrow list `for:david` and the rest `high-stakes`. Takedowns get neither (this replaces #2092's build step).
2. `scripts/safe-merge.sh` refuses a `high-stakes` PR until the second check verdict passes (#1850, item 3).
3. The Monday retro task writes the initiatives review, the short decision list, and the 5-PR spot-check sample. It applies 14-day defaults.
4. Create the 8 milestones and file every open issue and PR under one of them.
5. Re-sort the current backlog under the new rules: high-stakes PRs get second checks and merge; `needs-verification` issues that only need a call move to the call list and lose `for:david`; decision items older than 14 days get their recommended answer, unless they are on the never-by-default list.
