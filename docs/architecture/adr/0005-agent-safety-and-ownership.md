# 0005: Folder ownership, contracts between layers, and no shared append points

Status: proposed, 2026-10-28

## Context

Several Claude sessions build in parallel, each merging its own PRs. On day one this already caused merge conflicts, because every PR adds to the top of `docs/build-log.md` and `docs/decisions.md`. As the code grows, shared lists (like the feed adapter array in PR #53) and cross-lane refactors will cause more. Agents also need clear limits on which changes are safe to make alone.

## Decision

1. **Ownership by folder.** Each folder has one owning lane, listed in `docs/architecture/README.md`. When `packages/` exists, a `CODEOWNERS` file mirrors the list so GitHub shows it on PRs. An agent edits only its lane. For changes elsewhere, it opens an issue for the owner.
2. **Contracts between layers.**
   - The content schemas (ADR 0001) are the contract between people who add data and code that reads it.
   - `/api/v1/` (ADR 0003) is the contract between the data build and every surface.
   - Changing a contract in a breaking way needs a new ADR and a version bump.
3. **Generated files are marked** with a header saying what made them and how to rebuild them, and are never edited by hand.
4. **No shared append points.** Things that grow (adapters, apps, records, log entries) are found by listing a folder, not by adding a line to one shared file. This fits the coordinating session's plan to move build log and decision entries to one file per entry. ADRs already work this way.
5. **Same naming for one-file-per-entry logs.** `YYYY-MM-DD-<slug>.md` for build log and decision entries. ADRs keep a number: `NNNN-<slug>.md`.
6. **Schema validation blocks merges.** Bad data never reaches residents, whoever wrote it.

## Consequences

- Good: parallel sessions rarely touch the same lines. Reverting one lane's mistake does not undo another's work.
- Good: an agent can tell from the path alone whether a change is its to make.
- Cost: cross-lane improvements are slower, since they go through issues.
- The `CODEOWNERS` file is a repo file, not a setting, so it is safe to add. Making owner review required would be a setting, so that stays with David.
- This record does not change `CLAUDE.md` or `docs/COORDINATION.md`. If the lanes become permanent rules, that change goes to David.
