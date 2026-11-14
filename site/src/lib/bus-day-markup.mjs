// A day on the buses: the HTML. Shared by the site component and the prototype,
// so the words and pictures are written once. Everything here reads fine with
// no script: numbered steps, each with its own still chart.
import { svg, fmt, mins, DAYS } from './bus-day.mjs';
import { motionSwitchHtml } from './motion-markup.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const longDate = (ymd) => { const [y, m, d] = String(ymd).split('-').map(Number); return `${MONTHS[m - 1]} ${d}, ${y}`; };
const dayLabel = (k) => DAYS.find((d) => d.key === k).label;

export const STEPS = [
  { day: 'm', t: '5:40', h: 'The first bus leaves at 5:40 a.m.',
    p: 'On weekdays the day starts with an early Orange Line trip from Pifer Terminal. Northern Circulator follows at 5:55, and by 7:30 a.m. 17 routes are out.' },
  { day: 'm', t: '12:00', h: 'At midday, 18 of 20 routes are running',
    p: 'Every daytime route is out. The two that are not are night routes: Downtown Mall PM starts at 6 p.m., and Campus PM runs only Thursday to Saturday nights.' },
  { day: 'm', t: '20:30', h: 'By 8:30 p.m., most routes are done',
    p: "Most routes start their last trip between 5 and 8 p.m. Three keep going: Westridge Mylan (last run 9 p.m.), Blue & Gold (8:40 p.m.) and Downtown Mall PM (11 p.m.). On Thursday to Saturday nights during WVU's fall and spring sessions, two run late. Campus PM runs until 3:40 a.m. West Run runs until 2:30 a.m." },
];

export function dayMarkup(routes, { checked, tripPlanner = 'https://www.busride.org/google-trip-planner' } = {}) {
  const data = routes.map((r) => ({ g: r.g, n: r.n, short: r.short, trip: r.trip, runs: r.runs, early: r.early && { days: r.early.days, at: r.early.at }, unsureFrom: r.unsureFrom, wvu: r.wvu || undefined, wvuNote: r.wvuNote ? 1 : undefined }));
  const unsure = routes.filter((r) => r.unsure).map((r) => `<li><strong>${esc(r.name)}:</strong> ${esc(r.unsure)}</li>`).join('');
  const o = [];
  o.push(`<div id="day-explainer" data-routes="${esc(JSON.stringify(data))}">`);
  o.push('<div class="rightnow" id="day-rightnow" hidden><h3>Right now</h3><p class="rn-line" id="day-rn-line"></p><details><summary>Each route right now</summary><ul id="day-rn-list"></ul></details><p class="rn-note">By the posted hours. Holidays and WVU breaks can change service.</p></div>');
  o.push(motionSwitchHtml({ skip: '#day-sum' }));
  o.push('<div class="scrolly">');
  o.push(`<figure class="stage" aria-hidden="true">${svg(routes, { day: 'm', t: mins('5:40'), live: true })}<p class="now" data-now></p><p class="key">Bar: first run to last run. <span class="k-tail">Faint end:</span> last trip still on the road. <span class="k-un">Red:</span> unsure.</p></figure>`);
  o.push('<ol class="days" aria-label="One weekday on the buses: morning, midday and evening">');
  STEPS.forEach((s, i) => {
    const t = mins(s.t) + (mins(s.t) < 300 ? 1440 : 0);
    o.push(`<li data-day="${s.day}" data-t="${t}">`);
    o.push(`<p class="when">${dayLabel(s.day)}, ${fmt(t)}</p>`);
    o.push(`<h3>${i + 1}. ${esc(s.h)}</h3>`);
    o.push(`<div class="snap">${svg(routes, { day: s.day, t })}</div>`);
    o.push(`<p>${esc(s.p)}</p>`);
    o.push('</li>');
  });
  o.push('</ol></div>');
  o.push('<section class="summary" id="day-sum" tabindex="-1" aria-labelledby="day-sum-h">');
  o.push('<h3 id="day-sum-h">The day in short</h3>');
  o.push("<p>On weekdays the first bus leaves at 5:40 a.m., and by 9 a.m. 18 of 20 routes are running. Most routes start their last trip between 5 and 8 p.m. Downtown Mall PM runs until 11 p.m., Monday to Saturday. Thursday to Saturday nights during WVU sessions, Campus PM runs until 3:40 a.m. Sunday has 6 routes.</p>");
  o.push('<div id="day-try" hidden>');
  o.push('<h3>Pick a day and a time</h3>');
  o.push('<div class="picks" role="group" aria-label="Day">' + DAYS.map((d) => `<button type="button" data-pick="${d.key}" aria-pressed="false">${d.label}</button>`).join('') + '</div>');
  o.push('<div class="timerow"><label for="day-time">Time: <b id="day-time-label">9 a.m.</b></label><button type="button" id="day-now">Now</button></div>');
  o.push('<input type="range" id="day-time" min="300" max="1680" step="5" value="540">');
  o.push('<div class="scale" aria-hidden="true"><span>5 a.m.</span><span>noon</span><span>midnight</span><span>4 a.m.</span></div>');
  o.push('<p class="note" id="day-now-note" hidden></p>');
  o.push(`<div class="chartbox">${svg(routes, { day: 'm', t: 540, live: true })}</div>`);
  // The result line changes on every slider step, so it is not a live region.
  // Screen readers hear the slider's own value while it moves, and the result
  // once the slider settles (day-say, #1427).
  o.push('<p class="out" id="day-out"></p>');
  o.push('<p class="sr-only" id="day-say" aria-live="polite"></p>');
  o.push('<ul class="lists" id="day-lists"></ul>');
  o.push('</div>');
  o.push('<h3>Read it with care</h3><ul class="care">');
  o.push(`<li>First and last run mean when the route starts that trip. The bus reaches your stop later. For the time at your stop, use the <a href="${tripPlanner}">trip planner</a> or call 304-291-RIDE (304-291-7433).</li>`);
  o.push('<li>This shows when each route runs, not how often a bus comes.</li>');
  o.push("<li>Campus PM and the WVU campus routes run only during WVU's fall and spring sessions, and Blue & Gold has no weekend service in summer. Holidays can change service too.</li>");
  if (unsure) o.push(`<li>Where the hours are unsure:<ul>${unsure}</ul></li>`);
  o.push(`<li>Hours come from each route's page on Mountain Line's website${checked ? `, checked ${longDate(checked)}` : ''}. Every route's full list is below.</li>`);
  o.push('</ul></section></div>');
  return o.join('\n');
}
