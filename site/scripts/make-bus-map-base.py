"""Make content/bus-map/base.json: the river and the two interstates for the
bus trip map on /bus-routes/ (#1656). Run by hand when the drawing needs new
lines; the build only reads the JSON.

Source: U.S. Census Bureau TIGER/Line 2024 (public domain):
  AREAWATER/tl_2024_54061_areawater.zip   (Monongahela River, Monongalia County)
  PRISECROADS/tl_2024_54_prisecroads.zip  (I-79 and I-68)
Usage: pip install pyshp; download and unzip both into DIR; then
  python3 site/scripts/make-bus-map-base.py DIR content/bus-map/base.json
Lines are cut to the map box and thinned (Douglas-Peucker, about 40 m).
"""
import json, math, sys
import shapefile

BOX = (-80.36, 39.56, -79.86, 39.74)   # west, south, east, north
TOL = 0.0004                            # degrees, about 40 m

def inbox(p):
    return BOX[0] <= p[0] <= BOX[2] and BOX[1] <= p[1] <= BOX[3]

def dp(pts, tol):
    if len(pts) < 3:
        return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    if (x1, y1) == (x2, y2):  # a closed ring: split at the point farthest from the start
        i = max(range(len(pts)), key=lambda k: math.hypot(pts[k][0] - x1, pts[k][1] - y1))
        return dp(pts[: i + 1], tol)[:-1] + dp(pts[i:], tol)
    dx, dy = x2 - x1, y2 - y1
    n = math.hypot(dx, dy) or 1e-12
    far, idx = 0, 0
    for i, (x, y) in enumerate(pts[1:-1], 1):
        d = abs(dy * x - dx * y + x2 * y1 - y2 * x1) / n
        if d > far:
            far, idx = d, i
    if far <= tol:
        return [pts[0], pts[-1]]
    return dp(pts[: idx + 1], tol)[:-1] + dp(pts[idx:], tol)

def parts(shape):
    idx = list(shape.parts) + [len(shape.points)]
    for a, b in zip(idx, idx[1:]):
        yield shape.points[a:b]

def runs(pts):
    """Split a line into the runs that are inside the box."""
    cur = []
    for p in pts:
        if inbox(p):
            cur.append(p)
        elif cur:
            yield cur
            cur = []
    if cur:
        yield cur

def rnd(pts):
    return [[round(x, 4), round(y, 4)] for x, y in pts]

d = sys.argv[1]
out = {"source": "U.S. Census Bureau, TIGER/Line 2024: areawater (54061) and primary and secondary roads (54), simplified", "river": [], "roads": {}}
for sr in shapefile.Reader(f"{d}/tl_2024_54061_areawater").iterShapeRecords():
    if sr.record["FULLNAME"] == "Monongahela Riv":
        for ring in parts(sr.shape):
            ring = dp(ring, TOL / 2)
            if len(ring) > 3:
                out["river"].append(rnd(ring))
for sr in shapefile.Reader(f"{d}/tl_2024_54_prisecroads").iterShapeRecords():
    name = sr.record["FULLNAME"]
    if name in ("I- 79", "I- 68"):
        key = name.replace(" ", "")
        for part in parts(sr.shape):
            for run in runs(part):
                run = dp(run, TOL)
                if len(run) > 1:
                    out["roads"].setdefault(key, []).append(rnd(run))
json.dump(out, open(sys.argv[2], "w"), separators=(",", ":"))
print({k: len(v) for k, v in out["roads"].items()}, "river rings", len(out["river"]), "points", sum(map(len, out["river"])))
