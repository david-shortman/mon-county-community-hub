#!/usr/bin/env python3
"""Count in-person listings by place (#834, from the reach check #112; by Census place since #1412).

Usage:
    python3 content/findability/reach.py             # count, using the saved lookups
    python3 content/findability/reach.py --geocode   # first look up new addresses

About 72% of Mon County residents live outside Morgantown city limits. This
counts how many of our in-person listings are in the city and how many are
elsewhere in the county, so the rural gap shows on the scoreboard and can move.
It counts our own listings, never people. Hidden entries are skipped.

What counts as in person:
- resources/ with a `contact.place` (an address the source publishes)
- places/ (community centers and halls); one with no address counts by its
  `area` and `community`
- secondhand/ shops with an `address` (online groups are left out)

Where a listing is: the Census place its address is in (a city, a town or a
census-designated place like Cheat Lake), from the U.S. Census Bureau's free
geocoder. A "Morgantown, WV" mailing address covers Cheat Lake, Brookhaven and
other places outside the city, so the mailing town is never used to decide
(the same rule as the town pages, #1120). The lookups are saved in
reach-places.yaml beside this file, with the day each was made, so a run
needs no network. `--geocode` looks up addresses not in that file, one at a
time; the geocoder has no robots.txt and needs no key. An address the
geocoder cannot match is counted by its mailing town and reported, so a gap
is visible instead of guessed.
Needs PyYAML.
"""
import datetime
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from collections import Counter
from pathlib import Path

import yaml

CONTENT = Path(__file__).resolve().parent.parent
LOOKUPS = Path(__file__).resolve().parent / "reach-places.yaml"
GEOCODER = "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress"
CITY = "Morgantown city"
COUNTY = "Monongalia County"
NO_PLACE = "county, outside any town or named place"
# Topics worth a line of their own, as they appear on resources.
TOPIC_LINES = [("food", "Food help"), ("health", "Health care"), ("housing", "Housing and shelter"), ("money", "Money, jobs and benefits")]


def town(address):
    """The mailing town in an address like '100 Main St, Westover, WV 26501'."""
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
            d["_file"] = f"{folder}/{f.name}"
            yield d


ABBREV = {"road": "rd", "street": "st", "avenue": "ave", "drive": "dr", "lane": "ln", "boulevard": "blvd",
          "highway": "hwy", "court": "ct", "place": "pl", "circle": "cir", "parkway": "pkwy", "four": "4",
          "south": "s", "north": "n", "east": "e", "west": "w", "greenbag": "green bag"}


def street_words(text):
    """House number and street name words, for comparing our address with the geocoder's match."""
    for part in text.split(","):
        m = re.match(r"\s*(\d+)\s+(.+)", part)
        if m:
            words = re.sub(r"[^a-z0-9 ]", " ", m.group(2).lower().replace("'", "")).split()
            words = " ".join(ABBREV.get(w, w) for w in words).split()
            return m.group(1), [w for w in words if w not in {"s", "n", "e", "w"}]
    return None, []


def same_street(ours, matched):
    """True when the match has our house number and street name (the geocoder sometimes
    returns a near miss, like Hawley Lane for Fawley Lane)."""
    n1, w1 = street_words(ours)
    n2, w2 = street_words(matched)
    return n1 is not None and n1 == n2 and w1[:len(w2)] == w2


def read_lookups():
    if not LOOKUPS.exists():
        return {}
    return (yaml.safe_load(LOOKUPS.read_text()) or {}).get("addresses") or {}


def geocode(address):
    """Ask the Census geocoder which county and place an address is in."""
    q = urllib.parse.urlencode({
        "address": address, "benchmark": "Public_AR_Current", "vintage": "Current_Current",
        "layers": "Incorporated Places,Census Designated Places,Counties", "format": "json",
    })
    req = urllib.request.Request(f"{GEOCODER}?{q}", headers={"User-Agent": "MonCountyCommunityHub reach count (github.com/david-shortman/mon-county-community-hub)"})
    with urllib.request.urlopen(req, timeout=30) as r:
        matches = json.load(r)["result"]["addressMatches"]
    found = set()
    for m in matches:
        g = m["geographies"]
        county = ", ".join(x["NAME"] for x in g.get("Counties", []))
        place = ", ".join(x["NAME"] for x in g.get("Incorporated Places", []) + g.get("Census Designated Places", []))
        found.add((county, place or NO_PLACE, m["matchedAddress"]))
    if not found:
        return {"result": "no match"}
    if len({(c, p) for c, p, _ in found}) > 1:
        return {"result": "matches disagree", "matches": sorted(f"{a}: {p}, {c}" for c, p, a in found)}
    county, place, matched = sorted(found)[0]
    return {"county": county, "place": place, "matched": matched}


def update_lookups(addresses):
    saved = read_lookups()
    new = [a for a in sorted(addresses) if a not in saved]
    today = datetime.date.today().isoformat()
    for i, a in enumerate(new):
        try:
            saved[a] = {**geocode(a), "checked": today}
        except Exception as e:  # network trouble: leave it for the next run
            print(f"  could not look up {a}: {e}", file=sys.stderr)
        if i < len(new) - 1:
            time.sleep(1)
    header = (
        "# Which Census place each in-person listing's address is in (#1412).\n"
        "# Made by `python3 content/findability/reach.py --geocode` from the U.S. Census\n"
        f"# Bureau's geocoder ({GEOCODER}).\n"
        "# `place` is the city, town or census-designated place, or\n"
        f"# \"{NO_PLACE}\". `checked` is the day of the lookup.\n"
        "# Fix a wrong match by hand and say why in `note`.\n"
    )
    LOOKUPS.write_text(header + yaml.safe_dump({"source": GEOCODER, "addresses": dict(sorted(saved.items()))}, sort_keys=False, allow_unicode=True, width=200))
    print(f"Looked up {len(new)} new address{'es' if len(new) != 1 else ''}; {len(saved)} saved in {LOOKUPS.name}\n")


