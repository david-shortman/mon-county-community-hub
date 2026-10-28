# Design rubrics

These rubrics are how we judge anything people use: the website, web apps, tools, calendar feeds, and anything we build later. Agents and humans use the same rubrics, so a score means the same thing no matter who gave it.

## The rubrics

| Rubric | What it asks | Main sources |
|---|---|---|
| [Accessibility](accessibility.md) | Can everyone use it, including people using a keyboard, a screen reader, an old phone, or a slow connection? | WCAG 2.2 AA |
| [Interface and interaction](interface-and-interaction.md) | Is it clear what to do, and does it respond well when you do it? | GOV.UK Design System, USWDS, Nielsen's heuristics |
| [Visual design](visual-design.md) | Does the look help people read and act? | USWDS design principles, WCAG contrast, Material and Apple guidance on dark mode |
| [Information architecture](information-architecture.md) | Can a resident with a task find the answer? | Nielsen Norman Group on IA and information scent, GOV.UK service manual |
| [Plain language](plain-language.md) | Can most adults read it once and know what to do? | plainlanguage.gov, GOV.UK content guidance, CDC Clear Communication Index |
| [Trust and civic ethics](trust-and-civic-ethics.md) | Is it honest, neutral, private, and pointed at real people and groups? | Our [charter](../CHARTER.md), Deceptive Design, Digital Services Playbook |

## How scoring works

Every criterion is scored **0 to 3**:

- **0, Failing.** Broken or missing. It stops some residents from getting what they need.
- **1, Weak.** Works for some people some of the time. Clear problems.
- **2, Good.** Meets the standard. Small issues at most.
- **3, Excellent.** Goes beyond the standard in a way residents would notice.

Each rubric sets its own **pass bar**. The default is: **no criterion at 0, and an average of at least 2.0.** Some rubrics add "must reach 2" criteria for things we will not ship without.

Score what is live, not what is planned. If a criterion does not apply (for example, a page with no forms), mark it **N/A** and leave it out of the average.

## How to run a review

1. **Pick the scope.** List the pages, feeds, or screens. Always include the home page and any page the change touched.
2. **Test the matrix.** At minimum: 390px wide (a common phone) and 1280px wide, each in light and dark color schemes. Add 320px for reflow checks.
3. **Run the automated checks.** An agent can do all of these with Playwright, which is pre-installed in cloud sessions (`require('playwright')`):
   - Load each page with `browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'dark' })`.
   - Inject [axe-core](https://github.com/dequelabs/axe-core) (`npm i axe-core`, then `page.addScriptTag({ content: fs.readFileSync('node_modules/axe-core/axe.min.js','utf8') })`) and run `axe.run()` with the tags `wcag2a, wcag2aa, wcag21aa, wcag22aa, best-practice`.
   - Press Tab through the page and record what gets focus and whether a focus outline shows.
   - Measure every link and button with `getBoundingClientRect()` for target size.
   - Compare `scrollWidth` to `clientWidth` for sideways scrolling.
   - Save full-page screenshots and look at them.
   - Use the accessibility tree (`locator.ariaSnapshot()`) to hear the page the way a screen reader would.
4. **Do the human checks.** Each criterion has a "How to check" line. Some need judgment: read the page as a resident with a real task, such as "I need food this week" or "When is the property tax deadline?"
5. **Write it up** in `docs/reviews/YYYY-MM-DD-<scope>.md` (see the [first review](../reviews/2026-10-28-site.md) for the format): a score table per rubric, evidence for every score below 3, and the top problems ranked by impact on residents.
6. **File issues** for the top problems with labels `for:code` and `type:design`. Each issue names the rubric and criterion (for example, "IA-4"), the evidence, and what done looks like. Do not add `up-next`; Duet ranks the queue.

## Ranking problems by impact

When choosing which problems to fix first, ask in this order:

1. Does it stop someone from getting help or acting in time? (A broken feed, a missing date, an unreadable page.)
2. How many residents does it touch? (Every page beats one page. Phones beat desktop.)
3. Does it hurt trust? (A wrong date or a hidden source costs more than an ugly button.)
4. How cheap is the fix?

## Changing the rubrics

The rubrics will get better as we use them. Change them by PR, and say in the PR what review showed the need. Keep criterion IDs stable (A1, II3, and so on) so old reviews still make sense; retire an ID instead of reusing it.
