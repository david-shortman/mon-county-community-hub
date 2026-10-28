#!/usr/bin/env python3
"""Compute findability scores from one run's results file.

Usage:
    python3 content/findability/score.py content/findability/2026-10-28.yaml

Prints the overall score, the score by topic, each dimension's average, and
the lowest and highest scoring questions. Scores are 0 to 100: the sum of each
question's points divided by the most points possible (15 per question).
Needs PyYAML (pip install pyyaml).
"""
import sys
from collections import defaultdict
from pathlib import Path

import yaml

DIMENSIONS = ["found", "steps", "current", "plain", "mobile"]
MAX_PER_QUESTION = 3 * len(DIMENSIONS)


def pct(points, count):
    return round(100 * points / (MAX_PER_QUESTION * count)) if count else 0


def main(path):
    here = Path(__file__).parent
    questions = {q["id"]: q for q in yaml.safe_load((here / "questions.yaml").read_text())["questions"]}
    run = yaml.safe_load(Path(path).read_text())
    results = run["results"]

    by_topic = defaultdict(list)
    dims = defaultdict(int)
    rows = []
    for r in results:
        s = r["scores"]
        total = sum(s[d] for d in DIMENSIONS)
        if total != r.get("total", total):
            print(f"warning: {r['id']} total {r['total']} does not match scores ({total})")
        topic = questions[r["id"]]["topic"]
        by_topic[topic].append(total)
        for d in DIMENSIONS:
            dims[d] += s[d]
        rows.append((total, r["id"], topic, questions[r["id"]]["question"]))

    missing = set(questions) - {r["id"] for r in results} - {
        q for q, v in questions.items() if v.get("retired")
    }
    if missing:
        print(f"warning: no result for {sorted(missing)}")

    n = len(results)
    print(f"Run {run['date']}: {n} questions")
    print(f"Overall findability: {pct(sum(t for t, *_ in rows), n)} / 100\n")
    print("By topic:")
    for topic, totals in sorted(by_topic.items(), key=lambda kv: pct(sum(kv[1]), len(kv[1]))):
        print(f"  {topic:22} {pct(sum(totals), len(totals)):3}  ({len(totals)} questions)")
    print("\nBy dimension (average out of 3):")
    for d in DIMENSIONS:
        print(f"  {d:8} {dims[d] / n:.1f}")
    rows.sort()
    print("\nLowest scoring questions:")
    for total, qid, topic, q in rows[:8]:
        print(f"  {total:2}/15  {qid}  {topic}: {q}")
    print("\nHighest scoring questions:")
    for total, qid, topic, q in rows[-8:][::-1]:
        print(f"  {total:2}/15  {qid}  {topic}: {q}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
