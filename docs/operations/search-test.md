# Site search test

Does the site's own search box (`/search/`, built with [Pagefind](https://pagefind.app/)) find the right page for the words residents actually type? This test answers that with a fixed set of queries, so we can see whether a change made search better or worse. Started in #529 (wave 6).

It costs nothing: it runs in Node on the index the build already makes, with no outside service.

## What it checks

- **The queries:** [`content/findability/search-queries.yaml`](../../content/findability/search-queries.yaml). About 250 searches, each with the page or pages that answer it. They are plain words and slang ("food stamps", "shut off notice", "dentist cheap"), short forms ("EBT", "LIEAP", "DMV"), common misspellings ("medicade", "narcain") and full questions, many from the [findability question set](../../content/findability/questions.yaml).
- **A hit** is a query whose expected page is in the **top 3** results. The score is hits out of all queries, also broken out by kind (everyday, short, misspelled, question), plus how many queries got no results at all.
- **The same code as the page.** The search page and this test both run `find` from [`site/src/lib/search-plan.mjs`](../../site/src/lib/search-plan.mjs) (#1286): fix common misspellings, drop filler words (including small words in a full question like "but", "have" and "there", #1676), swap words our pages say another way ("rehab" becomes "treatment", in `SAME`), search, put pages with more of the reader's words first (in a question of 4 or more words, the whole sentence as typed counts for less than its topic words, #1676), put a page first when one of its "Also called" entries is exactly what was typed (#1676), and put printouts, helper pages and group pages whose name does not match after the guides. The page gets this code as an inline script from `inlineSource()`, so one change moves both. A test checks that the page's copy gives the same answers as the module. In saved runs, `count` is how many results were shown, up to 10.

## Crisis words and pins (#1647)

Two rules in `search-plan.mjs` are about safety, not ranking. David chose both on November 3, 2026.

- **`CRISIS`:** a short list of words and phrases that mean someone may be in danger now ("suicide", "suicidal", "kill myself", "want to die", "self harm", "overdose", and a few close variants and misspellings). When a search has one, the search page shows the same 911 and 988 box as the crisis line (`CrisisLine.astro`) above the results, in a live region so screen readers read it out. It shows before the search loads, so it is there even if search fails. Without JavaScript the search page always shows that box.
- **`PIN`:** for the suicide and self harm words in `CRISIS`, `/mental-health/` goes first, ahead of the usual order. It is the page with 988, the 24/7 crisis line and the walk-in crisis clinic. Without the pin, group pages whose names have "suicide" (and `/grief/`) came first. Overdose is not pinned: `/drugs-and-alcohol/` (Narcan, overdose help) already comes first for it.

A query marked `first: true` in the test set must have its first expected page as the very first result, not just in the top 3. "suicide", "suicidal", "kill myself" and "sucide" use it.

Pins are a new kind of rule that overrides the order, so keep them to crisis words. Adding a pin or a crisis word changes what residents see about crisis help, so it waits for David ([`docs/COORDINATION.md`](../COORDINATION.md)). The box's words come from the crisis line, never from the search code.

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
