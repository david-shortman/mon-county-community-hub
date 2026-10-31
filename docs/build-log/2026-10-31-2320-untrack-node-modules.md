# 2026-10-31: Untrack a node_modules link that slipped into main

- **Found:** #866 committed `site/node_modules`, a symbolic link to one cloud session's own folder. The `.gitignore` rule `node_modules/` only matches folders, not links, so `git add -A` picked it up. Any other session that links `node_modules` into a worktree now gets "untracked working tree files would be overwritten" when it merges `main`.
- **Fix:** remove the link from git (the file on disk is untouched) and change the rule to `node_modules`, which matches a folder or a link.
- **Cost:** $0.
