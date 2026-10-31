# Show up where people already are online: search, AI assistants, and a share kit

Not everyone who needs a guide will start at our home page. Some will start at a search box, an AI assistant, or a local group's page or newsletter. The hub should be the correct local answer in those places, and it should be easy for a local group to pass a guide on in its own space, if it chooses to. From #191, part of #155 (idea 12 in [reaching people](reaching-people.md#12-show-up-where-people-already-are-online)).

**Agents never post anywhere outside this repo.** Groups decide what to share. Telling any group the kit exists, or asking anyone to share it, is David's call.

## What is already built

| Where people are | What we have | Where it lives |
|---|---|---|
| Search engines | Titles with the place name, a description on every page, a sitemap, `robots.txt`, and a share image and preview text on every page | `site/src/layouts/Base.astro`, `site/scripts/check-pages.mjs` (the build fails if a guide title lacks "Morgantown," "Mon County" or "Monongalia") |
| Search engines, structured | schema.org JSON-LD for organizations, places and events, checked on every build | `site/scripts/check-jsonld.mjs` (#37) |
| AI assistants that read the web | `llms.txt`: a plain list of every page with a one-line summary. The build fails if a page is missing from it | `site/src/pages/llms.txt.js` |
| Other tools and apps | A free, read-only public API with an OpenAPI description | `site/src/pages/api/v1/` (#72) |
| AI tools people run themselves | A read-only MCP server that answers from our checked data and cites every source | `apps/mcp/` (#75, ADR 0003) |
| Phones, one listing at a time | Pass it on: text a listing to yourself or someone, print it, or share it, from every card | `site/src/components/PassItOn.astro` (#157) |
| Bulletin boards | A printable one-page flyer with a QR code for each community center | `site/src/pages/community-centers/[slug]/flyer.astro` (#465) |

## What is missing

1. **A share kit for whole guides.** Built in #947 (`site/src/components/ShareThis.astro`, shown by `Base.astro`). Not yet on high-stakes guides, which wait for David.
2. **A check that the answers hold up.** The [findability test](../../content/findability/questions.yaml) asks real resident questions. Only a few are after-hours questions (a shelter tonight, a dinner this weekend, volunteering this weekend). The reach playbook suggests more, like "It is Sunday night and my power is being shut off. What can I do?" Adding them is part of the follow-up.

## The share kit

One small box at the bottom of each guide, under the heading **Share this**. It has three parts, built from what the page already has:

- **A two-sentence summary** in plain words. Sentence one says what the guide helps with. Sentence two says it is free and lists sources and checked dates. Build it from the page's `label` and `summary` (the `page` export every page has), so it never says more than the page does.
- **A short link** to the guide, written the way people say it: `everythingmorgantown.org/recycling`.
- **A small image:** the site's existing share image (`site/public/share.png`), which link previews in Facebook and messaging apps already show.

And two buttons: **Copy text** (summary plus link) and **Download image**. No tracking codes in the link, no account, nothing stored.

### Rules for the kit

- **Words come from the page.** The summary restates the guide's own label and summary. No new facts, no numbers, no claims about how many people it has helped.
- **Neutral.** It describes the guide. It never says a group endorses it, and it never asks anyone to "like" or "follow."
- **Plain and short.** About an 8th grade reading level, under 50 words, no em dashes.
- **Say it is free and checked, not that it is perfect.** "Every listing shows its source and the date we checked it" is something anyone can see on the page ([writing rules](writing-rules.md#4-no-claim-we-cant-show), rule 4).
- **No kit on sensitive pages.** Like Pass it on, skip domestic and sexual violence pages, where a share can leave a trace on a phone.
- **High-stakes guides** (food, bills, housing, crisis help) can have the kit, but adding it there is a change residents see on those pages, so that PR waits for David.

### Draft wording

A pattern, then three examples built from real pages' labels and summaries. These are drafts for the build, not posts.

**Pattern**

> {Label} in Morgantown and Mon County: {summary, lower-cased}. Free, from Everything Morgantown, with the source and checked date on every listing. {short link}

**Trash, recycling and drop-off** (`/recycling/`)

> Trash, recycling and drop-off in Morgantown and Mon County: pickup days, the curbside bin, and where to take hard items. Free, from Everything Morgantown, with the source and checked date on every listing. everythingmorgantown.org/recycling

**Meet people and get a library card** (`/meet-people/`)

> Meet people and get a library card in Morgantown and Mon County: a free library card, free library programs for adults, and Morgantown neighborhood association meetings. Free, from Everything Morgantown, with the source and checked date on every listing. everythingmorgantown.org/meet-people

**Flu and COVID shots** (`/flu-shots/`)

> Flu and COVID shots in Morgantown and Mon County: who should get one, when, and what it costs. Free, from Everything Morgantown, with the source and checked date on every listing. everythingmorgantown.org/flu-shots

### What a group would do

Nothing, unless it wants to. If a group finds the kit, it can paste the text into its page, newsletter or Facebook group, or print the flyer. We never ask, post, tag or message anyone. If David decides to tell groups about it, that conversation and any notes about it stay in Notion.

## Cost

Free. The kit uses the page's own words and the existing share image. No link shortener, no analytics service.

## How we will know

- **Use:** once analytics are decided (#41), aggregate counts of Copy text and Download image clicks. No tracking codes in shared links.
- **Recognition:** a local group linking to a guide, which the [measurement playbook](measurement.md) counts only from public pages or through David.

## Sources checked

The built features above were read from the repo on October 31, 2026. The idea comes from [reaching people](reaching-people.md), whose sources were checked October 28, 2026. Re-check by April 30, 2027.
