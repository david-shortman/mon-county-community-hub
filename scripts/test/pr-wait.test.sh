#!/usr/bin/env bash
# Tests for scripts/pr-wait.sh and scripts/safe-merge.sh, with a fake `gh`.
# Run: bash scripts/test/pr-wait.test.sh   (needs jq and git; no network)
# Each case scripts what GitHub answers, call by call, and checks the exit
# code and output. Covers a head commit that moves mid-wait, runs cancelled by
# a newer push (superseded), and the safe-merge refusals.
set -uo pipefail
HERE="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
export PR_WAIT_POLL=0 PR_WAIT_REPO=r
R=r

# The fake gh: `gh api [-X M] <endpoint> [--jq expr] [-f k=v]...`. Answers come
# from $FAKE/<endpoint key>.<n>, one file per call; after the last file it keeps
# giving the last one. A file holding just FAIL makes the call fail.
mkdir -p "$TMP/bin"
cat > "$TMP/bin/gh" <<'STUB'
#!/usr/bin/env bash
shift # api
ep=""; jq=""
while [ $# -gt 0 ]; do
  case "$1" in
    -X|-f) shift 2 ;;
    --jq) jq="$2"; shift 2 ;;
    *) ep="$1"; shift ;;
  esac
done
key=$(printf '%s' "$ep" | tr -c 'A-Za-z0-9' '_')
n=$(( $(cat "$FAKE/$key.count" 2>/dev/null || echo 0) + 1 ))
echo "$n" > "$FAKE/$key.count"
f="$FAKE/$key.$n"
while [ ! -f "$f" ] && [ "$n" -gt 1 ]; do n=$((n - 1)); f="$FAKE/$key.$n"; done
[ -f "$f" ] || { echo "fake gh: no answer for $ep" >&2; exit 1; }
[ "$(cat "$f")" = "FAIL" ] && { echo "fake gh: FAIL for $ep" >&2; exit 1; }
if [ -n "$jq" ]; then jq -r "$jq" "$f"; else cat "$f"; fi
STUB
chmod +x "$TMP/bin/gh"
export PATH="$TMP/bin:$PATH"

# answer <endpoint> <json for call 1> [<json for call 2> ...]
answer() {
  local ep="$1"; shift
  local key i=1
  key=$(printf '%s' "$R/$ep" | tr -c 'A-Za-z0-9' '_')
  for body in "$@"; do printf '%s' "$body" > "$FAKE/$key.$i"; i=$((i + 1)); done
}
pr() { printf '{"state":"%s","merged":false,"mergeable":true,"mergeable_state":"clean","head":{"sha":"%s","ref":"%s"}}' "$1" "$2" "${3:-feature}"; }
checks() { # name|status|conclusion ...
  local out="" c
  for c in "$@"; do IFS='|' read -r n s k <<<"$c"; out+="{\"name\":\"$n\",\"status\":\"$s\",\"conclusion\":\"$k\"},"; done
  printf '{"check_runs":[%s]}' "${out%,}"
}
site_run() { printf '{"workflow_runs":[{"name":"Site","status":"%s","conclusion":"%s","html_url":"u"}]}' "$1" "$2"; }
hs_run() { printf '{"workflow_runs":[{"name":"High stakes","status":"%s","conclusion":"%s"}]}' "$1" "$2"; }

pass=0; fail=0; CASE_DIR=""
new_case() { CASE_DIR="$TMP/case$((pass + fail))"; mkdir -p "$CASE_DIR"; export FAKE="$CASE_DIR"; cd "$TMP"; }
# expect <name> <exit code> <text the output must contain> -- <command...>
expect() {
  local name="$1" code="$2" want="$3"; shift 4
  local out got
  out=$(timeout 30 "$@" 2>&1); got=$?
  if [ "$got" = "$code" ] && grep -qF -- "$want" <<<"$out"; then
    pass=$((pass + 1)); echo "ok - $name"
  else
    fail=$((fail + 1)); echo "not ok - $name (exit $got, wanted $code and \"$want\")"; sed 's/^/    /' <<<"$out"
  fi
}

# 1. The head moves while waiting: the old commit's checks were cancelled by
#    the new push. Report on the new commit, not "cancelled".
new_case
answer pulls/7 "$(pr open aaa)" "$(pr open bbb)"
answer commits/aaa/check-runs "$(checks 'build|completed|cancelled' 'review|completed|cancelled')"
answer commits/bbb/check-runs "$(checks 'build|completed|success' 'review|completed|success')"
answer issues/7/comments '[]'
expect "head moves mid-wait: follows the new commit" 0 "RESULT: all checks passed" -- "$HERE/pr-wait.sh" 7

new_case
answer pulls/7 "$(pr open aaa)" "$(pr open bbb)"
answer commits/aaa/check-runs "$(checks 'build|completed|cancelled' 'review|completed|cancelled')"
answer commits/bbb/check-runs "$(checks 'build|completed|success' 'review|completed|success')"
answer issues/7/comments '[]'
expect "head moves mid-wait: says so" 0 "head moved from aaa to bbb" -- "$HERE/pr-wait.sh" 7

