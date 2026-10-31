# Merge conflicts on PRs

Several sessions open PRs at the same time, so a branch often falls behind `main`. When a PR's branch conflicts with `main`, **GitHub does not run any checks on it**: no build, no Claude review. Anything that waits for those checks waits forever.

## Every session that opens a PR

1. **Wait with the script, not a bare loop.** Run `scripts/pr-wait.sh <pr-number>`. It stops right away with exit code 2 if the PR has a conflict, and gives up after 25 minutes (exit code 3) instead of hanging.
2. **On a conflict, merge `main` into your branch:**
   ```
   git fetch origin main
   git merge origin/main
   ```
   Resolve each conflicted file, then run the same checks as before (`npm ci && npm run check-content && npm run build` in `site/` if the site changed), commit the merge, and push. Then run `scripts/pr-wait.sh` again. The review runs on the new commit.
3. **Never force-push or rebase a branch someone else is using.** A merge commit is fine; the PR is squash-merged anyway.
4. **After you merge, check `main`.** Run `scripts/pr-wait.sh main`. If main's Site run was cancelled because a newer merge landed, the script says "superseded" and follows the newest run, since that build includes your merge. Only a real build failure exits 1. Two PRs can each pass on their own and still break `main` when they land minutes apart. This happened on 2026-10-30: a new page (#313) and a rule that every page needs tags (#314) merged together, and the site stopped deploying.
5. **If `main` is red, fix it forward right away, but look first.** Check open PRs and the last few commits: another session may already be fixing it. On 2026-10-30 two sessions sent the same fix (#318, #319), which broke the build a second time until #320 removed the duplicate.

## Resolving the usual conflicts

- **Two PRs added items to the same list** (menu items in `site/src/layouts/Base.astro`, lines in `site/src/pages/llms.txt.js`, rows in a table): keep both. Take the other side's version of lines it changed (for example a renamed label) and add yours.
- **Both sides changed the same sentence or rule:** keep the newer intent from `main` and reapply your change on top. If you cannot tell which is right, stop and comment on the PR instead of guessing.
- **Generated files or lockfiles:** do not hand-edit. Take `main`'s version and regenerate (for example `npm install` for `package-lock.json`).

## Making conflicts less likely

- Merge `origin/main` into your branch right before opening the PR.
- Add new items at the end of their section or in sorted order, not always at the top (see "Avoiding merge conflicts" in `docs/COORDINATION.md`).
- Keep PRs small and merge them as soon as their checks pass.
