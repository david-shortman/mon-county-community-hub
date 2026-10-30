# 2026-10-30: Page weight checked on every build (#180)

- **Considered:** the weight budget (urgent pages under 100 KB, everyday pages under 300 KB) was only checked by hand in design reviews.
- **Chose:** a small Node script that runs after the build, like the contrast check. No new workflow step and no cost.
- **Shipped:** `site/scripts/check-weight.mjs`. For each built page it adds the gzipped page to the gzipped files it loads on a first visit (font, icon, scripts, styles, images) and prints a table, largest first. The build fails if a page is over budget. Urgent pages are listed once at the top of the script (home, Stay tonight, food help), and any page with the crisis strip counts as urgent.
- **Today:** every page is 17 to 24 KB, well under budget. The search index loads only when someone searches, so it is not counted.
