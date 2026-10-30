# 2026-10-30: Four small fixes from earlier reviews (#247, #142, #233, #326)

- **Considered:** small problems reviewers and David had flagged: an empty band above the first heading in cards and boxes, "12 p.m." where the text says noon, the SNAP phone and hours shown twice, and "PTSD" and "military sexual trauma" with no plain words.
- **Shipped:**
  - Cards and callout boxes no longer keep the page's heading margin above their first line (#247). On the flu shots page the heading now starts 17px from the top of the card instead of 60px. Fixed once in the shared styles, so every card and box gets it.
  - Times at 12:00 show as "noon" on event cards (#142).
  - `/snap/`: the intro no longer repeats the DoHS number and hours; they appear once in the card, with the Call button (#233).
  - Vet Center entry: "post-traumatic stress (PTSD)" and "sexual assault or harassment during military service (military sexual trauma)" (#326).
- **Checked:** content check, build, weight and accessibility scans pass.
