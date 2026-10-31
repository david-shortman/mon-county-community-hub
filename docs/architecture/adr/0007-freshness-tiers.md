# 0007: Keep facts fresh in four tiers: live, derived, watched, re-checked

Status: proposed 2026-10-31 (#122, David's design from October 28).

## Context

Pages mixed two kinds of content. Dates came from live feeds and checked records and were refreshed every day. But many sentences were typed straight into page templates (addresses, hours, phone numbers, the glass rule) under one hand-written "checked" date. Nothing noticed when a source changed, nothing marked a sentence as it aged, and nothing re-checked it on a schedule.

## Decision

Prefer the highest tier a fact allows:

1. **Live.** Pulled from a feed or API at each daily build (`site/src/lib/feeds/`). Cards say where and when it was pulled. When a feed fails, the build uses the last good snapshot.
2. **Derived facts.** A sentence a page needs that has no feed lives in the fact store: `content/facts/<topic>/<slug>.yaml`, with the `text` shown, the exact words it is based on (`quote`), its `source`, the `checked` date and `recheck_days`, set by how fast the fact changes (a definition about 365, a phone number about 180, hours about 90, a program waiting on a date about 30). Pages render facts with the `Fact` component and never type facts into templates. Records in `orgs/` and `resources/` stay the home for listings; facts are for the sentences around them.
3. **Watched sources.** The daily source check (`site/scripts/check-sources.mjs`, #16) already reads every web address in `content/`, facts included, stores a fingerprint of each page, and lists pages that changed in one standing `source-check` issue, with the files that use them. It uses no Claude.
4. **Scheduled re-checks.** A fact past `recheck_days` shows "This may be out of date" on the page by itself, and the Health check lists it (`facts-due`), oldest first. Duet's sweep re-reads due facts and facts whose source changed: it confirms (updates `checked`) or corrects (a PR). No separate Claude run.

## Guarantees

- `npm run check-content` fails if a fact lacks text, quote, source, checked date or re-check window, and a page that names a missing fact fails the build.
- The page shows the stale note with no one acting.
- Tiers 1 to 3 cost nothing. Claude only runs for facts that are due or changed, inside runs that already happen (`docs/operations/budget.md`).

## Consequences

- Good: every sentence has its own date and source, and its own clock.
- Good: re-checking is a list, not a hunt through templates.
- Limit: moving a page to facts is hand work, one page at a time. `/recycling/` is first; other pages follow as they are touched.
- Not yet: `dateModified` in structured data from the oldest fact (#37).
