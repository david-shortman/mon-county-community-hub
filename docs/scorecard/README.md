# Weekly scorecard

One table a week that shows whether the site is better than what residents have today, and what moved since last week. Each file is one week: `YYYY-Www.md` to read, and `YYYY-Www.json` that the next week compares against. Asked for in #1052; design in the [scorecard design doc](https://claude.ai/artifact/QeSvygH6YKeXpVNyLcnAyv).

## How it is made

The [Scorecard workflow](../../.github/workflows/scorecard.yml) runs every Monday at 10:23 UTC, after the Sunday findability check. It builds the site, runs the slow-phone test, runs [`site/scripts/scorecard.mjs`](../../site/scripts/scorecard.mjs), and opens and merges a PR that adds only the two files here. If GitHub does not let the workflow open or merge that PR, it opens a `for:code` issue with both files, and a session adds them by hand.

It costs nothing: about 10 minutes of a free GitHub runner a week. It uses no accounts, no keys and no data about people.

To make one by hand, in `site/` after `npm run build`:

```
node scripts/lighthouse.mjs --json /tmp/lighthouse.json
node scripts/scorecard.mjs --lighthouse /tmp/lighthouse.json
```

GitHub reads use the `gh` command on a hand run. Add `--no-github` to skip them.

## Where each number comes from

| Lane | Measures | Source |
|---|---|---|
| Information | High-stakes PRs waiting, and how many are older than 2 days (#1056) | Open PRs, checked with the same rules as the High stakes check (`site/scripts/high-stakes.mjs`) |
| Information | "Not out yet" lines and typed phone numbers no record has, on high-stakes pages (#1056) | `site/scripts/check-typed-facts.mjs` |
| Information | Checked dates within 30 and 90 days, oldest checked date | Every `checked:` date in `content/` |
| Information | Broken, moved and phone-not-found sources | The open Source check issue |
| Information | Corrections, Help wanted gaps | `content/corrections/`, `content/gaps/` |
| Information | Answer pages, reach outside Morgantown | `content/findability/score.py` on the latest run, `content/findability/reach.py` |
| Presentation | First page, words before the answer, must call | The latest source benchmark (`content/findability/benchmark/`) |
| Presentation | Reading grade | `dist/reading-grades.json` from `check-reading.mjs` |
| Presentation | Contrast, accessibility fixes waiting | The build (it fails if contrast drops), `docs/accessibility.md` |
| Infrastructure | Pages, page weight | `dist/page-weight.json` from `check-weight.mjs` |
| Infrastructure | Slow 4G phone speed (#1053) | `site/scripts/lighthouse.mjs`: Lighthouse 13.5.0 mobile test on five pages of the live site, one run each |
| Infrastructure | Health failures this week, live feeds | Health issues opened in the last 7 days, `/api/v1/feed-health.json` on the live site |
| Infrastructure | Page files added this week | git history of `site/src/pages/` |
| Outcomes | Findability score, our pages in search, needs where we beat every source | The latest findability run and source benchmark |

"Today's sources" means the other sources in the latest source benchmark (the county resource guide PDF, the city page and official pages), where a number can be compared. A number that could not be read says "not read", never zero.

## Reading the Move column

- **better** or **worse**: the number moved more than its noise, in a good or bad direction.
- **about the same**: it moved, but within the noise. Noise: findability 2 points, reading grade 0.3, page weight 1 KB, main content time 0.3 seconds, blocking time 50 ms, layout shift 0.02. Everything else: any change counts.
- **up** or **down**: a count with no good direction, like corrections logged.

## Limits

- "High-stakes PRs waiting" counts changes that are written but not live. It cannot see a change in the world that nobody has written up yet.
- The two typed-text counts are hints, not errors. A "not out yet" line is right until the source posts the date; the list is there so a person re-checks each one. This is the gap that let last season's LIEAP line stay on `/utility-bills/` after its record was fixed (#1056).
- Lighthouse runs once per page from a GitHub server, so the time moves a little from week to week. The goal from #1053 is under 2.5 seconds for the main content on every page.
- Visits are not measured. That waits on a choice by David.
