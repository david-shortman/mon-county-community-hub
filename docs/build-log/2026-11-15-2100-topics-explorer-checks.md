# Topics explorer: motion off, no script and phone checks

**Issue:** #2030 (the last step of the Topics explorer build, #2025)

One pass that proves the explorer keeps every promise the plain /topics/ page made.

**Changed:**

- The shared "Turn off motion" switch (`MotionSwitch.astro`) now sits under the chips' help line. It is the same setting as every scroll story on the site, and it stops Flip through's fly-off, drag tilt and card peek. When the phone already asks for reduced motion, the button hides and a note says why.
- Fixes found by taking 360 px screenshots (made in the #2027 to #2029 branches, so each PR is right on its own):
  - The chips lost their look once the script turned them into buttons, because Astro's scoped styles do not reach elements a script makes. A picked chip did not look picked. Now fixed, with a test.
  - The picks bar sat under the phone's tab bar. It now sits just above it (`--tabbar`), and its Flip through button is short ("Flip through 12", with the full name for screen readers), so the bar is one or two rows.
  - My list's Remove buttons wrapped under their page names. Each page and its Remove button now share a row.
- `docs/accessibility.md`: a screen reader item for the explorer under "Needs a person".

**New e2e tests** (`site/e2e/topics-explorer.test.mjs`, 17 for the explorer in all):

- Reduced motion on the device: no switch, a note, no peek, the next card at once, no transition.
- "Turn off motion" on /topics/: stays off after a reload, no peek, no fly-off wait.
- Scripts off at 360 px: no buttons in the page, no empty boxes (Picked for you, My list, the bar and the deck stay hidden), Help now and the A to Z show, all 20 chip links answer, no sideways scroll.
- 360 px phone at 640 and 560 px tall (address bar hidden and showing): no sideways scroll with picks, My list or the deck, and the deck and its Save, Skip, Open page and Close fit on screen.

**Screenshots** at 360 px, light and dark, are in `docs/design/looks/topics-explorer/`: the chips with two picked, Picked for you, My list, and the deck.

**Weight:** /topics/ is 82.7 KB (budget 150 KB). Before the explorer it was 70.2 KB, so the whole explorer adds 12.5 KB, under the 30 KB extras budget.

**Still needs a person:** a VoiceOver pass on an iPhone, and the same checks by hand on a real iPhone (Safari) and Android phone (Chrome), including Back keeping your place (#1369).

Cost: $0.
