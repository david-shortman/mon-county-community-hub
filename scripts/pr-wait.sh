#!/usr/bin/env bash
# Wait for a PR's checks, but stop early if the PR cannot run them.
# Usage: scripts/pr-wait.sh <pr-number> [timeout-minutes, default 25]
#        scripts/pr-wait.sh main   (after merging: did main build and deploy?)
# Exit codes: 0 all checks done (see output for results; a cancelled check is
#             reported as superseded, not failed), 2 merge conflict,
#             3 timed out, 4 PR closed or not found.
# GitHub does not start checks on a PR whose branch conflicts with its base,
# so waiting on such a PR hangs forever. See docs/operations/merge-conflicts.md.
set -uo pipefail
PR="${1:?usage: scripts/pr-wait.sh <pr-number> [timeout-minutes]  or  scripts/pr-wait.sh main}"
LIMIT_MIN="${2:-25}"
REPO="repos/david-shortman/mon-county-community-hub"
deadline=$(( $(date +%s) + LIMIT_MIN * 60 ))

# `scripts/pr-wait.sh main`: after a merge, wait for main's Site build and say
# whether the site deployed. Exit 0 green, 1 red, 3 timed out.
# A Site run cancelled because a newer push landed is not a failure: the newer
# run builds everything in it, including this merge. So on "cancelled" the
# script follows the Site run for main's current head commit instead.
if [ "$PR" = "main" ]; then
  sleep 10
  sha=$(gh api "$REPO/commits/main" --jq .sha)
  first=$sha
  while :; do
    s=$(gh api "$REPO/actions/runs?branch=main&head_sha=$sha" --jq '[.workflow_runs[] | select(.name=="Site")][0] | "\(.status)|\(.conclusion)|\(.html_url)"' 2>/dev/null)
    note=""; [ "$sha" != "$first" ] && note=" (newer than ${first:0:7}, so it includes it)"
    case "$s" in
      completed\|success*) echo "main ${sha:0:7}: Site build passed$note"; exit 0 ;;
      completed\|cancelled*)
        # Follow main's current head commit, not the newest run: a re-run of an
        # old commit's build is newer but does not include this merge (#529).
        newest=$(gh api "$REPO/commits/main" --jq .sha 2>/dev/null)
        if [ -n "$newest" ] && [ "$newest" != "$sha" ]; then
          echo "main ${sha:0:7}: Site run superseded by a newer push; following ${newest:0:7}"
          sha=$newest; continue
        fi
        echo "main ${sha:0:7}: Site run was cancelled, with no newer run to follow. Not a failure: ${s##*|}"
        echo "If nothing else is merging, re-run it from the Actions page."; exit 0 ;;
      completed*) echo "main ${sha:0:7}: Site build FAILED$note: ${s##*|}"
        echo "Fix forward now. First check open PRs: another session may already be fixing it."; exit 1 ;;
    esac
    [ "$(date +%s)" -ge "$deadline" ] && { echo "TIMEOUT waiting for main's Site build"; exit 3; }
    sleep 15
  done
fi

while :; do
  info=$(gh api "$REPO/pulls/$PR" --jq '"\(.state)|\(.mergeable)|\(.mergeable_state)|\(.head.sha)|\(.head.ref)"' 2>/dev/null) || { echo "PR #$PR not found"; exit 4; }
  IFS='|' read -r state mergeable mstate sha ref <<< "$info"
  [ "$state" = "open" ] || { echo "PR #$PR is $state"; exit 4; }
  # Right after a push, GitHub can still show the old commit. If this is the
  # PR for the branch checked out here, wait until it shows our latest commit.
  if [ "$ref" = "$(git rev-parse --abbrev-ref HEAD 2>/dev/null)" ] && [ "$sha" != "$(git rev-parse HEAD 2>/dev/null)" ]; then
    [ "$(date +%s)" -ge "$deadline" ] && { echo "TIMEOUT: PR #$PR never showed the local commit. Did the push work?"; exit 3; }
    sleep 10; continue
  fi
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
      if grep -q '|failure$\||timed_out$' <<< "$runs"; then echo "RESULT: a check failed"
      elif grep -q '|cancelled$' <<< "$runs"; then echo "RESULT: a check was cancelled (superseded by a newer run), not failed. Push again or re-run it if no newer run follows."
      else echo "RESULT: all checks passed or skipped"; fi
      exit 0
    fi
  fi
  if [ "$(date +%s)" -ge "$deadline" ]; then
    echo "TIMEOUT after $LIMIT_MIN minutes. Current checks on $sha:"; echo "${runs:-  (none yet)}" | sed 's/^/  /'
    exit 3
  fi
  sleep 20
done
