# 2026-10-31: pr-wait.sh no longer calls a cancelled run a failure

- **Considered:** during the sprint, many merges landed minutes apart. Each new push cancels main's previous Site run, and `scripts/pr-wait.sh main` reported every cancelled run as "Site build FAILED", which sent sessions looking for a breakage that was not there.
- **Shipped:** in `main` mode, a cancelled Site run makes the script follow the newest Site run on main and wait for its real result (that build includes the earlier merge). A cancel with no newer run is reported as cancelled, not failed, with exit 0. In PR mode, a cancelled check now reads "cancelled (superseded)" instead of "a check failed". Exit codes 2 (conflict) and 3 (timeout) are unchanged; `docs/operations/merge-conflicts.md` says what "superseded" means.
- **Tested:** against real history: started from ccdba34 (its run was cancelled), the script followed e1d0bdd and reported it passed.
