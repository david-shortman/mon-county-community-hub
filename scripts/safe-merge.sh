#!/usr/bin/env bash
# Squash-merge a PR only when it is safe to merge without David.
# Usage: scripts/safe-merge.sh <pr-number>
# Exit codes: 0 merged and main checked (pr-wait.sh main's result), 4 refused
#             (labeled for:david, High stakes check not finished or not green,
#             PR closed), 5 GitHub refused the merge.
# Why: the High stakes check adds the for:david label a minute or two after a
# PR opens or gets a new commit. On 2026-10-31 three for:david PRs (#712, #787,
# #906) were merged with a raw `gh api ... /merge` before or without looking at
# the label. This script waits for that check on the PR's current head commit
# and re-reads the labels right before merging. See
# docs/operations/merge-conflicts.md.
set -uo pipefail
PR="${1:?usage: scripts/safe-merge.sh <pr-number>}"
REPO="repos/david-shortman/mon-county-community-hub"
refuse() { echo "REFUSED: PR #$PR: $1"; exit 4; }

pr=$(gh api "$REPO/pulls/$PR" --jq '"\(.state)|\(.merged)|\(.head.sha)"' 2>/dev/null) || refuse "not found"
IFS='|' read -r state merged sha <<<"$pr"
[ "$merged" = "true" ] && refuse "already merged"
[ "$state" = "open" ] || refuse "not open (state: $state)"

labels() { gh api "$REPO/issues/$PR/labels" --jq '[.[].name] | join(",")'; }
case ",$(labels)," in *,for:david,*) refuse "labeled for:david. It waits for David (docs/COORDINATION.md, \"When a PR waits for David\"). Do not merge it." ;; esac

# The High stakes workflow run for this exact head commit.
hs=$(gh api "$REPO/actions/runs?head_sha=$sha&per_page=50" --jq '[.workflow_runs[] | select(.name=="High stakes")][0] | "\(.status)|\(.conclusion)"' 2>/dev/null)
case "$hs" in
  completed\|success) ;;
  ""|null\|null) refuse "the High stakes check has not started for head commit ${sha:0:7}. Wait with scripts/pr-wait.sh $PR, then try again." ;;
  completed*) refuse "the High stakes check for ${sha:0:7} ended '${hs#*|}', so the for:david label may be missing. Re-run it, then try again." ;;
  *) refuse "the High stakes check for ${sha:0:7} is still running (${hs%%|*}). Wait with scripts/pr-wait.sh $PR, then try again." ;;
esac

# The head must not have moved while we checked, and the label is read once more
# right before the merge, since the label step runs at the end of that check.
now=$(gh api "$REPO/pulls/$PR" --jq .head.sha)
[ "$now" = "$sha" ] || refuse "a new commit (${now:0:7}) landed while checking. Wait for its checks, then try again."
case ",$(labels)," in *,for:david,*) refuse "labeled for:david. It waits for David. Do not merge it." ;; esac

# sha= makes GitHub refuse the merge if the head changed in the last second.
if ! out=$(gh api -X PUT "$REPO/pulls/$PR/merge" -f merge_method=squash -f sha="$sha" 2>&1); then
  echo "GitHub refused the merge of #$PR: $out"; exit 5
fi
echo "Merged #$PR (head ${sha:0:7}). Checking main..."
exec "$(dirname "$0")/pr-wait.sh" main
