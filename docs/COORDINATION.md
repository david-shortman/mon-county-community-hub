# How we work

This project has three contributors: David (the human in charge), **Claude Duet** (the always-on background partner), and **Claude Code** sessions (fast, hands-on build sessions David runs on his laptop). This page is the operating agreement between them. If something here stops working, change it here.

## Who does what

| | Best at | Typical work |
|---|---|---|
| **David** | Judgment, relationships, decisions, local knowledge | Sets direction, talks to real organizations, reviews only the PRs flagged `for:david` |
| **Claude Duet** | Persistence and background work | Look and think in the daily loop, review, the morning brief, routing feedback, ambassador support for David, small content PRs (details below) |
| **Claude Code** | Speed and direct power on the machine | Build and measure in the daily loop: the site, data pipelines, bulk content work, tooling, CI, the scoreboard, anything that needs a long focused session |

Rule of thumb: if it needs to happen **while David is away**, it is Duet's. If it needs **a lot of code or files at once**, it is Claude Code's. If it **changes direction or goes public in a new way**, it is David's call.

## Claude Duet's role

The charter's daily loop is split between the two Claudes. Duet does **look and think**. Claude Code does **build and measure**. Both write the log.

On top of that, Duet does five jobs:

1. **Look and think.** Watch local sources for changes, research open questions, keep the landscape map current, and rank ideas using the charter's scoring. The best ideas become issues labeled `up-next`.
2. **Review.** Be a second set of eyes before things spread. Check new or changed content for accuracy (a source and a checked date for every fact), neutrality, plain language, and privacy. Problems become comments on the PR or new issues.
3. **Digest.** Turn the public build log and the Activity log into a short morning brief for David: what changed, open `for:david` items, and what is next.
4. **Feedback.** Catch community feedback and corrections as they come in and turn each one into an issue, so nothing gets lost.
5. **Ambassador support.** Help David with the people side of the project. Duet drafts outreach for him, preps him before partner conversations, and keeps track of where each relationship stands.

**Duet never contacts anyone outside the project.** Every draft waits for David's yes, and David is the one who sends it. Notes about relationships, contacts, and outreach plans stay in the private Notion home, never in this repo.

## The three shared surfaces

Nothing important lives only inside one chat. Every contributor can read and write all three of these.

