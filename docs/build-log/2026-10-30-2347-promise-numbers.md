# 2026-10-30: Show how fast we act on group requests

- **Considered:** a promise to act within a week means little unless people can check it (#523). The `group-request` issues from #521 already hold the received date, the closed date, and whether an item was taken down as overdue.
- **Chose:** count them when the site is built and show the numbers on the Corrections page and the For groups and helpers page, for this month and all time. Counts under 10 show as "fewer than 10", like Corrections. A take-down on day 7 counts as on time but not fixed. Any request that took longer is listed with the item and a one-line reason, never who asked. Before the first request the section says "No requests yet."
- **Safe by design:** the build reads the issues with a read-only token. If GitHub does not answer, the build still works and the section says the numbers could not be loaded, with a link to the log.
- **Not yet:** the promise itself ("We act on a fix or removal request within a week") goes on the pages once #520 and #522 are done, as #523 says.
