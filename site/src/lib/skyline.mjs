// The skyline on the menu border (#241): one straight line with very small,
// plain silhouettes of places here sitting on it. Our own simple shapes, not
// traced from photos, maps or art. Each place is sourced in
// docs/design/identity.md ("What makes this place look like itself").
//
// The box is 3840 by 16 units, drawn at 1 unit per pixel on screens up to
// 3840px wide, so shapes never grow or get cut off. It crops from the middle
// instead of stretching, so a phone sees the middle cluster and wide screens
// see more of the line. Shapes are at most 13 units tall.
const W = 3840;
const X0 = 720; // shifts the layout below to the middle of the box
const B = 15.25; // the line, 1.5 thick, so its bottom edge is the box bottom
const n = (v) => +v.toFixed(2);

// Shapes that are filled. Each returns path data.
const building = (x, w, h) => `M${x} ${B}V${n(B - h + 1)}H${n(x - 0.5)}V${n(B - h)}H${n(x + w + 0.5)}V${n(B - h + 1)}H${x + w}V${B}Z`;
const house = (x, w, h, roof, base = B) => `M${x} ${base}V${n(base - h)}L${n(x + w / 2)} ${n(base - h - roof)}L${x + w} ${n(base - h)}V${base}Z`;
const pine = (x, h, w = 6) => `M${n(x - w / 2)} ${n(B - 2)}L${x} ${n(B - h)}L${n(x + w / 2)} ${n(B - 2)}H${n(x + 0.6)}V${B}H${n(x - 0.6)}V${n(B - 2)}Z`;
const roundTree = (x, r, trunk = 3, base = B) => {
  const cy = base - trunk - r;
  return `M${n(x - 0.6)} ${base}V${n(cy)}H${n(x + 0.6)}V${base}Z M${n(x - r)} ${n(cy)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
};
const hill = (x, w, h) => `M${x} ${B}Q${n(x + w / 2)} ${n(B - 2 * h)} ${x + w} ${B}Z`;
const rect = (x, w, h) => `M${x} ${B}V${n(B - h)}H${x + w}V${B}Z`;

// Groups, each a real kind of place here.
const places = {
  // Brick downtown: three storefront blocks of different heights.
  downtown: (x) => [building(x, 8, 10), building(x + 9, 7, 13), building(x + 17, 9, 9)],
  // Wooded hills: a few trees.
  trees: (x) => [pine(x, 10), pine(x + 5, 8, 5), roundTree(x + 11, 3)],
  // Dorsey's Knob: a knob with trees on top.
  knob: (x) => [hill(x, 40, 5), pine(x + 18, 12, 4), pine(x + 22, 13, 4)],
  // Houses stepping up a hillside, as in Sunnyside and Wiles Hill.
  hillside: (x) => [hill(x, 46, 4.5), house(x + 9, 5, 3, 2.5, B - 1.4), house(x + 17, 5, 3, 2.5, B - 3.2), house(x + 25, 5, 3, 2.5, B - 3.6)],
  // The Seneca glass factory: a long low building and its tall stack.
  glassworks: (x) => [rect(x, 22, 6), rect(x + 16, 3, 14)],
  // The Wharf District: two and three story warehouses.
  wharf: (x) => [building(x, 16, 7), building(x + 17, 13, 10)],
};

// Rail-trail truss bridge, drawn as lines: deck, top chord, diagonals, piers.
const bridge = (x) => `M${x} ${B - 5}H${x + 36}M${x + 3} ${B - 5}L${x + 6} ${B - 10}H${x + 30}L${x + 33} ${B - 5}`
  + `M${x + 6} ${B - 5}L${x + 10} ${B - 10}L${x + 14} ${B - 5}L${x + 18} ${B - 10}L${x + 22} ${B - 5}L${x + 26} ${B - 10}L${x + 30} ${B - 5}`
  + `M${x + 3} ${B}V${B - 5}M${x + 33} ${B}V${B - 5}`;

// Where each group sits, before the X0 shift. The middle (about 980 to 1420)
// is what a phone sees.
const layout = [
  ['trees', 590], ['hillside', 700], ['trees', 860], ['wharf', 930],
  ['knob', 1040], ['trees', 1130], ['downtown', 1188], ['glassworks', 1270], ['bridge', 1350], ['trees', 1410],
  ['hillside', 1500], ['downtown', 1620], ['trees', 1700], ['knob', 1780],
];

const fill = [];
const lines = [`M0 ${B}H${W}`];
for (const [kind, x0] of layout) {
  const x = x0 + X0;
  if (kind === 'bridge') lines.push(bridge(x));
  else fill.push(...places[kind](x));
}

export const SKYLINE = { width: W, height: 16, fill: fill.join(''), line: lines.join('') };
