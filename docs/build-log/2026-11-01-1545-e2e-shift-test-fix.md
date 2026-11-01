# 2026-11-01: Fix a flaky Quick exit test

- **Considered:** the e2e test "pressing Shift three times leaves" failed in CI on #1240 with `ERR_ABORTED` while waiting for the stand-in weather page. It passed locally.
- **Cause:** the test checks that "Shift+A" resets the count, but Shift+A's own Shift key-up then counts as 1, and the next Shift makes 2. So the first of the "three" presses already left the page, and the next two started a second exit that cancelled the first. On a slow runner that shows as an aborted navigation. The site's Quick exit works as intended; the test's key sequence was off.
- **Chose:** wait out the 1 second count window before pressing Shift three times. No site code changed.
- **Cost:** $0.
