# Modern craft and edge techniques

Research for the visual identity wave (#396, sprint log #529), lane: modern craft. Written November 1, 2026. This is phase 1 research. Phase 2 lanes build three directions as hidden preview pages, and David picks.

**The short version.** The site already reads clearly. What makes it look generic is that nothing on it looks *decided*: one heading size jump, one card shape, system body text, an accent used only for links. Sites that feel made by people get their character from a few strong, specific choices in type, rhythm and structure, not from decoration. Most of those choices cost under 1 KB of CSS. The one real byte cost is a display face (about 7 to 11 KB more than today). The ranked list of ten twists is at the end.

## What this doc already respects

These come from [`identity.md`](../identity.md), [`presentation.md`](../presentation.md), the [visual design rubric](../../rubrics/visual-design.md) and [`accessibility.md`](../../accessibility.md). Any idea below that bends one says so.

- **Text contrast 7:1** (AAA) in light and dark, checked by `npm run check-contrast`. Non-text edges 3:1.
- **Weight budget:** urgent pages under 50 KB, everyday pages under 150 KB, everything compressed, first visit (`site/scripts/check-weight.mjs`). Today the heading font is 10.6 KB and the logo font 2.5 KB inline.
- **No drawn motif.** Three were tried and removed on October 30 ([decision](../../decisions/2026-10-30-1000-no-drawn-motif.md)). Any new shape needs screenshots for David first.
- **"Bold, not loud":** strength from type, size and shape, "never from motion, noise, or more colors than needed." Glass, gradients and stained glass effects are on the avoid list.
- **Green means act.** Brick is decoration only.
- Works at 320px and 200% text, respects reduced motion, crisis strip and Quick exit stay instantly findable, no imitation of WVU, the city or the county, open-licensed self-hosted fonts, $0.

## Part 1: the current edge of design thinking

### What the "generic AI look" is

Writers in 2025 and 2026 describe the same tells over and over. One widely shared explainer traces the "purple gradient website" to Tailwind UI's indigo demo components, copied so often that models learned them as "modern design" ([prg.sh, October 26, 2025](https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website)). Agency write-ups list the rest: Inter or a similar neutral sans everywhere, a blue to purple gradient hero, three rounded cards with an icon each, soft shadows, one fade-in per section ([925 Studios](https://www.925studios.co/blog/ai-slop-design-tells)). Treat agency blogs with care, since they sell the fix, but the list matches what designers point at.

The pull the other way is real but young. Andy Baio's Waxy linked an Eater report (July 26, 2026) on restaurants turning to handmade, DIY flyers and menus as a reaction to generated imagery ([Waxy](https://waxy.org/2026/07/restaurants-are-leaning-into-handmade-diy-aesthetics-as-ai-slop-grows/)). The warning that comes with it: fake roughness is also easy to generate, and it reads as amateur when done badly.

**What this means for us.** Our site does not have the purple tells. Its generic feel comes from something quieter: *median choices*. A centered 46rem column, an h1 only about 1.7 times body size, white cards with 10px corners and a 1px line, system UI body text, and no structure that is visible on purpose. Every one of those is a fine default. None of them is a decision.

### Six ideas that make a site feel authored

1. **Typography is the design.** Type carries the identity, and color and imagery support it. A strong scale (big jumps, not 1.2 steps), tight heading leading, a face with a point of view for display only, and numerals treated as a feature (big dates, step numbers). This is the cheapest and strongest move for us because our content is already text.
2. **Structure you can see.** Hairline rules, column labels, numbered sections and aligned edges, like a printed timetable, a bus schedule, a library card catalog or a county almanac. The grid is shown, not hidden. This reads as "someone organized this," which is exactly the trust signal a resource hub needs.
3. **Deliberate asymmetry.** A wide left label column (dates, step numbers, "Last checked") beside the text on wide screens, collapsing to stacked on phones. One element per page breaks the column (the big date, the answer box). Asymmetry fails when it is random; it works when one rule explains it.
4. **Printed color.** Riso and two-ink printing: flat color, overprint where two inks cross (multiply), slight misregistration, paper showing through. Duotone (two colors only on an image). It reads as "made with a press, by hand." It goes wrong when it becomes a filter on everything, or when bright inks drop text contrast.
5. **Bento layouts, carefully.** A bento grid is a set of unequal tiles in one frame (Apple keynote slides made it famous). It works when tile size follows importance and each tile holds one thing. It goes wrong as "card soup": every tile equal weight, icons standing in for meaning, lots of rounded boxes with nothing to rank them. That is the main AI look. If we use it at all, it fits the home page "What do you need help with?" doors, with one tile clearly biggest (Help now), and never on guides.
6. **Signs a person was here.** A colophon page (what fonts, why, who checks), real dates ("Last checked Tuesday"), a dateline (we already have one, and it is our most authored element), small hand-set details like proper quotes, non-breaking spaces before the last word of a heading, and old-style numerals in running text. These are tiny, and they add up.

### Examples worth studying

Links checked November 1, 2026. Describe, don't copy. No screenshots are in this repo.

| Example | What makes it feel authored | What we could borrow | What not to borrow |
|---|---|---|---|
| [GOV.UK Design System](https://design-system.service.gov.uk/) and [GDS design principles](https://www.gov.uk/guidance/government-design-principles) | One typeface (Transport, from Margaret Calvert's road signs), huge confident headings, thick black rules, no decoration at all. Authority from restraint. | The scale: h1 roughly 2.5 to 3 times body on wide screens. Thick rules as structure. The step-by-step pattern (we already use it for Trailhead). | The black and white government look itself. It would make us look official. |
| [Helsinki Design System](https://hds.hel.fi/) | A city system with one custom face (Helsinki Grotesk) and one shape, the "koro" edge (a wave, zigzag or pulse line between sections) that is clearly Helsinki's. | Proof that one small, consistent edge shape can carry a whole civic identity. | The koro itself, and any drawn edge without David seeing it first (our wavy ridge was removed). |
| [Big Shoulders](https://fonts.google.com/specimen/Big+Shoulders) (Patric King, for Chicago) | A condensed face drawn from Chicago's own signage, made for the Chicago Design System and released under the OFL. A city identity carried by type. | The method: draw type cues from local signs and printed matter. | The font. It is strongly tied to Chicago. |
| [Low-tech Magazine, solar site](https://solar.lowtechmagazine.com/) | Runs on a solar server. Images are dithered to a few colors to save bytes, the page shows the battery level, and the design is plain text with care. The constraint *is* the look. | Dithered or duotone images as both a byte saver and a look. Saying our constraint out loud ("this page is light so it loads on any phone"). | The battery meter and the retro feel. |
| [Are.na](https://www.are.na/) | Calm, gray, almost no color, generous space, small type, lots of trust. | Calm as a choice: one accent, quiet chrome, content first. | The very small type. |
| [The Pudding](https://pudding.cool/) | Every essay has its own type and color, chosen for the topic. Hand-built charts. | Treating the "How is Mon County doing?" data pages as their own small editorial objects. | Per-page styling on resident guides. Guides must stay uniform. |
| [Fraunces](https://github.com/undercasetype/Fraunces) (Undercase Type) | A variable "Old Style soft" serif with optical size, softness and "wonk" axes. Warm 1970s book type. | We already use it for the logo. It could step up to h1 only (see fonts). | WONK=1 on headings: the leaning letters get noticed before the words. |
| [Frank Chimero, "The Web's Grain" (2015)](https://frankchimero.com/blog/2015/the-webs-grain/) | An essay, not a site: design with the web's edgeless, flowing nature instead of fighting it. | The argument for our approach: let text reflow, let structure come from rules and type, not fixed frames. | Nothing. |
| [Utopia](https://utopia.fyi/) (Clearleft) and [Every Layout](https://every-layout.dev/) | Fluid type and space scales calculated from two screen sizes, and layouts built from a few small rules. Craft as a system. | A real modular scale with `clamp()`, so headings grow on wide screens and stay safe at 320px. | Nothing; these are tools. |
| [Velvetyne](https://gitlab.com/velvetyne) and [Collletttivo](https://www.collletttivo.it/typefaces) | Libre foundries: every font is under the OFL, often drawn by students and small studios, with real personality. On November 1, 2026, velvetyne.fr showed a single statement page instead of its catalog; the font sources are on GitLab. | Open, self-hostable display faces that do not look like Google Fonts defaults. | Their loudest display faces. Ours must stay serious-leaning. |
| [Google Fonts Knowledge](https://fonts.google.com/knowledge) | Clear writing on variable fonts, optical size and type pairing. | Reference for builders. | Nothing. |

## Part 2: techniques that are safe and cheap now

Support data comes from the [`web-features`](https://www.npmjs.com/package/web-features) package, version 3.44.0, read November 1, 2026. "Baseline widely" means every major browser for 30 months; "Baseline new" means every major browser recently. Byte costs are measured: the brotli size of a minimal snippet on its own. Inside a page the real added cost is about the same or smaller.

**Already on the site:** cross-document view transitions with reduced motion turned off (`AppShell.astro`), speculation rules for prefetch, `:has()` on door cards and pickers, `text-wrap: balance` on headings and `pretty` on text. Container queries are mentioned in `identity.md` (#153) but no `@container` rule is in `site/src` today.

| Technique | Support | Bytes | Fallback | Fit for us |
|---|---|---|---|---|
| Variable fonts, `font-variation-settings`, `font-optical-sizing` | Baseline widely (2018, 2020) | Font file cost, see below | Static font | Useful as a *design tool*; ship static cuts (see note) |
| `oklch()` colors | Baseline widely (May 2023) | ~0 (same tokens, different syntax) | none needed | Good for building tints. `check-contrast.mjs` reads only `#rrggbb` today, so either keep hex in tokens or update the script first |
| `color-mix()` | Baseline widely (May 2023) | ~100 B for a tint set | Put the hex first, then the mix | Good: door tints, hover states, borders from one hue |
| Relative color (`oklch(from var(--accent) l c h / .5)`) | Baseline new (Sept 2024) | ~0 | Hex first | Nice to have; `color-mix()` covers most needs |
| `light-dark()` | Baseline new (May 2024) | Saves bytes (one line per token, no dark block) | Needs `color-scheme`; older browsers get light | Tidy, but the contrast script parses the two token blocks, so it would need a rewrite. Low priority |
| `text-wrap: balance` | Baseline new (May 2024) | ~30 B | Normal wrapping | Shipped |
| `text-wrap: pretty` | Chrome 117, Safari 26. Not Firefox | ~30 B | Normal wrapping | Shipped |
| `initial-letter` | Chrome 110. Safari only with `-webkit-` prefix. Not Firefox | ~80 B | A plain big letter | Use for big step numbers, not drop caps on guides (drop caps slow reading at the top, which is where our answers are) |
| `text-box: trim-both cap alphabetic` | Chrome 133, Safari 18.2. Not Firefox | ~50 B | Normal spacing | Good: buttons and big headings optically centered, tighter stacked type |
| `lh`, `rlh`, `cap` units | Baseline widely (Nov 2023) | ~0 | none needed | Good: spacing in line heights gives a steady vertical rhythm; rules every `1lh` |
| `font-variant-numeric: tabular-nums` / `oldstyle-nums` | Baseline widely | ~40 B | Default numerals | Good: dates and phone numbers line up in lists. Only works if the font file keeps the feature. Atkinson Next has `tnum` (tabular) and `pnum`, but no old-style figures. Our shipped 800 cut keeps only `locl`, so it must be re-cut with `--layout-features+=tnum` first (a few hundred bytes) |
| CSS-only texture: SVG `feTurbulence` grain as a data URI | Every browser | ~220 B (measured: 387 B raw, 216 B brotli) | Flat background | **Bends a rule:** identity says "never from noise." Also costs paint time on old phones if applied as a live `filter`; as a background image it rasterizes once. Paper grain at 3 to 5% opacity is the most it should ever be, and only behind the header. Show David before shipping |
| Gradients for texture (`repeating-linear-gradient` ruled lines) | Every browser | ~90 B | Flat | Fine as ruled lines (a ledger look), not as color gradients (on the avoid list) |
| Cross-document view transitions | Chrome 126, Safari 18.2. Not Firefox yet (Firefox 144 has same-page ones) | ~100 B | Normal page load | Shipped. Possible next step: `view-transition-name` on the header so it stays still while the page body changes. Keep crisis pages and the Quick exit out of any transition so nothing delays leaving |
| Scroll-driven animation (`animation-timeline: view()`) | Chrome 115, Safari 26. Not Firefox | ~140 B with `@supports` and reduced motion guards | Content just shows | Low value here. "Bold, not loud" rules out reveal effects. The one fair use: a thin reading progress line on very long guides. Content must never start hidden |
| Container queries | Baseline widely (Feb 2023) | ~90 B per card rule | Stacked card | Good: date cards get a big date column when the card is wide, wherever the card is placed |
| Container style queries | Baseline new (May 2026, Firefox 151) | ~60 B | Ignore | Later: let a `--door` variable on a section restyle cards inside it |
| `:has()` | Baseline widely (Dec 2023) | ~60 B per rule | Plain state | Shipped. More uses: a card that holds a `.btn-primary` gets the green edge; a page with a crisis strip tightens its header |
| Subgrid | Baseline widely (Sept 2023) | ~80 B | Cards align on their own | Good: in a row of cards, titles, dates and buttons line up across cards. Feels built, not stacked |
| Anchor positioning | Core: Chrome 125, Firefox 147, Safari 26. Full spec: Safari 27 only | ~150 B | A popover in the middle of the screen | Later: "Where is this from?" source notes that open beside the fact. Works with the `popover` attribute and no script |
| `::details-content` | Baseline new (Sept 2025) | ~80 B | Instant open | Style Milepost bodies (a rule down the left side, a tint). Do not animate the open; `interpolate-size` is Chrome only |
| `@starting-style` | Baseline new (Aug 2024) | ~60 B | No entry animation | Skip. We do not want entry effects |
| `font-size-adjust` | Baseline new (July 2024) | ~30 B | Normal size | Good: keeps the fallback font the same visual size as the web font when `font-display: optional` falls back |
| `accent-color` | Chrome 93, Firefox 92, Safari 26.2 | ~25 B | System color | Good: checklist boxes in hill green, one line |
| `hanging-punctuation` | Safari 26.5 only | ~30 B | Normal | Tiny, harmless: quotes hang outside the text edge in Safari |
| `forced-colors` media query | Baseline widely | as needed | | Any texture, tint or rule must disappear cleanly in Windows high contrast. Test every direction there |

### A note on variable fonts and our budget

Variable fonts are great for *choosing* a look and poor for *shipping* on a 50 KB page. Measured, Latin subset, woff2:

| File | Size |
|---|---|
| Atkinson Hyperlegible Next, static 800 (on the site now) | 10.6 KB |
| Atkinson Hyperlegible Next, static 760 (cut with the fontTools instancer) | 12.6 KB |
| Atkinson Hyperlegible Next, variable weight 200 to 800 | 33.2 KB |
| Same, variable range narrowed to 600 to 800 | 32.4 KB |
| Fraunces, all four axes | 118.2 KB |
| Fraunces, weight 600 to 900 only, other axes fixed | 32.2 KB |
| Fraunces, one static cut (wght 800, opsz 144, SOFT 50, WONK 0) | 17.9 KB |
| Roboto Flex, all axes | 318.8 KB |
| Roboto Flex, weight and grade only, other axes fixed | 29.9 KB |

Narrowing an axis range barely helps; fixing it does. **Recommendation: pick settings with the variable font, then cut one or two static instances at build time** with `fonttools varLib.instancer` and `pyftsubset` (the same way the logo font is made). Use variable files only on an everyday page that truly needs a range.

**Axis ideas, honestly scored.**

- **Optical size (`opsz`):** the best axis for us. A display cut at opsz 72 to 144 has tighter spacing and finer detail for big headings. Fixed at cut time, it costs nothing extra.
- **Grade (`GRAD`) for dark mode:** light text on dark looks heavier. Grade thins strokes without changing width, so nothing reflows. Only a few open fonts have it (Roboto Flex, Roboto Serif); Atkinson Next does not. The cheap version for Atkinson: a second static cut at weight 760 (12.6 KB) for dark mode only. But a dark mode visitor would then download a second file on first visit. Not worth it on urgent pages; a maybe for everyday pages. Simplest of all: in dark mode, add `letter-spacing: 0.005em` to headings. 0 bytes, about 70% of the effect.
- **Width (`wdth`):** condensed headings fit long local names ("Hazel Ruby McQuain Riverfront Park") on phones. Bricolage Grotesque and Anybody have it.
- **Softness and wonk (Fraunces):** keep SOFT 50 to 100 for warmth, WONK 0.

### Color: the current palette in OKLCH, and room to grow

Today's tokens, converted (lightness, chroma, hue):

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#f9f7f2` = `oklch(97.6% 0.007 89)` | `#161714` = `oklch(20.2% 0.006 122)` |
| `--fg` | `oklch(23.0% 0.004 107)` | `oklch(93.9% 0.007 97)` |
| `--muted` | `oklch(42.4% 0.007 95)` | `oklch(77.3% 0.010 94)` |
| `--accent` (hill green) | `#1e5847` = `oklch(41.7% 0.067 170)` | `#8fd1b5` = `oklch(80.8% 0.078 166)` |
| `--accent-bg` | `oklch(94.6% 0.012 170)` | `oklch(27.9% 0.021 165)` |
| `--brick` | `#9b4a34` = `oklch(50.7% 0.114 36)` | `#d98c72` = `oklch(71.3% 0.102 39)` |
| `--line` | `oklch(87.8% 0.018 81)` | `oklch(33.6% 0.014 119)` |

What this shows: every neutral is near zero chroma, hue around 90 (warm). The accent is a muted green at hue 170. Chroma is low across the board, which is calm but also part of why it reads flat.

**A fuller palette that keeps every text pair at 7:1.** Three pale background tints on the same lightness as each other, so they can mark areas (door sections, "who to ask" boxes, data pages) without carrying meaning. Each was checked with `--fg`, `--muted` and `--accent` on top:

| New token idea | Light | Dark | Worst text pair on it |
|---|---|---|---|
| `--river-bg` (the Mon) | `oklch(95.5% 0.016 235)` = `#e6f2fa` | `oklch(27% 0.025 235)` = `#1a2931` | 7.26:1 light (accent), 7.28:1 dark (muted) |
| `--sandstone-bg` | `oklch(95.5% 0.028 80)` = `#faefdc` | `oklch(27% 0.025 80)` = `#2d2518` | 7.26:1 light, 7.37:1 dark |
| `--brick-bg` | `oklch(95.5% 0.022 40)` = `#feece5` | `oklch(26% 0.025 40)` = `#2f201b` | 7.22:1 light, 7.62:1 dark |

At lightness 94.5% these drop to about 6.9:1 for muted text, so 95.5% is the floor in light mode. Building them with `color-mix(in oklch, var(--brick) 8%, var(--bg))` keeps one source hue per token. A river blue for text (`oklch(40% 0.06 235)` = `#234d63`, 8.5:1 on the page) is possible, but it would compete with green as "act on this," so keep blue for backgrounds only.

**Riso-style ink colors** (for one optional direction): hill green `oklch(55% 0.09 170)` and brick `oklch(62% 0.11 40)` as flat "inks" with `mix-blend-mode: multiply` where they overlap. These are only 3.5 to 4.4:1 on the page, so they are for shapes and big numerals behind text, never for text itself.

## Font shortlist

All sizes are measured from the [Fontsource](https://fontsource.org/) npm packages (v5.3), Latin subset, woff2, one static weight unless noted. Velvetyne sizes are from their GitLab sources, subset by us to the same Latin range. Every font listed is under the **SIL Open Font License 1.1**, which allows self-hosting, subsetting and keeping the files in a public repo.

The question for each: does it pair with Atkinson Hyperlegible Next? Atkinson stays the safe face for anything people must read fast (body, if we ever move off system fonts, plus h2, h3, buttons, numbers). A partner face would carry only the h1 and maybe big dates. Good pairs contrast clearly (a serif or a condensed face against Atkinson's open sans) and share its large x-height.

| # | Family | Source | Size per weight | Variable | Feeling | Pairs with Atkinson Next? |
|---|---|---|---|---|---|---|
| 1 | **Fraunces** | Undercase Type, Google Fonts | 17.5 to 17.8 KB (17.9 KB as a custom opsz 144 cut) | wght, opsz, SOFT, WONK (118 KB) | Warm, bookish, a little 1970s, "old downtown." Already our logo face | **Yes, best fit.** Already in the identity, so no new voice. h1 only |
| 2 | **Newsreader** | Production Type, Google Fonts | 22.0 to 23.2 KB | wght, opsz (129 KB) | A newspaper you trust. Serious, editorial, local paper | **Yes.** Strong "dateline" companion. Slightly bigger file |
| 3 | **Literata** | TypeTogether, Google Fonts | 19.9 to 21.7 KB | wght, opsz (108 KB) | Made for reading on screens; sturdy, calm book face | Yes, quieter than Newsreader. Good if we ever want serif body text |
| 4 | **Source Serif 4** | Adobe, Google Fonts | 19.6 to 21.2 KB | wght, opsz (120 KB) | Neutral, sturdy, a little formal | Yes, but more "institution" than "neighbor" |
| 5 | **Bitter** | Huerta Tipográfica, Google Fonts | 18.1 to 18.9 KB | wght (33 KB) | Slab serif, sturdy, print-shop, sign painter | Yes. David saw it for the logo and chose Fraunces, so a second-choice voice |
| 6 | **Bricolage Grotesque** | Mathieu Triay, Google Fonts | 21.3 to 21.9 KB (21.5 KB as wght 800, wdth 85) | wght, wdth, opsz (129 KB) | A grotesque with ink traps and quirks at big sizes. Printed, a bit punk, still friendly | Partly. Two sans faces can blur; works only if Bricolage is condensed and very big |
| 7 | **League Gothic** | The League of Moveable Type, Google Fonts | 10.2 KB | wdth (18 KB) | Tall, condensed, poster and transit sign. Classic American print | **Yes, cheapest.** For big dates and short headings only; poor for long headings |
| 8 | **Overpass** | Delve Fonts for Red Hat, Google Fonts | 16.6 to 17.2 KB | wght (39 KB) | Based on Highway Gothic, the US road sign face. Public works, wayfinding | Partly. Close to Atkinson in tone; reads "infrastructure," which suits Trailhead mileposts |
| 9 | **Schibsted Grotesk** | Bakken & Bæck for Schibsted, Google Fonts | 23.8 to 24.6 KB | wght (46 KB) | Newsroom grotesque, crisp, confident | Partly. A sans/sans pair; needs a big size gap |
| 10 | **Compagnon** | Velvetyne (OFL) | 15.7 KB Roman, 17.1 KB Bold | No | Typewriter meets old print; looks like a typed notice on a corkboard | Yes, for small labels ("Last checked", datelines), not headings |
| 11 | **Sporting Grotesque** | Lucas Le Bihan, Velvetyne (OFL) | 12.5 KB Bold | No | Odd, sporty, hand-cut grotesque. Loud | Only for one direction that wants edge. Risky for "serious-leaning" |
| 12 | **Lineal** | Frank Adebiaye, Velvetyne (OFL) | 8.7 KB Bold | Yes (static measured) | Clean geometric with a slight hand-drawn quality; very light file | Partly. Cheap, but geometric sans with Atkinson can look accidental |
| 13 | **Atkinson Hyperlegible Mono** | Braille Institute, Google Fonts | 9.7 to 9.8 KB | wght (17 KB) | Same family, monospaced: phone numbers, codes, dates in a ledger | **Yes, same family.** Lines up phone numbers and hours in tables |

**Also measured, for comparison:** Atkinson Hyperlegible Next 400/700/800 at 11.8 / 12.4 / 12.3 KB in Fontsource's slightly larger Latin range (ours is 10.6 KB), League Spartan 12.5 KB, Anybody 12.6 KB, Hanken Grotesk 13.1 to 13.5 KB, Commissioner 18.2 KB, Young Serif 26.4 KB, Gloock 25.7 KB, Basteleur Bold 25.6 KB (Velvetyne), Avara Bold 8.3 KB (Velvetyne).

**Avoid:**

- **Inter, Space Grotesk, Instrument Serif, DM Serif Display:** good fonts, but they are the current defaults of template and AI-built sites, which is the look we are leaving.
- **Public Sans:** reads as a federal site (`identity.md`).
- **Big Shoulders:** tied to Chicago's identity.
- **Fontshare fonts (Satoshi, General Sans, Zodiak and others):** free to use, but under the ITF Free Font License, not the OFL. ITF says they are "not open-source," and summaries say the files may not be redistributed or modified ([ITF announcement](https://www.indiantypefoundry.com/news/introducing-fontshare)). Our fonts live in a public repo and we subset them, so they fail our "open-licensed and self-hostable" rule. We could not read the license page itself on November 1, 2026; check it before reconsidering.
- **Collletttivo** (Apfel Grotezk, Mazius Display, Ronzino, Necto Mono and others): all OFL ([catalog](https://www.collletttivo.it/typefaces)) and worth a look, but downloads come from their site as kits, so we did not measure file sizes. A phase 2 builder who wants one should measure first.

## Ten useful modern twists, ranked by impact per byte

"Impact" is how much it moves the site from generic to authored, for a resident, at 390px. "Bytes" is added compressed weight per page.

| Rank | Twist | Added bytes | Why it ranks here | Watch out for |
|---|---|---|---|---|
| 1 | **A real type scale.** h1 grows to about 2.6rem on wide screens (`clamp(1.9rem, 1.4rem + 2.5vw, 2.6rem)`), line height 1.05 to 1.1, letter spacing -0.015em; h2 1.5rem; a clear jump between levels. Big numerals for dates and step numbers (2.5 to 3rem, tabular). | ~0.2 KB | The single biggest change from "default" to "decided," for almost nothing | Test at 320px with 200% text; long words like "Monongalia" must wrap or fit |
| 2 | **Visible structure: ruled lines and labels.** A 2 to 3px `--fg` rule above each h2 (GOV.UK style), small uppercase or small-caps section labels, and a wide-screen left column for dates, step numbers and "Last checked." A timetable, not a stack of cards | ~0.4 KB | Says "someone organized this," the trust signal a hub needs. Replaces some card borders, so pages get calmer | Rules are decoration, keep them neutral (`--fg` or `--line`), never green |
| 3 | **Fewer, better cards.** Drop card borders on guide pages; keep cards only for things you act on (dates, places). Use subgrid so a row of cards lines up titles, dates and buttons, and a container query to give a date card a big date column when it is wide | ~0.3 KB | Kills the "three rounded cards" tell, the most AI-coded pattern we have | Keep 48px targets and the Actions component as is |
| 4 | **Fraunces for h1 only** (one static cut: wght 800, opsz 144, SOFT 50, WONK 0, 17.9 KB), Atkinson Next for h2, h3 and everything else | ~7 KB more than today if it replaces nothing; ~18 KB if added | A known, approved voice (the logo) carried into each page title. Strongest single "made with care" signal | `font-display: optional` and `font-size-adjust` so the fallback matches. Check urgent pages stay under 50 KB. Alternative: Newsreader for a newsier voice |
| 5 | **Optical alignment details:** `text-box: trim-both cap alphabetic` on buttons and big headings, spacing in `lh` and `rlh` units for a steady rhythm, `hanging-punctuation`, non-breaking space before the last word of headings (at build time) | ~0.2 KB | The kind of finish nobody names but everybody feels | Chrome and Safari only for `text-box`; Firefox just looks like today |
| 6 | **OKLCH token family with three pale area tints** (river, sandstone, brick backgrounds above), built with `color-mix()` from one hue each. Use them to mark areas, like a door's section or the "who to ask" box | ~0.3 KB | A fuller, more local palette without new meaning-carrying colors | Update `check-contrast.mjs` if tokens stop being hex. Tints never carry meaning |
| 7 | **The dateline as a design system.** Promote our most authored element: a small Compagnon or Atkinson Mono line style reused for "Last checked Tuesday, Nov 1," source lines and step timing. One recognizable "typed notice" voice for facts about facts | 0 KB (Atkinson Mono: ~10 KB, Compagnon: ~16 KB) | Makes the checking we already do visible, which is our real difference | A second font file on urgent pages may not fit; the 0 KB version uses small caps and tabular numbers in the current fonts |
| 8 | **A header that stays put between pages** (`view-transition-name: site-header`) on top of the existing 150ms crossfade | ~0.1 KB | Makes the site feel like one built object, not a stack of pages | Reduced motion already off. Keep crisis pages out so Quick exit is never delayed |
| 9 | **`::details-content` styling for Mileposts:** a thick `--ridge` rule down the left of an open step, step number set big with `initial-letter` (Chrome) or a plain large numeral elsewhere | ~0.2 KB | Turns Trailhead routes into a recognizable shape without drawing anything | No open/close animation. Numbers stay real text |
| 10 | **Printed color, one place only:** a two-ink duotone or riso overprint treatment for the share image, the About page, or public domain photos of Morgantown (for example from the Library of Congress), done with an SVG `feColorMatrix` filter (~0.3 KB) or baked into the image file | ~0.3 KB filter; images cost more (aim 15 to 25 KB, lazy loaded, everyday pages only) | Strong "made by hand, from here" look, but only where it does not compete with answers | Photos of identifiable people are out. Credit every image. Never on urgent pages. Show David first, since drawn and image motifs were rejected before |

**Considered and ranked out:** paper grain noise (bends "never from noise"; if tried, 3 to 5% opacity behind the header only, about 0.2 KB), scroll-driven reveals (content must never start hidden; "bold, not loud"), bento home grid (only if Help now is clearly the biggest tile; easy to slide into card soup), `light-dark()` (tidier code, but needs a contrast script rewrite for no visible change), dark mode grade (needs a second font file; use 0.005em letter spacing instead).

## How the twists could combine in phase 2

Three seeds a builder could start from. Each keeps the tokens, the 7:1 rule and the budget.

- **Almanac.** Twists 1, 2, 3, 5 and 7, with Fraunces h1 (4). Ruled lines, a left label column, big tabular dates, a typed-notice style for "Last checked." Feels like a well-kept county almanac or a library bulletin board. Lowest risk.
- **Timetable.** Twists 1, 2, 3 and 9, with League Gothic for big dates and short headings, Atkinson for the rest, Overpass-style wayfinding labels. Feels like transit signs and route maps, fits Trailhead. Medium risk: condensed type must not crowd at 200% text.
- **Press.** Twists 1, 4, 6 and 10: Newsreader or Fraunces headings, the three area tints as flat "inks," one duotone image treatment on the About and data pages. Feels like a local paper printed on a small press. Highest risk to "is it too much?"; show David screenshots early.

## Sources

Read November 1, 2026.

- Browser support: [`web-features` 3.44.0](https://www.npmjs.com/package/web-features) (`data.json`, from cdn.jsdelivr.net)
- Font files: [Fontsource](https://fontsource.org/) packages v5.3 via jsDelivr; [Velvetyne on GitLab](https://gitlab.com/velvetyne) (Basteleur, Compagnon, Sporting Grotesque, Avara, Lineal; licenses read in each repo's `LICENSE.txt` or README)
- [Collletttivo typefaces](https://www.collletttivo.it/typefaces) (all OFL)
- [ITF, "Introducing Fontshare"](https://www.indiantypefoundry.com/news/introducing-fontshare)
- [prg.sh, "Why Your AI Keeps Building the Same Purple Gradient Website"](https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website) (October 26, 2025)
- [925 Studios, "AI Slop Fonts and Gradients"](https://www.925studios.co/blog/ai-slop-design-tells) (agency blog)
- [Waxy, restaurants and handmade aesthetics](https://waxy.org/2026/07/restaurants-are-leaning-into-handmade-diy-aesthetics-as-ai-slop-grows/) (July 26, 2026)
- Examples table links as listed above

**How the numbers were made.** Font sizes: Fontsource file listings from the jsDelivr data API. Velvetyne OTFs were subset with `pyftsubset` to Fontsource's Latin range, woff2, `kern` and `liga` only. Custom static cuts used `fonttools varLib.instancer`, then woff2. CSS byte costs: each snippet on its own, compressed with brotli. Contrast: WCAG 2.2 relative luminance, the same formula as `site/scripts/check-contrast.mjs`, with OKLCH converted to sRGB using Björn Ottosson's published matrices. All scratch files stayed outside the repo.
