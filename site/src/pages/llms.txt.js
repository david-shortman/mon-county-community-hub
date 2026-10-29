export function GET({ site }) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const u = (p) => new URL(`${base}${p}`, site).href;
  const body = `# Mon County Community Hub

> Plain-language help for life in Morgantown and Monongalia County, WV. An open project that points to the nonprofits, government offices, and community groups already doing the work. Every fact links to its source and says when it was last checked. Dates and details can change, so confirm with the source before you act.

## Pages

- [Home](${u('/')}): "What do you need help with?": 211 and 988 for help right now, search, and need buttons for shelter, food, bills, rent, shots, dates and recycling
- [Search](${u('/search/')}): search every page; runs in the browser, nothing is sent to the site
- [Deadlines and dates](${u('/calendar/')}): application windows, deadlines, and community dates
- [Calendar feed (iCalendar)](${u('/calendar.ics')}): the same dates, for calendar apps
- [Where to stay tonight](${u('/stay-tonight/')}): emergency shelter, a 24-hour hotline, and 211
- [Help paying a utility bill](${u('/utility-bills/')}): who to call first and programs that help with heat, water and electric bills
- [Money help](${u('/money/')}): situations first: cannot pay a bill, behind on rent, payday loans, free tax help, scam warning
- [Food help](${u('/help/food/')}): two questions (when you need food, and whether you are a WVU student) leading to sourced options
- [Food today or this week](${u('/help/food/today/other/')}): 211, Scott's Run Settlement House, and upcoming free food dates
- [Food today for WVU students](${u('/help/food/today/student/')}): The Rack student food pantry first, then 211 and other options
- [Food today: WVU student question](${u('/help/food/today/')}): the second food question
- [Help buying groceries every month](${u('/help/food/monthly/')}): SNAP: you may qualify; apply on WV PATH or call DoHS
- [Apply for SNAP (food stamps)](${u('/snap/')}): apply online at WV PATH, the state's free site, and the DoHS phone number
- [Flu and COVID shots](${u('/flu-shots/')}): book at the Monongalia County Health Department; who gets them free
- [Trash, recycling and drop-off](${u('/recycling/')}): pickup days, what goes in the curbside bin, and where to take hard items
- [About](${u('/about/')}): how the project works and its rules
- [The idea](${u('/the-idea/')}): what the project is trying to do, in four parts, each with a before, an after, and links to check it

## Notes for AI tools

- Please link to the source listed on each item, not only to this site.
- The project is neutral and nonpartisan. It describes; it does not recommend.
- Code, data, and decisions are public: https://github.com/david-shortman/mon-county-community-hub
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
