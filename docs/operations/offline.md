# Offline: saved copies on the phone

Many residents use old phones, prepaid data or spotty signal. The site keeps saved copies of key pages in the phone's browser so they open with no signal. The code is [`site/src/pages/sw.js.js`](../../site/src/pages/sw.js.js) (it builds `/sw.js`, a "service worker"), started by [`site/src/components/AppShell.astro`](../../site/src/components/AppShell.astro). Cost: $0. No library, no outside service, nothing sent anywhere.

## What gets saved, and when

| When | What | About how much |
|---|---|---|
| First visit, as the page finishes loading | Help now (`/stay-tonight/`) | about 18 KB |
| Right after that, on the same first visit | The hard-moment pages: Tonight, Food help and the Food today pages, Utility bills, After a storm, Mental health, Drugs and alcohol, Protective orders | about 160 KB, once |
| From the second page on | The home page, the door pages, Dates | about 185 KB, once |
| Any page a person opens | That page | its own size |

- Each list is fetched again at most once a week, and checked at most once an hour.
- **Data Saver on:** only Help now is saved.
- **2G connection:** only Help now, until the phone has a faster connection.
- Everyone gets the same lists, so the saved pages do not show which of them a person looked at.
- At most 60 pages are kept. When over, the oldest pages a person opened go first, never the lists above.

## How a saved copy is shown

The site always tries the network first. If there is no answer in 4 seconds, or no network, the saved copy shows with a note at the top:

> Saved copy from 9:14 p.m. on November 1, 2026, shown because the connection is slow or missing. Dates, hours and phone numbers may have changed. Call before you go.

If the copy is more than 30 days old, the note adds "That is more than a month ago."

If the page is not saved (or its copy expired), the phone shows the saved Help now page instead, with a note that says so.

## When saved copies expire

Old information can send someone to a closed door, so copies are deleted after:

| Pages | Deleted after | Why |
|---|---|---|
| Tonight, Food today pages, Dates | 3 days | They change day to day |
| The other hard-moment pages | 30 days | Hours and numbers change, but not daily |
| Any other page | 90 days | |
| Help now | Never | It is the last thing to show with no signal. Its note says when a copy is more than a month old. |

When the phone is online, a copy is replaced long before it expires (weekly for the lists, every visit for the page being opened). Expiry matters only for a phone that has been offline or away from the site for a long time.

## How it is tested

`site/e2e/offline.test.mjs` (Playwright): after one visit to the home page, every hard-moment page opens offline with the dated "Call before you go" note; an unsaved page falls back to Help now; copies made 40 days old are not shown for Tonight, and the Help now fallback says it is more than a month old; back online, pages show with no note.

## Changing it

- Adding a page to the saved lists: edit `HARD` in `sw.js.js`. The build fails if a listed page does not exist. Keep the About page's "Saved copies stay on your phone" note accurate.
- Changing what the note says, or what Help now shows offline, changes what residents see about crisis help, so the PR waits for David.
