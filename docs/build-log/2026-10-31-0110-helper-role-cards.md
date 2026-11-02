# 2026-10-31: Cards for helpers (#404, part 2)

- **Considered:** many residents reach help only through someone they already trust. Part 1 (#734) let a helper make a list of places; the role cards were still open.
- **Chose:** `/for/helpers/` and one card per role: teachers, pastors and faith leaders, librarians, nurses, landlords and bus drivers. Each card has three things a person might say and two or three steps for each. A step is either a page on this site or a resource record, so every number keeps its source and checked date; the step text was checked against each record's own words. Data lives in `site/src/lib/helper-roles.mjs`.
- **Shipped:** 7 pages. Each card prints on one Letter page with phone numbers spelled out and a version date, and says it is not advice.
- **Waits for David:** the cards name 988, 211 and 911 and point to shelter, food and rent help, so the PR is labeled `for:david`. Handing cards to any group stays with #163.
- **Cost:** $0.
