// Lists secondhand entries that are due for their quarterly re-check (#430).
// Usage (from site/): npm run secondhand-due
// An entry is due when its oldest source check is over 3 months old. Cards
// say "Not checked lately" after 4 months, so this gives a month to re-check
// before residents see that. Unclear entries are listed too, since each one
// waits on a fact we could not confirm. Exit code is always 0.
import { loadSecondhand, oldestChecked, todayYmd } from '../src/lib/content.mjs';

const today = todayYmd();
const ageDays = (d) => Math.round((Date.parse(`${today}T12:00:00Z`) - Date.parse(`${d}T12:00:00Z`)) / 86400000);
const all = loadSecondhand({ all: true }).filter((s) => s.status !== 'closed');
const due = all
  .map((s) => ({ s, checked: oldestChecked(s.sources), age: ageDays(oldestChecked(s.sources)) }))
  .filter((x) => x.age > 91 || x.s.status === 'unclear')
  .sort((a, b) => b.age - a.age);
for (const { s, checked, age } of due) console.log(`${s._file}: ${s.status}, last checked ${checked} (${age} days ago). Re-read ${s.sources.map((x) => x.url).join(' ')}`);
console.log(`${due.length} of ${all.length} secondhand entries are due for a re-check.`);
