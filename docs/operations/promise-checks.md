# Promise checks: what holds each access and privacy promise

The Privacy, About and How this site works pages, and [`docs/accessibility.md`](../accessibility.md), promise residents things about access and privacy. This page lists each promise and the check that fails the build if a change breaks it. A promise with no check is either a fact about another company (cited on the page with a link to that company's own policy) or a hand-run audit with a date. Added for #1423 on November 2, 2026.

The public version of this list is `/access/`, "Built for any phone and every reader" (#1419). When you add a promise to a public page, add a check here first. If no check is possible, word the promise as a fact with a date or a source, not as a guarantee.

## Privacy (`/privacy/`, `/about/`, `/how-it-works/`)

| Promise | Held by |
|---|---|
| The only outside file any page loads is the visit counter (GoatCounter, added in #1352 and #1384). No ads, no ad trackers, no outside fonts | `e2e/promises.test.mjs`: "no page loads a font, script, style or image from another site", on every built page and every built style file. Allowed outside files are listed in `OFF_SITE_OK` with a reason |
| Pages contact no other site while they load, except the visit counter. Directions buttons send nothing to Google unless tapped | `e2e/promises.test.mjs`: "pages contact no other site except the visit counter" (browser, full suite) |
| No cookies | `e2e/promises.test.mjs`: "our own code sets no cookies" (built files) and the browser test above (`cookies()` is empty). That GoatCounter sets no cookies is GoatCounter's own promise, linked on `/privacy/` |
| The counter stores no IP address or anything that identifies you | GoatCounter's privacy policy, linked on `/privacy/`. Not ours to test |
| GitHub may keep server logs; we don't see them | GitHub's privacy statement, linked on `/privacy/` |
| No sign-up forms, no payments, the site never asks for your name | `e2e/promises.test.mjs`: "no page asks for a name, email, phone, address or password, and no form sends anything to a server" |
| Reporting a problem never needs an account | `scripts/check-pages.mjs` (#1079): no GitHub "new issue" links that need an account |
| Crisis pages tell no other site where you came from | `e2e/crisis.test.mjs`: "crisis pages have the full strip" checks `<meta name="referrer" content="no-referrer">`. `e2e/promises.test.mjs` checks every Quick exit link has `rel="noreferrer"` |
| No Text this, Print this or Share on domestic or sexual violence listings | `e2e/promises.test.mjs`: every record with `private_trace: true` is found on a built page, its card has no Pass it on row, every page that shows it has Quick exit, and no page has a text link or Share button carrying its title |
| Saved offline copies: the same first list for everyone, the pages About names, expiring after 3, 30 and 90 days, never sent anywhere | `e2e/promises.test.mjs`: "the saved offline list is the same for everyone" (reads the built `sw.js`). `e2e/offline.test.mjs`: "the first saved list is the same whichever page a person opens first", and the 40-day test for expiry |
| Search runs on the phone | Search is Pagefind, built into `dist/pagefind/`. The off-site checks above fail if search ever loads from another site |

## Access (`docs/accessibility.md`, `/how-it-works/`)

| Promise | Held by |
|---|---|
| Urgent pages under 50 KB, every other page under 150 KB | `scripts/check-weight.mjs`, after every build |
| Text contrast at least 7 to 1 in light and dark | `scripts/check-contrast.mjs`, after every build |
| No serious axe problems at 390 px in light and dark; no sideways scroll at 320 px with text at 100% and 200% | `scripts/check-a11y.mjs`, on every PR |
| With reduced motion on, nothing animates | `e2e/promises.test.mjs`: "with reduced motion on, nothing animates" on a sample of the pages with the most moving parts (full suite). The full sweep of every page is the hand-run `scripts/a11y-deep.mjs` |
| The scroll story on How this site works reads as a plain numbered list without script, and Turn off motion stops it | `e2e/promises.test.mjs`: the two scroll story tests (full suite) |
| "Skip to main content" is the first thing on every page | `e2e/promises.test.mjs`: "Skip to main content is the first thing in every page" |
| 911 and 988 on every page, dialing the right number | `e2e/crisis.test.mjs` |
| A listing not rechecked in 6 months says it may be out of date | `test/data.test.mjs` and `scripts/check-content.mjs` (`isStale` in `src/lib/content.mjs`) |
| Keyboard, focus order, focus not hidden, text spacing, headings, link text | Hand-run audit, `scripts/a11y-deep.mjs`, with its date in `docs/accessibility.md`. Not a build gate |
| Screen readers, voice control, forced colors, phone text size settings | Need a person on a real device. "Needs a person" in `docs/accessibility.md`, #369 |
