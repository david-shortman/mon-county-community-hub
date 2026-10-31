# Entry format for secondhand shops, free programs and online groups

**Issue:** #423 (part of #422, thrift, markets and swaps)

## What we built

- A new folder, `content/secondhand/`, one YAML file per shop, free or lending program, or online group. The format is in `content/README.md`.
- Each entry says what kind of place it is, which part of the county it is in, who runs it, what it sells or takes, whether it buys from you, and what local cause its money funds, with a source and checked date.
- A `status` field: `confirmed`, `likely`, `unclear` or `closed`. Only confirmed and likely entries reach a page. Unclear ones stay in the data and get a `needs-verification` issue.
- `npm run check-content` checks the new entries: required fields, allowed kinds, areas, goods tags and statuses, web links and addresses, no em dashes, and time wording.
- A `ShopCard` component that every page in the section will share. It shows the "Buys from you" and "Funds a local cause" tags, and "Not checked lately" once a card is over 4 months old (#430).
- Two calendar topics, `secondhand` and `market`, in the Living here door, for dated sales and markets.

## Why

Five pages build from the same entries (#426 to #429), so one fix shows up everywhere. A separate folder keeps shop listings apart from help resources and does not need an org record for every business.

## Overlap check

Lane 5's gathering place record (#455) is for buildings people gather in (halls, community centers). Shops and lending programs need different fields (what it buys, what it funds), so they get their own folder. If both settle on shared fields later, the `area` names can be merged.
