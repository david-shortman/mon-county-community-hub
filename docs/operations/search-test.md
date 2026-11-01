# Site search test

Does the site's own search box (`/search/`, built with [Pagefind](https://pagefind.app/)) find the right page for the words residents actually type? This test answers that with a fixed set of queries, so we can see whether a change made search better or worse. Started in #529 (wave 6).

It costs nothing: it runs in Node on the index the build already makes, with no outside service.

## What it checks

- **The queries:** [`content/findability/search-queries.yaml`](../../content/findability/search-queries.yaml). About 250 searches, each with the page or pages that answer it. They are plain words and slang ("food stamps", "shut off notice", "dentist cheap"), short forms ("EBT", "LIEAP", "DMV"), common misspellings ("medicade", "narcain") and full questions, many from the [findability question set](../../content/findability/questions.yaml).
- **A hit** is a query whose expected page is in the **top 3** results. The score is hits out of all queries, also broken out by kind (everyday, short, misspelled, question), plus how many queries got no results at all.
- **Close to the page, not the same.** The test runs each query through [`site/src/lib/search-plan.mjs`](../../site/src/lib/search-plan.mjs): fix common misspellings, drop question words, then search. If no page has every word, it searches each word and puts pages that match the most words first. The search page (`site/src/pages/search.astro`) uses the same misspelling list, but its own word map and ordering (printouts, helper pages and group pages last). So the two scores differ by a few queries. To score what the page itself shows, run the queries through `/search/` in a browser, as the November 1 walkthrough rerun did (`docs/reviews/2026-11-01-simulated-walkthroughs-rerun.md`).

The queries are written by us. The site never logs, counts or stores what visitors search for (see the [privacy page](../../site/src/pages/privacy.astro)), and this test does not change that.

## Running it

```sh
cd site
npm ci
npm run build                          # or let the test build just the pages and index
npm run search-test                    # print the score
npm run search-test -- --show-misses   # also list every miss and what came back instead
npm run search-test -- --save          # save content/findability/search-runs/<date>-<time>.json
npm run search-test -- --plain         # raw words with no plan, the way search worked before #529
npm run search-test -- --build         # rebuild the pages and index first (skips the other build checks)
```

`--summary <file>` writes the Markdown report to a file. CI uses it.

## In CI

The Site workflow runs the test after every build and adds the report to the run's summary page (open the run, then scroll to "Site search test"). It is **never a gate**: a low score does not fail the build. Look at it when a PR changes page wording, page structure, `content/also-called.yaml` or the search code.

## Saved runs

Dated results go in [`content/findability/search-runs/`](../../content/findability/search-runs/), one JSON file per run: the date, the mode (`plan` or `plain`), the score by kind, and for each query its top 3 pages, the rank of the expected page and whether it was a hit. Save a run when you change search on purpose, so the next session can compare. Do not save one for every PR.

## Improving a score

Work through the misses (`--show-misses`) and pick the fix that also helps someone reading the page:

1. **The page never uses the word people search for.** Add a short entry to [`content/also-called.yaml`](../../content/also-called.yaml). It shows a visible "Also called: ..." line at the end of the page, weighted like a page title in search. Only add words for what the page really covers. Never hide text for search.
2. **A misspelling or run-together word.** Add it to `SPELLING` in `site/src/lib/search-plan.mjs`. The search page says "Showing results for ..." so the fix is never silent.
3. **The right page is there but lower.** Usually a page with many repeated listings is crowding it out. Mark repeated parts with `data-pagefind-ignore` (the "Also check" links and the Make a list place list already are). Do not ignore a page's own content.
4. **No page answers it.** That is a content gap, not a search problem. Open an issue, or leave the miss in the report as a reminder.
5. **The expected page was wrong.** Fix the query's `expect` list, and say why in the PR.

Tuning Pagefind's ranking settings (`termFrequency`, `pageLength`, `termSaturation`) was tried on 2026-11-01. No setting moved the score by more than one query, so the defaults stay.

Changes to `content/also-called.yaml` for pages about shelter, crisis help, food or benefits wait for David, like any change to what those pages show ([`docs/COORDINATION.md`](../COORDINATION.md)).
