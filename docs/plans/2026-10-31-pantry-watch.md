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
   - counts the file name of each PDF link as part of the text, so a new schedule PDF behind the same link text is a change
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
- **Politeness.** One run a day. Each site gets one request at a time, 1.5 seconds apart, or longer when its robots.txt sets a Crawl-delay (the city and United Way sites ask for 10 seconds; capped at 15). robots.txt is honored.
- **Our own words.** Facts go on the site in our own plain words. The quote is kept only as proof in the watch list and the record.

## How often

- **Daily** for every page on the list, inside the existing Source check (a few extra requests, free GitHub runner time, no Claude).
- **Weekly** for a person re-reading each food listing's hours, as the Health report already requires for food-today details (#494). The watcher tells that person where to look first.
- **On the sweep** for Facebook-only and blocked sources.

## The list

Checked 2026-10-31. The live list, with markers and quoted hours, is `content/watch/food.yaml`.

| Group or list | Type | Hours on its own page? | Page |
|---|---|---|---|
| Christian Help (service and donation hours) | page | Yes, quoted | https://motownchristianhelp.com/contact/ |
| Christian Help (food orders) | page | Yes, quoted | https://motownchristianhelp.com/programs/ |
| Scott's Run Settlement House (site hours, used by our record) | page | Yes, quoted | https://www.srsh.org/ |
| Scott's Run Settlement House (FAQ, pantry times) | page | Yes, quoted | https://www.srsh.org/faq |
| Scott's Run Settlement House (free market) | page | Partly or none, page watched for changes | https://www.srsh.org/free-market |
| St. Ursula Food Pantry and Outreach | page | Yes, quoted | https://www.stmarystarcity.com/st--ursula |
| Salvation Army Morgantown (office and Sally's Kitchen) | page | Yes, quoted | https://morgantown.salvationarmypotomac.org/morgantown/how-we-help |
| Community Kitchen (weekday lunch) | page | Yes, quoted | https://www.morgantowncommunitykitchen.com/ |
| Senior Monongalians (congregate meals) | page | Partly or none, page watched for changes | https://www.seniormons.org/blank |
| Morgantown Area Meals on Wheels | page | Partly or none, page watched for changes | https://morgantownwvmow.org/ |
| Starting Points food pantry | page | Yes, quoted | https://moncountyfamilysupportcenter.org/food-pantry/ |
| First Presbyterian Church (Sunday breakfast) | page | Partly or none, page watched for changes | https://www.firstpresmorgantown.org/community-missions |
| Pantry Plus More (mobile giveaways) | page | Partly or none, page watched for changes | https://www.pantryplusmore.org/mobile-food-giveaways/ |
| Mountaineer Food Bank mobile pantry (Monongalia County) | page | Partly or none, page watched for changes | https://mountaineerfoodbank.org/food-pantries/ |
| United Way FRN food list (page with the current PDF) | page | Partly or none, page watched for changes | https://www.unitedwaympc.org/food-hunger |
| United Way FRN food list (PDF of 1.26.26) | pdf | In the PDF | https://www.unitedwaympc.org/sites/unitedwaympc/files/Monongalia%20County%20Food%20Assistance%20Hours%201.26.26%20(1).pdf |
| City of Morgantown, PATHWAYS to Help (Food Resources) | page | Partly or none, page watched for changes | https://www.morgantownwv.gov/708/PATHWAYS-to-Help |
| The Rack and Rack II (WVU student pantry) | blocked | Not readable by a robot | https://studentengagement.wvu.edu/the-rack-student-food-pantry |
| Catholic Charities WV food assistance | blocked | Not readable by a robot | https://www.ccwva.org/programs/food-assistance/ |
| Catholic Charities Morgantown pantry | none | No web source | none found |
| Covenant Evangelical Methodist food pantry (Greenbag Road) | none | No web source | none found |
| Canyon Presbyterian food pantry | none | No web source | none found |
| Rock Forge Presbyterian food pantry | none | No web source | none found |
| Wadestown food pantry | none | No web source | none found |
| Clay-Battelle Senior Center meals | none | No web source | none found |
| Circle of Friends | none | No web source | none found |
| Sarah's Table | none | No web source | none found |
| Food Not Bombs Morgantown | none | No web source | none found |
| Morgantown Mutual Aid Fair | none | No web source | none found |
| Caritas House | none | No web source | none found |
| Community Action (High Street) | none | No web source | none found |
| Hope Farm food pantry | none | No web source | none found |

The best single list is United Way's Family Resource Network (FRN) food page and its PDF. Many small church pantries appear only there. Asking the FRN about sharing that data is #23.

**Hours that sources disagree on** (Scott's Run, Starting Points, St. Ursula, Salvation Army, First Presbyterian, Covenant, Catholic Charities) are in #932. They stay off the site until a person confirms them.

**No watchable source:** the `none` rows above, plus The Rack (WVU blocks robots), go to the call queue (#156).

## Cost

$0. The check runs on the free GitHub Actions runner inside a job that already exists. No accounts, keys or paid services. If plain hashing proves too noisy, changedetection.io (open source, can read PDFs) is a free self-hosted option, but it would need a server, so it is not proposed now.

## Later

- One issue per changed source instead of one per list, if the grouped issue gets busy (ADR 0007, "What is still open").
- Reading text out of PDFs, so a PDF schedule can be watched by section like a page. Needs a PDF text package; not added now.
- Small groups from #22 can get their own list (for example `content/watch/groups.yaml`) using the same fields.
