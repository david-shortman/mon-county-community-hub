# 2026-10-28: The chronicle, starting with day one

- **Considered:** leaving the project's history in PRs and issues only, versus a public record with pictures that a resident, a reporter, or the next AI session can read in five minutes.
- **Chose:** a chronicle in `docs/chronicle/`: daily snapshots of the live site and project numbers, a running timeline, and short dispatches.
- **Shipped:** the [day one dispatch](../chronicle/2026-10-28-day-one.md), the first snapshot (12 screenshots at phone and laptop width in light and dark mode, a 14 second walkthrough video, and `snapshot.json` with issue, PR, commit and calendar counts, about 1.3 MB), a seeded [timeline](../chronicle/timeline.md), and `site/scripts/chronicle.mjs` to repeat it for any date. A separate PR for David proposes running it daily in GitHub Actions.
- **Scoreboard:** no change. This records state; it does not measure findability.
