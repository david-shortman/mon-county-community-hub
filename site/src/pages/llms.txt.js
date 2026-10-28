export function GET({ site }) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const u = (p) => new URL(`${base}${p}`, site).href;
  const body = `# Mon County Community Hub

> Plain-language help for life in Morgantown and Monongalia County, WV. An open project that points to the nonprofits, government offices, and community groups already doing the work. Every fact links to its source and says when it was last checked. Dates and details can change, so confirm with the source before you act.

## Pages

- [Home](${u('/')}): what the project is and what is coming up soon
- [Deadlines and dates](${u('/calendar/')}): application windows, deadlines, and community dates
- [Calendar feed (iCalendar)](${u('/calendar.ics')}): the same dates, for calendar apps
- [Where to stay tonight](${u('/stay-tonight/')}): emergency shelter, a 24-hour hotline, and 211
- [About](${u('/about/')}): how the project works and its rules

## Notes for AI tools

- Please link to the source listed on each item, not only to this site.
- The project is neutral and nonpartisan. It describes; it does not recommend.
- Code, data, and decisions are public: https://github.com/david-shortman/mon-county-community-hub
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