1. **GitHub issues: the work queue.** Every piece of work bigger than a few minutes is an issue. Labels say who it is for.
2. **GitHub repo: the public output.** Site code, structured resource data, and public docs. Everything here is world-readable.
3. **Notion home: the private thinking and the journal.** Mission drafts, brainstorm, landscape notes, open questions, and the Activity log. [Notion home](https://app.notion.com/p/40717805570781abbde2e8c1975f5f94)
4. **Agent HQ in Notion: the agents' own space.** Each agent role has a notebook (its page in the Agent Directory) for working memory and notes to its next run, there is a shared **Forum** for proposals, questions, heads-ups, handoffs, decision requests, and standups, and a shared **Learnings** list of lessons with evidence. [Agent HQ](https://app.notion.com/p/4071780557078180b8c2ef64006413af)

### Which channel to use

| Need | Channel |
|---|---|
| Something to build, research, or decide | A GitHub issue with the right label |
| The public record of what shipped and why | The PR and its build log entry |
| A discussion that is not work yet, or a question for another agent | A Forum post in Agent HQ, linked to any related issue |
| Your own memory between runs | Your notebook in the Agent Directory |
| A lesson others should know | A Learnings entry with evidence |
| Something time-sensitive between Claude Code sessions running right now | A direct message (`send_message`), then record the outcome on the issue or in the Forum |
| Anything that needs David | A `for:david` issue, plus a Forum post of Type "Decision request" |

Scheduled Claude Code runs and GitHub Actions cannot reach Notion. They write to GitHub, and Duet copies what matters into the Forum, notebooks, and Activity log on every sweep.

### Public vs private

The repo is public. Before anything is committed, ask: would we be comfortable with anyone in the county reading this?

- **Repo (public):** verified resources with sources, site code, schemas, public decisions.
- **Notion (private):** half-formed ideas, notes about specific people or conversations, strategy, outreach plans, anything unverified.
- **Never anywhere:** secrets or API keys, private individuals' personal information.

## Labels

| Label | Meaning |
|---|---|
| `for:david` | Needs a decision, approval, or a human contact |
| `for:duet` | Background or recurring work Duet should pick up |
| `for:code` | Build work for a Claude Code session |
| `type:research` | Find out what exists or what is true |
| `type:content` | Add or update resource entries |
| `type:build` | Site, tooling, data pipeline |
| `type:decision` | A choice to make; close it with the decision recorded |
| `up-next` | Ranked and ready to build. Duet adds it after look and think; Claude Code picks from the top |
| `in-progress` | Someone has claimed it (see the claiming rule) |
| `blocked` | Waiting on something; say what in a comment |

## Rules of the road

1. **Claim before you start.** Add `in-progress` and comment who has it (`Duet`, `Claude Code`, or `David`). Do not work on an issue someone else has claimed.
2. **Branches and PRs, never straight to `main`.** Duet uses `duet/<short-name>` branches, Claude Code uses `code/<short-name>`. The author merges its own PR (squash merge) once the PR checklist passes, unless it falls under "When a PR waits for David" below. To merge from the command line: `gh api -X PUT repos/david-shortman/mon-county-community-hub/pulls/<number>/merge -f merge_method=squash` (`gh pr merge` does not work in cloud sessions).
3. **Link everything.** PRs say `Closes #N`. Activity log rows link to the PR or issue.
4. **Log at the end of every session.** One row in the Notion Activity log: What, Type, Who, Date, Link. Who is `David`, `Duet`, or `Claude Code`.
5. **Decisions get written down.** Small ones: an Activity log row with Type `Decision`. Ones that shape the repo: also a new file in [`docs/decisions/`](decisions/) (format in [`docs/decisions.md`](decisions.md)).
6. **Cite sources and dates.** Every resource entry has a source URL and a last-verified date.
7. **Neutral and common-good.** No advocacy for candidates, parties, or businesses. Describe, do not promote.
8. **No em dashes** in any writing.
9. **Low or no cost first.** Look for free or low cost options first and say what each proposal would cost (see "Guardrails" in the charter).

## Avoiding merge conflicts

Many agents work at once, so files that everyone edits cause conflicts on almost every merge. Design shared files so that two PRs rarely touch the same lines:

1. **Logs are folders, one file per entry.** The build log is [`docs/build-log/`](build-log/) and decisions are [`docs/decisions/`](decisions/). Name files `YYYY-MM-DD-HHMM-<short-name>.md` (UTC). Never add entries to the old single files; they are pointers now.
2. **Indexes link to folders instead of listing every file by hand.** A README can describe what a folder holds and point to it. If a list is truly needed, generate it with a script in CI rather than editing it in each PR.
3. **New items go in a fixed, sorted place, not at the top.** In tables and lists that many PRs touch (labels, playbook files, rubrics), add rows in alphabetical order or at the end of the right section.
4. **Every shared file has an owning lane.** Rules files (`CLAUDE.md`, this file, the charter) belong to David. Lane files belong to their lane (see the Agent Directory in Agent HQ). To change another lane's file, open an issue or Forum post for its owner instead of editing it.
5. **Small PRs, merged fast.** Rebase on `main` right before merging. If a conflict is only two PRs adding entries, keep both.
6. **One change per shared file per PR.** Do not bundle unrelated edits to the same shared file.

When a new file starts collecting edits from many PRs, treat it as a bug: open an issue to split it into a folder.

## When a PR waits for David

We are incubating, so the default is to ship and fix forward. Bad merges get reverted, not prevented. A PR waits for David only if it:

- Changes these rules, `CLAUDE.md`, or repo settings
- Adds or changes anything to do with secrets, money, paid services, or outside accounts
- Deletes published content or a whole section of the site
- Speaks for the project to a specific outside person or organization (outreach, press, partnership language)
- Touches anything the author is unsure is public-safe
- Changes what residents see about shelter, crisis help, food or benefits: any page in the Help now or Get through this month door, any page with topic `housing`, `money` or `food` or that names a crisis line (988, 211, 911), the Food help pages, the crisis strip and crisis line parts, and any `resources/`, `orgs/` or `calendar/` entry with topic `housing`, `money` or `food` or that names a crisis line. The High stakes check labels these `for:david` on its own (`site/scripts/high-stakes.mjs`). One exception: taking down or hiding a wrong item does not wait. Merge that, say so in the PR, and David checks it after.

In those cases, add the `for:david` label to the PR and say what you need in the description. Everything else, merge it.

## How David hears from us

- **Duet's morning brief** is the one daily digest: what changed overnight, open `for:david` items, what Duet plans next.
- **Duet pings during the day** only for things that cannot wait.
- **Claude Code sessions** end with a short recap in the session and an Activity log row.
- **`for:david` issues** are the standing inbox. If it needs David, it becomes one of these.

## How Duet and Claude Code hand work to each other

Duet cannot be messaged directly by Claude Code, so most handoffs go through issues (and the Forum for discussion):

- Duet finds something that needs real build work: opens an issue with `for:code` and `up-next`, includes what it found, why it ranks high, and links.
- A Claude Code session looking for work starts with open `up-next` issues, then other `for:code` issues.
- Claude Code opens a PR with new or changed content: Duet reviews it when it next runs. Review never blocks a merge; problems found after a merge get fixed forward.
- A Claude Code session finishes something Duet should keep current (a new data section, a new source to watch): opens a `for:duet` issue describing the recurring job.
- Either one starting a session first checks open issues with its label and the last few Activity log rows.

## Starting a Claude Code session

1. `cd ~/mon-county-community-hub && git pull`
2. Read `CLAUDE.md` (Claude Code does this automatically).
3. Pick or get pointed at an issue with `for:code`, claim it.
4. Work on a `code/...` branch, open a PR.
5. Log a row in the Activity log.

### Using `gh` in a cloud session

`gh` works in cloud sessions, with three catches:

- **Ignore `gh auth status`.** It says the token is invalid even when `gh` works. The session's proxy adds the real credential to each request. Test with a real call instead, like `gh api repos/david-shortman/mon-county-community-hub --jq .full_name`.
- **Use `gh api` REST calls, not `gh pr ...` or `gh issue ...`.** Those commands use GraphQL, which cloud sessions block with an HTTP 403. `scripts/pr-wait.sh` and `scripts/safe-merge.sh` use REST only, so they work. The 403 message lists REST routes for auto-merge, review threads and draft status.
- **Start child sessions with the repo attached.** The proxy only adds credentials for repos attached to the session, so a child session started without this repo as its source gets refused.
