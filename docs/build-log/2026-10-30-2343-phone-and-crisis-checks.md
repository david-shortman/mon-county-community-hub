# 2026-10-30: Tighter checks for phone numbers and crisis details

- **Considered:** scammers plant fake support numbers that AI answers repeat, AI tools mix up places with the same name, and local services change fast (#494). The content rules were strong, but a wrong crisis number could sit for six months before a re-check.
- **Chose:** four small guards, all free: a written rule that phone numbers come only from the group's own site or a government page; a weekly re-check list for every record on the crisis, shelter and food-today pages (read from those page files, so new records join by themselves); warnings when an address leaves out WV or text names Morgantown in another state, in both `check-content` and the daily source check; and the "call to confirm" rule written down.
- **Shipped:** `content-recheck-weekly` in the Health check (15 records today, all checked this week), the "May be about another place" section in the source check, and four new rules in `content/README.md`.
