# Meeting records as open data, and a past meetings page per body (#2084, step 1)

**What:**

- `/api/v1/agenda_guides.json` and `/api/v1/meeting_decisions.json`: every agenda guide and every minutes record, past and coming, in the open data (CC BY 4.0). Each adds `body_name`, `page_url`, and for guides `kind_label` on each item and `agenda_saved_copy`; minutes records add `minutes_status_note`. One record at a time works too, like `/api/v1/meeting_decisions/{slug}.json`.
- Every `sources[]` entry in the API now has `saved_copy` when the Internet Archive keeps a checked copy of that page or file (#1906, #2079).
- MCP server: a `meeting_records` tool. It filters by body, words, dates, and agendas or decisions, newest first. With words, it returns only the matching items or motions, plus the total. Every result has sources, checked dates and freshness, and the note tells AI tools to describe records as written and never judge them.
- `/meetings/agendas/<body>/past/` for each body with a past guide or any minutes: every minutes record and every past agenda guide, newest first. Body pages link to it. Past guides leave out how to watch and comment. Listed in `llms.txt`.

**Why:** Before this, guides and decided lists dropped out of sight 30 days after the meeting, and none of it was in the open data or the MCP server. Keeping and exporting the records is the base for the later steps in #2084 (topic tags, following a matter across meetings, facts that feed other pages).

**Rules kept:** nothing new is written about any item. The API and pages show the same reviewed records, with the agenda's and minutes' own words, `[name]` for private people, and no ranking. Within v1 the API only adds fields (the contract file grew; nothing was removed).

**Numbers on 2026-11-22:** 13 agenda guides, 8 minutes records, 9 past meetings pages.

**Cost:** free. Static files built with the site.
