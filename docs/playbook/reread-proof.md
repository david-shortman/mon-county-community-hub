# Proof of a re-read

A listing's checked date tells residents when someone last read its source. Until now, a date could move with nothing to show the page was read again. This page says what counts as proof and how it is checked. It answers #1094.

Cost: $0. A field in the content files and a check in the repo.

## The rule

**When you move a source's `checked` date, or add a source, leave proof that you read that page on that date.** One of these:

| Proof | What to add | When it fits |
|---|---|---|
| **A quote** | `quote:` on that source: a few words copied exactly from the page, 3 to 40 words, that back the fact you checked | Any page you read, web page or PDF. The usual choice. |
| **A call** | `phone_confirmed:` on the record, set to the same date (`content/README.md`, "Confirmed by phone") | A group whose only source is a phone call |
| **A program read** | `method: feed` or `method: watched-page` on the source | Feeds and watched pages. Their run log is the proof, and they set this themselves. |

```yaml
sources:
  - url: https://www.example.org/food-pantry
    checked: 2026-11-14
    quote: "Pantry hours: Tuesdays and Thursdays, 10 a.m. to 1 p.m."
```

Pick words that show the fact people act on: the hours line, the phone line, the income limit, the deadline. If you re-read a page and the fact has not changed, copy the current words again. A quote copied from an old copy of the file is not proof.

Rewording a listing, moving facts between files or fixing a typo is not a re-read: leave `checked` alone (`content/README.md`, "`checked` is a Morgantown date").

## Keep it small and off resident pages

- The quote lives only in the content file and in the open data API (`/api/v1/`, as `sources[].quote`). Cards and pages do not show it.
- Copy only the few words that back the fact. Never copy a whole page or a news story ([writing rules](writing-rules.md#1-credit-local-news-never-rewrite-it)).
- Never quote anything about a private person. Quote the group's or office's own words only.

## How it is checked

- **`npm run check-content`** fails on a malformed quote (fewer than 3 words, more than 40, or more than one line).
- **`node scripts/check-reread.mjs`** (from `site/`, and part of `npm run check-content`) compares the content files with `main` and warns for each source whose checked date moved, or that is new, with no quote, no call on that date and no program read. It reads files you have not committed yet too, so run it before you commit. In CI it compares a PR with `main`. It warns and never fails today.
- **The PR review** can see the warnings in the build log. A warning on a top-tier listing (the risk rubric in [trust and AI](trust-and-ai.md#risk-rubric)) means the PR is not ready.
- **Tests:** `site/test/reread.test.mjs`.

## What comes next

- **The quote is checked on the page.** A quote could be copied once and kept forever, so the daily Source check looks for each quote on its own page and lists the ones it cannot find ([fact compare](../operations/fact-compare.md), #1074).
- **Failing instead of warning.** `check-reread.mjs --strict` fails on a missing proof. Turning that on for every PR changes how every content session works, so it waits for David (a `for:david` PR from sprint wave 15 proposes it).
- **Old listings.** The 1,716 sources on file today have no quote. They need none until their date next moves. Each re-check adds one, so the share with proof grows with the normal re-check clock.

When it started (November 14, 2026), comparing the last 40 commits on `main` found 16 source dates that moved, or sources added, with no proof. That is the baseline.

## Sources checked

A house rule. It builds on the sourcing rule in [trust and AI](trust-and-ai.md#treat-ai-output-as-unchecked-until-sourced), the IFCN commitment to let readers check our work, cited there, and the second check's "field by field" step. No new outside source. Written November 14, 2026.
