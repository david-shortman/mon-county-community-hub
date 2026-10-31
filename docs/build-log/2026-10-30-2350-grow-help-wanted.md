# 2026-10-30: Help wanted box on /grow/ (#444)

- **Considered:** the charter asks the site to help people start the work, not only find it. Naming gaps honestly also invites corrections when we missed something.
- **Chose:** a small data file per topic, `content/gaps/<topic>.yaml`, and a `HelpWanted` box any page can show. The first file is `growing`, with only gaps we looked for ourselves on 2026-10-30: a posted way to sign up for a community garden plot, a seed swap with a date this year, a garden club or plant help line that posts how to join, and farmers market days on a current official page. The box uses the site's current "Tell us" route with the same note as the footer (public, needs a free GitHub account).
- **Left off:** gaps from the grower help map that we could not check today (tool library outside city limits, farmland matching, a farm to school contact, pantries that take garden produce). They can be added once someone looks. #431 (thrift and swaps) can reuse the same file format.
- **Shipped:** `content/gaps/growing.yaml`, `loadGaps()`, `HelpWanted.astro`, a check-content rule for gaps files, and the box on /grow/.
