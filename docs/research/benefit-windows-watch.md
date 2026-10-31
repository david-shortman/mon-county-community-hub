# Watching for state benefit windows

Last checked: 2026-10-30
For issue #216.

LIEAP, the winter heating help program, is announced only by press release, and its windows are short. The 2026 window closed early: DoHS posted "Announces closure of LIEAP Application Period" on February 6, 2026. The 2026-27 window was posted on October 30, 2026, and a calendar entry for it (`lieap-pre-application-2026-27`) was opened the same day in PR #755, which waits for David.

## The weekly check

Once a week (and daily from October to February):

1. Open the DoHS news page: https://dohs.wv.gov/news . It lists press releases newest first, with dates.
2. Look for titles that name LIEAP, SNAP, Medicaid, WV WORKS, Summer EBT, school clothing, or "application period."
3. Open the release. Copy only what it says: start date, last day, who it is for, how to apply, phone.
4. Add or update a file in `content/calendar/` (format in `content/README.md`), with the release as the source and today's Morgantown date as `checked`. Update any resource that mentions the program (for LIEAP, `lieap-heating-help`).
5. These are money topics, so the PR waits for David. Say in the PR that the date came from a release dated that day.

## Feed status

- The DoHS news page has no RSS or iCal link that we found on 2026-10-30, so this is a watched page, not a live feed.
- WV PATH (the online application) is where people apply, not where dates are announced.

## What to watch for next

- Whether DoHS opens a general LIEAP window after the pre-LIEAP deadline of Wednesday, November 25, 2026. The October 30 release does not say.
- Emergency LIEAP (for households facing a shutoff), if a date is announced.
