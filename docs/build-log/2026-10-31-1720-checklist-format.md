# Weekly checklists: person-only items and How lines

After the first run of all three weekly checklists (#997, #998, #999, sprint wave 4, #529), the slow parts were:

- **Finding the Dominion Post columns.** The checklist said "find it from the Community section", but that section does not list them. The address pattern was only in the plan doc. Now each Dominion Post item has a How line with the pattern and how to find the last number read.
- **Pages an agent cannot read.** Visit Mountaineer Country (two pages), Mountaineer Week, the WVU calendar, WV arts grants and WV Forestry all showed a bot check or refused the connection on 2026-10-31. Time went into trying them. They now carry `person: true`, and the item starts with "A person reads this".
- **Google calendars.** Smithtown and Cheat Lake use Google Calendar, whose robots.txt asks robots to stay out. The old text said "read in a browser", which is easy to read past. They are now `person: true` too.
- **A moved page.** The Friends of the Library address now redirects; the item points at the new one.
- **Card shows and agendas.** How lines say where the details are (each show's own page; the site's /meetings/ page for which agendas are new).
- **Ticking.** The rules line now asks for a one-line note per item: what changed, "no change", or "not read" and why.

Code: `site/scripts/checklists.mjs` (two new item fields, validated and self-tested). Docs: `docs/operations/recurring-checks.md`. Cost: $0.
