// Who sets the rules for this (#1689): the public bodies a need's record names
// in `decided_by`, joined with what /who-decides/ already says about each one
// (when it meets) and with content/boards/ (open seats for residents).
// Describe only: what each body decides, never what it should do.
import { loadDir } from './content.mjs';
import { body } from './who-decides.mjs';

// Each source URL once, keeping its newest checked date.
const onceEach = (list) => {
  const m = new Map();
  for (const x of list) if (!m.has(x.url) || String(x.checked) > String(m.get(x.url).checked)) m.set(x.url, x);
  return [...m.values()];
};

export function ruleSetters(needSlug) {
  const need = loadDir('needs').find((n) => n.slug === needSlug);
  if (!need) throw new Error(`rule-setters: no need "${needSlug}" in content/needs/`);
  const boards = new Map(loadDir('boards').map((b) => [b.slug, b]));
  return (need.decided_by ?? []).map((d) => {
    const b = body(d.body);
    if (!b) throw new Error(`rule-setters: ${needSlug} names body "${d.body}", which is not in who-decides.mjs`);
    const board = d.board ? boards.get(d.board) : null;
    return {
      id: b.id,
      name: b.name,
      decides: d.decides,
      meets: b.meets,
      openSeats: board?.open_seats > 0 ? board.open_seats : 0,
      board: board?.slug ?? null,
      // The decides line's own sources, then /who-decides/'s (for when it
      // meets), then the board file's (for open seats), each URL once.
      sources: onceEach([...d.sources, ...(b.sources ?? []), ...(board?.open_seats > 0 ? board.sources ?? [] : [])]),
    };
  });
}
