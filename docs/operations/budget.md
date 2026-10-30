# Budget and pacing

The project runs on David's Claude plan, which he also uses for other work. **Target: the project leaves David at least 50 to 60% of his weekly Claude usage free.** The week resets Sunday at 8 AM Central.

## How we stay in range

Agents cannot see the plan's weekly usage meter, so we pace by schedule and by run size, and David (or the weekly budget check) adjusts when the meter says so.

| Lever | Normal pace | Lean pace (when over) | Push pace (when well under) |
|---|---|---|---|
| Scheduled build runs | 3 a day: 5:41 AM, 12:41 PM and 6:41 PM Eastern (David, 2026-10-29) | 1 every other day | 3 a day (more only if David says so) |
| Instant builds (`up-next`) | At most 1 labeled at a time, so about 2 a day | Paused (Duet adds no labels) | 1 or 2 labeled at a time |
| Duet sweeps | 2 a day, lean | 1 a day | 2 a day |
| Weekly jobs (findability, visibility, retro, chronicle) | Weekly | Visibility skipped that week | Weekly |
| Parallel one-off sessions | Only when David asks | None | Only when David asks |
| Claude review on PRs | Only PRs that change `site/` or `content/` | Same | Same |

## Rules for every agent

- **One digestible chunk per run.** Each scheduled build takes the next real piece of bigger work (a page, a flow, a feed, a tool), finishes it, and stops. Do not go looking for extra work. (David, 2026-10-30: "I don't just want you dealing with small stuff in these scheduled runs, but just taking on digestible chunks each time.")
- **Size to the run, not to the issue.** If an issue is bigger than one run, ship its first complete slice and leave the next step on the issue. Small fixes are for things that are wrong or unsafe on the live site.
- **Read only what you need.** Skim indexes and the newest few log files, not whole folders.
- **No retries in a loop.** If something fails twice, comment and stop.

## Checking

- A weekly budget check (Thursdays) compares this week's runs against the target and sets the pace for the rest of the week.
- David glances at Settings, then Usage. If the weekly meter is above about 40% before Thursday, switch to lean pace (tell the coordinating session or comment on #81).
- The Monday retro records the pace used, what shipped per run, and recommends next week's pace in the plan.
