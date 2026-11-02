// "Your year at home and in the garden" (#1448): a year strip from frost to
// frost, built from the rules in content/home-year.yaml. Pure functions, so
// the tests can check every date the strip draws against the rules.
// Frost dates come from each frost rule's half_of_years (NOAA's 50% date).

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// The four steps: which months each one covers.
export const STEP_MONTHS = [[1, 2, 3], [4], [5, 6, 7, 8, 9], [10, 11, 12]];

const md = (m, d) => m * 100 + d;
const lowerFirst = (s) => s.charAt(0).toLowerCase() + s.slice(1);
export const dateWords = (m, d) => `${MONTHS[m - 1]} ${d}`;

// Where a day sits inside its month row, from 0 (top) to 1 (bottom).
const frac = (m, d) => (d - 1) / DAYS[m - 1];
const endFrac = (m, d) => d / DAYS[m - 1];

// For one month, the part of a date range (start and end inclusive, may wrap
// into the next year) that falls in it, as { a, b } fractions, or null.
export function partIn(m, from, to) {
  const wraps = md(to.month, to.day) < md(from.month, from.day);
  const inside = (mm) => (wraps ? md(mm, 1) >= md(from.month, 1) || md(mm, 1) <= md(to.month, 1) : mm >= from.month && mm <= to.month);
  if (!inside(m)) return null;
  const a = m === from.month ? frac(m, from.day) : 0;
  const b = m === to.month ? endFrac(m, to.day) : 1;
  return b > a ? { a, b } : null;
}

// Everything the strip and its steps need, from the rules.
export function yearStrip(rules) {
  const by = new Map(rules.map((r) => [r.slug, r]));
  const spring = by.get('last-spring-frost')?.half_of_years;
  const fall = by.get('first-fall-frost')?.half_of_years;
  if (!spring || !fall) throw new Error('year strip: the frost rules need half_of_years');
  // The growing season runs from the day after the last spring frost to the first fall frost.
  const start = spring.day < DAYS[spring.month - 1] ? { month: spring.month, day: spring.day + 1 } : { month: spring.month + 1, day: 1 };
  const grow = { from: start, to: { month: fall.month, day: fall.day } };
  const fires = rules.filter((r) => r.kind === 'season').map((r) => ({ slug: r.slug, from: { month: r.month, day: r.day }, to: { month: r.end_month, day: r.end_day } }));
  const items = rules
    .map((r) => ({ slug: r.slug, kind: r.kind, month: r.month, day: r.day, title: r.title, end: r.kind === 'season' ? { month: r.end_month, day: r.end_day } : null }))
    .sort((x, y) => md(x.month, x.day) - md(y.month, y.day) || x.title.localeCompare(y.title));
  const months = MONTHS.map((name, i) => {
    const m = i + 1;
    return {
      m, name, short: name.slice(0, 3),
      grow: partIn(m, grow.from, grow.to),
      fire: fires.some((f) => partIn(m, f.from, f.to)),
      frost: [spring, fall].filter((f) => f.month === m).map((f) => ({ at: frac(m, f.day) + 0.5 / DAYS[m - 1], day: f.day, spring: f === spring })),
      items: items.filter((it) => it.month === m),
    };
  });
  const line = (it) => `${dateWords(it.month, it.day)}: ${lowerFirst(it.title)}${it.end ? `, to ${dateWords(it.end.month, it.end.day)}` : ''}.`;
  const listFor = (ms) => items.filter((it) => ms.includes(it.month)).map(line);
  const springW = dateWords(spring.month, spring.day), fallW = dateWords(fall.month, fall.day);
  const days = Math.round((Date.UTC(2027, fall.month - 1, fall.day) - Date.UTC(2027, spring.month - 1, spring.day)) / 864e5);
  const steps = [
    { title: 'Winter, January to March', text: 'Home dates come before the garden starts.', list: listFor(STEP_MONTHS[0]) },
    { title: `Last spring frost, ${springW}`, text: `In half of years, the last spring frost here comes after ${springW}. The growing season starts after it.`, list: listFor(STEP_MONTHS[1]) },
    { title: 'The growing season, May to September', text: `From ${springW} to ${fallW} is about ${days} days, or ${Math.round(days / 30.4)} months. That is the growing window in a typical year.`, list: listFor(STEP_MONTHS[2]) },
    { title: `First fall frost, ${fallW}`, text: `In half of years, the first fall frost comes by ${fallW}, and the growing season stops. In 1 of 10 years it comes by ${dateWords(by.get('first-fall-frost').month, by.get('first-fall-frost').day)}.`, list: listFor(STEP_MONTHS[3]) },
  ];
  return { months, steps, spring, fall, days };
}
