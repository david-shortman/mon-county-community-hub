// County indicators (#62, first slice of #15): official numbers about how Mon
// County is doing, one file each in content/indicators/. Pages render only
// from these files, each number with its source, data year and checked date.
import { loadDir, ymd } from './content.mjs';

export const INDICATOR_TOPICS = ['health', 'schools', 'safety'];
export const PLACES = [['monongalia', 'Monongalia County'], ['west_virginia', 'West Virginia'], ['united_states', 'United States']];

export function loadIndicators(topic) {
  return loadDir('indicators')
    .map((i) => ({ ...i, sources: (i.sources ?? []).map((s) => ({ ...s, checked: ymd(s.checked) })) }))
    .filter((i) => !topic || i.topic === topic);
}

// 0.129 as a percent reads "12.9%". Other units are rounded to the record's
// `digits` (as the publisher shows them) and get their unit words:
// "77.8 years", "43 per 100,000 people".
export function showValue(i, v) {
  if (v == null) return 'not given';
  if (i.unit === 'percent') return `${(v * 100).toFixed(1)}%`;
  const n = i.digits == null ? String(v) : v.toLocaleString('en-US', { minimumFractionDigits: i.digits, maximumFractionDigits: i.digits });
  if (i.unit === 'years') return `${n} years`;
  return i.per ? `${n} ${i.per}` : n;
}
