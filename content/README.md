# Content data

Structured data the site is built from. One file per entry, YAML, so humans and Claude can both edit it and changes show up clearly in PRs.

**Draft schema (v0).** Expect it to change once the first topic area is built.

## `orgs/<slug>.yaml`: organizations

```yaml
name: Example Organization
slug: example-organization
kind: nonprofit        # nonprofit | government | community-group | business | school | faith
website: https://example.org
summary: One or two plain-language sentences on what they do.
topics: [poverty, food]
area: monongalia-county # or morgantown, statewide, etc.
sources:
  - url: https://example.org/about
    checked: 2026-10-27
```

## `resources/<slug>.yaml`: things a person can use or do

```yaml
title: Free tax preparation
slug: free-tax-prep-example
org: example-organization  # slug from orgs/
topics: [poverty, money]
who_it_is_for: Households earning under a set amount.
what_to_do: Call to book an appointment, January through April.
contact:
  phone: "304-555-0100"     # public organizational contact only
  url: https://example.org/tax
cost: free
sources:
  - url: https://example.org/tax
    checked: 2026-10-27
```

## `calendar/<slug>.yaml`: dates and deadlines

Shown on the site's Deadlines page and in the subscribable `calendar.ics` feed. Entries drop off the site automatically once `ends` has passed (the site rebuilds every morning).

```yaml
title: Heating bill help (LIEAP) applications open
slug: lieap-2026-27           # unique; include the season or year
starts: 2026-11-02            # YYYY-MM-DD
ends: 2026-11-20              # YYYY-MM-DD; leave out for a single day
org_name: WV Department of Human Services
who_it_is_for: Households that need help paying winter heating bills.
what_to_do: Apply at your local DoHS office or online before the window closes.
url: https://example.wv.gov/lieap   # where a person should go to act
topics: [money, housing]      # money, food, housing, health, family, government, voting, recycling, taxes, community
sources:
  - url: https://example.wv.gov/lieap
    checked: 2026-10-28
```

To roll a yearly item forward, copy the file, change the slug, dates, and sources, and re-check the source. Never guess a date: if the new date is not published yet, leave the item out and note it in an issue.

Run `npm run check-content` in `site/` to validate entries.

## Rules

- Only public organizational contact details. Never a private person's info.
- Every entry has at least one source with a `checked` date.
- Entries older than 6 months since `checked` get flagged for re-verification.
