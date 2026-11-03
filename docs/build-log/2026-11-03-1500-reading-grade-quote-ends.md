# 2026-11-03: Reading grade counts sentences that end in a quote mark (#1665)

- **Considered:** the plain language cards lane found that `check-reading.mjs` missed a sentence end like `a tax break." It`. The opening took more than two sentences, and the grade counted fewer sentences, so it read higher than it should.
- **Chose:** one sentence-end rule for both the opening and the grade: `.`, `!` or `?`, then any closing quote marks (straight or curly) or brackets, then a space or the end. Two tests in `site/test/reading.test.mjs`; both fail on the old code.
- **Effect on a build of `main`:** 19 pages' full-text grade dropped 0.1 to 0.6 (largest: Medicaid 2027, 6.9 to 6.3). No opening grade changed, and no number in the summary moved (509 pages, 6 openings above 9, 157 of 393 cards above 9). Noted in `docs/scorecard/README.md`.
- **Cost:** free.
