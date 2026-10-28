# Chronicle

The project's photo album and memory. It shows what the site looked like, what the numbers were, and what happened, day by day. It is written for curious residents and reporters, and for the AI sessions that pick up the work tomorrow.

## What is here

| Part | Where | How often |
|---|---|---|
| **Daily snapshots** | `snapshots/YYYY-MM-DD/` | Every day, after the site deploys |
| **Weekly dispatches** | `YYYY-MM-DD-<slug>.md` (dated the last day of the week) | Every week |
| **Milestone stories** | `YYYY-MM-DD-<slug>.md` | When something big happens (a launch, a first real user, a partner) |
| **Timeline** | [`timeline.md`](timeline.md) | One line per notable event, added as it happens |

Dispatches so far:

- [2026-10-28: Day one](2026-10-28-day-one.md)

### A daily snapshot

Each `snapshots/<date>/` folder holds:

- Screenshots of every live page at phone width (390px) and laptop width (1280px), in light and dark mode. Named `<page>-<width>-<theme>.webp`.
- `walkthrough.mp4`: a short phone-size video (under 30 seconds) clicking through the site.
- `snapshot.json`: the numbers for that day. Issues and PRs opened, closed and merged, totals, open items by label, commits to main, calendar entries, what is waiting on David, and which sessions were running.

Days are UTC days, to match GitHub. A day's folder should stay under about 5 MB.

## Making a snapshot

```sh
git fetch origin main
node site/scripts/chronicle.mjs                      # today: screenshots, video, stats
node site/scripts/chronicle.mjs --date 2026-11-02 --stats-only   # stats for a past day
node site/scripts/chronicle.mjs --sessions sessions.json         # also record running sessions
```

Needs Node 22, Playwright (`require('playwright')` must work), and `gh` signed in. With ffmpeg you get WebP and MP4; without it, JPEG and WebM. Running it again for the same date replaces the screenshots and keeps the recorded sessions unless you pass new ones.

`sessions.json` is a list like `[{"role": "Builder", "kind": "Claude Code session", "lane": "..."}]`. Record roles and lanes only, never anything about a person.

## Writing a dispatch

- Use the public record as the source: [decisions](../decisions.md), the [build log](../build-log.md), merged PRs, issues, and the snapshots. Link to each one.
- Plain language, about an 8th grade reading level. No em dashes. No hype.
- Say what did not happen too. "No resident has used this yet" is part of the story.
- Embed a few screenshots from the snapshot folder with relative paths and a `width` so phone shots stay small.
- Never name or describe private individuals. Organizations and public offices are fine when the public record already names them.
- Add a line to the timeline for the dispatch itself.

## How agents should use this

Treat the chronicle as project memory:

- **Starting a session:** read the last dispatch and the bottom of the timeline to catch up fast.
- **Before claiming something changed:** compare `snapshot.json` across days instead of guessing. The screenshots show what residents actually saw.
- **After shipping something notable:** add one line to `timeline.md` with a link, in the same PR.
- **For measurement:** the snapshots are not the scoreboard. They are a record of state. The findability score lives in `docs/scoreboard.md`.

## Storage

Each day adds about 1.3 MB. That is fine for a while, but it adds up to roughly 500 MB a year on `main`, which would make every clone slow. See the automation proposal for the plan to move daily images to a separate `chronicle` branch, keeping only dispatch images and `snapshot.json` on `main`.
