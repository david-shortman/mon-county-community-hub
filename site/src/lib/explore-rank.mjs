// Ranking for the Topics explorer (#2027). No Node imports, so the browser
// script on /topics/ and the tests both use it.
//
// rankPicks(chips, picked, pages): the pages of the picked chips, best first.
//   chips:  [{ id, name, pages: [route] }] in file order
//   picked: [chip id] in any order
//   pages:  { [route]: { label, summary } }; routes without one are skipped
// Ranked by how many picked chips include the page, then by its best place in
// those chips (so the top page of each picked chip comes early), then by the
// chips' order in the file. Each result lists the names of the chips that
// matched, in file order.
export function rankPicks(chips, picked, pages) {
  const want = new Set(picked);
  const found = new Map();
  chips.forEach((c, ci) => {
    if (!want.has(c.id)) return;
    (c.pages ?? []).forEach((route, pos) => {
      const page = pages[route];
      if (!page) return;
      const f = found.get(route) ?? { route, label: page.label, summary: page.summary, chips: [], best: Infinity, firstChip: ci };
      f.chips.push(c.name);
      f.best = Math.min(f.best, pos);
      found.set(route, f);
    });
  });
  return [...found.values()]
    .sort((a, b) => b.chips.length - a.chips.length || a.best - b.best || a.firstChip - b.firstChip)
    .map(({ route, label, summary, chips: names }) => ({ route, label, summary, chips: names }));
}

// Saved picks from storage: only ids that are still chips, each once.
export function cleanPicks(raw, chips) {
  let list = [];
  try { list = JSON.parse(raw ?? '[]'); } catch (e) { return []; }
  if (!Array.isArray(list)) return [];
  const ids = new Set(chips.map((c) => c.id));
  return [...new Set(list.filter((id) => ids.has(id)))];
}
