# 2026-10-30: Tab bar labels grow with the reader's text size (#311)

- **Considered:** the phone tab bar labels were capped at 14px so they would fit, so people who set large text got small labels.
- **Chose:** let the labels grow with the text setting up to the size where the longest word still fits a quarter of the screen (6% of the screen width). The bar and the space kept free above it grow with them, and icons stay in one row when "Help now" wraps.
- **Result:** labels are 14px at normal text. At 200% text they are 19px on a 320px phone and 26px on a 430px phone, with no words broken and no sideways scroll on any page.
