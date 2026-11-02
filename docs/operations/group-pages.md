# Group pages: one page per organization

Every group in `content/orgs` that is not hidden has a page at `/groups/<slug>/`, and `/groups/` lists them A to Z. A group that hears about the site can find, in one place, everything we say about it and how to ask for a fix. Nothing is sent to the group. The page is there for them to find.

## What a page shows

1. The group's own record: kind, area, summary, public phone, website, sources and checked date.
2. Its listings: every record in `content/resources` whose `org` is the group's slug, shown with the same `ResourceCard` residents see on the guides.
3. The printable sheets those listings are on (`src/lib/printouts.mjs`).
4. Its upcoming dates (next 62 days). A calendar entry names its group in words (`org_name`), so a date belongs to a group only when `org_name` matches the group's `name` exactly, ignoring case.
5. How to ask for a fix: the fix form with the group's slug filled in, and the fix email. The promise in days comes from `REQUEST_DAYS` in `src/lib/group-requests.mjs`.
6. The group's records as JSON from the open data API, and a link to each listing's card widget (`/embed/listing/<slug>/`, see [embeds.md](embeds.md)).

Code: [`site/src/lib/group-pages.mjs`](../../site/src/lib/group-pages.mjs), [`site/src/pages/groups/[slug].astro`](../../site/src/pages/groups/[slug].astro), [`site/src/pages/groups/index.astro`](../../site/src/pages/groups/index.astro).

## Rules

- **Only what the records say.** The page adds no facts. Fix the record in `content/`, and the page follows on the next build.
- **Never say a group works with us.** Every page says a listing does not mean the group works with us or approves of the site.
- **Hidden groups get no page.** Hidden listings are left off their group's page.
- **Two records with the same name** (a duplicate waiting to be merged) both get a page, with the slug added to the title so titles stay unique. Merging the records is a content job: move the listings to one slug and hide or remove the other.

## Checks

- `npm run build`: page checks (unique title, one heading), and llms.txt must list every group page.
- `npm test`: `test/group-pages.test.mjs`.
- `npm run check-a11y` scans the first 3 group pages (see `FAMILIES` in `site/scripts/check-a11y.mjs`), since they share one template.
