# Accessibility rubric

Can everyone use it? That includes people who use a keyboard instead of a mouse, a screen reader, zoom, or voice control, and people on an old phone or a slow, metered connection. Many residents in our rural areas fit the last group.

**Standards this draws on**

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/), level AA, and [Understanding WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/)
- [Section 508](https://www.section508.gov/) (U.S. federal accessibility rules, which point to WCAG)
- [GOV.UK: Testing for accessibility](https://www.gov.uk/service-manual/helping-people-to-use-your-service/testing-for-accessibility)
- [axe-core rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [web.dev: Fast load times](https://web.dev/explore/fast) for slow connections

**Pass bar:** no criterion at 0, average at least 2.0, and **A1, A2, A3 and A4 must each be at least 2.** Those four are where WCAG failures lock people out.

---

### A1. Automated scan is clean

No WCAG A or AA failures that a machine can find.

- **0:** Any critical or serious axe violation on a main page.
- **1:** Only moderate or minor violations, but more than three in total.
- **2:** Zero WCAG A or AA violations; a few best-practice notes at most.
- **3:** Zero violations of any kind, across every page, at 390px and 1280px, in light and dark.
- **How to check:** Inject axe-core with Playwright and run it with tags `wcag2a, wcag2aa, wcag21aa, wcag22aa, best-practice` on every page in each viewport and color scheme. Remember that automated tools catch only about a third of problems; the other criteria cover the rest.

### A2. Keyboard and focus

Everything works with a keyboard alone, in a sensible order, and you can always see where you are. ([WCAG 2.1.1](https://www.w3.org/WAI/WCAG22/Understanding/keyboard), [2.4.3](https://www.w3.org/WAI/WCAG22/Understanding/focus-order), [2.4.7](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible), [2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum))

- **0:** Something can only be done with a mouse or touch, or focus gets trapped.
- **1:** Everything is reachable, but focus is invisible or hard to see in places, or the order jumps around.
- **2:** Logical order and a visible focus outline on every control in both color schemes.
- **3:** All of 2, plus a "Skip to main content" link and focus never hidden behind sticky headers or pop-ups.
- **How to check:** Press Tab through each page (Playwright `keyboard.press('Tab')` and read `document.activeElement` and its computed `outline`). Then try it by hand.

### A3. Screen reader structure

The page makes sense when heard instead of seen. ([WCAG 1.3.1](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships), [2.4.4](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context), [2.4.6](https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels), [4.1.2](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value))

- **0:** No headings or landmarks, or controls with no name.
- **1:** Headings and landmarks exist, but links are ambiguous ("click here", or two links with the same text going to different places) or lists read as run-on text.
- **2:** One `h1`, headings in order, `header`/`nav`/`main`/`footer` landmarks, every link and button says where it goes or what it does.
- **3:** All of 2, plus the current page is marked in navigation (`aria-current="page"`), links that leave the site or download a file say so, and dynamic updates are announced.
- **How to check:** Playwright `page.locator('body').ariaSnapshot()` and read it top to bottom. Spot check with VoiceOver (iPhone) or TalkBack (Android).

### A4. Contrast and color

People with low vision or color blindness can read everything. ([WCAG 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum), [1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast), [1.4.1](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color))

- **0:** Body text under 4.5:1 contrast, or meaning shown by color alone.
- **1:** Body text passes, but some small text, links, or control borders fall short.
- **2:** All text at least 4.5:1 (3:1 for large text), controls and focus outlines at least 3:1, in light and dark.
- **3:** All of 2, and body text at 7:1 (AAA), and it still works in Windows High Contrast / forced colors.
- **How to check:** axe `color-contrast` rule in both color schemes; check links are underlined or otherwise not color-only; emulate `forcedColors: 'active'` in Playwright.

### A5. Zoom, reflow and text spacing

It still works at 200% zoom, at 320px wide, and with bigger text spacing. ([WCAG 1.4.4](https://www.w3.org/WAI/WCAG22/Understanding/resize-text), [1.4.10](https://www.w3.org/WAI/WCAG22/Understanding/reflow), [1.4.12](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing))

- **0:** Content is cut off or overlaps at 320px or 200% zoom.
- **1:** Sideways scrolling is needed for normal text at 320px.
- **2:** No sideways scrolling at 320px; nothing clipped with larger text spacing.
- **3:** All of 2, and font sizes use relative units, so a phone's larger-text setting enlarges the page.
- **How to check:** Set the viewport to 320px and compare `document.documentElement.scrollWidth` to `clientWidth`. Apply the WCAG text-spacing bookmarklet CSS and look again.

### A6. Target size

Links and buttons are easy to tap, including for people with tremors or big thumbs. ([WCAG 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum); [Apple](https://developer.apple.com/design/human-interface-guidelines/accessibility) and [GOV.UK](https://design-system.service.gov.uk/) aim for about 44px)

- **0:** Standalone controls under 24 by 24 px with no spacing around them.
- **1:** Meets 24px, but key actions (the main button, the menu) are small and crowded.
- **2:** All standalone controls at least 24px with spacing; main actions and navigation at least 44px tall.
- **3:** All of 2, and lists of links (such as source lists) are spaced so a thumb hits the right one.
- **How to check:** In Playwright, list every `a, button, input, select` with `getBoundingClientRect()` at 390px. Links inside a sentence are exempt under WCAG, but note them.

### A7. Motion and media

Nothing moves, flashes, or plays on its own in a way that can hurt or distract. ([WCAG 2.3.1](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold), [2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide), [2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions); [1.2 captions](https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded))

- **0:** Autoplaying media, flashing, or animation that cannot be stopped.
- **1:** Some animation that ignores `prefers-reduced-motion`, or video without captions.
- **2:** No autoplay; animation respects reduced motion; media has captions or a transcript.
- **3:** Calm by default: no motion needed to understand anything. (A page with no motion at all scores 3.)
- **How to check:** Load with `reducedMotion: 'reduce'` in Playwright and compare; look for `video`, `audio`, CSS animations.

### A8. Old phones and slow connections

The page loads fast and works on cheap, older phones and weak signal. ([web.dev Core Web Vitals](https://web.dev/articles/vitals); [GOV.UK: Building a resilient frontend](https://www.gov.uk/service-manual/technology/using-progressive-enhancement))

- **0:** Over 1 MB to load, or blank without JavaScript.
- **1:** 300 KB to 1 MB, or main content needs JavaScript.
- **2:** Under 300 KB, main content is in the HTML, usable within 5 seconds on slow 3G.
- **3:** Under 100 KB, no required JavaScript, no web fonts or images that block reading, and it prints cleanly.
- **How to check:** `curl --compressed -w '%{size_download}'` each page and its assets; Playwright with JavaScript disabled (`javaScriptEnabled: false`); CDP `Network.emulateNetworkConditions` for slow 3G timing.
