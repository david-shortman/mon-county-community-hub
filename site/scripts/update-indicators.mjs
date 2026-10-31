// Refreshes the saved copy of each community-numbers source (#15).
// Commit the changed files in src/lib/indicators/snapshots/.
import { SOURCES, loadIndicator } from '../src/lib/indicators/index.mjs';

for (const src of SOURCES) {
  const r = await loadIndicator(src, { save: true });
  console.log(`${src.id}: ${r.status}`);
  if (r.status !== 'live') process.exitCode = 1;
}
