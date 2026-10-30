# When no current official source confirms a fact, open a needs-verification issue

- **Date:** 2026-10-30
- **Decided by:** David, in a Claude Code session
- **Decision:** If a fact a resident would need cannot be confirmed on a current official page (the agency's or group's own site), leave it off the page, and open an issue labeled `needs-verification` that holds:
  1. **Best last-known information:** what we found, where (link), and when that source was dated or seen.
  2. **Conflicts:** every version we saw, with its source.
  3. **Likely sources to check:** official pages, documents or offices that could settle it.
  4. **Human follow-up:** the step a person must take, such as calling the office to confirm. Contacting people or organizations is David's call under the charter, so these steps are marked for David (or a volunteer he names).
  5. **Where it goes:** the page and content entry to update once it is confirmed.
  Add `for:duet` if a later web check could settle it, and `for:david` if only a call or contact can.
- **Why:** Gaps were being noted only in build logs and PR descriptions, where they get lost. One issue per gap keeps the best information we have, says exactly what would confirm it, and gives a human a clear task, without ever putting an unverified fact in front of residents.
