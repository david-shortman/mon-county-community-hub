# 2026-11-02: High-stakes card fixes for David (#1394, #1412)

- **Considered:** high-stakes records that the card fold or the reach count handle badly. The WVU student pantry card hid its address and hours behind More details. The DoHS office had its address only in its text, so the reach count missed it.
- **Chose:** split the pantry and school meals cards the same way as batches 1 to 3 (same words, a short summary plus steps or notes), and give the DoHS office a `contact.place`. The DoHS address, phone and hours were re-read on its official page on November 2.
- **Shipped:** The Rack (steps for where, when, ID and bag; notes for once a day and holidays; "Then" dropped), free school meals (special diet and questions moved to notes), DoHS `contact.place`, and its lookup in `content/findability/reach-places.yaml` (Morgantown city).
- **Scoreboard:** in-person listings go from 194 to 195 once this merges (DoHS in the city).