# 2. A real failure on the current head is still a failure.
new_case
answer pulls/7 "$(pr open aaa)"
answer commits/aaa/check-runs "$(checks 'build|completed|failure' 'review|completed|success')"
answer issues/7/comments '[]'
expect "a failed check is reported" 0 "RESULT: a check failed" -- "$HERE/pr-wait.sh" 7

# 3. A conflict stops right away.
new_case
answer pulls/7 '{"state":"open","mergeable":false,"mergeable_state":"dirty","head":{"sha":"aaa","ref":"feature"}}'
expect "conflict exits 2" 2 "CONFLICT" -- "$HERE/pr-wait.sh" 7

# 4. Local branch checks: GitHub still shows our older commit, so wait; GitHub
#    shows a commit we do not have (merged from main on GitHub), so follow it.
REPO_DIR="$TMP/git"
git init -q -b feature "$REPO_DIR"
git -C "$REPO_DIR" -c user.name=t -c user.email=t@t commit -q --allow-empty -m one
OLD=$(git -C "$REPO_DIR" rev-parse HEAD)
git -C "$REPO_DIR" -c user.name=t -c user.email=t@t commit -q --allow-empty -m two
NEW=$(git -C "$REPO_DIR" rev-parse HEAD)

new_case
answer pulls/7 "$(pr open "$OLD")" "$(pr open "$OLD")" "$(pr open "$NEW")"
answer "commits/$OLD/check-runs" "$(checks 'review|completed|success')"
answer "commits/$NEW/check-runs" "$(checks 'review|completed|success')"
answer issues/7/comments '[]'
cd "$REPO_DIR"
expect "waits for GitHub to show the pushed commit" 0 "Checks on $NEW" -- "$HERE/pr-wait.sh" 7

new_case
answer pulls/7 "$(pr open ccc)"
answer commits/ccc/check-runs "$(checks 'review|completed|success')"
answer issues/7/comments '[]'
cd "$REPO_DIR"
expect "follows a head this clone does not have" 0 "Checks on ccc" -- "$HERE/pr-wait.sh" 7 1

# 5. main: the merge's Site run is cancelled by a newer push; follow main's head.
new_case
answer "actions/runs?branch=main&head_sha=m1" "$(site_run completed cancelled)"
answer commits/main '{"sha":"m2"}'
answer "actions/runs?branch=main&head_sha=m2" "$(site_run in_progress null)" "$(site_run completed success)"
expect "main: superseded run follows the newer push" 0 "Site build passed (newer than m1" -- "$HERE/pr-wait.sh" main 25 m1

new_case
answer "actions/runs?branch=main&head_sha=m1" "$(site_run completed failure)"
answer commits/main '{"sha":"m1"}'
expect "main: a failed build exits 1" 1 "Site build FAILED" -- "$HERE/pr-wait.sh" main 25 m1

new_case
answer "actions/runs?branch=main&head_sha=m1" "$(site_run completed cancelled)"
answer commits/main '{"sha":"m1"}'
expect "main: cancelled with nothing newer is not a failure" 0 "with no newer run to follow" -- "$HERE/pr-wait.sh" main 25 m1

# 6. safe-merge.sh refusals and the happy path.
new_case
answer pulls/7 '{"state":"open","merged":false,"head":{"sha":"aaa"}}'
answer issues/7/labels '[{"name":"for:david"}]'
expect "safe-merge refuses for:david" 4 "labeled for:david" -- "$HERE/safe-merge.sh" 7

new_case
answer pulls/7 '{"state":"open","merged":false,"head":{"sha":"aaa"}}'
answer issues/7/labels '[]'
answer "actions/workflows/high-stakes.yml/runs?head_sha=aaa&per_page=10" "$(hs_run in_progress null)"
expect "safe-merge refuses while High stakes runs" 4 "still running" -- "$HERE/safe-merge.sh" 7

new_case
answer pulls/7 '{"state":"open","merged":false,"head":{"sha":"aaa"}}' '{"state":"open","merged":false,"head":{"sha":"bbb"}}'
answer issues/7/labels '[]'
answer "actions/workflows/high-stakes.yml/runs?head_sha=aaa&per_page=10" "$(hs_run completed success)"
expect "safe-merge refuses when the head moves" 4 "a new commit (bbb)" -- "$HERE/safe-merge.sh" 7

new_case
answer pulls/7 '{"state":"open","merged":false,"head":{"sha":"aaa"}}'
answer issues/7/labels '[]' '[{"name":"for:david"}]'
answer "actions/workflows/high-stakes.yml/runs?head_sha=aaa&per_page=10" "$(hs_run completed success)"
expect "safe-merge re-reads the label right before merging" 4 "labeled for:david" -- "$HERE/safe-merge.sh" 7

new_case
answer pulls/7 '{"state":"open","merged":false,"head":{"sha":"aaa"}}'
answer issues/7/labels '[]'
answer "actions/workflows/high-stakes.yml/runs?head_sha=aaa&per_page=10" "$(hs_run completed success)"
answer pulls/7/merge '{"sha":"m9","merged":true}'
answer "actions/runs?branch=main&head_sha=m9" "$(site_run completed success)"
expect "safe-merge merges, then checks that merge's build" 0 "main m9: Site build passed" -- "$HERE/safe-merge.sh" 7

echo "# pass $pass, fail $fail"
[ "$fail" = 0 ]
