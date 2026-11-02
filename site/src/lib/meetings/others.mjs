// Bodies whose records /meetings/ links but does not read, each checked by
// hand (#13). Kept here so the town pages (/towns/, #1120) can link the same
// records. Each has an `id` so a town page can find its council.
export const OTHER_CHECKED = '2026-10-30';
export const others = [
  { id: 'school-board', name: 'Monongalia County Board of Education', url: 'https://go.boarddocs.com/wv/mono/Board.nsf/Public', link: 'Agendas and minutes on BoardDocs', note: 'That site does not let this page read it, so open the link to see the meetings.' },
  { id: 'star-city', name: 'Star City Town Council', url: 'https://www.starcitywv.com/minutes/', link: 'Signed council minutes, by year', note: 'We found no agendas posted.' },
  { id: 'granville', name: 'Granville Town Council', url: 'https://townofgranvillewv.gov/meeting-minutes-agendas', link: 'Council agendas and minutes', note: 'Posted as Word files.' },
  { id: 'westover', name: 'Westover City Council, Planning Commission and Sewer Board', url: 'https://www.westoverwv.org/government', link: 'Council agendas and minutes, in shared folders linked from the city government page', note: 'The files are scans. Board minutes are linked from the city home page.' },
  { id: 'board-of-health', name: 'Monongalia County Board of Health', url: 'https://www.monchd.org/about', link: 'Meeting agenda, and minutes for 2025 and 2026', note: 'The health department says the board meets the last Thursday in January, March, May, July, September and November at 9 a.m. in its Training Center, with dates subject to change.' },
  { id: 'mpo', name: 'Morgantown Monongalia MPO Policy Board', url: 'https://www.plantogether.org/agendas', link: 'Policy Board agendas and minutes', note: 'Back to 2018, with its committees on the same page.' },
];
