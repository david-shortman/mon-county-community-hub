# Proposal: make the verification methods rules (for David)

Sprint wave 15 (#529) wrote the research and freshness methods as playbook files and built checks that **warn**. Turning them into rules, or making the checks **block** a merge, changes `CLAUDE.md`, `docs/COORDINATION.md` and the merge gate, so each one is David's call. This page lists each change, the exact words proposed (links in the quotes are written for the file they would go in), and what it would cost. Nothing here is in force until David says yes.

## 1. Point every session at the methods (`CLAUDE.md`)

Add under "Must-follow rules", after "Cite a source URL and a last-verified date for every resource":

> - **Source by the playbook.** Find sources with [`docs/playbook/research-method.md`](docs/playbook/research-method.md) and pick them by [`docs/playbook/source-order.md`](docs/playbook/source-order.md): the owner's own page first, news only for a one-time event, directories only to find the owner. When you move a source's `checked` date, add a `quote` copied from the page ([`docs/playbook/reread-proof.md`](docs/playbook/reread-proof.md)).

Why: #1096 asked for agent instructions to point at the research playbook, and the source order and proof of a re-read only help if every session knows them. Cost: none.

## 2. The blind second check as a rule (`docs/COORDINATION.md`)

Add to "Rules of the road", as item 10:

> 10. **High-stakes content gets a blind second check before merge.** A PR that adds or changes a top-tier record (topic `health`, `money`, `housing`, `family`, `taxes` or `voting`, or any `calendar/` entry) waits until a different session posts a confirmed "Second check" table on it ([`docs/playbook/second-check.md`](playbook/second-check.md)). `scripts/safe-merge.sh` refuses it until `node site/scripts/second-check.mjs verdict --pr <number>` passes. Hiding a record does not wait.

Why: you chose this on #97 (October 30). It is written down (#1367) and the tools exist (#1833), but nothing makes it happen: of the last 25 merged PRs, 4 changed top-tier records and none had a confirmed second check. Cost: no money; one more short session for each top-tier PR (about 4 in 25 recently), from the same session budget.

## 3. Make the checks block

| Change | What it does | Cost |
|---|---|---|
| `safe-merge.sh` runs the second check verdict for PRs that change `content/` | A top-tier PR cannot be merged by script without a confirmed table | Needs `npm ci` in `site/` before merging (sessions already run it). The fake `gh` in `scripts/test/pr-wait.test.sh` gets one more case |
| `npm run check-content` runs `check-reread.mjs --strict` | A PR that moves a `checked` date with no quote, call or feed fails the build | Every content PR adds a short quote per re-read source. About 16 moved dates in the last 40 commits would have needed one |

If you say yes to item 2 or 3, the code lands in a follow-up PR labeled `for:david`, with tests.

## 4. Cards follow the fact windows (resident-facing)

Cards say "may be out of date" by the risk tier today (90 days for high-stakes, 6 months for the rest). [`freshness-by-fact.md`](../playbook/freshness-by-fact.md) (#1093) sets shorter windows for hours (90 days) and for events about to happen. Moving cards to them would show the note on more cards sooner, and About, Hard questions and How we check would say so. Cost: none in money; more re-reads to keep cards current (about 70 more by the end of January).

## What David should check

- [ ] Item 1: the `CLAUDE.md` sentence, as written or edited
- [ ] Item 2: the `COORDINATION.md` rule, as written or edited
- [ ] Item 3: which checks should block (either, both or neither)
- [ ] Item 4: whether cards should follow the fact windows
