// "A guided look at this chart" on How we're doing (#1451): the words for each
// step, worked out at build time from the same monthly points the chart draws.
// We point at values only. We never say why a number moved or what it means.

const num = (v) => String(Math.round(v * 10) / 10);

// pts: [{ month: 'YYYY-MM', label, value, preliminary }], oldest first.
// Returns the latest point, the same month a year before (or null), the
// difference, and the steps as { key, title, text }.
export function chartGuide(pts, { first = pts[0]?.label, top } = {}) {
  if (!pts.length) return null;
  const li = pts.length - 1;
  const latest = pts[li];
  const want = `${Number(latest.month.slice(0, 4)) - 1}${latest.month.slice(4)}`;
  const yi = pts.findIndex((p) => p.month === want);
  const yearAgo = yi >= 0 ? pts[yi] : null;
  const diff = yearAgo ? Math.round((latest.value - yearAgo.value) * 10) / 10 : null;
  const steps = [{
    key: 'latest', i: li,
    title: 'The newest month',
    text: `The dot at the right end of the line is the newest month. In ${latest.label}, the rate was ${num(latest.value)}%.${latest.preliminary ? ' This is a preliminary number, so it can change.' : ''}`,
  }];
  if (yearAgo) {
    const how = diff === 0 ? 'the same as' : `${num(Math.abs(diff))} percentage ${Math.abs(diff) === 1 ? 'point' : 'points'} ${diff < 0 ? 'lower than' : 'higher than'}`;
    steps.push({
      key: 'year', i: yi,
      title: 'The same month a year before',
      text: `Go back along the line to ${yearAgo.label}. The rate was ${num(yearAgo.value)}%. So ${latest.label} was ${how} a year before.`,
    });
  }
  steps.push({
    key: 'read', i: li,
    title: 'How to read any chart here',
    text: `Start with the labels. The side shows the rate${top != null ? `, from 0% to ${top}%` : ''}. The bottom shows the months, from ${first} to ${latest.label}. Each point on the line is one month. Then compare like with like: this rate rises and falls with the time of year, so set a month next to the same month a year before.`,
  });
  return { latest, yearAgo, diff, steps };
}
