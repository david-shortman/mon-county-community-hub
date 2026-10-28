# How we work

This project has three contributors: David (the human in charge), **Claude Duet** (the always-on background partner), and **Claude Code** sessions (fast, hands-on build sessions David runs on his laptop). This page is the operating agreement between them. If something here stops working, change it here.

## Who does what

| | Best at | Typical work |
|---|---|---|
| **David** | Judgment, relationships, decisions, local knowledge | Sets direction, talks to real organizations, reviews only the PRs flagged `for:david` |
| **Claude Duet** | Persistence and background work | Scheduled sweeps of local sources, research threads, landscape map upkeep, keeping Notion current, morning brief, small content PRs |
| **Claude Code** | Speed and direct power on the machine | Building the site, data pipelines, bulk content work, tooling, CI, anything that needs a long focused session |

Rule of thumb: if it needs to happen **while David is away**, it is Duet's. If it needs **a lot of code or files at once**, it is Claude Code's. If it **changes direction or goes public in a new way**, it is David's call.

## The three shared surfaces

Nothing important lives only inside one chat. Every contributor can read and write all three of these.

1. **GitHub issues: the work queue.** Every piece of work bigger than a few minutes is an issue. Labels say who it is for.
2. **GitHub repo: the public output.** Site code, structured resource data, and public docs. Everything here is world-readable.
3. **Notion home: the private thinking and the journal.** Mission drafts, brainstorm, landscape notes, open questions, and the Activity log. [Notion home](https://app.notion.com/p/40717805570781abbde2e8c1975f5f94)

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
| `in-progress` | Someone has claimed it (see the claiming rule) |
| `blocked` | Waiting on something; say what in a comment |

## Rules of the road

1. **Claim before you start.** Add `in-progress` and comment who has it (`Duet`, `Claude Code`, or `David`). Do not work on an issue someone else has claimed.
2. **Branches and PRs, never straight to `main`.** Duet uses `duet/<short-name>` branches, Claude Code uses `code/<short-name>`. The author merges its own PR (squash merge) once the PR checklist passes, unless it falls under "When a PR waits for David" below. To merge from the command line: `gh api -X PUT repos/david-shortman/mon-county-community-hub/pulls/<number>/merge -f merge_method=squash` (`gh pr merge` does not work in cloud sessions).
3. **Link everything.** PRs say `Closes #N`. Activity log rows link to the PR or issue.
4. **Log at the end of every session.** One row in the Notion Activity log: What, Type, Who, Date, Link. Who is `David`, `Duet`, or `Claude Code`.
5. **Decisions get written down.** Small ones: an Activity log row with Type `Decision`. Ones that shape the repo: also a line in [`docs/decisions.md`](decisions.md).
6. **Cite sources and dates.** Every resource entry has a source URL and a last-verified date.
7. **Neutral and common-good.** No advocacy for candidates, parties, or businesses. Describe, do not promote.
8. **No em dashes** in any writing.

## When a PR waits for David

We are incubating, so the default is to ship and fix forward. Bad merges get reverted, not prevented. A PR waits for David only if it:

- Changes these rules, `CLAUDE.md`, or repo settings
- Adds or changes anything to do with secrets, money, paid services, or outside accounts
- Deletes published content or a whole section of the site
- Speaks for the project to a specific outside person or organization (outreach, press, partnership language)
- Touches anything the author is unsure is public-safe

In those cases, add the `for:david` label to the PR and say what you need in the description. Everything else, merge it.

## How David hears from us

- **Duet's morning brief** is the one daily digest: what changed overnight, open `for:david` items, what Duet plans next.
- **Duet pings during the day** only for things that cannot wait.
- **Claude Code sessions** end with a short recap in the session and an Activity log row.
- **`for:david` issues** are the standing inbox. If it needs David, it becomes one of these.

## How Duet and Claude Code hand work to each other

They cannot message each other directly, so they hand off through issues:

- Duet finds something that needs real build work: opens an issue with `for:code`, includes what it found and links.
- A Claude Code session finishes something Duet should keep current (a new data section, a new source to watch): opens a `for:duet` issue describing the recurring job.
- Either one starting a session first checks open issues with its label and the last few Activity log rows.

## Starting a Claude Code session

1. `cd ~/mon-county-community-hub && git pull`
2. Read `CLAUDE.md` (Claude Code does this automatically).
3. Pick or get pointed at an issue with `for:code`, claim it.
4. Work on a `code/...` branch, open a PR.
5. Log a row in the Activity log.