def main():
    rows = []  # dicts: kind, topics, address, area, community
    total_resources = 0
    for d in load("resources"):
        total_resources += 1
        place = (d.get("contact") or {}).get("place")
        if place:
            rows.append({"kind": "resource", "topics": d.get("topics") or [], "address": place})
    for d in load("places"):
        rows.append({"kind": "community place", "topics": [], "address": (d.get("contact") or {}).get("place"),
                     "area": d.get("area"), "community": d.get("community")})
    for d in load("secondhand"):
        if d.get("area") == "online" or not d.get("address"):
            continue
        rows.append({"kind": "secondhand", "topics": [], "address": d["address"]})

    if "--geocode" in sys.argv:
        update_lookups({r["address"] for r in rows if r.get("address")})
    lookups = read_lookups()

    unmatched = []
    for r in rows:
        a = r.get("address")
        hit = lookups.get(a) if a else None
        if hit and hit.get("place") and not same_street(a, hit.get("matched", "")):
            hit = {**hit, "result": f"matched a different street: {hit.get('matched')}", "place": None}
            lookups[a] = hit
        if hit and hit.get("place"):
            if hit.get("county") != COUNTY:
                r["where"], r["bucket"] = f"outside the county ({town(a)})", "Outside the county"
            else:
                r["where"] = hit["place"]
                r["bucket"] = "Morgantown city" if hit["place"] == CITY else "Rest of the county"
        elif a:
            # Not looked up yet or no match: fall back to the mailing town, and say so.
            unmatched.append(a)
            mt = town(a).lower()
            r["where"] = f"not placed yet ({town(a)} mailing address)"
            r["bucket"] = "Morgantown city" if mt == "morgantown" else ("Rest of the county" if mt in COUNTY_TOWNS else "Outside the county")
        else:
            # A community place with no address: its area and community, set by hand from its source.
            in_city = r.get("area") == "morgantown"
            r["where"] = "Morgantown city (no address; by area)" if in_city else f"{r.get('community') or r.get('area')} (no address; by community)"
            r["bucket"] = "Morgantown city" if in_city else "Rest of the county"

    print(f"In-person listings by Census place ({len(rows)} listings with an address or place)\n")
    for kind, label in [("resource", "Resources"), ("community place", "Community places"), ("secondhand", "Secondhand shops")]:
        c = Counter(r["bucket"] for r in rows if r["kind"] == kind)
        n = sum(c.values())
        print(f"Resources: {n} of {total_resources} have an in-person address" if kind == "resource" else f"{label}: {n}")
        for b in ["Morgantown city", "Rest of the county", "Outside the county"]:
            if c[b]:
                print(f"  {b:20} {c[b]}")

    c = Counter(r["bucket"] for r in rows)
    share = round(100 * c["Rest of the county"] / len(rows)) if rows else 0
    # The scorecard reads this line (site/scripts/scorecard.mjs). "Morgantown" here means the city.
    print(f"\nAll in-person listings: Morgantown {c['Morgantown city']}, rest of the county {c['Rest of the county']}"
          f" ({share}%), outside the county {c['Outside the county']}")

    places = Counter(r["where"] for r in rows if r["bucket"] == "Rest of the county")
    print("\nRest of the county, by place:")
    for p, n in sorted(places.items(), key=lambda x: (-x[1], x[0])):
        print(f"  {p:55} {n}")
    mt = [r for r in rows if r.get("address") and town(r["address"]).lower() == "morgantown"]
    mt_in = sum(1 for r in mt if r["where"] == CITY)
    mt_out = sum(1 for r in mt if r["bucket"] == "Rest of the county")
    print(f"\nListings with a Morgantown mailing address: {len(mt)}. In the city: {mt_in}. "
          f"Elsewhere in the county: {mt_out}. Not placed yet: {len(mt) - mt_in - mt_out}.")

    print("\nBy topic (resources only; a resource can have more than one topic):")
    for topic, label in TOPIC_LINES:
        t = Counter(r["bucket"] for r in rows if r["kind"] == "resource" and topic in r["topics"])
        rest = Counter(r["where"] for r in rows if r["kind"] == "resource" and topic in r["topics"] and r["bucket"] == "Rest of the county")
        where = f": {', '.join(f'{p} {n}' for p, n in sorted(rest.items()))}" if rest else ""
        print(f"  {label:26} city {t['Morgantown city']}, rest of the county {t['Rest of the county']}{where}")
    print("  Food pantries and meal sites are not listings yet, so they are not counted (#1413).")

    other = sorted({r["where"] for r in rows if r["bucket"] == "Outside the county"})
    if other:
        print("\nOutside the county (check these are right): " + ", ".join(other))
    if unmatched:
        print(f"\nNot placed yet ({len(unmatched)}; counted by mailing town, run with --geocode or fix by hand in {LOOKUPS.name}):")
        for a in sorted(set(unmatched)):
            hit = lookups.get(a)
            print(f"  {a}" + (f" ({hit.get('result')})" if hit else " (not looked up)"))


# Mailing towns inside Monongalia County, lower case. Used only for an address
# the geocoder could not place.
COUNTY_TOWNS = {
    "westover", "star city", "granville", "osage", "cheat lake", "blacksville", "core", "daybrook",
    "maidsville", "wadestown", "arnettsville", "pursglove", "dellslow", "cassville", "brookhaven",
    "sabraton", "industrial park", "monongalia county",
}

if __name__ == "__main__":
    main()
