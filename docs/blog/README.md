# Writing a blog post

How to write a post for the Everything Morgantown blog (`/blog/`). The plan is #1701, approved by the owner on 2026-11-03. The file format and the checks that run on every post are in [`content/blog/README.md`](../../content/blog/README.md).

Every post is its own PR labeled `for:david`. It goes live only when the owner merges it.

The automatic post checks this guide mentions are in #1726, which waits for the owner. Until it merges, check those rules by hand.

## The five kinds of post

Set `type` in the post's front matter to one of these.

| Type | What goes in it | How often |
|---|---|---|
| `week-notes` | What changed on the site this week, what we checked, what we got wrong and fixed, and what is next. Drafted by the Chronicle job from the week's merged PRs and build log. | Weekly |
| `how-it-works` | One part of how the site is made or kept right, explained for a curious resident: how a fact gets a checked date, what the High stakes check does, how a correction is made. | About every two weeks |
| `what-we-found` | Something the work turned up in the public record: a gap, two official pages that disagree, a broken page. Usually starts from a file in [`docs/discoveries/`](../discoveries/). | When there is one |
| `new-on-the-site` | A new page, tool or feed, and who it is for. Link it, and say what it does not do yet. | When one ships |
| `milestone` | A goal from the charter met or missed, with the number and where it came from. | Rarely |

## Where facts come from

Use the public record only, and link every claim to it:

- merged PRs and their reviews
- issues and their comments
- the build log ([`docs/build-log/`](../build-log/)) and decisions ([`docs/decisions/`](../decisions/))
- discoveries ([`docs/discoveries/`](../discoveries/))
- the scoreboard ([`docs/scoreboard.md`](../scoreboard.md)), saved runs and snapshots in `content/`

Never use private planning, Notion pages or anything not already public in this repo or on the site. If a fact is not in the public record, leave it out.

## Voice

- Short sentences, about an 8th grade reading level. The site's reading grade check runs on post pages too.
- Plain words. Say what happened, then why it matters to someone who lives here.
- Honest about what did not happen or did not work. Say so plainly, without excuses.
- No hype: no "exciting", "powerful", "game-changing" and the like.
- Do not describe the site's own writing style ("we write in plain language"). Show it instead.
- No em dashes. Use commas, colons, or separate sentences.

## People and organizations

- The owner is "the owner". Never use a name. The post check fails on the owner's first name.
- No private individuals, ever. No quotes from residents.
- Name organizations and public offices only when the public record names them. Describe what happened; never blame. "The county's page and the state's page give different hours" is fine. "The county got it wrong" is not.

## Neutral and common good

- No promotion of events, businesses, candidates, parties or causes.
- Describe, do not advocate. A post can say what a rule does and who made it. It never says what a rule should be.

## Numbers and dates

- Tie every number to a time: "in the week of November 2, 2026", or "as of" the post date. The post check fails on "now", "currently", "so far" or "to date" in a sentence with no date.
- Say where each number comes from, with a link.

## Details residents act on

Phone numbers, hours, addresses, amounts, income limits, deadlines and rules change. Never copy them into a post. Link the page on the site that keeps them current, and list that page under `pages` in the front matter. The post check fails on a phone number, hours, a dollar amount or an income limit in the text.

Crisis lines appear only as part of a link to a help page, never on their own.

## Corrections

A post is not rewritten after it goes up. To fix one, add a dated entry to `corrections` in its front matter, saying what was wrong and what changed. It shows at the top of the post and on [the Corrections page](https://everythingmorgantown.org/corrections/). Fix typos without a note.

## Proposing a post

Open an issue titled "Blog post: <topic>" with the `type:content` label. Write one paragraph on why it matters now, and link the public record it would draw on. Week notes need no issue; the Chronicle job drafts them each week.

## Before you open the PR

1. Name the file `content/blog/YYYY-MM-DD-<slug>.md`, with the date it should go up.
2. Run `npm run check-content` in `site/`. It runs the post checks.
3. Build the site and read the post page on a phone-width screen.
4. Open the PR, label it `for:david`, and link the issue or the week it covers.
