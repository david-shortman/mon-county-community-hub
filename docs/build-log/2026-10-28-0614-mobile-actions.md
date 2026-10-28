# 2026-10-28: Mobile first, part 1: action buttons and a bottom tab bar

- **Asked:** David said nearly all visits come from phones, and asked for mobile-first design with modern, useful ideas, keeping the local identity rooted.
- **Considered:** six ideas: action buttons on cards, a bottom tab bar, offline and add to home screen, instant page loads, a neighborhood picker without tracking, and CSS polish. Started with the first two because they help someone act on a phone right away, and they fold in #49 (card and menu fixes from the first design review).
- **Shipped:**
  - Cards lead with a big date and "in 3 days", then large buttons: Details, Call, Directions, Add to calendar, Share. Buttons only show when the source gave us a link, phone, or place.
  - One calendar file per entry for "Add to calendar" (46 files built today). Share opens the phone's share sheet, or copies the link where there is none.
  - On phones the menu is a tab bar at the bottom, in thumb reach: Home, Deadlines, Stay tonight, Bill help, and More (a native popup listing every page). The ridgeline is its top edge. The current page is marked on phones and desktop. The footer now lists all pages, and there is a "Skip to main content" link.
  - Recycling drop-off sites and the Solid Waste Authority got Call and Directions buttons, using only the addresses and numbers already on the page.
  - New optional content fields `place`, `phone`, and `phone_label`, checked by `npm run check-content`.
  - CSS is now inlined, so pages paint in one request on slow connections.
  - The identity guide has a new "Mobile first" section.
- **Checks:** axe found zero violations on all four pages at 390px and 1280px in light and dark. At 320px and 390px: no sideways scrolling, every button and tab is at least 48px, focus never hides under the tab bar, and no two links share a name but go to different places. Every text pair still passes WCAG 2.2 AA.
- **Next:** offline and add to home screen, instant page loads, the neighborhood picker, and CSS polish, as separate issues.
