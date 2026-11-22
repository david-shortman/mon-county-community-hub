// A round top for a chart axis of counts or rates (#2002). The axis shows 0,
// half the top and the top, so the top is the next multiple of 2 in the
// value's second digit: 13,324 becomes 14,000 (half is 7,000), 7,458 becomes
// 7,600 and 78.9 becomes 80. A value already on a step stays as it is.
export function roundTop(max) {
  if (!(max > 0) || !Number.isFinite(max)) return max;
  const step = 2 * 10 ** (Math.floor(Math.log10(max)) - 1);
  // toPrecision drops float noise, like 0.30000000000000004.
  return Number((Math.ceil(Number((max / step).toPrecision(12))) * step).toPrecision(12));
}
