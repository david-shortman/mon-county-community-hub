# 2026-11-15: Serves lines on 48 issues, and slugs with "and" in them now count (wave 19, #529)

- **Why:** the Health issue (#1955) warned that 48 issues opened since 2026-11-03 had no "Serves:" line and 1 named no slug we know.
- **Done on GitHub:** appended a `Serves:` line to the 48 issue bodies (nothing else in each body changed), and rewrote #1697's line, which named people in words, to `Serves: housing-costs, wants-a-say`.
- **Changed:** `site/src/lib/serves.mjs` split a Serves line on the word "and" anywhere, including inside a slug. So `wages-and-cost-of-living` and `drugs-and-overdose` read as two unknown halves, and an issue that named only one of them always showed as unknown (#1898, #1562). It now splits only on " and " with spaces around it. A new test in `site/test/serves.test.mjs` covers both slugs.
- **Checks:** `node --test test/serves.test.mjs` passes (4 tests). Run against today's open issues, the check finds 0 unknown lines. Cost: $0.
