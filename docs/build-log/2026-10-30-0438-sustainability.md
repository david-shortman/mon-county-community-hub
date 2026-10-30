# 2026-10-30: Running costs and how someone else could keep it going (#113)

- **Considered:** the funder lens and civic tech notes both say to write down what the project costs and who could carry it. Civic tech projects often stop when their builders leave. The root README also had no steps to build the site.
- **Chose:** one short doc, `docs/sustainability.md`, that says what is known and marks what is not (the domain price and renewal date, the Claude plan price, the Notion plan). No partner names.
- **Shipped:**
  - `docs/sustainability.md`: costs today (about $0 plus the domain, with the Claude plan David already pays for), free limits, what could cost money later, what happens if each part stops, and the skills, time and accounts a new owner would need.
  - Root `README.md`: a "Run it yourself" section. Tested on a fresh clone: `npm ci`, `npm run check-content`, `npm run build` and `npm run preview` all worked with nothing else set up.
- **Scoreboard:** none directly.
