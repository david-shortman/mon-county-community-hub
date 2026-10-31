# 0007: Four freshness tiers: live, derived, watched, re-checked

Status: proposed, 2026-10-31 (#122)

## Context

Residents act on what the site says: a phone number, an address, an hour, a date. Facts go stale quietly. #122 set out a design (David, Oct 28): prefer live data, then facts stored with their sources, then machines watching sources for change, then scheduled re-checks, with Claude used only where a person's judgment is needed. Much of it now exists, built in separate PRs. This record ties the pieces together so new work fits one pattern.

## Decision

Every fact on the site comes from one of four tiers. Use the highest tier a source supports.

| Tier | What it is | Where it lives today | Claude used? |
|---|---|---|---|
| 1. Live | Pulled from a source's own feed or data at every daily build. The page says where it came from and when. If the source is down, the last good saved copy is used, and the build never fails | Calendar feeds (`site/src/lib/feeds/`), meetings (`site/src/lib/meetings/`), community numbers (`site/src/lib/indicators/`). Each keeps saved copies in a `snapshots/` folder and has an `npm run update-*` script | No |
| 2. Derived (stored facts) | A record in `content/` with `sources` (url and `checked` date) for every fact. Pages render facts from records, not from text typed into templates | `content/orgs`, `content/resources`, `content/calendar`, `content/places` and others. The recycling page reads its phones, addresses and hours from records (#146) | Only to write or correct a record |
| 3. Watched | A daily job with no Claude calls fetches every source page, notes when its text changes, and flags broken or moved links and phone numbers that vanished | `site/scripts/check-sources.mjs` (#16), its registry rules in `content/source-rules.yaml` | No |
| 4. Re-checked | A person or agent re-reads the source for facts that are past due or whose source changed, then confirms (bumps `checked`) or corrects (a PR) | The Health report lists past-due records (6 months; weekly for crisis, shelter and food-today details, #494). Duet's sweep picks them up | Yes, only for due or changed facts |

Rules that hold across tiers:

- **A fact shows its source and checked date.** The card's source line uses the oldest `checked` date across its sources, so nothing looks fresher than its stalest source (#39).
- **Stale facts say so on the page.** Past 6 months, the source line adds "This may be out of date, so check with them before you go." The API and the MCP server mark the same records `stale` (ADR 0003).
- **Machine-read facts say they are machine-read.** Feed and page-reader records keep the fetch time and the page they came from (ADR 0002).
- **No facts typed into templates.** A page that needs a fact with no record yet adds the record first. Short context that is not a resident-facing fact (like how to read a chart) may stay in the page.

## What is still open

- Some pages still hold facts in their templates (for example, a few sentences on the recycling page quote a hauler's checklist with a page-level source list). Moving them into records is page-by-page work, best done by the lane that owns each page.
- "Source changed" from tier 3 already lands in one standing "Source check" issue, with the records that use each source (`site/scripts/source-issue.mjs`). It does not yet open one issue per changed source with a `source-changed` label, as #122 first sketched; one standing issue may be enough, and is easier on the issue list.
- Per-fact `recheck_days` by volatility (hours about 90 days, addresses and phones about 180) is not in the schemas yet. Today one 6-month rule applies, plus the weekly rule for high-stakes details. Adding an optional field is backward compatible.
- Pages could expose `dateModified` (their oldest fact) in structured data. The JSON-LD from #37 is the place to add it.

## Consequences

- Good: one pattern for every new source. A new feed or reader copies the tier 1 shape (fetch, parse, saved copy, update script); a new fact gets a record.
- Good: Claude's budget goes only to facts that are due or changed.
- Cost: moving the last template facts into records takes small PRs in other lanes.
