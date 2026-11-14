# Running the blind second check

David chose a blind second check for high-stakes items on #97 (October 30, 2026). [Trust and AI](trust-and-ai.md#the-independent-second-check) says what it is and why: a different session checks each claim on its own, without seeing the first session's sources, and a mismatch blocks the merge. This page is how to run it, step by step, with the tools that make it repeatable. It answers #1098.

## When it is needed

A PR needs a second check when it adds or changes a record in `content/orgs/`, `resources/`, `calendar/`, `secondhand/`, `boards/` or `places/` that is top tier: a topic of `health`, `money`, `housing`, `family`, `taxes` or `voting`, any `calendar/` entry, or a record the risk rubric scores 6 or more. Hiding a record does not need one (taking a wrong item down never waits), and the verdict skips hidden records.

## The steps

1. **The author makes the claim packet.** From `site/`:
   ```
   node scripts/second-check.mjs claims > ../claims.md
   ```
   It lists one row per field (hours, phone, cost, who it is for, address, dates) for each top-tier record the branch adds or changes, and nothing else: no source links, no URLs from the text, no file paths, no notes. Name files to make a packet for them instead (`node scripts/second-check.mjs claims resources/example.yaml`). Do not commit `claims.md`.
2. **A different session checks it.** Start a fresh session (for example with `create_session`, with this repo attached) and give it only the packet and this instruction: "You are the second checker for PR #N. Do not open the PR, its diff or the record's file. For each claim, find the owner's own page, read it, and fill in the table. Post the table as one comment on PR #N that starts with `## Second check`." The checker works from the [source order](source-order.md) and the [research method](research-method.md), and finds sources on its own. The session that wrote the change must not fill in the table.
3. **The checker posts the table** as a PR comment. Each row is `confirmed`, `changed` or `not found`, with the owner's source URL and the date it was read.
4. **The author reads the verdict.** From `site/`:
   ```
   node scripts/second-check.mjs verdict --pr N
   ```
   It exits 0 when every filled row is confirmed with a URL and a date, or when the PR changes no top-tier record. It exits 1, and says why, when the table is missing, a row has no result, or a row is `changed` or `not found`.
5. **A mismatch blocks the merge.** Do not average or smooth it over. Either the author fixes the record to match the owner's page and a third look confirms it, or the record is hidden (`hidden.reason: unconfirmed-risky`) until it is settled. A `not found` means the fact comes off.

David's own check of shelter, crisis, food and benefits changes (#493) still applies on top: those PRs stay `for:david` either way.

## What it costs

No money. Each second check is one more short session, so it uses session time from the same budget as other work ([budget](../operations/budget.md)). The risk rubric keeps it to top-tier items so it does not turn into a rubber stamp.

## Where it stands (November 14, 2026)

- **Built:** the claim packet and the verdict reader (`site/scripts/second-check.mjs`, `site/src/lib/second-check.mjs`), with tests in `site/test/second-check.test.mjs`. The PR template already has the table.
- **Baseline:** of the last 25 merged PRs, 4 changed top-tier records (#1781, #1790, #1799, #1807). None had a filled, confirmed second check table. One (#1807) had the claim column filled in, with no results.
- **Not yet enforced.** Nothing stops a merge without the check today. Two changes would, and both are rules changes for David: adding the step to `docs/COORDINATION.md`, and having `scripts/safe-merge.sh` run the verdict and refuse on exit 1. Both are proposed, with exact wording, in a `for:david` PR from sprint wave 15.

## Sources checked

The process is David's decision on #97 ([his comment](https://github.com/david-shortman/mon-county-community-hub/issues/97#issuecomment-6524402282)), as written in [trust and AI](trust-and-ai.md#the-independent-second-check), whose sources were checked there. The baseline was read from the GitHub API on November 14, 2026.
