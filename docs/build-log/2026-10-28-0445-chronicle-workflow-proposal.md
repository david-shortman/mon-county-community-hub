# 2026-10-28: Proposed: run the chronicle every day (waits for David)

- **Considered:** committing daily screenshots to `main`, a separate `chronicle` branch, or GitHub release assets.
- **Chose:** release assets, one release per month, so clones stay small. Only the small `snapshot.json` files and the dispatches go into `main`.
- **Shipped:** a proposed `.github/workflows/chronicle.yml` (daily snapshot after the morning rebuild, weekly dispatch written by Claude). It adds a workflow and uses the Claude token secret, so it waits for David.
