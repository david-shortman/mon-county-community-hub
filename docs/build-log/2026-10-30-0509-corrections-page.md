# 2026-10-30: A public Corrections page, and helpers can say who they are (#158)

- **Considered:** helpers (people who work at a place or help others find services) are the most likely to spot a wrong number, and there was no public record showing that fixes happen.
- **Chose:** one small file per fix in `content/corrections/`, read by a new `/corrections/` page, plus an optional question on the report form. No names asked or shown.
- **Shipped:**
  - `/corrections/`: every fix, newest first, with what was wrong, what kind of fix, how it was found, and links to the page and the fix. This month's counts follow the measurement rule (under 10 shows "fewer than 10").
  - The report form asks "How do you know about this?" (optional): works or volunteers there, helps people find services, used it, or other. Reports from the first two are read first; the triage job is #371 for Duet.
  - Three entries from today's own re-checks (#355): recycling center hours, an unsourced sentence removed, and an e-cycle date we could not confirm.
  - Schema in `content/README.md`.
- **Scoreboard:** Level 4 (corrections submitted) now has a public count.
