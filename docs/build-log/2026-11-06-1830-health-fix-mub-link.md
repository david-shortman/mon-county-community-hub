# 2026-11-06: Fix the broken MUB board page link (Health #1742)

- **Considered:** only swapping the URL, or also checking what the new page says.
- **Chose:** the old page now returns 404. MUB's current page is `https://www.mub.org/newsroom/mub-board-of-directors`. It lists the next meeting as Tuesday, November 17, 2026, which conflicts with our "2nd Tuesday" entry for November 10. Per the unverified-facts rule, the November 10 calendar entry was removed and the "2nd Tuesday" wording softened. A `needs-verification` issue tracks it.
- **Shipped:** link swapped on the board record and Who decides; Nov 10 entry removed.
- **Also:** the Site run on main failed at the GitHub Pages deploy step ("Deployment failed, try again later"), not in the build. It needs a re-run, which this session could not do. The next push or scheduled run redeploys.
