# Every run is automatic, nothing manual

- **Date:** 2026-10-31
- **Decided by:** David
- **Decision:** Every scheduled job and workflow runs on its own: on a schedule, on a change, or both. No job may depend on a person starting it from the Actions tab. A manual start button can stay as a backup, but never as the only way a job runs.
- **Why:** The 311 totals job (#881) was built to run only when someone started it, and it never ran. David: "We need any runs to be automatic, nothing manual." As of this date, 311 totals was the only manual-only workflow; it now runs every Monday and whenever its workflow or script changes on main. Cost: $0 (Actions minutes on a public repo).
