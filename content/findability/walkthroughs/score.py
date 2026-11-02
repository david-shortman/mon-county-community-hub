#!/usr/bin/env python3
"""Score simulated walkthroughs (#529, sprint wave 6). Made-up tasks, not residents.

Usage:
    python3 score.py build tasks.yaml before.json [after.json]   prints a results file (YAML)
    python3 score.py summary 2026-10-31.yaml                     prints averages from a results file

before.json and after.json come from walk.js (after with --after, on a build
that has the fix PRs). Each task gets six scores, 0 to 3, each tied to one
rubric criterion in docs/rubrics/:

  IA1 task success: 3 the tap path reaches the answer and the answer page has
      a phone number or an outside link to act on; 2 the path reaches it;
      1 only search reaches it (top 10); 0 neither.
  IA2 steps: cost = taps + (screens scrolled to reach each link and the
      answer; none for a #section link, which jumps there) / 3. 3 at most 2, 2 at most 4, 1 at most 6, 0 above 6 or a dead end.
  IA7 search: 3 both searches put the answer in the top 3; 2 one does;
      1 one has it in the top 10; 0 neither.
  PL1 reading level of the 150 words from the answer on (rough Flesch-Kincaid):
      3 grade 6 or lower, 2 up to 8, 1 up to 10, 0 above. null when the text
      is a list with no sentences.
  TR1 sources and dates: 3 a checked date on the page, all within 90 days,
      and an outside source link; 2 a checked date; 0 none.
  II1 clear next step: 3 a phone number or outside link to act on; 1 none.

Needs PyYAML.
"""
import json
import sys

import yaml



def target_scores(g):
    a = g["answer"]
    broken = bool(g.get("broken"))
    # A link to a #section jumps straight there, so only count scrolling to the answer without one.
    answer_screens = 0 if "#" in g["url"] else (a.get("markerScreen") or 0)
    screens = sum((s.get("screen") or 0) for s in g["steps"]) + answer_screens
    cost = g["clicks"] + screens / 3
    act = bool([t for t in a.get("tel", []) if len(t) > 3])  # 3-digit lines are on every page, so they do not count or a.get("ext", 0) > 0
    ia2 = 0 if broken else (3 if cost <= 2 else 2 if cost <= 4 else 1 if cost <= 6 else 0)
    gr = a.get("grade")
    pl1 = None if gr is None else (3 if gr <= 6 else 2 if gr <= 8 else 1 if gr <= 10 else 0)
    old = a.get("oldestCheckedDays")
    tr1 = 0 if old is None else (3 if old <= 90 and a.get("ext", 0) > 0 else 2)
    return {"reached": not broken, "act": act, "IA2": ia2, "PL1": pl1, "TR1": tr1, "II1": 3 if act else 1,
            "taps": g["clicks"], "screens": screens, "grade": gr, "oldest_checked_days": old}


def task_scores(t, run):
    per = [target_scores(g) for g in run["targets"]]
    pick = min if t.get("answer") == "all" else max
    # For "all", the weakest target counts; for "any", the strongest.
    best = pick(per, key=lambda p: (p["reached"], p["IA2"]))
    ranks = [s["rank"] for s in run["searches"]]
    top3 = sum(1 for r in ranks if r and r <= 3)
    ia7 = 3 if top3 == len(ranks) else 2 if top3 else 1 if any(ranks) else 0
    reached = all(p["reached"] for p in per) if t.get("answer") == "all" else any(p["reached"] for p in per)
    ia1 = (3 if best["act"] else 2) if reached else (1 if any(ranks) else 0)
    scores = {"IA1": ia1, "IA2": best["IA2"], "IA7": ia7, "PL1": best["PL1"], "TR1": best["TR1"], "II1": best["II1"]}
    vals = [v for v in scores.values() if v is not None]
    return {
        "taps": best["taps"],
        "screens_scrolled": best["screens"],
        "dead_end": None if reached else next(g["broken"] for g in run["targets"] if g.get("broken")),
        "search": [{"q": s["q"], "rank": s["rank"], "top3": s["top3"]} for s in run["searches"]],
        "reading_grade": best["grade"],
        "oldest_checked_days": best["oldest_checked_days"],
        "scores": scores,
        "total": sum(vals),
        "out_of": 3 * len(vals),
    }


def build(tasks_file, before_file, after_file=None):
    tasks = yaml.safe_load(open(tasks_file))
    before = {r["id"]: r for r in json.load(open(before_file))}
    after = {r["id"]: r for r in json.load(open(after_file))} if after_file else {}
    out = []
    for t in tasks:
        row = {"id": t["id"], "task": t["task"], "who": t["who"], "group": t.get("group"), "need": t.get("need")}
        row["before"] = task_scores(t, before[t["id"]])
        if t["id"] in after:
            tt = dict(t)
            if t.get("after_path"):
                tt["targets"] = [{**t["targets"][0], **t["after_path"]}]
            row["after"] = task_scores(tt, after[t["id"]])
        out.append(row)
    return out


def summary(rows, key):
    keys = ["IA1", "IA2", "IA7", "PL1", "TR1", "II1"]
    have = [r[key] for r in rows if key in r]
    if not have:
        return None
    avg = {}
    for k in keys:
        v = [h["scores"][k] for h in have if h["scores"][k] is not None]
        avg[k] = round(sum(v) / len(v), 2) if v else None
    pts = sum(h["total"] for h in have)
    most = sum(h["out_of"] for h in have)
    return {
        "tasks": len(have),
        "score": round(100 * pts / most),
        "averages": avg,
        "dead_ends": sum(1 for h in have if h["dead_end"]),
        "searches_top3": sum(1 for h in have for s in h["search"] if s["rank"] and s["rank"] <= 3),
        "searches": sum(len(h["search"]) for h in have),
        "average_taps": round(sum(h["taps"] for h in have) / len(have), 1),
    }


if __name__ == "__main__":
    if len(sys.argv) >= 4 and sys.argv[1] == "build":
        rows = build(*sys.argv[2:5])
        print(yaml.safe_dump({"summary": {"before": summary(rows, "before"), "after": summary(rows, "after")}, "results": rows}, sort_keys=False, allow_unicode=True, width=110))
    elif len(sys.argv) == 3 and sys.argv[1] == "summary":
        rows = yaml.safe_load(open(sys.argv[2]))["results"]
        print(yaml.safe_dump({"before": summary(rows, "before"), "after": summary(rows, "after")}, sort_keys=False))
    else:
        sys.exit(__doc__)
