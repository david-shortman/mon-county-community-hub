# 2026-11-02: An interactive upcoming dates view for AI chats (#1371)

- **Considered:** the first MCP Apps view named in #1371: upcoming dates with a topic filter and Add to calendar. The spec (MCP Apps, 2026-01-26) has no download method, and views run in a sandbox with no outside requests.
- **Chose:** one self-contained HTML file served as a `ui://` resource. The `upcoming_dates` tool links to it only for chat apps that say they can show views. Add to calendar opens the date's existing `.ics` file on the site through `ui/open-link`. Other chat apps get a plain text list instead of raw JSON.
- **Shipped:** `apps/mcp/views/upcoming-dates.html`, `resources/list` and `resources/read` in `apps/mcp/server.mjs`, an `add_to_calendar` link on every date, smoke test checks and a README section.
- **Checked:** in a stand-in host (a page that answers `ui/initialize`, sends a real tool result and records `ui/open-link`): the list renders, the topic filter works, Add to calendar asks to open the right `.ics` link, and there is no sideways scroll at 320px with 200% text or at 390px in light and dark.
- **Not yet:** screenshots in Claude and ChatGPT. Both need the server online first (#1370, David's decision).
