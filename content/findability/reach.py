#!/usr/bin/env python3
"""Count in-person listings by area (#834, from the reach check #112).

Usage:
    python3 content/findability/reach.py

About 72% of Mon County residents live outside Morgantown city limits. This
counts how many of our in-person listings are in Morgantown and how many are
elsewhere in the county, so the rural gap shows on the scoreboard and can move.
It counts our own listings, never people. Hidden entries are skipped.

What counts as in person:
- resources/ with a `contact.place` (an address the source publishes)
- places/ (community centers and halls), by their `area`
- secondhand/ shops with an `address` (online groups are left out)
A listing's town comes from its address. "Morgantown" means a Morgantown
mailing address, which also covers some close-in places outside city limits.
Needs PyYAML.
"""
import re
from collections import Counter
from pathlib import Path

import yaml

CONTENT = Path(__file__).resolve().parent.parent
# Secondhand `area` values that are Morgantown or close in (content/README.md).
SECONDHAND_MORGANTOWN = {"downtown", "mileground", "university-ave"}


def town(address):
    """The town in an address like '100 Main St, Westover, WV 26501'."""
    parts = [p.strip() for p in address.split(",")]
    for p in reversed(parts):
        if re.fullmatch(r"(WV|West Virginia)( \d{5})?", p) or not p:
            continue
        return p
    return address


def load(folder):
    for f in sorted((CONTENT / folder).glob("*.yaml")):
        d = yaml.safe_load(f.read_text()) or {}
        if not d.get("hidden"):
            yield d


def main():
    rows = []  # (kind, where)
    total_resources = 0
    for d in load("resources"):
        total_resources += 1
        place = (d.get("contact") or {}).get("place")
        if place:
            rows.append(("resource", town(place)))
    for d in load("places"):
        rows.append(("community place", "Morgantown" if d.get("area") == "morgantown" else f"county ({d.get('area')})"))
    for d in load("secondhand"):
        if d.get("area") == "online" or not d.get("address"):
            continue
        rows.append(("secondhand", town(d["address"])))

    def bucket(where):
        w = where.lower()
        if w == "morgantown":
            return "Morgantown"
        if w.startswith("county") or w in COUNTY_TOWNS:
            return "Rest of the county"
        return "Outside the county"

    print(f"In-person listings by area ({len(rows)} listings with an address or place)\n")
    for kind in ["resource", "community place", "secondhand"]:
        c = Counter(bucket(w) for k, w in rows if k == kind)
        n = sum(c.values())
        if kind == "resource":
            print(f"Resources: {n} of {total_resources} have an in-person address")
        else:
            print(f"{'Community places' if kind == 'community place' else 'Secondhand shops'}: {n}")
        for b in ["Morgantown", "Rest of the county", "Outside the county"]:
            if c[b]:
                print(f"  {b:20} {c[b]}")
    c = Counter(bucket(w) for _, w in rows)
    share = round(100 * c["Rest of the county"] / len(rows)) if rows else 0
    print(f"\nAll in-person listings: Morgantown {c['Morgantown']}, rest of the county {c['Rest of the county']}"
          f" ({share}%), outside the county {c['Outside the county']}")
    towns = Counter(w for _, w in rows if bucket(w) == "Rest of the county" and not w.startswith("county"))
    if towns:
        print("Towns outside Morgantown with an in-person listing: " + ", ".join(f"{t} {n}" for t, n in sorted(towns.items())))
    other = sorted({w for _, w in rows if bucket(w) == "Outside the county"})
    if other:
        print("Outside the county (check these are right): " + ", ".join(other))


# Mailing towns inside Monongalia County, lower case. A town not listed here
# shows under "Outside the county (check these are right)", so a missing name
# is visible instead of guessed. Some county addresses use a mailing town over
# the line (for example Bruceton Mills); those show there too.
COUNTY_TOWNS = {
    "westover", "star city", "granville", "osage", "cheat lake", "blacksville", "core", "daybrook",
    "maidsville", "wadestown", "arnettsville", "pursglove", "dellslow", "cassville", "brookhaven",
    "sabraton", "industrial park", "monongalia county",
}

if __name__ == "__main__":
    main()
