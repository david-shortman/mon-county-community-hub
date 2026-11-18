# 2026-11-14: Long card fields, batch 6 (#1394)

- **Considered:** the `check-content` list of `who_it_is_for` and `what_to_do` fields over 60 words, skipping records with topic housing, money or food or that name a crisis line (those wait for David), election cards, and cards other wave 16 lanes are likely to touch (health care, jobs).
- **Chose:** five cards, same words and sources, split into a short summary plus `options` or `notes`:
  - BOPARC ice arena: the skating times move into a list of days. The card on `/parks/` does not show the `hours` field, so the times stay on the card as a short list rather than being cut.
  - Organizational Arts Grants: who is not considered and the $5,000 rule move to notes.
  - Vet Center grief counseling: the three cases stay up front in one shorter sentence (who qualifies stays on the first screen), and the Reserve and National Guard line is a note.
  - LiveAbility transition help: the three groups stay in one sentence; what the help can include is a note.
  - Camp Caring: what happens after you apply is a note; the missing date and place stay up front.
- **Shipped:** five records in `content/resources/`. Only connecting words and punctuation changed. Long-field warnings fell from 46 to 41. Cost: $0.
