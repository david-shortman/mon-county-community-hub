# 2026-11-03: One place record, many outputs: a design note and a share text (#399)

- **Considered:** what is left on #399. Most of it is already true: each place is one record (`content/places/`), and the page, flyer, status line, hall finder, town pages, API and MCP server all read it. Missing: a share text, HSDS locations and a voice script.
- **Shipped:** `docs/architecture/place-record.md`, which maps each output to the fields it reads (checked against the code) and lists what is not built. Every place page now has "Pass it on" (text, print or share) made from the same record: name, phone, address and the oldest checked date.
- **Left:** HSDS `location` export (needs split addresses; waits for a partner who asks) and a voice script (no phone line to use it).
