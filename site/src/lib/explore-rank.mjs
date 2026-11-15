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

// Pages that Pass it on hides (#157, #555): domestic and sexual violence help.
// They get no Save button and never go in a saved, copied or texted list,
// since a list on the phone leaves a trace someone else might see.
export const QUIET_ROUTES = ['/protective-orders/', '/life-events/leaving-an-unsafe-home/'];
export const isQuietPage = (route, page = {}) =>
  QUIET_ROUTES.includes(route) || /domestic|sexual (assault|violence)|abuse/i.test(`${page.label ?? ''} ${page.summary ?? ''}`);

// Flip through (#2028): a deck of routes, one card at a time.
// state: { routes, i, log: [{ route, act, added }] }. `saved` is My list's
// routes in the order saved. Each call returns new values and changes nothing.
export const newDeck = (routes) => ({ routes: [...routes], i: 0, log: [] });
export function deckAct(state, saved, act) {
  if (act === 'back') {
    if (!state.log.length) return { state, saved };
    const last = state.log[state.log.length - 1];
    return {
      state: { ...state, i: state.i - 1, log: state.log.slice(0, -1) },
      saved: last.act === 'save' && last.added ? saved.filter((r) => r !== last.route) : saved,
    };
  }
  if (state.i >= state.routes.length || (act !== 'save' && act !== 'skip')) return { state, saved };
  const route = state.routes[state.i];
  const added = act === 'save' && !saved.includes(route);
  return {
    state: { ...state, i: state.i + 1, log: [...state.log, { route, act, added }] },
    saved: added ? [...saved, route] : saved,
  };
}
// How many cards in this run were saved.
export const deckSavedCount = (state) => state.log.filter((l) => l.act === 'save').length;
