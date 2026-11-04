"""Make the street base map for the full bus map on /bus-routes/ (#1721).

Writes small GeoJSON files to site/public/bus-map/, drawn by MapLibre GL JS
only when someone opens the full map (decision
docs/decisions/2026-11-04-1500-street-map-on-tap.md). Run by hand when the
base map needs new data; the site build only copies the files.

Source: U.S. Census Bureau TIGER/Line 2024, public domain:
  ROADS/tl_2024_54061_roads.zip         every named road in Monongalia County
  AREAWATER/tl_2024_54061_areawater.zip rivers and lakes
  LINEARWATER/tl_2024_54061_linearwater.zip  creeks (named ones only)
  AREALM/tl_2024_54_arealm.zip          parks, campuses, hospitals
  COUNTY/tl_2024_us_county.zip          the county outline
Usage: pip install pyshp; download and unzip all of them into DIR; then
  python3 site/scripts/make-street-map.py DIR site/public/bus-map
"""
import json, math, os, sys
import shapefile

D, OUT = sys.argv[1], sys.argv[2]
COUNTY = "54061"
# Area landmark types kept as green or tinted shapes.
AREA_KIND = {"K2180": "park", "K2181": "park", "K2182": "park", "K2183": "park", "K2184": "park", "K2185": "park", "K2186": "park", "K2187": "park", "K2188": "park", "K2189": "park", "K2190": "park", "K2540": "campus", "K1231": "hospital", "K2457": "airport"}

def dp(pts, tol):
    """Douglas-Peucker line thinning; handles closed rings."""
    if len(pts) < 3:
        return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    if (x1, y1) == (x2, y2):
        i = max(range(len(pts)), key=lambda k: math.hypot(pts[k][0] - x1, pts[k][1] - y1))
        return dp(pts[: i + 1], tol)[:-1] + dp(pts[i:], tol)
    dx, dy = x2 - x1, y2 - y1
    n = math.hypot(dx, dy) or 1e-12
    far, idx = 0, 0
    for i in range(1, len(pts) - 1):
        x, y = pts[i]
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

def r5(pts):
    return [[round(x, 5), round(y, 5)] for x, y in pts]

# Census shortens water names ("Monongahela Riv"); spell them out for labels.
WATER_WORDS = {"Riv": "River", "Lk": "Lake", "Cr": "Creek", "Crk": "Creek", "Rn": "Run", "Br": "Branch", "Fk": "Fork"}
def water_name(n):
    return " ".join(WATER_WORDS.get(w, w) for w in (n or "").split())

def feature(geom_type, coords, props):
    return {"type": "Feature", "properties": props, "geometry": {"type": geom_type, "coordinates": coords}}

def write(name, feats):
    path = os.path.join(OUT, name)
    text = json.dumps({"type": "FeatureCollection", "features": feats}, separators=(",", ":"))
    open(path, "w").write(text)
    print(f"{name}: {len(feats)} features, {len(text) // 1024} KB")

os.makedirs(OUT, exist_ok=True)

# Roads: class for drawing, name for street labels.
ROAD = {"S1100": "interstate", "S1200": "major", "S1630": "ramp", "S1400": "local"}
TOL = {"interstate": 0.00004, "major": 0.00004, "ramp": 0.00004, "local": 0.00003}
major, local = [], []
for sr in shapefile.Reader(f"{D}/tl_2024_{COUNTY}_roads").iterShapeRecords():
    kind = ROAD.get(sr.record["MTFCC"])
    if not kind:
        continue
    name = sr.record["FULLNAME"].strip()
    for part in parts(sr.shape):
        line = dp(part, TOL[kind])
        if len(line) < 2:
            continue
        f = feature("LineString", r5(line), {"k": kind, **({"n": name} if name else {})})
        (local if kind == "local" else major).append(f)
write("roads-major.json", major)
write("roads-local.json", local)

water = []
for sr in shapefile.Reader(f"{D}/tl_2024_{COUNTY}_areawater").iterShapeRecords():
    if sr.record["AWATER"] < 20000:
        continue
    rings = [r5(dp(ring, 0.00003)) for ring in parts(sr.shape)]
    rings = [r for r in rings if len(r) > 3]
    if rings:
        water.append(feature("Polygon", rings, {"n": water_name(sr.record["FULLNAME"])}))
for sr in shapefile.Reader(f"{D}/tl_2024_{COUNTY}_linearwater").iterShapeRecords():
    if not sr.record["FULLNAME"]:
        continue
    for part in parts(sr.shape):
        line = dp(part, 0.00006)
        if len(line) > 1:
            water.append(feature("LineString", r5(line), {"n": water_name(sr.record["FULLNAME"])}))
write("water.json", water)

areas = []
cbox = None
for sr in shapefile.Reader(f"{D}/tl_2024_us_county").iterShapeRecords():
    if sr.record["GEOID"] == COUNTY:
        cbox = sr.shape.bbox
        rings = [r5(dp(ring, 0.0002)) for ring in parts(sr.shape)]
        write("county.json", [feature("Polygon", rings, {"n": "Monongalia County"})])
for sr in shapefile.Reader(f"{D}/tl_2024_54_arealm").iterShapeRecords():
    kind = AREA_KIND.get(sr.record["MTFCC"])
    b = sr.shape.bbox
    if not kind or not cbox or b[2] < cbox[0] or b[0] > cbox[2] or b[3] < cbox[1] or b[1] > cbox[3]:
        continue
    rings = [r5(dp(ring, 0.00003)) for ring in parts(sr.shape)]
    rings = [r for r in rings if len(r) > 3]
    if rings:
        areas.append(feature("Polygon", rings, {"k": kind, **({"n": sr.record["FULLNAME"]} if sr.record["FULLNAME"] else {})}))
write("areas.json", areas)
