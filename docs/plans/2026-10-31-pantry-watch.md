# Watch plan: food pantry and meal pages

Issue #166, feeding #122. Research behind it: #167. Written 2026-10-31.

Pantry hours change more than almost anything else we list, and a wrong hour sends someone to a locked door. This plan says which pages we watch, how often, what counts as a change, and what happens next. It fits tier 3 ("watched") of [ADR 0007](../architecture/adr/0007-freshness-tiers.md) and reuses the daily Source check. It adds no new system.

## Where pantry hours live today (#167)

No free, public, current feed of Mon County pantry hours exists. The food bank's partner map runs on Vivery, which needs a login. Feed America and Plentiful are open, but they copy older lists and have few hours. So the hours we trust come from each pantry's own page, and the watch list below is built from those pages. Full findings: #167.

## How it works

1. **The list.** [`content/watch/food.yaml`](../../content/watch/food.yaml) names each pantry or meal site, its own page (or PDF), and, for pages, two short markers (`start`, `end`) around the hours block plus the hours text as quoted on the page (`quote`). It is not a listing and does not show on the site.
2. **The check.** The daily Source check (`.github/workflows/sources.yml`, 11:41 UTC) already fetches every source politely: one request at a time per site, a pause between requests, robots.txt honored, Facebook and Instagram never fetched. For pages on the watch list, `site/scripts/watch.mjs` then:
   - reads only the text between `start` and `end`, so banners, news and dates elsewhere on the page do not raise alarms
   - hashes that text **with digits kept** (the main Source check drops digits so clocks do not count, but for hours the digits are the point)
   - checks that the saved `quote` is still on the page, ignoring dash, case and "a.m."/"am" styles
   - for a PDF, compares the whole file
3. **What counts as a change** (each one alerts once, not every day):
   - the hours part of the page changed
   - the saved hours text is no longer on the page
   - the `start` marker is gone (the page was rebuilt)
   - the PDF changed
   A page that could not be read (blocked, down, robots.txt) is **not** a change. It is listed in the standing Source check issue, and the last good state is kept.
4. **What happens on a change.** The workflow opens **one** grouped issue for the list, labeled `source-changed` and `for:duet`, or adds a comment if that issue is still open. Each item shows the page, the reason, the hours we saved and what that part of the page says now.
5. **What a person does.** Open the page and read it. Then one of:
   - hours changed: update the record with the new hours, the quoted text and a new `checked` date, in a PR. Food PRs wait for David (High stakes check).
   - nothing real changed: update `start`, `end` or `quote` in the watch list so the alarm stops.
   - the page no longer gives hours: the listing says "Call before you go" with its last checked date, and the place goes to the call queue (#156).
   Close the issue when every item is handled.

**Never auto-publish.** The job has read access to the repo and write access to issues only. It cannot change content or the site. Hours change on the site only through a PR a person writes after reading the page.

## Rules

- **Hours are confirmed only with a quote.** Following the UK find-your-food-bank pattern: hours count as confirmed only when every day and time shows on the org's own live page, saved as `quote` with the `checked` date. Otherwise the listing says "Call before you go" with the last checked date.
- **The org's own page wins.** City pages, Feed America, Plentiful and 211 are cross-checks. If one disagrees with the org's page, the org's page wins, and the disagreement goes in the record's notes or a `needs-verification` issue.
- **Facebook stays manual.** Meta's terms allow automated collection only through its API. Facebook-only groups are listed as `kind: facebook` and checked by a person on the sweep (#6). The watcher never fetches them.
- **No page at all.** Listed as `kind: none` and handed to the call queue (#156).
- **Blocked sites.** Some sites block automated sessions. Listed as `kind: blocked`, checked by a person in a browser.
- **Politeness.** One run a day. Each site gets one request at a time, 1.5 seconds apart. robots.txt is honored.
- **Our own words.** Facts go on the site in our own plain words. The quote is kept only as proof in the watch list and the record.

## How often

- **Daily** for every page on the list, inside the existing Source check (a few extra requests, free GitHub runner time, no Claude).
- **Weekly** for a person re-reading each food listing's hours, as the Health report already requires for food-today details (#494). The watcher tells that person where to look first.
- **On the sweep** for Facebook-only and blocked sources.

## The list

SOURCE_TABLE

## Cost

$0. The check runs on the free GitHub Actions runner inside a job that already exists. No accounts, keys or paid services. If plain hashing proves too noisy, changedetection.io (open source, can read PDFs) is a free self-hosted option, but it would need a server, so it is not proposed now.

## Later

- One issue per changed source instead of one per list, if the grouped issue gets busy (ADR 0007, "What is still open").
- Reading text out of PDFs, so a PDF schedule can be watched by section like a page. Needs a PDF text package; not added now.
- Small groups from #22 can get their own list (for example `content/watch/groups.yaml`) using the same fields.
