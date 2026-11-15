# 2026-11-15: New resident and remote worker starting pages, act from the page (#261, #529)

- **Considered:** the wave 20 persona walkthroughs on `main` (simulated, not real residents). The two lowest of 32 personas were "Just moved here" (9 of 18) and "Remote worker moving here" (10 of 18). Both landing pages were lists of links with no phone and no checked date. On the new resident page, the trash pickup link only said "find your day", though we could not find a public list of pickup days by street (the `pickup-days` fact).
- **Chose:** the record option in `GroupStart` (#1288), as the wave 17 disability and older adult pages did. Facts come only from the records.
  - New to Mon County: the trash pickup link now says we could not find a public list of pickup days by street, and shows the Solid Waste Authority phone and source line (`mon-swa-ask-about-trash`).
  - Remote workers: the library Wi-Fi link shows the library's phone and source line (`mympls-wifi-computers-and-rooms`). The internet link now goes straight to the state map of internet service on Internet at home.
- **Left out:** the state speed test record. Its phone is for people with no internet to leave a message, and the state says calls may not be returned, so it is not a good "Call" button here.
- **Measured:** simulated walks, before and after, in the wave 20 persona results file (`content/findability/walkthroughs/`). Just moved here: 9 to 16 of 18. Remote worker: 10 to 16 of 18. Cost: $0.
