# 2026-10-31: County Commission agendas and where other bodies post meetings

- **Considered:** outside the city, meeting records are scattered or missing (#13). The city's AgendaCenter reader (#12, #743) was in place.
- **Chose:** add the Monongalia County Commission as a second daily source, read from the county's meeting page, where each agenda's file name carries its date. For bodies with no feed, a short list of where they post agendas, minutes and video, or that we found nothing, each with the page read and the date: the Board of Health, the MPO Policy Board and Star City.
- **Shipped:** County Commission regular, work session, special and emergency agendas on `/meetings/` and in `meetings.json`, linked to the county's files; the "Other public bodies" list; a source rule so the daily check watches the county's listing page, not each agenda file.
- **Left off:** the school board (BoardDocs blocked the build session), Westover and Granville (pages not reachable) and Blacksville (not looked for). Opened #860.
