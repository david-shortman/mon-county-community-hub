// The time strip on When plans and budgets get decided (#1444). One SVG per
// step; data-z says how far it is zoomed out: "1" one budget year, "5" the
// 5-year capital plan, "10" the comprehensive plan's ten years, "now" back
// to this year with the times to speak marked. Every date in the drawing is
// also in the page text with its source; the drawing is aria-hidden.
// Facts: W. Va. Code 11-8-9 and 11-8-14 (levy estimate meetings March 7 to
// 28; cities meet again on the third Tuesday in April), the city's Finance
// page (budget year July 1 to June 30), the 2027-2031 capital plan, and the
// Morgantown 2033 (adopted by Council December 19, 2023), the county
// comprehensive plan (adopted February 1, 2023), the school excess levy on
// the May 12, 2026 ballot (fiscal years from July 1, 2027 to July 1, 2030),
// and the schools' 2020-2030 facilities plan.

export const ZOOMS = ['1', '5', '10', 'now'];

// Months of a budget year, July first.
export const MONTHS = ['J', 'A', 'S', 'O', 'N', 'D', 'J', 'F', 'M', 'A', 'M', 'J'];

// Position (0 to 1) of a day in a budget year that starts July 1.
// month is 1 to 12, day 1 to 31. Uses a 365 day year; close enough for a sketch.
export function yearPos(month, day) {
  const lens = [31, 31, 30, 31, 30, 31, 31, 28, 31, 30, 31, 30]; // Jul..Jun
  const idx = (month + 5) % 12; // July -> 0
  let d = 0;
  for (let i = 0; i < idx; i++) d += lens[i];
  return (d + day - 1) / 365;
}

const X0 = 16, X1 = 304, W = X1 - X0;
const x = (p) => +(X0 + p * W).toFixed(1);

function yearStrip(markNow) {
  const ticks = MONTHS.map((m, i) => {
    const xi = x(i / 12);
    return `<path class="tk" d="M${xi} 52v10"/><text class="tm" x="${+(xi + W / 24).toFixed(1)}" y="76" text-anchor="middle">${m}</text>`;
  }).join('');
  const a = x(yearPos(3, 7)), b = x(yearPos(3, 28));
  const apr = x(yearPos(4, 15)); // the third Tuesday falls between April 15 and 21
  return `<g class="yr">
  <text class="tb" x="${X0}" y="20">One budget year</text>
  <text class="tx" x="${X0}" y="40">July 1</text><text class="tx" x="${X1}" y="40" text-anchor="end">June 30</text><text class="tx" x="160" y="40" text-anchor="middle">City, county, schools</text>
  <rect class="bar" x="${X0}" y="52" width="${W}" height="10"/>
  ${ticks}
  <rect class="hot" x="${a}" y="48" width="${+(b - a).toFixed(1)}" height="18"/>
  <rect class="hot" x="${apr}" y="48" width="5" height="18"/>
  <text class="tx th" x="${a}" y="98" text-anchor="middle">March 7 to 28</text>
  <text class="tx th" x="${apr + 6}" y="112">3rd Tuesday</text><text class="tx th" x="${apr + 6}" y="124">in April</text>
  <g class="idea"><path class="pin" d="M${a + 8} 132l-6 -10h12z"/>${markNow === null
    ? `<text class="tidea t-idea" x="${a + 8}" y="146" text-anchor="middle">Your idea</text><text class="tidea t-now" x="${a + 8}" y="146" text-anchor="middle">Speak here</text>`
    : `<text class="tidea" x="${a + 8}" y="146" text-anchor="middle">${markNow ? 'Speak here' : 'Your idea'}</text>`}</g>
</g>`;
}

