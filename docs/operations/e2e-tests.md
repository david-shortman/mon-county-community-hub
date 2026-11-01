# End-to-end tests

The site has 200+ pages and many sessions add more each day. These tests open the built site in a real browser (Chromium, through Playwright) and check the things residents depend on that can break without anyone noticing. They live in [`site/e2e/`](../../site/e2e/). Cost: $0. Playwright is already a dev dependency, and GitHub Actions is free on this public repo.

## Run them

```sh
cd site
npm ci
npm run build          # the tests read dist/
npm run e2e            # full suite, about 20 seconds
npm run e2e:smoke      # quick subset
npm run screenshots    # phone screenshots to site/e2e-shots/ (ignored by git)
```

Run one file with `node --test e2e/tonight.test.mjs`. In a Claude Code cloud session, Chromium is already at `/opt/pw-browsers` and the tests find it. On a laptop, run `npx playwright install chromium` once.

## What they check

| File | What it protects |
|---|---|
| `crisis.test.mjs` | Every page has the 911 and 988 line. Every link that shows 911, 988 or 211 dials that number. Crisis pages have the strip with 911, 988 and Quick exit, before the header, with no referrer. Every Help now page shows 911 and 988 near the top. The home page Help now bar has 211, 911, 988 and "A place to stay", and Call 211 is on the first phone screen. Quick exit replaces the page (Back skips it), works with scripts off, and Shift three times leaves while a capital letter does not. The strip stays on screen while scrolling. |
| `questions.test.mjs` | Every choice in every question flow (`Question.astro`) leads to an answer with scripts off. Door pages list every situation as a working link with scripts off. Every pick on every door page shows steps. Every "Your steps" link from What help might I get? shows steps. |
| `tools.test.mjs` | File today's what to bring builder: whole list with scripts off; picks shorten the list and stay in the web address. Make a list for someone. Search finds pages for common words, and the home page search box opens results. |
| `calendar.test.mjs` | `/calendar/` lists events. Every "add to calendar" `.ics` file loads and is valid. `/calendar.ics` is valid, has no repeated UIDs, and has every event on the page. The month view loads. |
| `tonight.test.mjs` | `/tonight/` never says "open" unless the check is from today in Morgantown, on the phone's own clock, including near midnight. |
| `print-and-api.test.mjs` | Printing hides the menus and the crisis strip and keeps the page. Pages print to PDF. Every printout on `/print/` opens. The API index lists types whose files load and match their counts, every API JSON file parses, and `/data/` links to the API. |
| `links.test.mjs` | Every internal link, asset and `#anchor` on every built page points to something that exists. Links to everythingmorgantown.org count as internal. Reads the HTML only, so it is quick. |
| `offline.test.mjs` | After one visit, every hard-moment page opens with no signal, with a dated "Call before you go" note. An unsaved page falls back to Help now. Old saved copies are not shown. Back online, pages show with no note. See [offline.md](offline.md). |

`screenshots.mjs` is not a test. It takes phone-width (390px) pictures of 15 pages residents most likely need. The site has no visit counts yet, so the list is a judgment call. Long pages stop at 6000px. The phone tab bar is fixed to the screen, so in a full-page picture it shows partway down the page. That is expected.

## In CI

The Site workflow runs on every pull request, after the accessibility scan:

- **The PR changes `site/`, `content/`, `apps/` or `site.yml`:** the full suite, then the screenshots. To see them, open the PR's Site run (Checks tab, then "Summary") and download **phone-screenshots**. They are kept 14 days and never committed.
- **Anything else** (docs only, for example): the smoke subset, `E2E_SMOKE=1`. No screenshots.

The tests do not run on pushes to `main` or the daily rebuild, so they never hold up a deploy.

## When a test fails

1. Read the message. Each one names the page and what is wrong.
2. Reproduce it: build, then run that one file.
3. Fix the page, not the test, unless the test is wrong about how the page should work.
4. If the fix touches a page that waits for David (Help now, crisis lines, food, money, housing; see "When a PR waits for David" in `docs/COORDINATION.md`), open the fix as its own PR with `for:david`. Then add the break to the `WAITING` list at the top of the test, with the PR number, so other PRs are not blocked. Remove the line when that PR merges.
5. If the page is in an open `for:david` PR, comment on that PR instead of opening a second one.

## Add a test

- Put it in the file for its area, or a new `site/e2e/<area>.test.mjs`. Files ending in `.test.mjs` run on their own.
- Use `setup()` from `e2e/lib.mjs` in `before()`. It serves `dist/` the way GitHub Pages does (`/a` redirects to `/a/`, missing pages get `404.html`) and opens Chromium. Close it in `after()`.
- Use `PHONE` for a 390px phone. Use `{ ...PHONE, javaScriptEnabled: false }` to test with scripts off.
- Never reach the internet. Stand in for outside sites with `context.route()`, the way `crisis.test.mjs` does for weather.gov.
- Test what a resident does and sees: click, tick, type, read the text. Avoid depending on exact wording that writers will change.
- Prefer checks that cover every page of a kind (every crisis page, every door) over one example, so new pages are covered without editing the test.
- Long loops: cut them to a few items when `SMOKE` is true, or mark the test `{ skip: fullOnly }`. Keep the full suite under about a minute.
