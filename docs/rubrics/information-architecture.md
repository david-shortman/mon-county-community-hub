# Information architecture rubric

Can a resident with a task find the answer? Information architecture (IA) is how content is grouped, labeled, and connected. This rubric is scored by acting out real tasks, not by looking at a site map.

**Standards this draws on**

- [Nielsen Norman Group: Information architecture basics](https://www.nngroup.com/articles/ia-vs-navigation/)
- [NN/g: Information scent](https://www.nngroup.com/articles/information-scent/)
- [NN/g: Navigation and menu design](https://www.nngroup.com/articles/menu-design/)
- [GOV.UK Service Manual: Structuring content](https://www.gov.uk/guidance/content-design/organising-and-grouping-content-on-gov-uk) and [Start with user needs](https://www.gov.uk/service-manual/user-research/start-by-learning-user-needs)
- [USWDS: Navigation](https://designsystem.digital.gov/components/header/) and [principle "Earn trust"](https://designsystem.digital.gov/design-principles/)
- [Digital.gov: Information architecture](https://digital.gov/topics/information-architecture)

**Pass bar:** no criterion at 0, average at least 2.0, and **IA1 (task success) must be at least 2.**

## The task set

Score IA1 and IA2 with a set of resident tasks. Use tasks that match what the site claims to cover, and add new ones as the site grows. Start with these and keep them in the review so results compare over time:

1. "I need food this week. Where can I go?"
2. "When is the deadline to sign up for health insurance?"
3. "I'm 67 and own my home. Is there a tax break, and when do I apply?"
4. "Where can I get rid of old tires?"
5. "How do I get these dates on my phone?"
6. "This date looks wrong. How do I tell someone?"
7. "Who runs this site, and why should I trust it?"

The Findability scout's tests in `docs/scoreboard.md` and `content/findability/` use a wider set; borrow from them when they apply.

---

### IA1. Task success

A resident with a real task can find the answer on the site.

- **0:** Fewer than half the tasks can be done.
- **1:** Half or more can be done, but some answers exist only on another page the resident has no way to reach.
- **2:** Every task the site claims to cover can be done.
- **3:** All of 2, and each answer leads to a real organization with a next step (call, go, apply).
- **How to check:** Start at the home page for each task. Record found or not, and the path taken. An agent can script this in Playwright by following links whose text best matches the task.

### IA2. Steps to the answer

The answer is close. Count taps from the home page, including scrolling past a full screen as one step.

- **0:** Average over five steps, or many dead ends.
- **1:** Average of four or five steps.
- **2:** Average of three or fewer.
- **3:** Average of two or fewer, and common tasks are answered on the home page.
- **How to check:** Same task run as IA1; record steps for each and average them.

### IA3. Labels people use

Menus, headings, and link text use residents' words, not ours. ([NN/g: Use clear labels](https://www.nngroup.com/articles/navigation-ia-tests/))

- **0:** Labels are internal jargon or brand names that mean nothing to a newcomer.
- **1:** Mostly plain, but some labels are vague ("Resources", "Learn more") or do not match the page title.
- **2:** Labels describe the content, and the menu label matches the page heading.
- **3:** All of 2, and labels are tested against words residents actually search for (for example, "food pantry", not "food security").
- **How to check:** List each menu item, its page `h1`, and its `title`. Compare to search terms from the Findability scout or to how sources name the same thing.

### IA4. Navigation and wayfinding

People always know where they are, where they can go, and how to get back.

- **0:** No consistent menu, or pages you cannot leave without the back button.
- **1:** A menu exists, but it does not show the current page or does not lead to all main sections.
- **2:** A consistent menu on every page, current page marked, every main section reachable in one tap.
- **3:** All of 2, plus breadcrumbs or "related" links once there is more than one level.
- **How to check:** Visit every page and note the menu items and whether the current one is marked (`aria-current`). Draw the link map from the HTML.

### IA5. Information scent

Each link and heading gives a strong, accurate hint of what is behind it, so people do not have to guess.

- **0:** Links regularly lead somewhere unexpected.
- **1:** Mostly accurate, but some links surprise (an item title that sends you to another website without saying so; a source link that only shows a domain).
- **2:** Link text predicts the destination, and links that leave the site are marked or named for their destination.
- **3:** All of 2, and the home page previews each section with its most useful content.
- **How to check:** Before following each link, write what you expect; then follow it and compare.

### IA6. Grouping and browsing by need

Content is grouped by what residents need (food, health, taxes, housing), and they can browse or filter by it.

- **0:** No grouping; one long list.
- **1:** Items are tagged, but tags are not browsable or filterable.
- **2:** Residents can see everything for one need on one page or with one filter.
- **3:** All of 2, and groups cross-link (the health insurance deadline links to the health care guide).
- **How to check:** Try to see "everything about food" from the home page. Count the steps or note that you cannot.

### IA7. Search and recovery

People who do not find it by browsing have another way: search, a site index, or a pointer to someone who can help.

- **0:** No search and no fallback; dead ends.
- **1:** No search, but the site is small enough that every page is linked from the menu.
- **2:** A search or an A to Z index once the site has more than a handful of pages, and a fallback like WV 211 on empty results.
- **3:** All of 2, and failed searches are counted (anonymously) to find gaps.
- **How to check:** Look for search or an index; search for a task word and for a misspelling.

### IA8. Findable from outside

Search engines and other tools can find and understand each page. Most residents arrive from a search, not our home page.

- **0:** Pages have no unique title or description, or are blocked from indexing.
- **1:** Unique titles, but missing descriptions, a sitemap, or structured data.
- **2:** Unique, descriptive `title` and meta description per page, a `sitemap.xml`, and canonical URLs.
- **3:** All of 2, plus structured data (for example, schema.org `Event` for dates) and an open data or feed version of the content.
- **How to check:** Read `<title>`, `<meta name="description">`, and `<link rel="canonical">` on each page; fetch `/sitemap.xml` and `/robots.txt`; run the [Schema.org validator](https://validator.schema.org/).
