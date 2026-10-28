# 2026-10-28: Decisions one file each, and rules to avoid merge conflicts

- **Considered:** the merge conflicts that hit almost every PR today. Counting edits on `main` showed the hotspots: `docs/build-log.md` (14 PRs) and `docs/decisions.md` (12), then shared guides and indexes (3 to 4 each).
- **Chose:** the same fix the build log got in #34: a folder with one file per entry, plus written rules so new shared files do not become hotspots.
- **Shipped:** all 18 decisions moved to `docs/decisions/` with the same naming as the build log; `docs/decisions.md` is now a pointer with the format. Two new decisions: Agent HQ in Notion, and this change. A new "Avoiding merge conflicts" section and a "Which channel to use" table in `docs/COORDINATION.md`, a matching rule in `CLAUDE.md`, and updated paths in the chronicle workflow prompt.
- **Scoreboard:** no resident-facing change. Pipeline measure for the weekly retro: PRs needing a conflict fix should drop to near zero. Check 2026-11-02.
