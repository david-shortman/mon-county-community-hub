// "See how your bill is figured" on /property-tax/ (#1446). The Assessor's
// formula: market value times 60% is the assessed value; with the homestead
// exemption, subtract $20,000 from the assessed value; the assessed value
// times the levy rate (dollars for each $100) is the tax. Used at build time
// for the worked example and in the browser for the try-it tool, so both
// always agree. Stores nothing.
export const ASSESS_SHARE = 0.6;
export const HOMESTEAD = 20000;

export function estimate(market, ratePer100, homestead = false) {
  const m = Math.max(0, Number(market) || 0);
  const assessed = Math.round(m * ASSESS_SHARE);
  const off = homestead ? Math.min(HOMESTEAD, assessed) : 0;
  const taxable = assessed - off;
  const tax = Math.round((taxable / 100) * ratePer100);
  return { market: m, assessed, off, taxable, tax };
}

export const money = (n) => '$' + Math.round(n).toLocaleString('en-US');

// The math in words, for the worked example and the live result.
export function sayMath(e, ratePer100) {
  let s = `${money(e.market)} times 60% is ${money(e.assessed)}, the assessed value.`;
  if (e.off) s += ` Take off ${money(e.off)} for the homestead exemption, which leaves ${money(e.taxable)}.`;
  s += ` ${money(e.taxable)} times $${ratePer100} for each $100 is about ${money(e.tax)} a year.`;
  return s;
}
