# Thrift shops, sell or donate, and markets pages

**Issues:** #426, #427, #428, #430 (part of #422)

Three new pages in the Living here door, all built from `content/secondhand/` and the calendar, with no hand-kept lists:

- **Thrift and resale shops** (`/thrift-shops/`): 18 shops grouped by area, A to Z. Quick filters (clothes, kids, furniture and home, books records and games, antiques and vintage, buys from you, funds a local cause) are plain links to each card, so they work with no script.
- **Sell, donate or give away your stuff** (`/sell-or-donate/`): "What do you have?" with sell, sell online, donate, give away free and recycle options for eight kinds of things. Recycling links to the recycling page instead of copying it. It says plainly that there is no building materials reuse store since the ReStore closed in 2023. The selling online box uses the FTC's tips and names no meetup spot, because no official page names one (#681).
- **Markets and sales coming up** (`/markets/`): the next 30 days from the calendar, the farmers market and the library book sale room every week, the yearly sales, the nearest Pennsylvania flea markets, yard sale sites we could open, and how to sell at a market.

The "Borrow it or get it free" page (#429) is in the Get through this month door, so it waits for David in its own PR. Until it merges, these pages link free programs to their own websites and hide the link to it.

**Keeping it fresh (#430):** `docs/operations/secondhand-checks.md` lists the weekly organizer pages and the quarterly shop check. `npm run secondhand-due` lists entries due for a re-check. Cards say "Not checked lately" after 4 months. A `for:duet` issue asks Duet to run both checks.
