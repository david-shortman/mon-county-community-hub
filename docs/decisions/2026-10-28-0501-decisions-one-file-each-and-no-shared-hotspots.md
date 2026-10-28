# Decisions are one file each, and shared files are designed to avoid merge conflicts

- **Date:** 2026-10-28
- **Decided by:** David
- **Decision:** Decisions move to `docs/decisions/`, one file each, like the build log. Logs are folders of files; indexes link to folders instead of listing every file by hand; shared guides add new items in a fixed, sorted place instead of at the top; each shared file has an owning lane. See "Avoiding merge conflicts" in `docs/COORDINATION.md`.
- **Why:** In the first two days, `docs/build-log.md` and `docs/decisions.md` were edited by 14 and 12 PRs, and parallel agents hit merge conflicts on nearly every merge.
