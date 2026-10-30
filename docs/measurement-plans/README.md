# Measurement plans

A measurement plan says, before a change ships, what we will measure and how we will judge it. Writing it first stops us from picking whichever number looks good afterward. The reasons and sources are in [the measurement playbook](../playbook/measurement.md#write-a-measurement-plan-before-a-change-ships).

## When to write one

Write a plan for any change we mean to evaluate: a new answer page aimed at a findability question, a new tool, a tagged link, a test of wording or layout. Small fixes do not need one. Their build log entry already names the scoreboard row and a check date ([pipeline step 7](../process/pipeline.md#7-measure)).

## How

1. Copy [`TEMPLATE.md`](TEMPLATE.md) to `docs/measurement-plans/YYYY-MM-DD-<slug>.md` (UTC date, same slug as the build log entry).
2. Fill in every field. Commit it in the same PR as the change, or earlier.
3. On the check date, add the result under "Result", main measure first, even if it is "no change" or "could not measure". Add a "Checked YYYY-MM-DD" line to the change's build log entry too.
4. Never rewrite a field after the change ships. Add a dated line under "Changes" with the reason instead.

Plans are public. Never put a person's name, contact details, or anything that points to one resident in a plan.

## Shared counting rules

These apply to every plan, the scoreboard, and the build log.

### Tagging outbound links

When we tag a link so clicks can be counted, use exactly these labels, all lowercase (the values are case sensitive):

| Label | Value |
|---|---|
| `utm_source` | `monhub` |
| `utm_medium` | `site` for a link on a page, `calendar` for a link in a calendar entry or feed |
| `utm_campaign` | the slug of the page or entry the link is on, for example `utility-bills` |

Example: `https://example.org/apply?utm_source=monhub&utm_medium=site&utm_campaign=utility-bills`

- Never put anything about a person in a tag.
- Only tag a link when its owner has no objection. If unsure, ask through a `for:david` issue. Leave government links that must stay clean, like voter registration, untagged.
- A click is a click toward a partner, not an action. Report it as "clicks toward", never "applications" or "sign-ups".
- Tags only help if someone counts them. Today the site has no analytics (that choice is David's, #41), so tagged links are counted only by partners who share their own numbers, which goes through David (#98).

### Small counts

- Report any count of people or their actions (visits, clicks, sign-ups, feedback) from 1 to 9 as "fewer than 10". Counts of our own things, like pages or questions, can be shown as they are.
- Never publish a breakdown (by day, page, or group) that would let someone work out a count under 10.
- Show the raw count next to any percentage.
- When a total is under 100, add a plain caveat, for example "small numbers, so this could be chance."

### Honest reporting

- Report the main measure first, before anything exploratory.
- Report every plan's result, including "no change" and "could not measure".
- Say "contributed to", never "caused".
- Say what else changed in the same window (deadlines, the season, news, other pages shipping).

## Plans

The plans are the dated files in this folder. Newest first is reverse file name order.
