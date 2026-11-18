# Upcoming dates in AI chats say how fresh each date is

**What changed.** The MCP server's `upcoming_dates` tool and its interactive view (#1371) now say how each date was read and when. A date from a group's own calendar feed says "Pulled from" that feed on a date; a date a person or agent read says "Checked" on a date. A date that starts in the next 14 days, from a source last read over 30 days ago, gets a "Check before you go" note in the view, the tool result (`check_first`) and the plain text answer.

**Why.** That is the same rule the Health check uses for upcoming events (`upcoming_event` in `content/recheck-windows.yaml`, #1093), so an AI chat and the site agree on when a date needs a second look. A date that moved is worst just before the day.

**Checks.** The smoke test reads `content/recheck-windows.yaml` and fails if the server's numbers drift from it, and checks every date has `read_how` and `days_since_checked`. The view was checked in a stand-in host at 320px (light) and 390px (dark), both with 200% text, with a test date that is soon and old. No date on the site is past the rule today, so nothing shows the note yet.

**Not done.** Screenshots in Claude and ChatGPT still wait on hosting the server (#1370, David).

Part of #1371 and #122, sprint wave 16 (#529).
