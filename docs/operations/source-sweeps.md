# Recurring local source sweeps

The plan for #6: which public sources get re-checked, how often, and by whom (a scheduled job or a person), so changes reach the site. It builds on [`recurring-checks.md`](recurring-checks.md), which lists the jobs that already run, and it follows the strict robots decision ([`2026-11-01-0715-keep-robots-strict.md`](../decisions/2026-11-01-0715-keep-robots-strict.md)): a source whose robots.txt or terms say no is read by a person, never by a script, and never worked around.

Written 2026-11-01 (sprint wave 9, #529). Cost: $0. Everything runs on GitHub's free runner or in sessions we already run.

## What each sweep produces

- **A change worth acting on:** a `type:content` issue, or an update to the standing watch issue for that lane, with the source link and what changed. Food, shelter and money changes wait for David as usual.
- **Nothing changed:** nothing, or a one-line "no change" on that week's checklist issue.
- **A summary:** Duet folds the week's sweep issues into the morning brief.

## The sources from #6, and where each stands

| Source | Read by | How often | Where it lives now | Robots and terms (checked 2026-11-01) |
|---|---|---|---|---|
| Monongalia County Commission agendas and minutes | Script | Daily | The meetings reader in the morning site build; the Agenda guides job (`.github/workflows/agendas.yml`) opens one issue per meeting with a posted agenda in the next 14 days; minutes summaries in `content/minutes/` | Allowed (`automated-reads.md`) |
| Morgantown City Council agendas and minutes | Script, plus a person | Daily (script); weekly (person) | Same meetings reader and Agenda guides job (`morgantownwv.gov/AgendaCenter`, allowed). The Make it better weekly checklist also has a person scan new agendas | Allowed. The city's calendar feed is blocked (`/common/modules/icalendar/`), so city events come from a person reading `calendar.aspx` on the weekly centers checklist |
| Morgantown Public Library news and events | Script | Daily | The library events feed (`events.mympls.org`, adapter `morgantown-library`) in the morning build | Allowed. Its robots.txt also asks that content not be used to train AI; we only read events and show them with a link back |
| United Way of Monongalia and Preston Counties | Script (food lists); a person (grants and news) | Daily (food); monthly (rest) | The food pantry watch reads its food page and the food hours PDF (`content/watch/food.yaml`). Its grant cycle is in `docs/research/local-grants-and-funders.md` | Allowed, with `Crawl-delay: 10`, which the shared reader honors |
| WVU Extension, Monongalia County | A person | Monthly | Not covered yet | **Refuses automated reads:** `extension.wvu.edu` answered HTTP 403 to both robots.txt and the county page on 2026-11-01. A person reads it in a browser |
| Local grant and funding calls | Script (some); a person (the calendar) | Daily (watched pages); monthly (calendar) | The Make it better watch reads the Organizational Arts Grants, WV arts grants and WV Community Tree Grants pages. The full grant calendar is in `docs/research/local-grants-and-funders.md` | Each funder's site is checked in the shared reader before any read |

## Schedule

| When | Who | What |
|---|---|---|
| **Every morning** | Scripts (site build 10:17 UTC, Source check 11:41 UTC, Agenda guides 14:17 UTC) | Meetings, library and other event feeds; every cited source; the food, centers, sale, Make it better and (in winter) shelter watches. Changes open or update issues. |
| **Every Monday** | A person, through the weekly checklist issues | Centers, sales and markets, and Make it better (city agendas and vacancy list). Items marked `person: true` are pages that refuse automated reads. |
| **First week of each month** | A person (the Make it better checklist already has a monthly block) | Add three items (see "Proposed changes"): WVU Extension Monongalia County events and programs; United Way news and the agency application page; the grant calendar rows whose next date is within 60 days. |
| **By grant cycle** | A person, from the grant calendar | January (United Way Funded Partners opens January 11, 2027), April (Organizational Arts Grants for 2027-28), August (Your Community Foundation rounds). The Make it better checklist already adds April items. |
| **Once a year** | A person | Re-read `docs/research/local-grants-and-funders.md` against each funder's page, and re-run `node scripts/robots-audit.mjs` in `site/` to catch sources whose robots.txt changed. |

## Proposed changes (small, $0, each its own PR)

1. **Add WVU Extension to the Make it better checklist** as a monthly item with `person: true`: `https://extension.wvu.edu/monongalia`, with the note "refuses automated reads (HTTP 403); read in a browser." Lane: Make it better.
2. **Add United Way's agency application page** (`https://www.unitedwaympc.org/agency-application`) to the Make it better watch, so a change to the January cycle opens an issue. Robots.txt allows it.
3. **Add a monthly "grants due soon" item** to the Make it better checklist: rows in the grant calendar with a date in the next 60 days. The checklist script already computes similar date lists, so this is a small change to `site/scripts/checklists.mjs`.
4. **Keep the source list in one place.** The tables above and in `recurring-checks.md` are the list; tune them by editing these files, not by comments on #6.

None of these contact anyone or need an account.

## Not covered on purpose

- **Facebook-only sources** (#459): Meta allows automated reading only through its API. A person reads them, or we leave them out.
- **Google Calendar feeds:** `calendar.google.com/robots.txt` allows only the home page, so they stay on the weekly checklists.
- **Sources that block robots** (city calendar feed, BLS, WVU Extension): read by a person or left frozen with the date they were last read, per the robots decision.
