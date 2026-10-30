# 2026-10-30: No sideways scroll at 320px with 200% text (#332)

- **Considered:** `/money/` and `/stay-tonight/` scrolled sideways by a few pixels on a 320px screen with text at 200%. On `/money/`, the "Can't wait" buttons sat in equal columns that could shrink below their labels ("Text 898-211"). On `/stay-tonight/`, the "Leave this page" button could not move off the line with the crisis text.
- **Chose:** let both rows wrap. The "Can't wait" buttons now size to their labels and drop to a new row when they do not fit. The crisis strip wraps the quick exit under the text only when the text is large; at normal size it still sits beside it on 320px and 390px screens.
- **Checked:** every built page (26) at 320px with 100% and 200% text, using Playwright. None scroll sideways.
