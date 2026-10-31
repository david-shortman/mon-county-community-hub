#!/usr/bin/env python3
"""Score one source benchmark run (#183, #184).

Usage:
    python3 content/findability/benchmark/score.py content/findability/benchmark/2026-10-30.yaml

Prints, for each need, a before-and-after table of every source, whether our
page meets the "dramatically better" bar, a summary line, and what changed
since the previous run file in this folder. The measures and the bar are in
the "Source benchmark" section of docs/scoreboard.md. Needs PyYAML.
"""
import sys
from pathlib import Path

import yaml

CARD = ["days_and_hours", "open_today", "who_qualifies", "what_to_bring",
        "address_or_how", "next_step_not_only_call", "checked_date", "provider_link"]
# The bar, written before the first run (2026-10-30). Do not loosen it.
BAR = {"max_taps": 1, "max_kb": 100, "min_card": 7, "max_fact_age_days": 30}


def card(src):
    c = src.get("card") or {}
    return sum(1 for k in CARD if c.get(k))


def covered(src):
    return src.get("covered", True) not in (False, "no")


def scored(src):
    return src.get("scored", True) is not False


def facts_ok(src):
    """Every fact checked and confirmed (needed to meet the bar)."""
    facts = src.get("facts") or []
    return bool(facts) and all(f.get("confirmed") is True for f in facts)


def facts_wrong(src):
    """At least one fact checked and found wrong."""
    return any(f.get("confirmed") is False for f in src.get("facts") or [])


def meets_bar(src):
    """True if a source meets the "dramatically better" bar for an urgent need."""
    auto = src.get("auto") or {}
    why = []
    if (src.get("taps") or 0) > BAR["max_taps"]:
        why.append(f"{src.get('taps')} taps")
    if auto.get("kb") is not None and auto["kb"] > BAR["max_kb"]:
        why.append(f"{auto['kb']:.0f} KB")
    if card(src) < BAR["min_card"]:
        why.append(f"card {card(src)}/8")
    if src.get("must_call"):
        why.append("must call to learn")
    if not facts_ok(src):
        why.append("not every fact confirmed")
    return not why, why


def beats(ours, other):
    """Our page beats a source when the source does not cover the need, or when
    ours has more answer card points, is not worse on correct today (a fact
    found wrong), and does not need a call that a source fully covering the
    need does not."""
    if not covered(other):
        return True
    if facts_wrong(ours) and not facts_wrong(other):
        return False
    if ours.get("must_call") and not other.get("must_call") and other.get("covered", "yes") == "yes":
        return False
    return card(ours) > card(other)


def row(src):
    if not covered(src):
        return f"  {src['name']:14} not covered"
    if not scored(src):
        return f"  {src['name']:14} not scored this run (blocked)"
    auto = src.get("auto") or {}
    kb = f"{auto['kb']:.0f} KB" if auto.get("kb") is not None else "? KB"
    wb = auto.get("words_before_answer")
    where = f"p.{auto['answer_page']}" if auto.get("answer_page") else f"{src.get('taps', '?')} taps"
    flags = []
    if src.get("must_call"):
        flags.append("must call")
    if src.get("blocked"):
        flags.append("checked by hand")
    if src.get("covered") in ("partial",):
        flags.append("partial")
    return (f"  {src['name']:14} card {card(src)}/8  {where:8} {kb:>8}  "
            f"words before {wb if wb is not None else '?':>4}  grade {auto.get('reading_grade') or '-'}"
            + (f"  ({', '.join(flags)})" if flags else ""))


def summarize(run):
    out = {}
    for need in run["needs"]:
        ours = next(s for s in need["sources"] if s["kind"] == "ours")
        others = [s for s in need["sources"] if s["kind"] != "ours" and scored(s)]
        ok, why = meets_bar(ours)
        out[need["id"]] = {
            "beats_all": all(beats(ours, o) for o in others),
            "lost_to": [o["name"] for o in others if covered(o) and not beats(ours, o)],
            "bar": ok, "why": why, "must_call": bool(ours.get("must_call")), "card": card(ours),
        }
    return out


def main(path):
    path = Path(path)
    run = yaml.safe_load(path.read_text())
    s = summarize(run)
    print(f"Source benchmark {run['date']}: {len(s)} needs\n")
    for need in run["needs"]:
        r = s[need["id"]]
        print(f"{need['id']}  {need['need']}")
        for src in need["sources"]:
            print(row(src))
        verdict = "meets the bar" if r["bar"] else "misses the bar: " + ", ".join(r["why"])
        print(f"  -> ours {verdict}" + (f"; does not beat: {', '.join(r['lost_to'])}" if r["lost_to"] else "") + "\n")
    n = len(s)
    beat = sum(r["beats_all"] for r in s.values())
    bar = sum(r["bar"] for r in s.values())
    calls = [k for k, r in s.items() if r["must_call"]]
    print(f"Summary: our page beats every source on {beat} of {n} needs; meets the bar on {bar} of {n}.")
    print("Needs where ours still needs a phone call to learn the key fact: " + (", ".join(calls) if calls else "none"))
    skipped = [f"{n['id']} {s['name']}" for n in run["needs"] for s in n["sources"] if not scored(s)]
    if skipped:
        print("Not scored this run (left out of the comparison): " + ", ".join(skipped))

    # Changes since the previous run in this folder.
    runs = sorted(p for p in path.parent.glob("20*.yaml") if p.name < path.name)
    if runs:
        prev = summarize(yaml.safe_load(runs[-1].read_text()))
        moved = [f"{k}: card {prev[k]['card']} -> {r['card']}" + (", now meets the bar" if r["bar"] and not prev[k]["bar"] else "")
                 for k, r in s.items() if k in prev and (prev[k]["card"] != r["card"] or prev[k]["bar"] != r["bar"])]
        print(f"\nSince {runs[-1].stem}: " + ("; ".join(moved) if moved else "no change"))

    # Our page should match the latest findability run's hub_page.
    find = sorted((path.parent.parent).glob("20*.yaml"))
    if find:
        latest = {r["id"]: r.get("hub_page") for r in yaml.safe_load(find[-1].read_text())["results"]}
        for need in run["needs"]:
            ours = next(x for x in need["sources"] if x["kind"] == "ours")
            hub = latest.get(need["id"])
            url = (ours.get("start") or ours.get("url") or "").split("#")[0]
            if hub and hub.rstrip("/").split("/")[-1] != url.rstrip("/").split("/")[-1]:
                print(f"note: {need['id']} our page {url} differs from {find[-1].name} hub_page {hub}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
