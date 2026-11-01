# Accessibility status

Where the site stands on accessibility, what a machine has checked, and what still needs a person. The standard is [WCAG 2.2](https://www.w3.org/TR/WCAG22/) level AA, scored with the [accessibility rubric](rubrics/accessibility.md). Text contrast goes further, to 7:1 (AAA), as set in [`docs/design/identity.md`](design/identity.md).

Last full audit: **October 31, 2026, evening**, on every built page (211), during sprint wave 5 (#529). The first audit that day covered 137 pages in wave 4.

## How it is checked

| Check | What it covers | Runs |
|---|---|---|
| `npm run check-a11y` | axe-core at 390px in light and dark; no sideways scroll at 320px with text at 100% and 200% | In CI on every PR. Fails the build |
| `npm run check-contrast` | Every text and background color pair in the site's color tokens, light and dark | After every build. Fails the build |
| `node scripts/a11y-deep.mjs [path]` | axe at 1280px in light and dark, text zoom, keyboard, focus hidden by sticky bars, text spacing, reduced motion, names for charts and icons, link text | By hand, in `site/` after `npm run build`. Prints findings, never fails |

Machines catch only part of the problems. The "Needs a person" list below is the rest.

## Results, October 31, 2026 (211 pages)

| Area (WCAG) | Result | Notes |
|---|---|---|
| Automated scan (many) | Pass | 0 axe problems at 390px and 1280px, light and dark |
| Text contrast (1.4.3, 1.4.6) | Pass | Text pairs are at least 7:1 in both themes |
| Contrast of chart lines and controls (1.4.11) | Pass, after a fix | The orange trend line was 2.99:1 on the page background. Now 3.17:1 (#1035) |
| Reflow at 320px (1.4.10) | Pass | No page scrolls sideways at 320px. 400% zoom on a 1280px screen is the same test |
| Text at 400% on a wide screen (1.4.4) | 210 of 211 pass; 1 fix waiting | `/how-it-works/` scrolled sideways at 1280px with text at 400%: its table kept the first column on one line. The fix is #1105, which waits for David because the page names 211 |
| Text at 200% (1.4.4) | Pass, after fixes | Fixed in #1008 and #1146 (19 flyers and How is Mon County doing?, #971). `check-a11y` on 276 pages: none scroll sideways at 320px with text at 200%. Home page crisis buttons (#1016) no longer scroll sideways, but their fix still waits for David |
| Text spacing (1.4.12) | Pass | Nothing scrolls sideways or gets cut off |
| Keyboard (2.1.1, 2.1.2) | Pass | Tabbed through every page: every link, button and input can be reached, and focus never gets stuck. Pressing Space and Enter on each control was not tested one by one |
| Skip link (2.4.1) | Pass | "Skip to main content" is the first Tab stop on every page |
| Focus visible (2.4.7) | Pass | Every Tab stop shows a focus ring |
| Focus not hidden (2.4.11) | Pass | On a 390px phone, no focused item sits under the header or the bottom tabs |
| Focus order (2.4.3) | Pass, one fix waiting | Order follows the page. `/calendar/` has 911 Tab stops. #1090 (waits for David) groups it by week with jump links: 223 Tab stops, and "Skip past the dates" is the 20th (#1033) |
| Quick exit | Pass | On `/stay-tonight/`, "Leave this page" is the 4th Tab stop, after 911 and 988. Pressing Shift 3 times also leaves |
| Headings, landmarks, page titles (1.3.1, 2.4.2, 2.4.6) | Pass, after a fix | `/birth-control-and-testing/` jumped from `h1` to `h3`. Fixed in this round. One `h1`, main landmark and region rules pass on every page |
| Form labels (1.3.1, 3.3.2) | Pass | axe's label rules pass on every checkbox, search box and finder input |
| Link purpose (2.4.4) | Pass | No empty or "click here" links. Some source links share a short name like "Medicare"; the sentence around each says what it is |
| Charts and images (1.1.1) | Pass | Each trend chart has a text name and a "See every number" table. Icons are hidden from screen readers. `/pulse/` and the planned `/needs/` page have no charts |
| Reduced motion (2.3.3) | Pass | With "reduce motion" on, nothing animates |
| Target size (2.5.8) | Pass | axe target size rule passes |

## Fixes in this round

- #1008: no sideways scroll at 200% text on Compare halls and on trend chart number tables; `check-a11y` now checks 200% text.
- #1022: the Vote page's voter ID card shows the IDs as a list and each exception apart (#973).
- #1035: the trend chart's orange line meets 3:1, and `scripts/a11y-deep.mjs` lets anyone re-run this audit.
- Wave 5: the heading order on Birth control and testing (#1110) and Burning leaves and brush (#1146) is fixed, and the flyers and How is Mon County doing? fit at 200% text (#1146, closes #971). #1105 (waits for David) fixes the How it works table at 400% text, and #1090 (waits for David) makes the calendar one week at a time.

## Waiting

- #1016 (waits for David): home page crisis buttons stack when text is big.
- #1105 (waits for David): How it works at 400% text.
- #1090 (waits for David): the calendar, one week at a time, with jump links (#1033).

## Needs a person

A machine cannot tell how a page sounds or feels. These need a person with the real tool, on a real device. Free tools are enough: VoiceOver comes with iPhones and Macs, TalkBack with Android phones, and [NVDA](https://www.nvaccess.org/) is free for Windows.

1. **Screen readers (#369).** In VoiceOver (iPhone), TalkBack (Android) and NVDA (Windows):
   - Trailhead step headings inside `summary` on `/utility-bills/`: is the step read once, with its open or closed state? (#369)
   - The voter ID card on `/vote/`: does the list read as "list, 7 items", and do the exceptions read after it?
   - Compare halls on a phone (`/community-centers/halls/`): each hall shows as a card. Is it still read as a table, with column names?
   - Trend charts on `/how-we-are-doing/`: is the chart's name read, and can you reach the "See every number" table?
   - Checklists (for example `/drivers-license/`): is each box's ticked state read, and does "Clear ticks" say what it did?
   - `/stay-tonight/`: is the "Danger or crisis" region read first, and does "Leave this page" make sense out loud?
2. **Real text size settings.** The checks above make text bigger with CSS. Also try iPhone Larger Text, Android font size at the largest, and the browser's own text size setting, on the home page, the Vote page and a door page.
3. **Windows high contrast (forced colors).** Do focus rings, buttons, the crisis strip and chart lines still show?
4. **Voice control.** With iOS Voice Control or Dragon, can you say what a button says ("Tap Call 988") and have it work?
5. **People who use these tools every day.** The most useful test is a resident who uses a screen reader or a switch. Reaching out to someone is David's call (charter, "Autonomy").
