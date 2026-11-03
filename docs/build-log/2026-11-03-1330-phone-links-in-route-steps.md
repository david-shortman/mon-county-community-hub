# 2026-11-03: Phone numbers in route steps wrap at large text (#1641)

- **Considered:** at 390px with text at 200% and steps open, `/identity-theft/` and `/utility-bills/` were 417px wide. Press keeps phone links on one line on screens at least 24em wide, but a media query's em ignores the page's own text size, so the rule still applied at 200% and a number like 1-800-525-6285 could not fit inside a route step.
- **Chose:** a container query on the step body (`.mp-body`). Its em follows the step's own text size, so phone links may wrap only when the step holds less than 12em of text. At normal text sizes numbers stay on one line as before.
- **Checked:** all 10 pages with route steps fit at 320px and 390px with 200% text, light and dark. At 390px and 1000px with 100% text, numbers in steps still keep `nowrap`.
- **Cost:** free.
