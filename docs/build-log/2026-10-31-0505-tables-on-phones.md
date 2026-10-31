# 2026-10-31: Tables no longer break on phones (#917)

- **Problem:** on a phone, the "spaces to rent" table on Compare halls stacked short words one letter per line ("S / e / a / t / s") and cut off the Price column.
- **Cause:** a site-wide rule, `main { overflow-wrap: anywhere; }`, lets text break anywhere. Inside a table that also lets every column shrink to one letter wide.
- **Did:**
  - `site/src/layouts/Base.astro`: table cells and captions now break only between words. A shared `.table-scroll` box scrolls a wide table sideways in its own box, with soft shadows at the edge that show there is more.
  - `site/src/pages/community-centers/halls.astro`: on phones (40rem and under) each row shows as a small card: the place name on top, then labeled lines like "Seats: 40". Medium screens keep the grid, scroll it sideways and show a one-line hint. Table roles are set by hand so screen readers still hear a table.
- **Checked:** every built page with a table (Compare halls and How we're doing) at 320px and 390px, light and dark, with Playwright. No page scrolls sideways, and no word breaks mid-word. The How we're doing tables were already fine.
