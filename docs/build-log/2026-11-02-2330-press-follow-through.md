# 2026-11-02: Press follow-through on the other page types (#396)

- **Considered:** fixing each page that still looked like the old design one at a time, or finding the shared causes first. A computed-style scan of one page per template (40 pages, light and dark) showed most leftovers came from a few shared components, so the fixes went there.
- **Found:** printing from a device in dark mode gave dark boxes with black text and pale text on white paper, on every page. Screen-only buttons printed as empty boxes. Soft corners and pill shapes were left on forms, tags, tiles, code boxes, the Share this box and the Print and Share buttons. Embeds and the link preview pictures still had the old look. The full list is in [`docs/design/looks/press-audit-2026-11-02.md`](../design/looks/press-audit-2026-11-02.md).
- **Shipped:** #1462 (the audit), #1490 (one radius on forms, tags, tiles and code boxes, a rule under table heads, search results spacing), #1495 (link preview pictures in hemlock, paper and Newsreader).
- **Waiting for David:** #1469 (print always in light inks), #1492 (corners on components that also show on Help now pages, and the "Not yet" notes), #1497 (embed shapes). Each changes how a Help now page or embed looks.
- **Left to other lanes:** rust used as text in the bus and listing scroll stories (noted on #1441).
- **Checked:** `check-a11y` on all pages (0 blocking, including 320px at 200% text), screenshots at 390px and 1280px in light and dark, print emulation in light and dark. No new colors or spacing values. Cost: $0.
