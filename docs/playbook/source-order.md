# Source order: which source to trust for which fact

Every fact on the site comes from a source someone opened and read ([trust and AI](trust-and-ai.md#treat-ai-output-as-unchecked-until-sourced)). This page says which sources come first, and what a lower source may and may not be used for. It answers #1092: a spot check on October 31 found a tax help listing that rested on a magazine article and a bills-help directory site.

Cost: $0. It is a rule for writers plus a short list and a check in the repo.

## The order

Use the highest tier that states the fact. Go lower only when no higher source states it, and only for the uses in the next table.

| Tier | What it is | Examples |
|---|---|---|
| **1. The owner** | The group's own website, or the office that runs the program or makes the rule | A pantry's own page, the County Clerk's page, the state code, a program's own form or PDF |
| **2. Another office or a funder** | A government office, funder or umbrella group that publishes the fact about someone else | United Way's food hours PDF for its partner pantries, a state agency's list of county offices, a hospital system's page for a clinic it runs |
| **3. Local news** | A news story, named by outlet | The Dominion Post, WVU Today (for anyone but WVU), WDTV, WBOY, Morgantown Magazine |
| **4. Directories and copies** | Sites that list other groups, copy their pages, or collect posts | Help directories, event listing sites, nonprofit tax filing sites, neighbor apps, search results, AI answers |

Search results and AI answers are never a source. They can only point to a page you then open.

## What each tier may support

| Fact | Tier 1 or 2 | Tier 3 (news) | Tier 4 (directory) |
|---|---|---|---|
| Phone or text number | Yes | No | No |
| Hours, cost, who can get help, what to bring | Yes | No, unless it is a one-time event (next row) | No |
| A one-time event's date, time and place | Yes | Yes, as the only source when no owner or office page has it. The listing names the outlet ("a Dominion Post story from November 1") | No, except to find the owner's page |
| Address | Yes | As a second source only | As a second source only |
| That a group or program exists, and its name | Yes | Yes | Yes, to find the group. Then open its own page |
| A group's legal name, tax ID or filings | Yes | Yes | Yes (a nonprofit tax filing site is fine for this) |

Three rules sit on top of the table:

1. **A directory only points the way.** Use it to learn a group exists and to find its own page. Then read the facts there. If the group has no page and only a directory has the fact, leave the fact out (the phone rule in `content/README.md` already says this for phone numbers, #494).
2. **Copies count once.** A directory that copies an office's page, or two stories from the same press release, are one source, not two ([the second check](trust-and-ai.md#the-independent-second-check), step 3). A second source has to have learned the fact on its own.
3. **Say what the source is.** A news story or directory is shown by its address, and a page that names it says what it is ("Name the source as it is" in `content/README.md`). Credit news by outlet and use only the one fact you need ([writing rules](writing-rules.md#1-credit-local-news-never-rewrite-it)).

A source with its own interest in the answer (an advocacy group, a business, a campaign) has its own rule: [sources with their own slant](slanted-sources.md) (#1095).

## How it is recorded and checked

- **The list.** [`content/source-tiers.yaml`](../../content/source-tiers.yaml) names the sites that are news (tier 3) or directories (tier 4). Any site not on it counts as tier 1 or 2, so a new official site needs no edit. When you cite a news or directory site for the first time, add it there. `owner_of` marks a record that is about that site itself (the Nextdoor listing), where the site is the owner.
- **The check.** `npm run check-content` warns when every source of a listing is on that list, and says when the listing is top tier. It is a warning, not an error, because news can be the only source for a one-time event.
- **The report.** `node scripts/check-source-tiers.mjs` (from `site/`) lists every listing that rests only on news or directories, top-tier ones first. `--all` adds listings with at least one such source, and `--md` prints a table.
- **Tests:** `site/test/source-tiers.test.mjs`.

## Listings to review (November 14, 2026)

The report found 21 of 847 listings resting only on news or directory sources:

- **13 calendar entries** (top tier by the rubric, since every `calendar/` entry is). 8 are Westside and Arnettsville events from Dominion Post stories, which fit the one-time event row above. 5 are craft and card shows from event listing sites (FestivalNet, Treasure Hunter). Those need the organizer's or the venue's own page, or they come off when their dates pass.
- **8 secondhand shops** whose only sources are Morgantown Magazine, The Daily Athenaeum, WDTV or Dominion Post stories. Their hours and address should come from the shop's own page. If a shop has none, a person can check it on the secondhand checklist.

Run the report again for the current list. The review itself is open as an issue linked from #1092.

## Sources checked

This page sets a house rule. It builds on the SIFT method's advice to trace claims to the original ([hapgood.us/sift](https://hapgood.us/sift/)) and the second check steps in [trust and AI](trust-and-ai.md), whose sources were checked there. No new outside source is used here.
