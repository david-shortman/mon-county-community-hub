# Visual design rubric

Does the look help people read and act? Good visual design here is calm and plain. It puts the most important thing first, is easy to scan, and looks the same kind of trustworthy in light and dark mode.

**Standards this draws on**

- [USWDS design principles](https://designsystem.digital.gov/design-principles/) and [typography](https://designsystem.digital.gov/components/typography/), [spacing](https://designsystem.digital.gov/design-tokens/spacing-units/), [color](https://designsystem.digital.gov/design-tokens/color/overview/) tokens
- [GOV.UK Design System styles](https://design-system.service.gov.uk/styles/) (type scale, spacing, layout)
- [WCAG 2.2 contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum)
- Dark mode: [Apple Human Interface Guidelines: Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode), [Material Design: Dark theme](https://m2.material.io/design/color/dark-theme.html)
- [Nielsen: aesthetic and minimalist design](https://www.nngroup.com/articles/aesthetic-minimalist-design/)
- Our [local identity guide](../design/identity.md) (palette, type, cues to use and avoid)

**Pass bar:** no criterion at 0, and average at least 2.0.

---

### VD1. Hierarchy

The most important thing on each page and each item stands out most. For a deadline, that is usually what it is and when.

- **0:** Everything looks equally important, or the wrong thing stands out.
- **1:** Page-level hierarchy works, but inside items the key fact (date, action) is hard to spot.
- **2:** Clear order: page title, section, item title, key fact, details, fine print.
- **3:** All of 2, and a resident can scan a list and pick out what applies to them in a few seconds.
- **How to check:** Squint test on a 390px screenshot (blur it) and note what stands out. Five-second test: show the page, hide it, ask what it was about.

### VD2. Typography

Text is big enough, line length is comfortable, and the type scale is consistent.

- **0:** Body text under 16px, or lines over 90 characters.
- **1:** Body text is fine, but important text (sources, dates, fine print people need) is under 14px, or the scale is inconsistent.
- **2:** Body at least 16px, line length 45 to 80 characters, line height about 1.5, no needed text under 14px.
- **3:** All of 2, and a deliberate, small type scale (four or five sizes) used the same way everywhere.
- **How to check:** Playwright `getComputedStyle(el).fontSize` for body, headings, meta text, tags; measure line length on the 1280px screenshot.

### VD3. Spacing and layout

White space groups related things and separates unrelated things.

- **0:** Crowded or overlapping; you cannot tell what belongs together.
- **1:** Readable, but spacing is uneven or groups blur together.
- **2:** Consistent spacing scale; cards and sections clearly separated; comfortable margins on a phone (at least 16px).
- **3:** All of 2, and the layout holds up from 320px to wide screens without awkward gaps or huge empty space.
- **How to check:** Compare screenshots at 320, 390 and 1280px; check padding and margin values in CSS for a consistent scale.

### VD4. Color

Color has a job (links, status, emphasis) and is used the same way everywhere.

- **0:** Color fights the content, or the same color means different things.
- **1:** Mostly purposeful, but one color carries too many meanings (for example, links, dates, and tags all in the accent color).
- **2:** A small palette with clear roles, all combinations pass contrast (see accessibility A4).
- **3:** All of 2, and status colors (open, closing soon, past) are paired with text or icons, never color alone.
- **How to check:** List each color in the CSS and what it is used for. Grayscale a screenshot and see if meaning survives.

### VD5. Consistency and components

Repeated things are built from the same parts and look the same.

- **0:** Every page looks different.
- **1:** Shared header and footer, but repeated items vary.
- **2:** Shared components and design tokens (CSS variables) for color, type, and spacing.
- **3:** All of 2, and the components are documented so new pages and tools match without guessing.
- **How to check:** Read the layout and component files; compare the same component across pages in screenshots.

### VD6. Dark mode

Dark mode is designed, not just inverted, and it is as readable as light mode.

- **0:** No dark mode and the page forces bright white, or dark mode breaks contrast or hides content.
- **1:** Dark mode exists but has problems: pure black backgrounds with glare, washed-out accents, or images and logos that disappear.
- **2:** Follows the system setting, all contrast passes, surfaces use dark grays (not pure black), and colors are adjusted for dark backgrounds.
- **3:** All of 2, and form controls, scrollbars, and focus rings also adapt (`color-scheme` set), with no flash of the wrong theme on load.
- **How to check:** Playwright `colorScheme: 'dark'` and `'light'` screenshots side by side; run axe contrast in both.

### VD7. Tone of the visuals

The look fits a neutral civic resource: calm, honest, local. Not an ad and not a startup pitch.

- **0:** Looks like advertising, uses stock photos of people who are not here, or has a partisan feel.
- **1:** Neutral but generic; could be any site anywhere.
- **2:** Calm and plain, with nothing that looks like selling.
- **3:** All of 2, and small touches make it feel local and human without clutter.
- **How to check:** Human judgment on screenshots. Ask: would a county office, a church pantry, and a student all feel this is for them?

### VD-local. Sense of place

It feels like it comes from Morgantown and Mon County, through the few cues in the [local identity guide](../design/identity.md), while staying calm and easy to read. VD7 asks whether the tone fits a civic resource; this one asks whether the local touches are the right ones, used the right way.

- **0:** Generic or borrowed branding (a city, county, WVU, or business logo, seal, mascot, or color system), or a stereotype.
- **1:** A local cue is present but clashes, or it hurts readability, contrast, or predictability.
- **2:** Follows `docs/design/identity.md` (its tokens, no drawn decoration, brick only as thin edges) and passes every other rubric.
- **3:** All of 2, and a resident would recognize it as from here while it stays calm and clear.
- **How to check:** Compare the CSS tokens with the palette table in the guide and run `npm run check-contrast` in `site/`. Run the guide's "Is it too much?" check on a 390px screenshot in light and dark mode. Ask: would a long-time resident, a newcomer, and a student all feel it is theirs, and would anyone mistake it for an official site?
