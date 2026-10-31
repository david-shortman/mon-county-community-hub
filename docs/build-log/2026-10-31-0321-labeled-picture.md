# 2026-10-31: Labeled picture block

- **Considered:** the last open block in #179. Step path (`Route`), checklist and timeline already exist.
- **Chose:** `LabeledPicture.astro`: our own small SVG in a slot (hidden from screen readers), an optional caption, and a numbered list whose numbers match the circles in the drawing. The list carries all the meaning, so the picture only helps people find each part on their own paper. It prints on one piece. No page uses it yet; the first drawing (a shutoff notice or another letter) is chosen with Duet.
- **Checked:** a test page with a sample drawing at 390px (not committed).
- **Cost:** $0.
