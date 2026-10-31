# Plan: a community pulse, refreshed a few times a week

A plan for #258: one page where anyone, from a neighbor with an hour free to the mayor, can see what is happening in Mon County right now and where help is thin. This is a plan only. The build work is in the follow-up issues listed at the end.

## What it is

A page at `/pulse/` called **This week in Mon County**. It shows what is coming up, what changed since last week, and gaps we have evidence for, sorted by the life areas on the site (the doors in `content/doors.yaml`, from #222). It rebuilds every day with the site, so it is never more than a day old, and it says when it was last updated.

It sits on top of the slower pages: [How is Mon County doing?](../../site/src/pages/how-we-are-doing.astro) (#62, #15) for yearly and monthly numbers, and the needs register (#44) for ranked problems.

## Use what we already read

Almost everything the pulse needs is already read by the daily build (`site.yml` runs every morning, and the build fetches feeds, meetings and live numbers, falling back to the last saved copy if a source is down). Cost: $0.

| Section | Source we already read | How fresh | Owner |
|---|---|---|---|
| **Coming up this week:** events, deadlines | Calendar records (`content/calendar/`) and live feeds (`site/src/lib/feeds/adapters/`: city, county, library, arts center, farmers market, food bank, Mylan Park) | Daily build | The build, no AI |
| **Public meetings and what is on the agenda** | City Agenda Center and County Commission pages (`site/src/lib/meetings/`) | Daily build; `npm run update-meetings` prints what is new | The build; Duet notes newly posted agendas |
| **Ways to help:** cleanups, adopt-a-spot, boards with open seats | `make-it-better` pages and their records; `content/boards/` | When records change | Lane that owns Make it better |
| **Where help is thin** | `content/gaps/*.yaml` (each gap has a checked date), shown today in the Help wanted box | When a gap is checked | Lane that owns each gap file |
| **Problems people report to the city** | Morgantown 311 big-picture totals (#881). The API refuses our cloud sandbox, so a person runs the Actions job by hand and copies totals in through a PR | When someone runs it | Duet, per David's rule on #300 (a few totals, credited "Data from SeeClickFix, Morgantown 311.") |
| **Slow numbers:** unemployment, health measures | `site/src/lib/live-indicators/`, `content/indicators/` | Monthly or yearly | The build; `indicators.yml` monthly |
| **What changed on this site** | `content/corrections/`, new pages (from `docs/build-log/`) | Daily | The build |
| **Jobs and training** | Where employers post jobs (`/find-a-job/`) | When records change | Lane that owns Find a job |

We link to job boards; we do not list single job openings (the Find a job page says so). The pulse keeps that rule.

## Not yet: sources to look for

Each becomes a research issue before anything is built:

- **Volunteer asks** that local groups post publicly in a form we can read (a calendar feed or a public list). We do not copy third-party volunteer sites without their terms allowing it.
- **211 trends** for the county, if WV 211 publishes them. Data-sharing talks are already in #24 and are David's.

## Answers to the planning questions in #258

1. **Which sources, free and regular?** The table above. All are free and already read, except volunteer asks and 211 trends, which are research.
2. **How often, and who owns it?** The page rebuilds daily with the site. The sections are only as fresh as their sources, and each shows its own date. Duet looks at it on its weekly sweep and opens issues for anything stale. No new scheduled AI runs are needed.
3. **How to stay neutral.** Describe; never blame or rank. Show what a source says, with its date. No "worst," "failing," or "neglected." Never name a person. Never quote public comment from meeting minutes, since speakers are private residents. Count 311 reports by category only, never single reports or addresses.
4. **A mayor or a neighbor?** One page. The top half is for anyone: this week's events, meetings and ways to help. The bottom half, "Where help is thin," holds the gaps and the 311 totals, which are useful to people who run things. A second page would split the audience for no gain.
5. **How to show "not enough attention" fairly.** Only with evidence on file: a gap in `content/gaps/` with what we searched and when, a needs register entry with its sources, or a public total. If we have no evidence, the section says "Nothing on file yet" instead of guessing. A gap leaves the page when a checked source fills it.

## What the page never does

- Never ranks groups, neighborhoods or officials.
- Never says a number is good or bad, or claims the project changed one (the same rule as the live numbers).
- Never shows single 311 reports, names, or addresses.
- Never sends alerts. Turning on any alert is David's call.

## Follow-up issues

- `for:code`: build `/pulse/` version 1: coming up this week, public meetings, ways to help, where help is thin, and what changed on the site, by door, with a "last updated" date. All from data the build already has.
- `for:code`: in `update-meetings`, save which agenda items are new since the last saved copy, so the pulse can show "new on an agenda this week."
- `type:research`: free, public volunteer-ask sources in Mon County that we can read under their terms.

Nothing here needs money, accounts or outreach. If the 311 totals were ever run on a schedule instead of by hand, that would change how David's #300 rule works, so it would be a `for:david` question first.

Written October 31, 2026.
