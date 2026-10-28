# Trust and civic ethics rubric

Is it honest, neutral, private, and pointed at real people and groups? Our [charter](../CHARTER.md) says "Trust is the whole game." This rubric turns the charter's guardrails into things we can check on every page and tool.

**Standards this draws on**

- Our [charter](../CHARTER.md) (mission, guardrails) and [CLAUDE.md](../../CLAUDE.md)
- [U.S. Digital Services Playbook](https://playbook.cio.gov/)
- [USWDS design principles](https://designsystem.digital.gov/design-principles/): "Earn trust", "Listen"
- [Deceptive Design (formerly Dark Patterns)](https://www.deceptive.design/types)
- [FTC: Bringing Dark Patterns to Light (2022)](https://www.ftc.gov/reports/bringing-dark-patterns-light)
- [W3C: Ethical Web Principles](https://www.w3.org/TR/ethical-web-principles/)
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework) on transparency

**Pass bar:** no criterion at 0, average at least 2.0, and **TR1 (sources and dates), TR3 (neutrality) and TR4 (privacy) must each be at least 2.** A 0 on any of those three is a reason to take the content down until fixed.

---

### TR1. Sources and dates are visible

Every fact shows where it came from and when we last checked it, right next to it.

- **0:** Facts with no source, or no checked date.
- **1:** Sources exist but are hidden (only in the data file, or one source for a whole page).
- **2:** Each item shows its source link and last-checked date on the page.
- **3:** All of 2, and the source is named as the organization ("HealthCare.gov"), not just a web address, and stale items (not checked in 90 days) are flagged.
- **How to check:** For each item, find the source and date on the rendered page. Compare with `content/` files.

### TR2. Accuracy and freshness signals

What we show matches the source today, and date stamps are consistent.

- **0:** A shown fact contradicts its source, or past events show as upcoming.
- **1:** Correct, but date stamps conflict (a page "updated" earlier than its items were "checked"), or the feed and the page disagree.
- **2:** Correct and consistent across page, feed, and data.
- **3:** All of 2, plus an automated check that links still work and dates have not changed (see issue #16).
- **How to check:** Spot check three items against their sources. Compare page dates, feed dates, and data-file dates.

### TR3. Neutrality

We describe; we do not promote or take sides. (Charter: "No candidates, parties, or favored businesses.")

- **0:** Partisan content, or promotion of a business or candidate.
- **1:** Neutral facts, but wording that favors one group or program over equal alternatives.
- **2:** Neutral wording throughout; civic items point to official sources (for example, the WV Secretary of State for voting).
- **3:** All of 2, and how items are chosen and ordered is explained (for example, "sorted by date").
- **How to check:** Read every item for adjectives and claims. Look for "best", "great", "trusted", and calls to support anything.

### TR4. Privacy

We collect nothing we do not need and say so plainly. ([W3C Ethical Web Principles: privacy](https://www.w3.org/TR/ethical-web-principles/#privacy))

- **0:** Third-party trackers, ad pixels, or forms collecting personal info without need.
- **1:** No trackers, but no privacy statement, or third-party resources (fonts, scripts) that leak visits.
- **2:** No trackers or third-party requests, and a plain statement of what is and is not collected.
- **3:** All of 2, and any future counting is aggregate-only and described on the page.
- **How to check:** Playwright `page.on('request')` and list every host contacted. Read the privacy statement.

### TR5. Honesty about AI

People can tell that an AI helps build and check the site, what humans do, and how to reach a human.

- **0:** AI involvement hidden, or AI-written text presented as a person's.
- **1:** Mentioned only in fine print or off-site.
- **2:** Stated in plain words on the home page or About page, naming the AI and the human role.
- **3:** All of 2, and each item says how it was checked (by AI, by a person, or both) and links to the public log.
- **How to check:** Read the home and About pages as a first-time visitor.

### TR6. Points to real people and groups

Every item leads to the organization or person who can actually help. (Charter: "Connect, don't compete.")

- **0:** Items with no organization or way to reach one.
- **1:** Names the organization, but only links to a web page.
- **2:** Names the organization and gives a direct way to act (apply link, address, or phone).
- **3:** All of 2, plus a fallback for people without internet (a phone number, or WV 211).
- **How to check:** For each item, list org name, link, phone, address.

### TR7. No dark patterns

Nothing tricks, pressures, or traps people. ([Deceptive Design types](https://www.deceptive.design/types))

- **0:** Fake urgency, hidden costs, confirm-shaming, sneaky sign-ups, or hard-to-cancel subscriptions.
- **1:** Mild pressure (pop-ups asking for email, nags).
- **2:** None found.
- **3:** None found, and subscriptions (like the calendar feed) explain how to stop them.
- **How to check:** Walk every flow; look for countdowns, pre-checked boxes, pop-ups, and unclear unsubscribe paths.

### TR8. Open and accountable

Residents can see who runs it, why choices were made, and how to correct it.

- **0:** No way to know who is behind it or to correct mistakes.
- **1:** Who and why are on GitHub only, and correcting it needs a GitHub account.
- **2:** About page explains who, why, and how decisions are made, and offers a no-account way to report mistakes.
- **3:** All of 2, and corrections are logged publicly with what changed.
- **How to check:** Read the About page and footer; try to report a mistake while logged out of everything.
