# The state's county broadband summaries are pictures, not text

- **Found:** 2026-11-14, while scoring a getting online need for the needs register (#1908, sprint wave 18, #529)
- **What we found:** The West Virginia Office of Broadband's county availability PDF (September 2026) is made of images. Its numbers, like Mon County's 38,428 places, 1,819 funded and 143 unserved, cannot be selected, searched or read aloud by a screen reader. We read Mon County's page (page 31) by turning it into a picture and reading that.
- **Evidence:** [County availability summary, September 2026](https://broadband.wv.gov/wp-content/uploads/2026/09/County-availability-Sept2026.pdf), read 2026-11-14. The file reports "Adobe Acrobat 26.2 Image Conversion Plug-in" as its producer, and a text read returns no words. An earlier pass could not read the Mon County row for the same reason (#665).
- **Why it matters:** residents who use screen readers, and anyone searching for their county's numbers, cannot get them from the file. The same numbers may exist as text in the state's map, but we did not find a text table.
- **Who keeps it:** the West Virginia Office of Broadband.
- **Status:** open. The numbers are in the needs register with the page number. #1935 adds them to `/internet/` as text.