function fiveStrip() {
  const years = ['2026-27', '2027-28', '2028-29', '2029-30', '2030-31'];
  const cw = W / 5;
  const cells = years.map((y, i) => `<rect class="${i === 0 ? 'cell now' : 'cell'}" x="${x(i / 5)}" y="52" width="${+cw.toFixed(1)}" height="20"/><text class="tm" x="${+(x(i / 5) + cw / 2).toFixed(1)}" y="88" text-anchor="middle">${y}</text>`).join('');
  return `<g class="five">
  <text class="tb" x="${X0}" y="20">5-year capital plan, 2027-2031</text>
  <text class="tx" x="${X0}" y="40">This budget year is one slot</text>
  ${cells}
  <rect class="ln1" x="${x(1 / 5) + 4}" y="100" width="${+(cw - 8).toFixed(1)}" height="10"/>
  <text class="tx" x="${x(1 / 5) + 4}" y="124">Downtown master plan</text>
  <rect class="ln2" x="${x(1 / 5) + 4}" y="132" width="${+(3 * cw - 8).toFixed(1)}" height="10"/>
  <text class="tx" x="${x(1 / 5) + 4}" y="156">Wayfinding and gateway signs</text>
  <rect class="ln3" x="${x(1 / 5) + 4}" y="164" width="${+(4 * cw - 8).toFixed(1)}" height="10"/>
  <text class="tx" x="${x(1 / 5) + 4}" y="188">School excess levy, July 2027 to June 2031</text>
</g>`;
}

function tenStrip() {
  // 2023 to 2033, one tick a year. The 5-year plan covers July 2026 to June 2031.
  const yrs = Array.from({ length: 11 }, (_, i) => 2023 + i);
  const px = (yr) => x((yr - 2023) / 10);
  const ticks = yrs.map((y) => `<path class="tk" d="M${px(y)} 52v20"/>`).join('');
  const labels = [2023, 2026, 2031, 2033].map((y) => `<text class="tm" x="${px(y)}" y="88" text-anchor="middle">${y}</text>`).join('');
    return `<g class="ten">
  <text class="tb" x="${X0}" y="20">Comprehensive plan: Morgantown 2033</text>
  <text class="tx" x="${X0 + 14}" y="44">County plan adopted Feb 2023</text>
  <rect class="bar" x="${X0}" y="56" width="${W}" height="12"/>
  ${ticks}
  <rect class="cell now" x="${px(2026.5)}" y="52" width="${+(px(2031.5) - px(2026.5)).toFixed(1)}" height="20"/>
  ${labels}
  <text class="tx" x="${+((px(2026.5) + px(2031.5)) / 2).toFixed(1)}" y="110" text-anchor="middle">5-year capital plan</text>
  <path class="pin" d="M${px(2023 + 11.6 / 12)} 136l-6 -10h12z"/>
  <text class="tx th" x="${X0}" y="152">City final reading Dec 2023</text>
  <path class="pin2" d="M${px(2023 + 1 / 12)} 52l-6 -10h12z"/>
  <rect class="ln3" x="${X0}" y="164" width="${+(px(2030.5) - X0).toFixed(1)}" height="10"/>
  <path class="ln3" d="M${X0 - 2} 162l-10 7 10 7z"/>
  <text class="tx" x="${X0}" y="188">School facilities plan, 2020 to 2030</text>
</g>`;
}

export function strip(z) {
  if (!ZOOMS.includes(z)) throw new RangeError(`zoom ${z}`);
  const body = z === '1' ? yearStrip(false) : z === '5' ? fiveStrip() : z === '10' ? tenStrip() : yearStrip(true);
  return `<svg class="dc-strip" data-z="${z}" viewBox="0 0 320 ${z === '1' || z === 'now' ? 154 : 196}" aria-hidden="true" focusable="false">${body}</svg>`;
}

// One drawing for the scroll story: all three strips in one picture. CSS on the
// page shows one at a time by data-z and, with motion on, zooms between them:
// the year shrinks into the first slot of the 5-year plan, and the 5-year plan
// shrinks into its place on the ten years.
export function stage() {
  return `<svg class="dc-strip dc-stage-svg" data-z="1" viewBox="0 0 320 196" aria-hidden="true" focusable="false">
  <g class="z z-yr">${yearStrip(null)}</g>
  <g class="z z-five">${fiveStrip()}</g>
  <g class="z z-ten">${tenStrip()}</g>
</svg>`;
}
