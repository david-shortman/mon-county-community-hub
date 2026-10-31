# 2026-10-30: Tell residents about saved copies, and give the offline note the site's look

- **Considered:** since #150 the site keeps copies of some pages on the phone so they open with no signal, but no page said so or how to clear them (#352). The "Saved copy" note shown offline used inline styles that could drift from the site's note style (#354).
- **Chose:** one plain bullet on the About page next to "We don't track you", and a shared `.saved-copy` rule in `Base.astro`.
- **Shipped:** the About bullet says what is saved (Help now, the home page, the main topic pages, Dates, Food today and pages you open), that it stays on the phone and is not sent anywhere, and how to remove it (clear the site's data in browser settings). The offline note now uses only the class. Checked offline in light and dark at 320px and 390px with Playwright: the note shows with the right colors on a saved page and on the Help now fallback.
- **Not done:** the review idea to add "Call 211 for help any day" to the fallback note. That would name a crisis line in the offline note, so it should be its own change, checked against WV 211's current hours.
- **Cost:** $0.
