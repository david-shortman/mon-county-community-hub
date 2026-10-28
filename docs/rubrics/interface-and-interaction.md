# Interface and interaction rubric

Is it clear what to do, and does it respond well when you do it? This rubric is about controls, flows, and feedback: links, buttons, forms, feeds, and anything else a resident clicks, taps, or subscribes to.

**Standards this draws on**

- [GOV.UK Design System](https://design-system.service.gov.uk/) and its [patterns](https://design-system.service.gov.uk/patterns/)
- [U.S. Web Design System (USWDS)](https://designsystem.digital.gov/) and its [design principles](https://designsystem.digital.gov/design-principles/)
- [Nielsen's 10 usability heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)
- [GOV.UK Service Manual: design](https://www.gov.uk/service-manual/design)

**Pass bar:** no criterion at 0, average at least 2.0, and **II1 (clear next step) must be at least 2.**

---

### II1. Clear next step

On every page, a resident can tell what this page is for and what to do next. (Nielsen: match with the real world; GOV.UK: "Start with user needs")

- **0:** Purpose is unclear, or there is no obvious action.
- **1:** Purpose is clear, but the main action is buried or competes with many others.
- **2:** One clear purpose per page, and the main action is visible without scrolling on a phone.
- **3:** All of 2, and each item tells you exactly what to do and by when (an action, a place, a time, what to bring).
- **How to check:** Screenshot at 390px, look at the first screen only, and write down in one sentence what you would do next. If you cannot, score 1 or lower.

### II2. Controls look like what they do

Links look like links, buttons look like buttons, and things that are not clickable do not look clickable. (Nielsen: consistency and standards; USWDS [link](https://designsystem.digital.gov/components/link/) and [tag](https://designsystem.digital.gov/components/tag/) guidance)

- **0:** Clickable things are not recognizable, or decoration looks like controls everywhere.
- **1:** Mostly clear, but some elements mislead (pills or chips that look tappable but are not; buttons styled as plain text).
- **2:** Every control is recognizable, and nothing static looks interactive.
- **3:** All of 2, and the label says the result ("Add to my calendar", "Opens healthcare.gov"), including when a link leaves the site or downloads a file.
- **How to check:** On a screenshot, circle everything that looks tappable. Compare with the list of real `a`/`button` elements from Playwright.

### II3. Feedback and system status

The site tells people what happened and what is current. (Nielsen: visibility of system status)

- **0:** Actions give no feedback, or the page shows stale information as if it were current.
- **1:** Some feedback, but dates or status are inconsistent (for example, "Updated" and "Last checked" disagree).
- **2:** Every action has a visible result; time-based content shows when it was updated, and that date is right.
- **3:** All of 2, plus time-sensitive items show how soon ("in 3 days", "closes Friday") and past items drop off or are clearly marked.
- **How to check:** Read dates on each page and compare with the build time and the data files. Try each action and note what you see.

### II4. Mobile first

The phone experience is the main experience, not a shrunk desktop. ([GOV.UK: mobile first](https://www.gov.uk/service-manual/design/making-your-service-look-like-govuk); USWDS [responsive layout](https://designsystem.digital.gov/utilities/layout-grid/))

- **0:** Broken or unusable on a 390px phone.
- **1:** Usable, but needs zooming, sideways scrolling, or long scrolling past filler to reach the point.
- **2:** Comfortable on a phone: readable text, no sideways scroll, important content near the top.
- **3:** All of 2, and phone-native actions work: tap-to-call phone numbers, tap-to-map addresses, add-to-calendar on both iPhone and Android.
- **How to check:** Playwright at 390px; read the full-page screenshot. Check `tel:` and map links. Test calendar links on both platforms' handling (see II6).

### II5. Forms and input

If a feature asks for input, it follows the GOV.UK and USWDS form patterns. ([GOV.UK question pages](https://design-system.service.gov.uk/patterns/question-pages/), [USWDS forms](https://designsystem.digital.gov/components/form/))

- **0:** Fields without labels, placeholder text used as labels, or data lost on error.
- **1:** Labeled, but asks for more than needed or uses unclear input types.
- **2:** Visible labels, correct input types (`tel`, `email`, `inputmode="numeric"`), asks only what is needed, keeps input on error.
- **3:** All of 2, plus "one thing per page" for longer flows and hints that explain why we ask.
- **How to check:** List every `input`, `select`, `textarea` and its label in the accessibility tree. Submit empty and wrong values. **N/A** if there are no forms. Sending people to an outside form (such as GitHub) is scored under II7, not here.

### II6. Errors, edge cases and empty states

When something is missing or goes wrong, people are not stuck. (Nielsen: help users recognize, diagnose, and recover from errors; [GOV.UK error pages](https://design-system.service.gov.uk/patterns/page-not-found-pages/))

- **0:** Broken links, a feed that fails to import, or a dead-end error page with no way back.
- **1:** Errors are possible to recover from, but messages are technical or off-brand (a hosting company's default 404).
- **2:** A friendly 404 with a link home; empty states say what to do instead; feeds and downloads work in common apps.
- **3:** All of 2, and empty states point to another source of help (for example, "Nothing this week. Call 211 for help any day.").
- **How to check:** Visit a made-up URL. Find every empty state in the templates. Import the `.ics` feed into Apple Calendar, Google Calendar, and Outlook (or validate it at [icalendar.org](https://icalendar.org/validator.html)) and check times.

### II7. Ways to respond

People can report a mistake or suggest something without special accounts or skills. (USWDS principle: "Listen"; GOV.UK: [Get feedback](https://www.gov.uk/service-manual/measuring-success/measuring-user-satisfaction))

- **0:** No way to report a problem.
- **1:** A way exists, but it needs an account most residents do not have (such as GitHub) or technical knowledge.
- **2:** At least one way that needs no account, and people are told what happens next.
- **3:** All of 2, plus a "Report a problem with this item" link on each item that fills in which item it is.
- **How to check:** Follow every "Tell us" or "Suggest" link while logged out and note what it asks for.

### II8. Consistency

The same thing looks and works the same way everywhere. (Nielsen: consistency and standards)

- **0:** The same element behaves differently from page to page.
- **1:** Mostly consistent, with a few oddities (different labels for the same place, like "Deadlines" in the menu and "Deadlines and dates" in the title).
- **2:** Shared components for repeated items; labels match between menus, headings, and links.
- **3:** All of 2, and patterns match well-known government patterns so they feel familiar.
- **How to check:** Compare the same component (cards, menus, footers) on every page; list label pairs that should match.
