# Agenda guides: the weekly refresh

How to write and refresh the plain-language guides on `/meetings/agendas/` (#529). The neutrality rules are in [`docs/decisions/2026-10-31-2132-agenda-guide-neutrality.md`](../decisions/2026-10-31-2132-agenda-guide-neutrality.md). Read them first.

## What is covered

| Body | Usual meetings | Where the agenda posts | Can our tools read it? |
|---|---|---|---|
| Morgantown City Council | 1st and 3rd Tuesday, 7 p.m. Packet posts the Thursday before | [City AgendaCenter](https://www.morgantownwv.gov/AgendaCenter/City-Council-3) | Yes, the meetings list reads it daily |
| Monongalia County Commission | Wednesdays, 10 a.m. | [Meeting schedule and agendas](https://www.monongaliacounty.gov/commission/meeting_schedule/index.php) | Yes, the meetings list reads it daily |
| Monongalia County Board of Education | 2nd and 4th Tuesday, 5 p.m. | [BoardDocs](https://go.boarddocs.com/wv/mono/Board.nsf/Public) | No. BoardDocs answers our requests with 403, so a person reads it in a browser. Never work around the block |
| Morgantown Planning Commission, Board of Zoning Appeals, BOPARC, Morgantown Utility Board, Land Reuse and Preservation Agency | See each agenda | [City AgendaCenter](https://www.morgantownwv.gov/AgendaCenter) | Yes, the meetings list reads it daily, and the Agenda guides check opens issues for them |
| Morgantown Monongalia MPO Policy Board | See each agenda | [plantogether.org/agendas](https://www.plantogether.org/agendas) | By hand: open the page and its PDF links |
| Mountain Line Transit Authority Board | See each agenda | [busride.org board meetings](https://www.busride.org/copy-of-board-meetings) | By hand |
| Monongalia County Board of Health | Last Thursday of January, March, May, July, September and November, 9 a.m., per [its page](https://www.monchd.org/about) | [monchd.org/about](https://www.monchd.org/about) | By hand. Minutes are one PDF per year |
| Westover, Star City, Granville and Blacksville councils | See each town's page | Westover: [westoverwv.org](https://www.westoverwv.org/). Star City: [minutes](https://www.starcitywv.com/minutes/). Granville: [agendas and minutes](https://townofgranvillewv.gov/meeting-minutes-agendas) (Word files). Blacksville: no official page found yet | By hand. Most post minutes, not agendas, so these usually get "What was decided" files only |

Dates move. For example, the city calendar (checked 2026-10-31) lists no Council meeting on Tuesday, November 3, 2026, Election Day, and a Council meeting on Tuesday, November 10. Go by the posted agenda, not the usual pattern.

## When

- **Each day:** the Agenda guides check (`.github/workflows/agendas.yml`) opens one issue, labeled `agenda-guide`, for each newly posted Council or Commission agenda in the next 14 days that has no guide. Do the issue, then close it.
- **Each week (Thursday or Friday):** look at the next two weeks. Council packets post Thursday afternoon. Check BoardDocs by hand for school board agendas.
- **The day before a meeting:** re-open the agenda link. If the agenda was amended (a new file or "Amended" in the title), re-read it and update the guide.

## Checklist for one guide

1. Open the official agenda PDF, and the packet if there is one. Note the date you read it.
2. Copy `content/agendas/county-commission-2026-11-04.yaml` to `content/agendas/<body>-<YYYY-MM-DD>.yaml`. `body` is one of the keys of `BODIES` in `site/src/lib/agendas.mjs`. For two meetings of one body on the same day, add a short ending (`city-council-2026-10-06-special`).
3. Fill in `meeting` (as the agenda names it, like "Regular meeting" or "Special meeting"), `date`, `time` (quoted 24-hour), `place`, `watch`, `agenda_url`, `packet_url` if posted, and `read`.
   - Place and time come from the agenda header. If the agenda does not say, use the body's own page and list it in `sources`.
   - Watch: say only what the agenda or the body's page says (for example, the Council agenda names its YouTube channel). If you find no live stream, say so.
4. List **every** item in agenda order. For each:
   - `number`: as on the agenda. Sub-items that are separate votes get their own entry (`11a`, `11b`). Short routine sub-lists go in `parts`.
   - `title`: the agenda's words, exactly, typos included. Replace a private person's name with `[name]` (new hires, presenters, applicants). Do not copy personal details from the packet.
   - `kind`: one of the kinds in `site/src/lib/agendas.mjs`.
   - `line`: one to three short sentences on what kind of item it is. Use facts from the agenda or packet only (an amount, a street, a date). If the agenda gives no detail, write "The agenda gives no more detail."
5. Read every line against the rules. Ask: would someone on either side of this item read the line as fair? Would it still be true if the vote went either way? Remove any word that judges, predicts, or says who supports what.
6. In `site/`, run `npm run check-content` and `npm run build`. The check fails judging words and em dashes, but it cannot catch everything. Step 5 is the real check.
7. Open a PR named "Agenda guide: <body>, <date>", `Closes #<issue>`. Merge with `scripts/safe-merge.sh` once checks pass.

## Taking guides down

Guides drop off the page on their own after the meeting date. If an agenda is withdrawn or the meeting is cancelled, delete the file in a PR the same day; taking down a wrong item does not wait.

## Line patterns

Use these so the same kind of item reads the same way on every board.

| Kind | Pattern |
|---|---|
| `first-reading` | A first reading of an ordinance about <subject>. No final vote at this reading. |
| `later-reading` | A second reading and final vote on an ordinance about <subject>. First read on <date>. |
| `vote` | A vote on <a contract, a resolution, a request> for <subject, amount if listed>. |
| `request` | A request for <a variance, a conditional use, a site plan> at <address if listed>. The board hears it and decides. |
| `consent` | Routine items approved together with one vote. The agenda lists these parts. |
| `public-hearing` | A set time for the public to speak about <item> before Council acts on it. |
| `public-comment` | Time for members of the public to speak to the <body>. |
| `appointments` | Appointments of residents to city or county boards. |
| `executive-session` | A closed session under <W. Va. Code section on the agenda>, about <the reason the agenda gives>. No decisions are made in it. |
| `proclamation` | A statement by the <body> recognizing <subject>. |
| `discussion` | A discussion of <subject>. The agenda lists no vote. |

## What was decided (from minutes)

For meetings in the last 30 days with posted minutes, a file in `content/minutes/` lists what the minutes record. It shows on the body's page, `/meetings/agendas/<body>/`, for 30 days after the meeting. The guide itself is never changed to show how a vote went (neutrality rule 5); this is a separate record copied from the minutes.

1. Open the official minutes. Note whether they say "approved", "draft" or neither, and the date you read them.
2. Copy an existing file in `content/minutes/` to `content/minutes/<body>-<YYYY-MM-DD>.yaml`.
3. List **every** motion with a recorded result, in the minutes' order, routine ones too (approving minutes, adjourning). For each:
   - `item`: the agenda number or title, as the minutes give it.
   - `motion`: the motion's words as written. Leave out who moved and seconded it.
   - `result`: the result as written ("Motion carried", "Approved", "Failed"). If the minutes record a motion with no result, leave `result` out; the page says the minutes do not record one.
   - `vote`: the count as written ("7-0"). If the minutes list only a roll call, count it ("Yes 6, No 1"). Leave it out if the minutes give neither.
4. Never add what people said, the reasons given, who spoke, or how anyone felt. No adjectives about the result. Replace private people's names with `[name]`.
5. Set `minutes_status`: `Approved`, `Draft` or `Not marked`. Draft minutes can change, and the page says so.
6. Run `npm run check-content` and `npm run build` in `site/`, and open a PR named "What was decided: <body>, <date>".

When a board approves minutes that were a draft, re-read them and update the file (actions and `minutes_status`).

## Hand checks for bodies our tools do not read

Each week, open the pages in the table above for the MPO, Mountain Line, the Board of Health and the towns. Write a guide for any agenda posted for the next two weeks, and a "what was decided" file for any minutes posted for the last 30 days. If a site blocks automated reads, read it in a browser or skip it. Never work around a block.
