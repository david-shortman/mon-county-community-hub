# The work pipeline

How an idea becomes something residents use, and how we find out if it helped.

**Status: proposal.** This page was drafted by the process designer session on 2026-10-28. It changes how agents work, so only David can adopt it. Until he merges it, [`docs/COORDINATION.md`](../COORDINATION.md) and the [charter](../CHARTER.md) are the rules. If this page and those disagree, they win.

## Part 1: Diagnosis of the pipeline today

Today the loop is: Duet looks and thinks, files issues, and marks the best `for:code` issue `up-next`. A Claude Code session (the daily 6:41 AM Eastern run, or the GitHub Action in `.github/workflows/claude.yml`, added in PR #32) builds it, writes a build log entry, and merges its own PR. The site rebuilds every morning.

That loop is fast, which is right for an incubating project. Here is where it can break.

### Where work could stall

- **`for:david` has no clock.** Four decision issues (#23 to #26) wait on outreach that only David can do. Nothing tracks how long they have waited, and builds that depend on them have no fallback plan.
- **Claims never expire.** `in-progress` is a label. If a session dies mid-build, the issue stays claimed forever and nobody else will touch it.
- **Research has no exit.** Research issues (#17 to #21) say what to look into but not what "done" is or which build they feed. Research can run forever or stop short.

### Where work could duplicate

- **Two builders, one label.** The daily session and the `claude.yml` Action both start from `up-next`. Adding a label is not a lock: two runs that start minutes apart can both see an unclaimed issue. Issue #31 already carries both `up-next` and `in-progress`, which is the state where this goes wrong.
- **Parallel sessions collide on shared files.** Every PR adds to the top of `docs/build-log.md`. With five sessions today, every merge after the first one needs a rebase. (Fix adopted: one file per entry, see Ship.)
- **No check for "do we already have this?"** Nothing asks a new idea to search open issues or `content/` first.

### Where work could drift from the charter

- **Scores live in Duet's head.** The charter says to score ideas, but the scores are not written down anywhere public, so nobody can check why one idea beat another.
- **Issues do not say who they help or what they should move.** Without that, it is easy to build what is interesting to build instead of what residents need.
- **The charter's "connect, don't compete" rule has no check.** Nothing asks whether a new page points people to the organization doing the work.

### Where work could ship at low quality

- **The author is the only reviewer.** The same agent writes the change, checks its own PR checklist, and merges it. The checklist is ticked by hand, so it proves only that the box was ticked.
- **Automated checks cover data, not experience.** `npm run check-content` catches missing sources, bad dates, and em dashes in calendar entries. `npm run build` catches broken code. Nothing checks accessibility, mobile layout, reading level, neutrality, or whether a page is confusing.
- **Review is explicitly non-blocking.** PR #29 says Duet reviews content "when it next runs" and that review never blocks a merge. On a public civic site, a wrong phone number for a crisis line, a slanted sentence, or a page a screen reader cannot use can do harm in the hours before a fix-forward lands.

### Where work could go unmeasured

- **The scoreboard does not exist yet.** The first build log entry says "no measurements yet." The Findability scout is starting it now.
- **Builds are not tied to a metric.** A build log entry says what shipped, but not which number it should move or when someone will check.
- **Nobody looks back.** There is no step where an agent asks "what did last week's work actually change?"
- **The pipeline itself is not measured.** We do not know how long issues wait, how often merges get reverted, or how many follow-ups pile up.

### Risks of self-merging agents with no review

1. **Errors compound.** An agent that misreads a source will also misjudge its own check of that source. A second reader with a different job catches different mistakes.
2. **Prompt injection reaches production.** Issues, comments, and scraped web pages are untrusted text. An agent that reads them, writes code, and merges can be steered to publish something no one approved.
3. **Scope creep.** An agent can quietly change rules, workflows, or framing while doing something else. Path rules for `for:david` help, but only if the author notices.
4. **Trust cost is lopsided.** "Revert it later" is cheap for code and expensive for trust. The charter says one wrong or slanted item can undo months of work.
5. **Speed hides drift.** Many small self-merged PRs a day are hard for David to skim. Problems show up as a pattern, not in any single PR.

The fix is not to slow everything down. It is a cheap, automatic review on the things residents see, a written score for ideas, and a weekly look back.

## Part 2: The improved pipeline

Eight stages. Each one has an owner, an artifact, a label, and a gate to pass before the next stage.

| # | Stage | Who runs it | Artifact | Label after | Gate to move on |
|---|---|---|---|---|---|
| 1 | Intake | Duet, any agent, residents (issue form), David | GitHub issue | `idea` | Searched open issues and `content/` for duplicates |
| 2 | Scoring | Duet | Score comment on the issue | `for:code` or `for:duet` | Scored, and not blocked by an autonomy limit |
| 3 | Spec | Duet (Claude Code may refine) | "Done looks like" in the issue | `up-next` | Spec has all five parts (below) |
| 4 | Build | Claude Code (daily session or Action) | Branch and PR | `in-progress` on the issue | Checks pass: `check-content`, `build` |
| 5 | Review | `claude-review.yml` (automatic) | One review comment with scores | none (a check result) | No blockers |
| 6 | Ship | The PR author | Squash merge, build log entry | issue closed | Review passed, checklist done |
| 7 | Measure | Claude Code (Findability scout lane) | Scoreboard row | none | Check date set in the build log entry |
| 8 | Retrospective | Weekly scheduled agent | `docs/process/retros/<date>.md` | `type:process` on proposals | Proposals go to David |

### 1. Intake

Anyone can add an idea as an issue: Duet from its sweeps, any Claude session that notices a gap, residents through the "Suggest a resource" form, and David.

- New ideas get the `idea` label (it already exists).
- Before filing, search open and closed issues and `content/` for the same thing. If it exists, comment on that issue instead.
- An idea that needs an outside contact, money, an account, public alerts, or anything partisan goes straight to `for:david`. It is not scored.

### 2. Scoring

Duet scores every `idea` within a day and posts the score as a comment, so the ranking is public and can be checked. One idea, one comment, in this exact format so a script can read it later:

```
Score: 3.9
People 4 | Amplifies 5 | Evidence 3 | Effort 4 | Risk 3
Why: one or two sentences.
```

Each factor is 1 to 5, and higher is always better:

| Factor | 1 | 3 | 5 |
|---|---|---|---|
| **People** helped | A handful of people | A neighborhood or a specific group | Most of the county, or the people with the most need |
| **Amplifies** existing work | We would be doing it alone | Mentions local groups | Sends people straight to a local group's own program or sign-up |
| **Evidence** of need | A hunch | One source or one findability test shows the gap | Several tests, resident feedback, or partner request |
| **Effort** (inverted) | Weeks, new infrastructure | A few days | One session |
| **Risk** (inverted) | Touches trust-sensitive info with weak sources | Normal content with good sources | Little that could go wrong |

**Score = (2 x People + 2 x Amplifies + Evidence + Effort + Risk) / 7**, rounded to one decimal.

People and Amplifies count double because they are the mission. Effort and Risk count once so that small, safe work does not crowd out important work.

Two hard rules sit on top of the number:

- **Risk 1 never ships without David.** It becomes `for:david` no matter the score.
- **Evidence 1 cannot be `up-next`.** Do a findability test or a research issue first.

**Where the scored backlog lives:** in GitHub issues, nowhere else. The score comment is on each issue. The ranked view is the issue list filtered by `for:code` and sorted by score. The weekly retrospective prints the top 10 so the order is visible in one place. Notion keeps only private reasons (for example, a partner conversation behind an Evidence score).

### 3. Spec

Before Duet adds `up-next`, the issue must answer five questions. The existing Task issue form has room for all of them under "Done looks like":

1. **Who it helps** and the question they are trying to answer.
2. **Done looks like:** what a resident can do afterward that they could not do before.
3. **The metric it should move** (a scoreboard row or findability question) and **when to check it** (7 or 30 days).
4. **Which rubrics apply** (see the review gate below).
5. **Which local groups it points to.**

A spec that is missing any part stays `for:code` without `up-next`. Only one issue at a time may carry `up-next` per builder, which also limits double builds (see Build).

### 4. Build

The builder (the 6:41 AM session or the `claude.yml` Action):

- **Claims with a comment, then re-checks.** Add `in-progress`, post a claim comment, wait a few seconds, then reread the issue. If an earlier claim comment from another run exists, stop. The earliest claim comment wins. This turns the label race into a rule anyone can check.
- **Claims expire after 24 hours with no linked PR.** Anyone may remove a stale `in-progress` with a comment saying so.
- **Work in progress limit:** at most one open build PR per builder, and at most three open self-merge PRs total. Finish or close before starting more.
- **Runs the local checks** (`npm ci && npm run check-content && npm run build`) before opening the PR.
- **Adds a build log entry in the PR** as a new file (see Ship), including the metric and check date from the spec.

### 5. Review gate

Anything residents see or use gets an automatic review before merge. The workflow is [`.github/workflows/claude-review.yml`](../../.github/workflows/claude-review.yml).

**When it runs.** On every non-draft PR from this repo, when it is opened, marked ready, or gets new commits. A first step checks the changed files. Claude runs only if `site/` or `content/` changed; otherwise the check passes in seconds at no cost. PRs that only change docs, workflows, or rules do not need it: those already go to David or carry no resident-facing risk. Each new push cancels the review still running for the old one.

**Who reviews.** One Claude run that wears six hats, one per rubric written by the Design reviewer session:

| Reviewer | Rubric | Looks for |
|---|---|---|
| Accessibility | [`docs/rubrics/accessibility.md`](../rubrics/accessibility.md) | Screen readers, keyboard use, contrast, text size, phones |
| Interface and interaction | [`docs/rubrics/interface-and-interaction.md`](../rubrics/interface-and-interaction.md) | Can a person do the task, links and buttons that work and say where they go |
| Visual design | [`docs/rubrics/visual-design.md`](../rubrics/visual-design.md) | Clear hierarchy, consistent look, works on small screens |
| Information architecture | [`docs/rubrics/information-architecture.md`](../rubrics/information-architecture.md) | Can people find it, does it fit where it sits, names people would search for |
| Plain language | [`docs/rubrics/plain-language.md`](../rubrics/plain-language.md) | 8th grade reading level, short sentences, no jargon, no em dashes |
| Trust and civic ethics | [`docs/rubrics/trust-and-civic-ethics.md`](../rubrics/trust-and-civic-ethics.md) | Sources and dates, neutrality, privacy, official sources for civic actions, points to the group doing the work |

One run with six hats costs about one sixth of six separate runs and still reads the diff once per rubric. If a rubric file is missing, the reviewer says so and uses the charter's guardrails for that area instead.

**Which rubrics apply to which changes** (so a data-only change does not pay for a visual review):

| What changed | Rubrics that apply |
|---|---|
| `content/` only | Plain language, Trust, Information architecture |
| `site/src/pages`, `components`, `layouts`, styles | All six |
| `site/scripts`, `site/src/lib`, config only | Trust (are the data and links still right?) |

Rubrics that do not apply are listed as "not reviewed" so nobody mistakes silence for a pass.

**How it scores.** The reviewer uses the rubrics exactly as written: every criterion scored 0 to 3 (or N/A), an average per rubric, and each rubric's own pass bar (see [`docs/rubrics/README.md`](../rubrics/README.md)). It scores only what this PR adds or changes, not the whole site.

The first full site review found that no rubric passes yet. So the gate does not ask "does the site pass?" It asks "**did this PR make anything worse, or add something broken?**" That keeps "ship and fix forward" for everything except real harm.

| What the reviewer finds in the changed parts | What happens |
|---|---|
| A criterion at **0** that this PR adds or causes | **Blocker.** Fix before merge |
| A rubric's **"must reach 2"** criterion below 2 because of this PR (A1 to A4, II1, IA1, PL1, PL2, TR1, TR3, TR4) | **Blocker.** Fix before merge |
| A visible break of a `CLAUDE.md` rule, such as an em dash | **Blocker.** Fix before merge |
| A criterion at 1 that this PR adds, or a rubric under its pass bar in the changed parts | **Follow-up.** Open an issue before merging |
| A problem that was already on the site before this PR | Noted with its existing issue number, if any. Not a blocker, not a new issue |
| Scores of 2 or 3 | Nothing to do. Suggestions stay in the comment |

The comment shows a table with each rubric, its average for the changed parts, whether it meets the pass bar, and the criteria that drove the result.

**What the gate does not do.** It reads the diff and the built pages in the repo. It does not open a browser, so it cannot measure contrast, focus order, or real phone layout. Those need the full Playwright review in [`docs/rubrics/README.md`](../rubrics/README.md), which the Design reviewer lane runs on a schedule and after big changes. The gate says "not checked here" for criteria it cannot judge from code, instead of guessing.

**What the author does with the result.**

- **Pass:** merge. Then open one follow-up issue for each follow-up, labeled `for:code`, `type:design`, and `idea`, naming the rubric criterion (for example "PL1") and linking the review comment. Duet scores them like any other idea.
- **Blocked:** fix and push. The review runs again on the new commit and updates the same comment. If the author thinks a blocker is wrong, it does not override the check. It labels the PR `for:david` and says why.
- **Review did not finish** (timeout or error): re-run the check once. If it fails again, label `for:david`.

**How to keep it cheap.**

- Claude runs only when `site/` or `content/` changed, and only on non-draft PRs.
- Only the rubrics that apply to the files changed.
- One run with six hats, not six runs.
- Cancel the old review when a new commit lands.
- A turn limit and a timeout on the job.
- One comment per PR, edited in place on re-runs, so the thread stays short.
- Review the diff, not the whole site.

**A soft gate to start (decided by David, 2026-10-28).** The check turns red when it finds a blocker, but it is not a required check on `main`. The gate is a rule agents follow: for any PR that changes `site/` or `content/`, wait for "Claude review" and do not merge while it is red. The weekly retrospective reports any PR merged with a red or missing review. If that happens, the retro can propose making it a required check (a repo setting, David's call).

One thing to verify now that PR #32 is merged: GitHub does not start other workflows for PRs opened with the default Actions token. If the `up-next` Action opens PRs that way, neither the Site check nor this review will run on them. The Claude GitHub App token avoids this, so the first Action-built PR should be checked for both runs.

### 6. Ship

The author merges with a squash merge once the review passes and the PR checklist is done. The build log entry already in the PR records the metric and the date to check it.

**The build log is one file per entry (decided by David, 2026-10-28).** Entries live in [`docs/build-log/`](../build-log/) as `YYYY-MM-DD-HHMM-<short-name>.md` (UTC time), so parallel sessions never edit the same file. Each file has one `# YYYY-MM-DD: Title` heading and the same four bullets as before: Considered, Chose, Shipped, Scoreboard. Newest first is reverse file name order. The time keeps several entries on one day in order. [`docs/build-log.md`](../build-log.md) stays as a short pointer so old links still work.

### 7. Measure

- The Findability scout lane owns [`docs/scoreboard.md`](../scoreboard.md) and the findability tests in `content/findability/`.
- Every build log entry names the scoreboard row or findability question it should move and a check date.
- On the check date, the measuring agent re-runs that test and adds a line to that entry's file: "Checked YYYY-MM-DD: moved from X to Y" or "no change."
- Measurement follows the charter: aggregate counts only, no tracking of individuals.

### 8. Weekly retrospective

Once a week (Monday morning, as its own scheduled Claude Code session, decided by David on 2026-10-28), an agent writes `docs/process/retros/YYYY-MM-DD.md` and opens it as a PR. It reads:

- Build log entries from the last 7 days in `docs/build-log/`
- `docs/scoreboard.md` and any check-date results that came due
- Merged and closed PRs, review comments from `claude-review.yml`, and reverts
- Open issues: `up-next`, `in-progress`, `for:david`, and follow-ups from review

It writes these sections, in plain language:

1. **What shipped** and the metric each one was meant to move.
2. **What worked:** builds that moved a number, ideas whose score turned out right.
3. **What did not:** reverts, blockers, metrics that did not move, scores that were wrong.
4. **Pipeline health numbers:**
   - Days from `up-next` to merge (median)
   - Share of reviewed PRs blocked, and the top three blocker reasons
   - Follow-up issues opened and closed
   - Reverts
   - Oldest `for:david` item and its age
   - Stale `in-progress` claims
   - PRs that changed `site/` or `content/` and merged with a red or missing Claude review
   - Duplicate or colliding builds
5. **Stop doing:** at least one thing, with evidence.
6. **Top 10 backlog by score.**
7. **Process changes to propose:** at most three, each with the problem it fixes, the evidence, and how we will know in two weeks if it worked.

The retro itself is a log entry and can be self-merged. Any process change it proposes is a separate PR (see below).

## Part 3: How the process improves itself

- **Any agent may propose a process change.** It opens a PR that edits this page or `COORDINATION.md`, labeled `for:david` and `type:process`. It states the problem, the evidence, and the test.
- **Only David merges process changes.** This is already the charter's rule for `CLAUDE.md`, `COORDINATION.md`, and repo settings. It extends to this page and to `.github/workflows/`.
- **Changes are trials.** Each adopted change gets a two-week check in the retrospective: keep it, change it, or drop it.
- **Small, few, and measured.** At most three proposals a week, so David is not buried. The pipeline health numbers above are the evidence.
- **Rubrics improve the same way.** If a rubric blocks things that should not be blocked, or misses something that hurt residents, the retro notes it and the Design reviewer lane updates the rubric.

## Labels this page uses

Existing: `idea`, `for:code`, `for:duet`, `for:david`, `up-next`, `in-progress`, `blocked`.

New, if adopted: `type:process` (a change to how we work; always `for:david`).

## Decisions so far

David answered the open questions on 2026-10-28:

1. **Soft gate first.** The Claude review is a rule agents follow, not a required check. The retrospective watches for PRs merged around it.
2. **A scheduled Claude Code session runs the weekly retrospective**, every Monday morning.
3. **One file per build log entry** in `docs/build-log/`.
