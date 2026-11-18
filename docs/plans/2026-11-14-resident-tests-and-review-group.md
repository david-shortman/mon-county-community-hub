# Plan: resident tests and a local review group, for when outreach opens

For #500 (part of #490), sprint wave 18 (#529). Written 2026-11-14. **Draft only. No one is contacted until David says the site is ready.** Builds on the "tests with real residents" item in #98 and the civic tech playbook ([plain words, tested with people](../playbook/civic-tech.md#plain-words-tested-with-people)).

## Why

No resident, service worker or local group has shaped the site yet. That is on purpose while it is being built. The people a tool is for should help shape it (Design Justice, MIT Press, 2020, https://designjustice.mitpress.mit.edu/, cited in #500). Our own checks (the findability runs in `content/findability/`, persona reviews in `docs/persona-reviews/`) are Claude testing Claude's work. They catch a lot, but not what a real person in a real hurry gets stuck on.

## Part 1: resident tests

### How a test works

A think-aloud test: a person tries a task on their own phone and says what they are thinking, while one team member watches and takes notes. The 18F method guide says to ask participants to "think out loud," keep a running list of problems, avoid "interrupting the session," and hold a short debrief after each test (https://guides.18f.org/methods/validate/usability-testing/, read 2026-11-14).

- **How many:** five people per round, then fix what they hit, then another round. "The best results come from testing no more than 5 users and running as many small tests as you can afford" (Jakob Nielsen, Nielsen Norman Group, March 18, 2000, https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/, read 2026-11-14).
- **How long:** about 20 minutes each.
- **Where:** wherever the person already is. A library table, a community center, or a video call. Their own phone, so we see their real screen size and signal.

### The script

The person running it reads this aloud. Plain words, about 8th grade.

1. **Before.** "Thanks for doing this. We are testing the website, not you. There are no wrong answers. If something is hard, that is the site's fault, and it is exactly what we need to know. Please don't tell us anything private about yourself. Use made-up details if a page asks. We won't record your name. Is it OK if I take notes? You can stop any time."
2. **Warm up.** "Open your phone's browser the way you normally would. If you wanted to find help with something in Morgantown, what would you do first?" (Note what they do. Don't steer them to the site yet.)
3. **Tasks.** Give one at a time. Say: "Please say out loud what you're thinking as you go." Pick four from the findability questions in `content/findability/questions.yaml`, so results can be compared with our own runs. A good starting set, covering different parts of the site:
   - q01: "You can't pay your heating bill this winter. Find where you could get help."
   - q20: "You have old paint and batteries. Find where you can drop them off."
   - q28: "Find which bus gets you to the hospital, and when it runs."
   - q12: "You want to speak at a City Council meeting. Find out how."
4. **After each task.** "How sure are you that this answer is right? What would you do next?"
5. **Last.** "Was anything confusing, or missing? Anything you would tell a friend about it?"
6. **Thank them.** Say how they can see what changed: the Corrections page and the build log.

Do not use crisis tasks (shelter tonight, crisis help) in a test. Those pages are checked by the review group in Part 2 instead, so no one is asked to act out a hard moment.

### What we write down

- For each task: found it or not, how many taps, where they got stuck, and what they said in a few words.
- **No names, no recordings, no photos, no personal stories.** Notes stay private (in Notion) until they are turned into issues in our own words, the same rule as feedback (#522).
- Each problem becomes an issue with "Serves:" naming the persona (#1037), and "Source: resident test, round N, date". No quotes that could identify anyone.

### Who could be asked

Described by role only. David decides who, and he makes every contact.

- People who use local services, reached through a group they already trust (a pantry, the library, a family resource center), only if that group agrees.
- People who help others find services: librarians, pantry volunteers, caseworkers, school coordinators.
- A mix of ages, at least one person who reads another language best, at least one older adult, and at least one person who lives outside Morgantown city limits (our persona list in `content/personas.yaml` has more).

## Part 2: a small local review group

### What it would do

- **Once a month, about one hour:** read three to five high-stakes pages (food, shelter, crisis lines, utility help, benefits) and mark anything wrong, out of date, unclear or missing.
- **Send notes through the fix form** that already exists (`FIX_FORM`), so nothing new is needed. A team member files issues in our words (`docs/operations/feedback-triage.md`). Their fixes show on the Corrections page as found by a helper.
- **Optional:** a short look at a new page before it goes live, when a page is about their work.

### Who might join

Four to six people, by role: a pantry or meal volunteer, a librarian, a caseworker or peer support worker, a school or family resource coordinator, and one or two people who use these services. No one from a political campaign or party, and no one paid by a group to promote its own listing (charter: neutral).

### What it would cost them

About one hour a month, plus reading time. Nothing to install, no account to make.

### How their input shows on the site

- **By default, no names.** Fixes say "Reported by someone who helps people find services," as the Corrections page does today.
- **Credit only with written permission,** and only as the person or group asks (a name, a role, or a group name). That is a change to the About page, so it waits for David (writing rule 5, `docs/playbook/writing-rules.md`).
- A line on the About page saying a local review group reads high-stakes pages each month, once that is true and not before (writing rule 4: no claim we can't show).

## Options and what they cost

| Option | What it is | Cost |
|---|---|---|
| A. Volunteers, no thank-you gift | Ask people to help for free | $0. Fewer people may say yes, and it asks most of the people with the least time. |
| B. A small thank-you per test or meeting | A gift card or cash for each person | Money. David sets the amount. For example, five people at $25 each is $125 per test round, and a five-person group meeting monthly at $25 each is $125 a month. Example amounts only, not a recommendation. |
| C. In-kind thanks | A group or business donates gift cards or snacks | $0 to us, but it asks an outside group for something, so David decides. The donor would not be promoted on the site. |
| D. Partner with a group that already gathers helpers | Run tests or the review at a meeting that already happens (#163) | $0. Takes a few minutes of someone else's meeting. |

**Recommended:** D for the first round of tests (no cost, and people are already there), and B or C for the review group if David wants it to last, since a monthly hour is real work. Nothing here needs an outside account or tool.

## Decisions for David

1. **When does outreach open?** Nothing in this plan starts until he says the site is ready.
2. **Resident tests: yes, not now, or later?** And which group, if any, to ask first.
3. **A thank-you for testers and reviewers:** none, money (and how much), or in-kind.
4. **The review group: yes, not now, or later?** And how many people.
5. **Credit:** whether to list reviewers by name when they ask, and the About page wording.

These are in #1937.

## What a Claude Code session can do now, with no contact

- Keep the four test tasks matched to current findability questions.
- Make a one-page printable version of the script (a later PR, if David wants it).
- After a round, turn David's notes (in our words) into issues.
