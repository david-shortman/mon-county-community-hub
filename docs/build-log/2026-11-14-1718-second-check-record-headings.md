# Second check verdict reads tables under record headings

**What changed.** `parseTable()` in `site/src/lib/second-check.mjs` now reads every `## ` section inside a "Second check" comment whose table starts with a `| Field | Claim |` header. Before, it stopped at the first `## ` heading, so it missed the tables under each record heading that `packetMd()` writes. A checker who posted the packet's own format got a false "no filled Second check table" (#1886, seen on #1866).

**What stays the same.** Tables with other headers, such as a `| Rubric |` review table, are still skipped.

**Test.** `site/test/second-check.test.mjs` builds a filled comment from `packetMd()` output with two records and a review table after them. It failed before the fix (0 rows) and passes now.

Cost: $0.
