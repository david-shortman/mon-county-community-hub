// State lawmakers for Mon County (#1766): the state House and Senate districts
// that cover part of Monongalia County, and each member's official page.
// Every fact comes from wvlegislature.gov: the House and Senate rosters and
// each member's page, which lists the district and the counties it covers.
// `covers` is the member page's "District Counties" line, word for word.
// Names and districts only. No party, nothing about votes or positions.
// Re-check after each election, appointment or resignation, and at least
// every 90 days.
const day = '2026-11-14';
const senateRoster = 'https://www.wvlegislature.gov/Senate1/roster.cfm';
const houseRoster = 'https://www.wvlegislature.gov/House/roster.cfm';
const member = (chamber, title, last) => `https://www.wvlegislature.gov/${chamber}/lawmaker.cfm?member=${encodeURIComponent(`${title} ${last}`)}`;

// The Legislature's own address lookup on its ArcGIS site, linked from its
// Redistricting page as "Official Interactive District Maps".
export const districtSearch = {
  url: 'https://wvlegislature.maps.arcgis.com/apps/instant/lookup/index.html?appid=7eebb7df971a4652a3d7375f3a3de9df',
  sources: [
    { url: 'https://www.wvlegislature.gov/redistricting.cfm', checked: day },
    { url: 'https://wvlegislature.maps.arcgis.com/home/index.html', checked: day },
  ],
};

// The Lawmaker Search, down for maintenance when last checked.
export const lawmakerSearch = { url: 'https://joint.wvlegislature.gov/lawmaker-search/', checked: day };

export const senate = [
  {
    district: 2,
    covers: 'Marshall (part), Wetzel, Tyler, Doddridge, Marion (part), Monongalia (part)',
    members: [
      { name: 'Charles H. Clements', url: member('Senate1', 'Senator', 'Clements') },
      { name: 'Chris Rose', url: member('Senate1', 'Senator', 'Rose') },
    ],
  },
  {
    district: 13,
    covers: 'Marion (part), Monongalia (part)',
    members: [
      { name: 'Joey Garcia', url: member('Senate1', 'Senator', 'Garcia') },
      { name: 'Mike Oliverio', url: member('Senate1', 'Senator', 'Oliverio') },
    ],
  },
];

export const house = [
  { district: 77, covers: 'Monongalia, Wetzel', members: [{ name: 'Joe Statler', url: member('House', 'Delegate', 'Statler') }] },
  { district: 78, covers: 'Monongalia', members: [{ name: 'Geno Chiarelli', url: member('House', 'Delegate', 'Chiarelli') }] },
  { district: 79, covers: 'Monongalia', members: [{ name: 'Evan Hansen', url: member('House', 'Delegate', 'Hansen') }] },
  { district: 80, covers: 'Monongalia', members: [{ name: 'John Williams', url: member('House', 'Delegate', 'Williams') }] },
  { district: 81, covers: 'Monongalia', members: [{ name: 'Anitra Hamilton', url: member('House', 'Delegate', 'Hamilton') }] },
  { district: 82, covers: 'Monongalia', members: [{ name: 'David McCormick', url: member('House', 'Delegate', 'McCormick') }] },
];

export const sources = {
  senate: [{ url: senateRoster, checked: day }, ...senate.flatMap((d) => d.members.map((m) => ({ url: m.url, checked: day })))],
  house: [{ url: houseRoster, checked: day }, ...house.flatMap((d) => d.members.map((m) => ({ url: m.url, checked: day })))],
};
export const rosters = { senate: senateRoster, house: houseRoster };
