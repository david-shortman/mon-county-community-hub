# 2026-10-30: Recycling page reads its facts from content, and topics read as words

- **Considered:** the recycling page hard-coded the Solid Waste Authority phone, the drop-off center and the Mountaineer Transfer Station, and some phone numbers showed twice, once as a link and once as a Call button (#146). The review of #117 asked to explain "single-stream" and keep one time format (#119). Event cards listed topic tags like "money" instead of the words on the doors.
- **Chose:**
  - New `orgs/republic-services.yaml` and `resources/mountaineer-transfer-station.yaml`, read from the county's disposal page on October 30, 2026. The drop-off center record gets its phone, 304-291-5940, from moncountyrecycling.com (read the same day). The page now reads these records and the existing `mon-swa-ask-about-trash` record.
  - Each phone shows once: as a Call button where there is one.
  - "Single-stream" and "sorted" are explained in one line, sourced to the EPA's measurement definitions (read October 30, 2026).
  - Event cards say "Topics: Bills and money, Food", using the labels in `content/doors.yaml`.
- **Left inline:** the Western Mon County site (run by the Marion County Solid Waste Authority) and PACE paper shredding keep their county source lines on the page. Moving them needs two more org records.
- **Checked:** times already use one format (7 a.m., 3:25 p.m.). The e-cycle card already shows the weekday ("Sat, Oct 31").
- **Cost:** $0.
