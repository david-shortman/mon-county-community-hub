# Feedback triage runbook and a "how the sender knows" field (part of #371)

The corrections log (`content/corrections/`, the `/corrections/` page) and the checking rules (#168) already existed. What was missing was the recurring job itself once reports moved off GitHub to the Tally form and fix@ (#197, #522): which reports to read first, and how a report's source becomes `found_by` in a corrections file.

- `docs/operations/feedback-triage.md`: where reports come in, the reading order (removals, privacy and shelter, crisis or food the same day; then people who work at a place or help others; then the rest), and a table from each way in to `found_by`.
- The **Feedback (project team)** issue form gets an optional "How the sender knows" choice, so the helper-first signal is not lost when a team member files a report from the form or email. It never holds a name.
- The Tally form itself does not ask how the sender knows. Adding that is in David's account, so it is noted on #1530.

Checked 2026-11-14: no open reports from the public GitHub form, no open Feedback or Group request issues.
