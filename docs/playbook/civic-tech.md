# Civic tech practice

Governments and civic tech groups have learned a lot about building public services that people can actually use. This page pulls the most useful lessons from the GOV.UK Service Standard, the U.S. Digital Services Playbook, 18F, Code for America, and the Digital Public Goods Alliance. Each practice says what it is, why it matters for Mon County, and exactly how this repo applies it.

## Start with real resident questions

**What it is.** Both the GOV.UK Service Standard (point 1, "Understand users and their needs") and the U.S. Digital Services Playbook (play 1, "Understand what people need") say to start from the needs of the people who will use a service, not from the tools or the org chart. GOV.UK says "Testing your assumptions early and often reduces the risk of building the wrong thing." Code for America's first principle of human-centered government is "put people first."

**Why it matters here.** It is easy to build a page that lists every program and still miss the question a resident is actually asking, such as "how do I get help with my heating bill this winter?"

**How we apply it.** The daily loop's **Look** step starts from questions phrased the way a resident would ask them, not from agency names. Each findability test records the exact question, whether an answer was found, how many steps it took, and whether it worked on a phone. New pages and YAML entries should name the question they answer in the PR description. We will NOT invent user research findings. Interviews or tests with real residents need people, so they become a `for:david` issue to arrange.

**Sources:**
- [GOV.UK Service Standard, point 1](https://www.gov.uk/service-manual/service-standard/point-1-understand-user-needs)
- [U.S. Digital Services Playbook](https://playbook.usds.gov/)
- [Code for America: Human-Centered Government (2021)](https://codeforamerica.org/news/human-centered-government/)

## Solve the whole problem, then hand off

**What it is.** GOV.UK point 2, "Solve a whole problem for users," says "users should not have to understand how government works in order to use public services." The USDS Playbook (play 2) says to "Address the whole experience, from start to finish."

**Why it matters here.** A resident does not care whether help comes from the county, the state, or a nonprofit. They need the next step, the deadline, and who to call.

**How we apply it.** Organize the Astro site by life situation (heating bills, food, a new business), not by agency. Every `resources/` entry fills in `who_it_is_for` and `what_to_do`, and every `calendar/` entry has a `url` where a person can act. This matches the charter rule "Connect, don't compete": our job ends at a clear handoff to the real organization. We will NOT copy whole application forms or try to replace an organization's own intake.

**Sources:**
- [GOV.UK Service Standard, point 2](https://www.gov.uk/service-manual/service-standard/point-2-solve-a-whole-problem)
- [U.S. Digital Services Playbook](https://playbook.usds.gov/)

## Plain words, tested with people

**What it is.** GOV.UK point 4, "Make the service simple to use," asks teams to "test for usability frequently with actual and potential users." The USDS Playbook (play 3) says to "Use language that is familiar to the user and easy to understand." The archived 18F Content Guide says "Don't use formal or long words when easy or short ones will do," and to explain technical terms the first time they appear. 18F's usability testing method has people try a task while thinking out loud, then the team reviews what went wrong. Digital.gov notes that plain language is required by law for federal public content under the Plain Writing Act of 2010.

**Why it matters here.** The charter sets an 8th grade reading level. Confusing words cost people time and can keep them from getting help.

**How we apply it.** The findability test includes a plain language check on each answer page. PR review checks that `summary`, `who_it_is_for`, and `what_to_do` use short, common words (for example "use" not "utilize," "help" not "assist"). Agents can run "task walk-throughs" themselves, but real think-aloud tests with residents become a `for:david` issue, since only David contacts people.

**Sources:**
- [GOV.UK Service Standard, point 4](https://www.gov.uk/service-manual/service-standard/point-4-make-the-service-simple-to-use)
- [18F Content Guide: plain language (archived)](https://guides.18f.org/content-guide/our-approach/plain-language/)
- [18F Methods: usability testing (archived)](https://guides.18f.org/methods/validate/usability-testing/)
- [Digital.gov plain language guide series](https://digital.gov/guides/plain-language)

## Works for everyone, on any phone

**What it is.** GOV.UK point 5, "Make sure everyone can use the service," covers disabled people and people "who do not have access to the internet or lack the skills or confidence to use it." WCAG 2.2, a W3C Recommendation since 5 October 2023, is the main web accessibility standard. Level AA includes Reflow (1.4.10: content works at 320 CSS pixels wide without sideways scrolling) and the new Target Size (Minimum) (2.5.8: tap targets at least 24 by 24 CSS pixels, with exceptions). Level A adds Consistent Help (3.2.6: repeated help links stay in the same order). Pew Research found in 2023 survey data that 73% of rural adults have home broadband, versus 86% of suburban adults. Among adults in households earning under $30,000 a year, 28% are "smartphone dependent" (a smartphone but no home broadband).

**Why it matters here.** Many Monongalia County residents will reach us on a phone, sometimes on a weak signal.

**How we apply it.** Target WCAG 2.2 AA on every page. Keep the Astro site light: static HTML, little or no client JavaScript, small images. The findability test's "works on a phone" check uses a 320 pixel wide view. Put any "suggest a correction" link in the same place on every page. Always show a phone number from `contact.phone` so people without data can still act.

**Sources:**
- [GOV.UK Service Standard, point 5](https://www.gov.uk/service-manual/service-standard/point-5-make-sure-everyone-can-use-the-service)
- [W3C: What's new in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
- [W3C: Understanding SC 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- [Pew Research Center: Mobile technology and home broadband (2024)](https://www.pewresearch.org/internet/2024/01/31/americans-use-of-mobile-technology-and-home-broadband/)

## Never finished: iterate in the open

**What it is.** GOV.UK point 8, "Iterate and improve frequently," says "Services are never 'finished'" and warns that bug fixes alone mean "fixing symptoms rather than underlying problems." The USDS Playbook has plays on agile, iterative work (play 4) and on using data to drive decisions (play 12). Code for America lists "improve continuously" and "inform with evidence" as principles.

**Why it matters here.** Local information goes stale fast: deadlines move, phone numbers change, programs end.

**How we apply it.** The daily loop (Look, Think, Build, Measure, Learn) is this practice. The site rebuilds every morning from `content/`, calendar entries drop off after `ends`, and entries older than six months since `checked` get flagged. Each build log entry and scoreboard change should say what we expected and what actually changed. Ship small PRs often instead of large redesigns.

**Sources:**
- [GOV.UK Service Standard, point 8](https://www.gov.uk/service-manual/service-standard/point-8-iterate-and-improve-frequently)
- [U.S. Digital Services Playbook](https://playbook.usds.gov/)
- [Code for America: Human-Centered Government](https://codeforamerica.org/news/human-centered-government/)

## Open code, open data, open standards

**What it is.** GOV.UK point 12, "Make new source code open," says "Public services are built with public money," so code should be open by default, with secrets left out. Point 13 says to "Build on open standards" and to publish useful data "in an open, machine readable format." USDS play 13 is "Default to open." Open Referral's Human Services Data Specification (HSDS) is an open standard for community resource data, built around four core objects: organization, service, location, and service_at_location. iCalendar (RFC 5545) is the open standard for calendar data.

**Why it matters here.** Open data lets 211 lines, libraries, and other tools reuse our work. That amplifies local groups more than one website can.

**How we apply it.** Keep code under MIT and `content/` under CC BY 4.0 (already decided in `docs/decisions.md`). Keep the `calendar.ics` feed valid iCalendar. Before the `content/` schema leaves draft (v0), compare `orgs/` and `resources/` fields to HSDS so a future HSDS JSON export is easy. We will NOT invent a new format where a standard fits.

**Sources:**
- [GOV.UK Service Standard, point 12](https://www.gov.uk/service-manual/service-standard/point-12-make-new-source-code-open)
- [GOV.UK Service Standard, point 13](https://www.gov.uk/service-manual/service-standard/point-13-use-common-standards-components-patterns)
- [Open Referral HSDS overview](https://docs.openreferral.org/en/latest/hsds/overview.html)
- [RFC 5545: iCalendar](https://www.rfc-editor.org/rfc/rfc5545)

## Plan for who keeps it running

**What it is.** In 2023 Code for America ended its Brigade program, about 60 volunteer chapters, by ending fiscal sponsorship. It said it was "not best suited to serve as a central supporting organization for a network of volunteers" and that multi-year funding for that network was hard to sustain. StateScoop reported that former brigades formed new umbrella groups and moved to other fiscal sponsors. A 2017 Knight Foundation and Rita Allen Foundation report found that "very few startups in the space have been able to sustain and scale their work."

**Why it matters here.** This project depends on one human owner and on agents. Civic tech often dies when the builders leave, funding ends, or no partner owns the result.

**How we apply it.** Treat the open YAML data and docs as the lasting product, so anyone can pick them up. Keep the repo runnable from its README alone. Prefer pointing to an organization's own page over copying it, so their updates flow through. Partnerships and any future handoff to a local institution become `for:david` issues.

**Sources:**
- [Code for America: Reflections on the Brigade Network's Next Chapter (2023)](https://codeforamerica.org/news/reflections-on-the-brigade-networks-next-chapter/)
- [StateScoop: Former Code for America brigades regroup (2023)](https://statescoop.com/code-for-america-former-brigades-regroup/)
- [Knight Foundation: Scaling Civic Tech (2017)](https://knightfoundation.org/reports/scaling-civic-tech/)

## Check against the Digital Public Goods Standard

**What it is.** The Digital Public Goods Alliance (DPGA) Standard has nine indicators: SDG relevance, open licensing, clear ownership, platform independence, documentation, a way to extract data in non-proprietary formats, privacy and applicable laws, standards and best practices, and "do no harm by design." Open content needs a Creative Commons license (CC BY is encouraged), and open data needs an Open Data Commons approved license. Only an authorized representative of the owner can apply, and status lasts one year before reassessment.

**Why it matters here.** It is a free, public checklist for whether an open project is reusable and safe, even if we never apply.

**How we apply it.** We likely meet several indicators already: CC BY 4.0 content, MIT code, public docs, YAML data, and a privacy rule of no personal information. Gaps to check: documented ownership, a clear content moderation policy for suggested resources, and a CSV or JSON export. Whether to apply is a `for:david` decision.

**Sources:**
- [DPGA: The Digital Public Goods Standard](https://www.digitalpublicgoods.net/standard)
- [DPG Standard text on GitHub](https://github.com/DPGAlliance/DPG-Standard/blob/main/standard.md)
- [DPGA submission guide](https://www.digitalpublicgoods.net/submission-guide)
- [DPG Registry](https://www.digitalpublicgoods.net/registry)

## Checked

Sources checked 2026-10-28.
