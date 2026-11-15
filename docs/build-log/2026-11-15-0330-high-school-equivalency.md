# /high-school-equivalency/: the steps to a WV high school equivalency diploma

Date: 2026-11-14. Closes #1936. Sprint wave 19, learning lane (#529).

## What I considered

#1936 asked for a short section on `/work-and-learning/`. That page is changed by open PR #1840 (for:david), and it names 211, so any edit there waits for David. A page of its own avoids both, fits the "Step path" block (`Route` and `Milepost`), and can be linked from both pages.

## What shipped

- `/high-school-equivalency/`, "Finish high school as an adult": 5 steps (who adult education is for, free classes at MTEC, the GED Ready practice test, the free GED test, getting the diploma). Each step has a source line, read 2026-11-14, from the WV Department of Education's adult education pages, GED Testing Service's West Virginia page and MTEC's Adult Learning Center pages.
- A new record, `content/resources/mtec-ged-prep.yaml`, for GED prep at the MTEC Adult Learning Center, with quotes from each source.
- Links from `/keep-learning/#more` and `llms.txt`.

## Left off

- Which GED testing center is nearest. No official page we can read names one: #1957.
- The $20 fee MTEC's page gives for extra diploma copies. It is DiplomaSender's price, and DiplomaSender's own page was not read.
- The HiSET name on the state's and MTEC's pages: see `docs/discoveries/2026-11-14-hse-pages-name-old-tests.md`.

## Next

A link from `/work-and-learning/` once #1840 is settled. The adult skills need's gap ("No one page walks an adult through the steps") can be removed once #1950 lands.

## Scoreboard

Findability q78 ("Where can I finish my high school diploma, and what are the steps?") should now find a step page. Re-run it in the next findability sweep.
