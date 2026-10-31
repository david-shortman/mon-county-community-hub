# 2026-10-31: Build warning for page openings above grade 9 (#833)

- **Considered:** the charter asks for about an 8th grade reading level, but nothing measured it on every build. The dentist page opened at about grade 11 (#804) and no check noticed.
- **Chose:** a warning-only check after the build, using the same Flesch-Kincaid formula as the source benchmark so the numbers match. It grades the first two sentences after each page's H1, because that is what most people read.
- **Shipped:** `site/scripts/check-reading.mjs`, run in `postbuild`. It skips text with no sentences and openings under 12 words. First run: 92 openings graded, 15 above grade 9, mostly community center pages and their flyers, plus `/calendar/month/`, `/contractor-license/` and the home page.
- **Next:** fix the flagged openings in their own lanes' PRs. Once the list is short, the warning could become a failure.
