# 2026-10-30: Community centers and halls section, a page per center, the hall finder, and the Your community door (#462, #463, #464, #252)

- **Considered:** the section (#450) needs four jobs on one page (find, eat, rent, join), a page for each place, a side by side hall table, and the Your community door page, which had no page of its own yet.
- **Chose:** `/community-centers/` built from `content/places` (#587). Cards are grouped by part of the county; a name box narrows them when scripts run, and the area links do the same job without scripts. Center events come from calendar entries with `venue`. The section name lives in one constant (`SECTION` in `site/src/lib/places.mjs`), so David's pick in #454 is a one-line change.
- **Shipped:** the section page, 19 center pages at `/community-centers/<slug>/` (story, what's there, regulars, events, join, rent, reach, status, sources, "Report a problem"), the hall finder at `/community-centers/halls/`, and `/community/` with this section as its first picks. `DoorPage.astro` now lets a situation with no phone steps show as a "Start here" link to its page. All pages are in llms.txt and the sitemap.
- **Next:** center events on the calendar (#457), the printable flyer (#465), the watch plan (#458) and findability questions (#460).
- **Cost:** $0.
