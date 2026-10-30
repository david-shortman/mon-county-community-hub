# 2026-10-30: Personal data check

- **Considered:** scanning the repo and GitHub for residents' details, and adding a privacy line to the suggestion form. The COORDINATION.md rule is a separate `for:david` change, and Notion is out of reach for GitHub Actions runs.
- **Chose:** a pattern scan of emails, phone numbers and authors across files, commits, issues and PRs, plus the form line. Nothing was edited or deleted.
- **Shipped:** the suggestion form now opens with "This is public. Please don't include your name, phone, address or personal story." Scan found only organization contact info in `content/` and `site/`; all issues and PRs were written by the owner or Claude; commits carry only the owner and bot noreply addresses. Closes #452 for the form and check. The Notion Activity log and the COORDINATION.md rule still need David or Duet.
- **Scoreboard:** no number moves. Check the next batch of outside suggestions for personal details on 2026-11-30.
