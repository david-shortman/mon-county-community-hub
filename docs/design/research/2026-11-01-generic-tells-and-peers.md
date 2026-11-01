# Generic tells and peer sites

Identity discovery wave, phase 1 (research). Lane: generic tells and peer sites. Tracking: #396 (identity), #529 (sprint log).

**Question:** Why does the site read clear but plain, like template or AI output, and what do sites made by people do differently that we could borrow without losing readability?

**Short answer:** Almost every surface uses the same recipe: system font, a white or pale green box with a 10px rounded corner, a green underlined link, and a brick left edge. Peers that feel made by hand do the opposite in a few places: they use hard rules and bands instead of soft boxes, a second typeface with a different voice, dates and "checked" stamps set as real objects, and local names and places as the structure of the page. The ranked list of 10 moves is at the end.

Checked: November 1, 2026. Site built from `main` at that date and viewed at 390px and 1280px, light and dark (home, the Get through this month door at `/money/`, Where to stay tonight at `/stay-tonight/`, the Courts and legal help listing page at `/legal-help/`, and Dates at `/calendar/`). Screenshots were kept out of the repo.

## Hard limits every move must keep

From the brief and our own docs. Each move below says if it puts one at risk.

- **Contrast.** The brief says WCAG AA, but our [identity guide](../identity.md) sets 7:1 for text (AAA) since October 29, 2026. Builders should hold 7:1. Non-text edges need 3:1.
- 320px wide and 200% text, `prefers-reduced-motion`, keyboard and screen reader.
- **Weight.** Urgent pages under 50 KB, everyday pages under 150 KB ([presentation guide](../presentation.md#weight-budget)). Today the home page HTML is about 18 KB gzipped, Where to stay tonight about 18 KB, `/money/` about 29 KB, `/calendar/` about 63 KB, plus the 11 KB heading font and the 3.5 KB name font. So an urgent page has roughly 15 to 20 KB of room for any new font or drawing.
- Crisis strip and Quick exit stay first and instantly findable.
- No marks or colors that imitate WVU, the city or the county. **Gold and yellow are out as a signature color** because they read as WVU gold. That rules out copying GOV.UK's yellow focus state as is.
- Fonts open-licensed and self-hosted. Images our own SVG or public domain with credit. $0.
- The October 30 decision against drawn motifs ([no drawn motif](../identity.md#no-drawn-motif)) still stands. Moves below use type, rules and layout, not decoration.

## Part 1: audit of generic tells

Measured with Playwright on the built site (computed styles at 1280px, light), plus a look at every screenshot.

| # | Tell | Where it shows | Why it reads generic |
|---|---|---|---|
| T1 | **System font for nearly all text.** 172 of about 190 text elements on the home page use `system-ui`. Only headings and the site name use our own faces. | Every page body, buttons, nav, meta lines | `system-ui` is San Francisco on iPhone and Roboto on Android, the same as every app and every AI-built page. It is the default, so it says "default." |
| T2 | **Rounded corners on everything, in six sizes.** The home page has 28 elements at 10px radius, 7 at 12px, 6 at 8px, plus 4px, 9px and 999px. `/money/` has 85 at 10px. Nothing is square. | Cards, buttons, door tiles, steps, callouts, inputs, table boxes, the tab pill | Evenly rounded white boxes are the signature of component libraries (Tailwind, shadcn, Bootstrap). Six close radii also look unplanned. |
| T3 | **Everything is a box.** 13 boxed items on the home page, 22 on `/money/`. Sections, steps, cards and callouts all sit inside a bordered rectangle on the paper background. | Home doors, season cards, event cards, Milepost steps, resource cards | When everything is boxed, nothing is special. It reads as "card grid," not as a page someone laid out. |
| T4 | **One green does every job.** Hill green is the link color, primary button, secondary button border and text, date color, icon color, door name, choice label, tab marker and focus ring. | Every page; the desktop header is eight green underlined links in two rows | A single accent on all interactive things is the stock theme setup. The header looks like unstyled HTML links. |
| T5 | **A thin, quiet header.** Logo, dateline, then links, closed by a 1px line. On wide screens the nav wraps into two rows of underlined links. | Every page, most visible at 1280px | No band, no weight, no shape. The wordmark is the one strong thing and it floats. |
| T6 | **Type sizes drift.** 11 distinct sizes on the home page (14.4, 15.2, 16, 16.8, 17.6, 18, 18.4, 19.2, 20, 21.6, 41.6px), 11 on `/money/`. The visual design rubric (VD2) asks for four or five. | Meta lines, hints, labels, h3s, lede | Sizes only 1 to 2px apart look like accidents, flatten hierarchy, and make the page feel assembled from parts. |
| T7 | **Stock line icons in pale circles.** 1.8px rounded stroke icons inside `--accent-bg` circles. | Door tiles on home, tab bar pill, choice tiles on Where to stay tonight | This is the Feather / Lucide look used by thousands of apps. Icons in tinted circles are a dashboard cliché. |
| T8 | **One callout recipe used five times.** Pale green fill, 4px brick left border, rounded right corners. | Help now bar (`.right-now`), "who to ask" notes (`.note`), season cards, add to calendar, crisis strip | The left-bordered tinted box is the Markdown "admonition" or GitHub alert. Used everywhere, the brick edge stops meaning "local" and starts meaning "callout." |
| T9 | **Dates as a list of links.** Each row is a green bold date, an underlined title, then "tomorrow" in grey, wrapping unevenly. No month marker, no weekday column, no difference between a deadline and a bingo night. | `/calendar/`, "Coming up" on home | It reads like a database dump. Local papers and library calendars treat dates as the main visual: big numerals, a column, month heads. |
| T10 | **One centered narrow column at every width.** `.wrap` is 46rem centered. At 1280px about 45% of the screen is empty paper on both sides. | Every page at desktop | The centered single column with even margins is the safest default layout. There is no grid, no margin column, nothing that uses the extra width. |
| T11 | **Two by two pastel tiles with an icon top left.** | Where to stay tonight (A bed tonight, A warm place, Food tonight, Safe from someone) | The app-launcher tile pattern. Clear, but indistinguishable from any other app. |
| T12 | **Our trust signal looks like fine print.** "Source: ... Checked October 31, 2026" runs as a long grey sentence in 15.2px. | Every resource, event and step | The most distinctive thing we do, checking every fact by hand and dating it, is styled as the least important text on the card. |
| T13 | **Boilerplate before the title.** On Where to stay tonight the full disclaimer paragraph sits above the h1 at 390px. | `/stay-tonight/` and other crisis pages | Legal text first is a template habit. It also pushes the answer down (a note for the help lanes; this is layout, not just look). |
| T14 | **Even vertical rhythm.** Most gaps are 14 to 16px with h2 at `margin-top: 2em`, so sections blend into one long scroll. | Home at 390px is about 8,000px tall, with the same beat from top to bottom | No pauses, no change of density. People-made pages vary the rhythm: tight inside a group, a clear break between groups. |
| T15 | **Dark mode is "mint on charcoal."** `#8fd1b5` on `#161714`. | All pages in dark | Readable (10:1), but it is the most common dark theme pairing. Fine to keep; just not a source of character. |

### What already works and must be kept

- **The wordmark and icon tile.** Fraunces, soft, plus the two-hills-and-bridge tile is the single most "made by a person" thing on the site. Build around it, do not replace it.
- **The dateline.** "Morgantown · Sun, Nov 1 · High 72°, mostly sunny" is local, useful and true. Several peers do something like it (see "dated stamps" below). Give it more presence, not less.
- **Atkinson Hyperlegible Next 800 for headings.** It is open-licensed, legible, and less common than Inter or Roboto. Keep it as the "working" voice.
- **Warm paper background** `#f9f7f2` and the hill green and brick tokens with measured 7:1 contrast.
- **Answer first order**, the Help now bar on top, big 48px buttons, buttons named for who you reach ("Call Mon Power").
- **Crisis strip and Quick exit**, the bottom tab bar on phones, scripts optional, tiny pages.
- **A source and a checked date on every fact.** Keep the content; change how it looks (T12).
- **Plain, warm voice** and the Trailhead / Milepost idea. The metaphor is good; only the drawing of it is generic.

## Part 2: peer sites

16 sites studied on November 1, 2026. For each site, `robots.txt` was read first and disallowed paths were skipped. Facts come from each site's own HTML and CSS. Contrast numbers are our math on the color pairs; whether each pair is used as text was not verified. Blocked or dropped, with no workaround tried: Code for America (403), Southern Highland Craft Guild (403), Tamarack (403), Penland (robots.txt disallows all), Printed Matter (403), Hindman Settlement School (certificate error), Broken Pencil (bot challenge), Augusta Heritage Center (robots.txt did not load, so not used), NYPL (its CSS sits under a disallowed path).

### Civic and public service

1. **GOV.UK** ([gov.uk](https://www.gov.uk/), example: [Learn to drive a car](https://www.gov.uk/learn-to-drive-a-car)).
   - Focus is the brand: any focused link turns into a yellow `#ffdd00` block with a near-black `#0b0c0c` bar under it. Corners are square almost everywhere.
   - Step by step: numbered circles joined by a vertical line, with "and" and "or" between steps.
   - Human because: the strongest styling goes where people get lost, not into decoration.
   - Limits: GDS Transport is not licensed for other sites. Yellow would read as WVU gold here.
2. **ACCESS NYC** ([access.nyc.gov](https://access.nyc.gov/)).
   - Need first, program second: "Money to buy food," then "Supplemental Nutrition Assistance Program" under it.
   - Color utilities named after subway lines (`.bg-flushing` and others). Self-hosted Noto Sans and Noto Serif (open). Dated updates ("Latest Update March 31, 2026").
   - Human because: it speaks residents' words and borrows a color system the city already knows.
3. **Boston.gov** ([boston.gov](https://www.boston.gov/)).
   - Two voices: Montserrat bold uppercase titles over Lora italic intros (both open).
   - Heavy rules: an 8px solid black rule under the hero, dashed and dotted thin rules elsewhere.
   - Human because: it reads like a printed civic broadsheet, not a stack of cards.
   - Limits: its red `#fb4d42` is 3.4:1, too low for our text.
4. **West Virginia 211** ([wv211.org](https://wv211.org/)).
   - The action is the headline: "Dial 2-1-1," "Text your Zip Code to 898-211," with a backup number for phones on Wi-Fi calling.
   - Human because: it plans for a real failure in plain words.
   - Limits: Typekit fonts (proprietary), orange `#eb5814` at 3.5:1, a large Squarespace bundle.
5. **U.S. Web Design System** ([designsystem.digital.gov](https://designsystem.digital.gov/)).
   - Square blocks, pill tags. Its own open typeface (Public Sans), plus Merriweather and Source Sans.
   - Human because: the government made and gave away a typeface.
   - Limits: our identity guide rules out Public Sans (it reads federal). CSS bundle is about 1.1 MB.
6. **Civic Tech Field Guide** ([civictech.guide](https://civictech.guide/)).
   - Voice inside the interface ("like a librarian," "like a vending machine"). Big counted figures ("13,188+ curated entries").
   - Human because of the voice. Caution: its visuals (Inter, purple, 14px card radius) are the template look we want to leave.

### Community, mutual aid and bulletin boards

7. **Mutual Aid NYC** ([mutualaid.nyc](https://mutualaid.nyc/)).
   - Sentence-style entry: "I am... looking for HELP / looking to VOLUNTEER / a GROUP/ORGANIZER." Cream `#FBFAF3` base.
   - Human because: you finish a sentence instead of picking a category.
8. **Front Porch Forum** ([frontporchforum.com](https://frontporchforum.com/)).
   - Who are you, with a one-line gloss for each choice. The house number field is labeled "(private)" right where you type.
   - Human because: it states exactly what stays private, in place.
9. **Quimby's Bookstore** ([quimbys.com](https://www.quimbys.com/)), standing in for zines.
   - Dated stamp: "Hours as of June 2026," with address and phone at the top.
   - Typewriter face and hot pink accent.
   - Human because: it says how fresh its facts are, like a hand-lettered shop sign.
   - Limits: American Typewriter is proprietary; pink `#ff3399` is 3.4:1.

### Libraries

10. **The Seattle Public Library** ([spl.org](https://www.spl.org/)).
    - Catalog card pairing: a small uppercase kicker (14px, 1px letter spacing) over a 32px serif tile heading (Tinos, open).
    - Closures as full sentences with weekday and date ("closed on Thanksgiving Day, Thursday, November 26").
    - Human because: kicker plus serif reads like a library card, not an app.
    - Limits: the kicker face (futura-pt) is proprietary. The pattern works with open faces.

### Local news

11. **Mountain State Spotlight** ([mountainstatespotlight.org](https://mountainstatespotlight.org/)), West Virginia nonprofit newsroom.
    - A named explainer series. Every card carries a name and a date.
    - Lato headings over Georgia body.
    - Human because: people and dates are on every item.
    - Limits: navy and gold are close to WVU colors. We should not borrow the palette.
12. **The Stranger** ([thestranger.com](https://www.thestranger.com/)), Seattle alt-weekly.
    - Named recurring sections ("Slog," "Stranger Suggests," "Find The Stranger Near You"). Cream `#fff8e7` paper.
    - Human because: named columns give it a personality.
    - Limits: proprietary fonts and an opinion voice (endorsements), which we must not copy.

### Field guides and parks

13. **National Park Service, New River Gorge** ([nps.gov/neri](https://www.nps.gov/neri/index.htm)).
    - The Unigrid black band carried to the web: a solid black header band with the park name, subtitle "National Park & Preserve • West Virginia."
    - Every photo has a caption and a named credit.
    - Human because: a strong band says "this is a field guide," and photos credit the people who took them.
    - Background: the print Unigrid system (Vignelli with the Harpers Ferry Center, 1977) puts a white title on a black band at a fixed size on every brochure. Its typefaces (Helvetica, later Frutiger and NPS Rawlinson) are proprietary.
    - Limits: about 2.8 MB of CSS and many images.

### Appalachian arts and craft

14. **Appalshop** ([appalshop.org](https://appalshop.org/)), Whitesburg, Kentucky.
    - Age and place stated plainly in caps: "Making art and media in the mountains since 1969." First person mission.
    - Human because: it says where it is and how long it has been there.
15. **John C. Campbell Folk School** ([folkschool.org](https://www.folkschool.org/)), Brasstown, North Carolina.
    - Named places and rituals as navigation: Olive's Porch, Forge After Dark, Fireside Sale. Rust `#c34528`.
    - Human because: the menu is a map of a real place.
16. **Highlander Research and Education Center** ([highlandercenter.org](https://highlandercenter.org/)), New Market, Tennessee.
    - Palette named for the land: Deep Forest `#192C1D`, Meadow Mist `#EDFFE8` (14:1). Nav uses place names ("The Hill").
    - Human because: color and menus come from the actual land.
    - Limits: its fonts are proprietary or system-only.

### What recurs across peers

- **Hard rules and bands, not soft boxes.** GOV.UK, USWDS, Boston and NPS all use square corners and heavy rules. None of them round everything at 10px.
- **Dated stamps in words.** Quimby's, ACCESS NYC, Spotlight bylines, SPL closures.
- **Need first, official name second**, and sentence-style entry points.
- **Two-voice type:** a sans for labels and kickers, a serif for headlines or intros.
- **Local names as structure:** subway lines, Olive's Porch, "The Hill," "• West Virginia."
- **People credited:** bylines, photo credits, named series.
- **One accent with one job** (GOV.UK focus yellow), not one accent for everything.

## The 10 moves most worth borrowing

Ranked by how much each changes the "template" feel for the least risk to reading, weight and the hard limits. Each names the tell it fixes, the peer it comes from, concrete values, and the cost. All are $0.

### 1. Rules and bands instead of rounded boxes
**Fixes:** T2, T3, T8. **From:** GOV.UK, Boston.gov, USWDS, NPS.
- Set one radius for the site: `--radius: 2px` (or 0) for cards, steps, callouts and inputs. Keep 999px only for the tab bar pill. Buttons 4px.
- Most cards lose their box: a 2px `--fg` rule on top (`border-top: 2px solid var(--fg)`) and space below, no side borders, no fill. Keep a filled box only for the Help now bar and the crisis strip, so "boxed" means "urgent."
- Sections open with a heavy rule: `border-top: 4px solid var(--fg)` above each h2 on the home page and door pages, with `padding-top: 12px`.
- Cost: CSS only, smaller than today. Risk: low. A rule is a non-text edge, so `--fg` on `--bg` (15.8:1) is far above 3:1.

### 2. The "checked" stamp as a real object
**Fixes:** T12, also T1. **From:** Quimby's ("Hours as of June 2026"), ACCESS NYC ("Latest Update"), Spotlight bylines.
- Turn "Checked October 31, 2026" into a small stamp on each card: uppercase label "CHECKED" plus the short date "OCT 31," in a monospace face with tabular figures, `0.8rem` minimum 14px, 1px `--muted` border, square corners, `letter-spacing: 0.06em`. The source link stays as a plain line under it.
- Face: **Atkinson Hyperlegible Mono** (SIL OFL, Braille Institute, same family as our headings) subset to digits, A to Z and a few marks, one weight, about 6 to 8 KB woff2. Or `ui-monospace` at 0 KB as a fallback.
- Why it is ours: no peer checks every fact by hand. Making the check visible is the most honest local signature we have.
- Risk: low. Keep the full date in an `aria-label` or visually hidden text so screen readers hear "Checked October 31, 2026."

### 3. The calendar as a printed listing
**Fixes:** T9, T14. **From:** SPL closures, local paper listings, GOV.UK step numbers.
- A month head as a band: "NOVEMBER 2026" in Atkinson 800, `1rem`, uppercase, `letter-spacing: 0.08em`, with a 4px `--fg` rule above.
- Each date gets a left column: weekday small caps ("SUN") over a big numeral ("1") at `2rem` with `font-variant-numeric: tabular-nums`, column `4.5rem` wide at all widths. Items for that day stack to its right, separated by 1px `--line` rules.
- Deadlines get a word, not a color: a "LAST DAY" label in the stamp style from move 2. Events stay plain.
- Cost: CSS plus a small template change in the calendar and `EventCard`. No new font. Risk: check 320px with 200% text; the date column may need to stack above the item there.

### 4. A second voice in type: a serif for ledes and card titles
**Fixes:** T1, T6. **From:** SPL (kicker plus serif), Boston.gov (Montserrat plus Lora), Spotlight (sans plus Georgia).
- Keep Atkinson 800 for h1 and h2 and all buttons and labels (the working voice). Add an open serif for the lede line under each h1 and for card titles (h3), weight 600 to 700. Body text stays on the system font.
- Candidates, all SIL OFL, self-hostable: **Source Serif 4** (Adobe, sturdy, good at small sizes), **Literata** (made for long reading on screens), **Newsreader** (newsy, has optical sizes). Avoid Fraunces here: the identity guide keeps it for the name only.
- Weight: one weight, Latin subset, about 18 to 25 KB woff2. That uses most of an urgent page's room, so load it with `font-display: optional` like the heading face, and leave it off urgent pages (they fall back to Georgia, which is fine).
- Fix the scale at the same time: five sizes only, for example 14.4px (meta, stamps), 18px (body), 21.6px (h3 and lede), 27px (h2), 36px (h1, 30px on phones).
- Risk: medium (weight). Builders must run `check-weight.mjs`.

### 5. A solid band header, like a field guide
**Fixes:** T5, T4. **From:** NPS Unigrid black band, Boston.gov's 8px rule.
- Header becomes a band in `--fg` (`#1d1d1b` light, and in dark mode `#ecebe6` would be too bright, so use `#0f100e` with a `--line` bottom edge). Wordmark and dateline in `--bg` color on the band (15.8:1).
- Nav sits below the band on the paper as plain words in `--fg`, weight 700, no underline, current page marked with a 4px `--fg` underline bar. Links in body text keep green and underline.
- The crisis strip and Quick exit stay above the band, unchanged, so they are still first.
- Cost: CSS only. Risk: the icon tile's green edge on a near-black band needs the 1px ring the dark mode already uses. Check that the band does not look like a government header (it should not carry any seal or "official" words).

### 6. Need first, name second on every card
**Fixes:** T3, T12 (hierarchy inside cards). **From:** ACCESS NYC ("Money to buy food" then "SNAP"), WV 211 (the action is the headline).
- Card heading is what you get, in the card title style: "Free lawyer for a civil case." Under it, the organization in a small uppercase kicker: "LEGAL AID OF WEST VIRGINIA."
- The kicker style is SPL's: `0.8rem`, weight 700, `letter-spacing: 0.06em`, `--muted`.
- Cost: template and content work in `ResourceCard` and `PlaceCard`, no weight. Risk: low; it also helps the "answer first" rule.

### 7. Give green one job, and let `--fg` do the rest
**Fixes:** T4, T7. **From:** GOV.UK (one accent with one job), USWDS.
- Green means "a link in text or a date you can add." Primary buttons become `--fg` fill with `--bg` text (15.8:1), secondary buttons a 2px `--fg` outline. The Call button stays the one filled button.
- Focus becomes the signature instead of a thin ring: `outline: 3px solid var(--fg); background: var(--accent-bg); box-shadow: 0 4px 0 var(--accent)`, a heavy "highlighter" that cannot be missed. Not yellow (WVU), not brick (decoration only).
- Drop the tinted circles behind icons (T7). Icons sit bare at 24px, stroke 2px, square line caps (`stroke-linecap: square`), which reads more like signage than an app.
- Cost: CSS only. Risk: low. Check the tab bar current state still has a non-color cue (it does: bold text).

### 8. Use the desktop width: a margin column
**Fixes:** T10, T14. **From:** Boston.gov and newspaper layouts; the NPS park page's side rail.
- At 64rem and up, a two column grid: a 14rem left margin column and the 46rem reading column. The margin holds the "On this page" list (sticky), the checked stamp for the page, and the door name as a kicker. Below 64rem it collapses back to today's single column, unchanged.
- Cost: CSS grid, no weight. Risk: low on phones (no change). Keep reading order the same in the HTML so screen readers are unaffected.

### 9. Sentence entry and named sections on the home page
**Fixes:** T11, T3 on home, and the "card grid" feel of the doors. **From:** Mutual Aid NYC ("I am... looking for"), Front Porch Forum (each choice glossed), The Stranger and the Folk School (named sections).
- Home heading stays "What do you need help with?" but the doors read as a list completing the sentence "I need help..." with each door as a big Atkinson line and its examples under it, separated by rules (move 1), not as boxed tiles with icons.
- Give recurring parts stable names that residents learn, in plain words: "This season," "Coming up," "Checked this week." Not cute names.
- Cost: template change in `DoorCards` and `SeasonCard`. Risk: medium for Where to stay tonight (T11): its 2x2 tiles work well under stress, so change only their look (square corners, no tint) and keep the layout. That page is high stakes and waits for David.

### 10. Say where we are and how we work, once, in a colophon
**Fixes:** T13 (boilerplate tone), and the faceless footer. **From:** Appalshop ("since 1969"), NPS photo credits, Spotlight bylines.
- A short colophon at the bottom of every page, set in the stamp face from move 2: "Made in Morgantown. Every fact links to its source and shows the day we checked it. Built [date]. Weather from the National Weather Service." Pull the long disclaimer into this footer and a link, so it no longer sits above the title on crisis pages (check with the help lane and David, since crisis pages are high stakes).
- Name the places in the footer the way the Folk School does: Morgantown, Westover, Star City, Granville, Cheat Lake, Blacksville. Plain list, no map drawing.
- Cost: template change, a few bytes. Risk: low, but the disclaimer move touches crisis pages, so it is a `for:david` change.

## What not to borrow

- Yellow or gold accents (GOV.UK focus, Spotlight gold): too close to WVU.
- Proprietary faces seen on peers: GDS Transport, futura-pt, kepler, tenso, karmina, proxima-nova, Acumin, American Typewriter. Use the open options named above.
- Bright accents under 4.5:1 used as text (Boston red, 211 orange, Appalshop green, Quimby's pink, Highlander fern).
- Heavy bundles and photos (NPS, USWDS, Squarespace sites).
- An opinion voice (alt-weeklies) or "official" framing (government bands with seals).
- Drawn motifs: still ruled out by the October 30 decision.

## Suggested pairings for the phase 2 builders

These group the moves into three directions that are clearly different from each other. Each one keeps the wordmark, the dateline, Atkinson headings and the tokens.

- **Field guide:** moves 1, 5, 7, 8. Black band header, square corners, heavy rules, margin column. Closest to NPS Unigrid. No new font, so 0 KB added.
- **Ledger:** moves 2, 3, 6, 10. Stamps, listing calendar, need-first cards, colophon. Built around our real signature, the checked date. About 6 to 8 KB for the mono subset.
- **Broadsheet:** moves 4, 1, 9, 3. A serif second voice, rules, sentence entry, listing calendar. The most "made by a person" feel and the heaviest (about 20 KB of font), so it must stay off urgent pages.

## Sources

Peer pages listed above, all checked November 1, 2026, each after reading its `robots.txt`. Our own measurements came from the built site at `main` on November 1, 2026, using Playwright `getComputedStyle` at 1280px and screenshots at 390px and 1280px in light and dark. Font licenses: [Atkinson Hyperlegible](https://www.brailleinstitute.org/freefont/) (SIL OFL, includes the Mono family), [Source Serif 4](https://github.com/adobe-fonts/source-serif) (SIL OFL), [Literata](https://github.com/googlefonts/literata) (SIL OFL), [Newsreader](https://github.com/productiontype/Newsreader) (SIL OFL).
