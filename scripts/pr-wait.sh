#!/usr/bin/env bash
# Wait for a PR's checks, but stop early if the PR cannot run them.
# Usage: scripts/pr-wait.sh <pr-number> [timeout-minutes, default 25]
# Exit codes: 0 all checks done (see output for results), 2 merge conflict,
#             3 timed out, 4 PR closed or not found.
# GitHub does not start checks on a PR whose branch conflicts with its base,
# so waiting on such a PR hangs forever. See docs/operations/merge-conflicts.md.
set -uo pipefail
PR="${1:?usage: scripts/pr-wait.sh <pr-number> [timeout-minutes]}"
LIMIT_MIN="${2:-25}"
REPO="repos/david-shortman/mon-county-community-hub"
deadline=$(( $(date +%s) + LIMIT_MIN * 60 ))

while :; do
  info=$(gh api "$REPO/pulls/$PR" --jq '"\(.state)|\(.mergeable)|\(.mergeable_state)|\(.head.sha)"' 2>/dev/null) || { echo "PR #$PR not found"; exit 4; }
  IFS='|' read -r state mergeable mstate sha <<< "$info"
  [ "$state" = "open" ] || { echo "PR #$PR is $state"; exit 4; }
  if [ "$mstate" = "dirty" ] || [ "$mergeable" = "false" ]; then
    echo "CONFLICT: PR #$PR conflicts with main, so its checks will not run."
    echo "Fix: git fetch origin main && git merge origin/main, resolve, rebuild, commit, push."
    echo "Then run this script again. See docs/operations/merge-conflicts.md."
    exit 2
  fi
  runs=$(gh api "$REPO/commits/$sha/check-runs" --jq '.check_runs[] | "\(.name)|\(.status)|\(.conclusion)"' 2>/dev/null)
  # Done when at least one check exists and none is still queued or running.
  # Checks can take a minute to appear after a push, so an empty list is not done.
  if [ -n "$runs" ] && ! grep -qv '|completed|' <<< "$runs"; then
    # Give a just-pushed PR a moment for a slower check (like review) to register.
    if grep -q '^review|' <<< "$runs" || [ "$(date +%s)" -gt $(( deadline - LIMIT_MIN * 60 + 120 )) ]; then
      echo "Checks on $sha:"; echo "$runs" | sed 's/^/  /'
      gh api "$REPO/issues/$PR/comments" --jq '.[] | select(.body | contains("<!-- claude-review -->")) | .body' \
        | sed -n '2p;/^### Blockers/,/^### Already on the site/p'
      grep -q '|failure\||cancelled\||timed_out' <<< "$runs" && echo "RESULT: a check failed" || echo "RESULT: all checks passed or skipped"
      exit 0
    fi
  fi
  if [ "$(date +%s)" -ge "$deadline" ]; then
    echo "TIMEOUT after $LIMIT_MIN minutes. Current checks on $sha:"; echo "${runs:-  (none yet)}" | sed 's/^/  /'
    exit 3
  fi
  sleep 20
done
