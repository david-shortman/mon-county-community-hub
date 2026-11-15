# Freshness by kind of fact

Some facts go stale fast and some barely change. A pantry's hours can change with the season; its street address changes only if it moves. This page sets how long each kind of fact stays fresh, so re-reads go first to the facts most likely to be wrong. It answers #1093.

Cost: $0. A short settings file and a Health check line.

## The layers, from fastest to slowest

A listing's re-check date is the **shortest** window that applies to it.

| Layer | Window | Where it is set |
|---|---|---|
| Crisis, shelter and food-today details | 7 days | `content-recheck-weekly` in the Health check (#494) |
| An event that starts in the next 14 days | Read within the last 30 days | `upcoming_event` in [`content/recheck-windows.yaml`](../../content/recheck-windows.yaml) |
| Hours (`hours`, `opening_hours`, `meetings`, `best_time`) | 90 days | `recheck-windows.yaml` |
| High-stakes topics and every calendar entry | 90 days | The risk rubric, `recheckDaysFor()` (#1461) |
| Costs, who can get help, what to bring | 180 days | `recheck-windows.yaml` |
| Everything else | 6 months (90 days for Make it better and boards) | `staleDaysFor()` in `site/src/lib/content.mjs` |
| Phone and address | 365 days | `recheck-windows.yaml`. Shorter layers above usually apply first. The daily Source check also looks for each phone on its source every day. |

A record can still set `recheck_days` to go faster ([content README](../../content/README.md), "Re-check cadence"). The fact windows never make a listing slower than its risk tier.

Why these numbers: hours move with seasons, staffing and holidays; income limits and fees usually change once or twice a year, often in January or July; phones and addresses change when a group moves. These are house rules, not an outside standard. Change a number in `recheck-windows.yaml` and say why in the PR.

## What uses it today

- **The Health check line `content-recheck-by-fact`** lists every listing past the window for the facts it states, oldest first, with the reason ("hours", "starts 2026-11-20, within 14 days"). Duet re-reads from that list, the same way as `content-recheck-on-time`.
- **`npm run check-content`** fails if `recheck-windows.yaml` has a bad number or a kind with no fields.
- **Tests:** `site/test/fact-windows.test.mjs`.

On November 14, 2026 every listing is within its window. By January 31, 2027, about 390 listings come due under the fact windows, against about 320 under the risk tier alone, so the fact windows add about 70 re-reads in that stretch, mostly hours.

## What waits for David

Cards say "may be out of date" by the risk tier today, never later than 6 months (#1519, which David approved). Moving cards to the fact windows would change what residents see on hundreds of cards and the promise on About, Hard questions and How we check, so it is not done here. To do it, `staleDaysFor()` would use `factWindow()` from `site/src/lib/fact-windows.mjs`, in a PR labeled `for:david`.

Hiding a listing that is past its window is also not automatic. A person hides one with `hidden.reason: overdue` when a re-read cannot be done ([content README](../../content/README.md), "Hiding an item").

## Sources checked

House rules built on the risk rubric in [trust and AI](trust-and-ai.md#risk-rubric) and the re-check cadence from #1461. No outside source. Written November 14, 2026.
