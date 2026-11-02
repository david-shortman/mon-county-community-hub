// The not-to-scale drawing for the example first week without a car (#1442).
// One SVG; data-s (1 to 5) says which step it shows, and CSS on the page
// turns parts on. Each trip stays drawn on later steps, so by step 5 the
// whole week is on the drawing. Places: home (an example), downtown, Pifer
// Terminal (where Route 9 Purple Line starts and where the Grey Line leaves
// from), Ruby Memorial Hospital, and the way out of town toward Pittsburgh.
// Facts behind it: content/resources/bus-to-ruby-memorial.yaml,
// mountain-line-fares.yaml and grey-line-pittsburgh.yaml. Fares and times are
// never drawn; they stay in the card text.

export const STEPS = 5;

// Which parts show at each step. Kept here so a test can check that a trip,
// once drawn, stays drawn.
export const PARTS = {
  1: ['pay'],
  2: ['fare'],
  3: ['trip-doc', 'bus-doc'],
  4: ['trip-doc', 'trip-air', 'bus-air'],
  5: ['trip-doc', 'trip-air', 'lbl-doc', 'lbl-air'],
};

export function scene(s) {
  if (!Number.isInteger(s) || s < 1 || s > STEPS) throw new RangeError(`step ${s}`);
  return `<svg class="wk-scene" data-s="${s}" viewBox="0 0 320 196" aria-hidden="true" focusable="false">
  <path class="route" d="M40 150L118 96L180 70L272 38"/>
  <text class="tx" x="200" y="96">Purple Line</text>
  <path class="road" d="M40 150L40 176H316"/>
  <g class="e e-trip-doc"><path class="trip" d="M92 122L118 96L180 70L272 38"/></g>
  <g class="e e-trip-air"><path class="trip2" d="M92 122L40 150"/><path class="trip3" d="M40 150L40 176H300"/><path class="arrh3" d="M298 170l12 6-12 6z"/></g>
  <rect class="stop" x="30" y="140" width="20" height="20" rx="2"/>
  <text class="tb" x="4" y="192">Pifer Terminal</text>
  <rect class="stop" x="262" y="28" width="20" height="20" rx="2"/>
  <text class="tb" x="200" y="20">Ruby Memorial</text>
  <circle class="dn" cx="118" cy="96" r="5"/>
  <text class="tx" x="70" y="90">Downtown</text>
  <circle class="home" cx="92" cy="122" r="7"/>
  <text class="tb" x="104" y="134">Home</text>
  <text class="tx" x="104" y="146">(example)</text>
  <text class="tx" x="196" y="168">Toward Pittsburgh</text>
  <g class="e e-pay">
    <rect class="chip" x="160" y="112" width="70" height="18" rx="2"/><text class="tx tc" x="166" y="125">Coins, bill</text>
    <rect class="chip" x="236" y="112" width="44" height="18" rx="2"/><text class="tx tc" x="242" y="125">Pass</text>
    <rect class="chip" x="160" y="136" width="44" height="18" rx="2"/><text class="tx tc" x="166" y="149">App</text>
  </g>
  <g class="e e-fare">
    <path class="tag" d="M150 102h112l8 9-8 9H150z"/>
    <text class="tx tc" x="156" y="115">Free, half or full fare?</text>
  </g>
  <g class="e e-bus-doc"><g class="bus bus-doc"><rect class="bs" x="-9" y="-6" width="18" height="12" rx="2"/></g></g>
  <g class="e e-bus-air"><g class="bus bus-air"><rect class="bs2" x="-9" y="-6" width="18" height="12" rx="2"/></g></g>
  <g class="e e-lbl-doc"><text class="tx tc" x="214" y="72">Doctor's visit</text></g>
  <g class="e e-lbl-air"><text class="tx tc" x="230" y="192">Airport trip</text></g>
</svg>`;
}
