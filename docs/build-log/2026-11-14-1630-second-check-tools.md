# 2026-11-14: Tools for the blind second check (#1098)

- **Considered:** the second check David chose on #97 was written down (#1367) but nothing made the blind packet, and nothing read the result, so it depended on each session remembering. The PR review cannot open web pages, so it cannot be the check.
- **Chose:** two small tools. `claims` prints the claim list for a checker with no sources, links or file paths, so a fresh session starts blind. `verdict --pr N` reads the "Second check" table from the PR and comments and exits 1 unless every row is confirmed with the owner's URL and a date.
- **Shipped:** `docs/playbook/second-check.md`, `site/scripts/second-check.mjs`, `site/src/lib/second-check.mjs`, tests, and a pointer from the trust playbook. Cost: $0, plus one short session per top-tier PR.
- **Scoreboard:** baseline: of the last 25 merged PRs, 4 changed top-tier records and none had a confirmed second check. Enforcing it (COORDINATION.md and `safe-merge.sh`) waits for David.
