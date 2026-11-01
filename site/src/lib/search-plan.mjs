// How the site search turns what someone typed into Pagefind searches (#529).
// The search page (src/pages/search.astro) and the search test
// (scripts/search-test.mjs) both run this same code, so the test scores what
// residents really get.
//
// Pagefind only returns pages that have every word, and it has no spell
// check. So a full question ("how do I apply for food stamps") or one typo
// ("medicade") used to find nothing. The plan:
//   1. Fix common misspellings from SPELLING, and say so on the page.
//   2. Drop question words ("how", "do", "I", "where"...) when other words are left.
//   3. Search for all the words left.
//   4. If nothing matches, search each word on its own and put the pages
//      that match the most words first.
//
// Everything here runs on the phone. Nothing is sent anywhere or saved.
//
// Keep these functions self-contained (no imports, no outside names except
// their arguments and the SPELLING and STOP lists passed in): the search page
// copies their source into an inline script.

// Misspellings and run-together words people type, and the word the pages use.
// Only add a fix when the right word is clear and the wrong one is not a word
// with its own meaning here. Sorted by the misspelling.
export const SPELLING = {
  attorny: 'attorney',
  ceritficate: 'certificate',
  certifcate: 'certificate',
  councel: 'council',
  counceling: 'counseling',
  dentsit: 'dentist',
  dentis: 'dentist',
  evicition: 'eviction',
  evition: 'eviction',
  foodstamps: 'food stamps',
  goverment: 'government',
  homless: 'homeless',
  lawer: 'lawyer',
  leap: 'lieap',
  liceap: 'lieap',
  liheap: 'lieap',
  liscense: 'license',
  lisence: 'license',
  licence: 'license',
  medicade: 'medicaid',
  medicaide: 'medicaid',
  medicair: 'medicare',
  medicar: 'medicare',
  narcain: 'narcan',
  narcon: 'narcan',
  pantrys: 'pantries',
  perscription: 'prescription',
  perscriptions: 'prescriptions',
  recyling: 'recycling',
  recylcing: 'recycling',
  registation: 'registration',
  sheltor: 'shelter',
  shleter: 'shelter',
  utlity: 'utility',
  utilty: 'utility',
  volenteer: 'volunteer',
  volunter: 'volunteer',
  wick: 'wic',
};

// Words that carry no topic on their own. Dropped only when other words are left.
export const STOP = ['a', 'an', 'and', 'am', 'are', 'about', 'any', 'at', 'be', 'been', 'can', 'cant', "can't", 'could', 'do', 'does',
  'for', 'from', 'get', 'go', 'going', 'have', 'help', 'how', 'i', "i'm", 'im', 'in', 'is', 'it', 'me', 'my', 'need', 'near',
  'of', 'on', 'or', 'our', 'out', 'please', 'should', 'so', 'some', 'that', 'the', 'there', 'this', 'to', 'up', 'we', 'what',
  "what's", 'whats', 'when', 'where', 'which', 'who', 'why', 'will', 'with', 'would', 'you', 'your'];

// Clean up the typed words: lower case, fix spelling, drop question words.
// Returns { words, fixed } where `fixed` is true when a spelling fix was made.
export function planWords(q, SPELLING, STOP) {
  var raw = String(q || '').toLowerCase().replace(/[‘’]/g, "'").replace(/[^a-z0-9' ]+/g, ' ').split(/\s+/).filter(Boolean);
  var fixed = false;
  var words = [];
  raw.forEach(function (w) {
    var bare = w.replace(/^'+|'+$/g, '');
    if (!bare) return;
    var fix = Object.prototype.hasOwnProperty.call(SPELLING, bare) ? SPELLING[bare] : null;
    if (fix && fix !== bare) { fixed = true; fix.split(' ').forEach(function (f) { words.push(f); }); }
    else words.push(bare);
  });
  var kept = words.filter(function (w) { return STOP.indexOf(w) === -1; });
  return { words: kept.length ? kept : words, fixed: fixed };
}

// Run the plan with a loaded Pagefind module. Returns
// { results: [pagefind result], searched: 'the words searched', fixed, loose }
// where `loose` is true when no page had every word, so pages with some of
// the words are shown instead.
export function searchPlan(pf, q, SPELLING, STOP, planWords) {
  var plan = planWords(q, SPELLING, STOP);
  var searched = plan.words.join(' ');
  if (!searched) return Promise.resolve({ results: [], searched: '', fixed: false, loose: false });
  return pf.search(searched).then(function (res) {
    if (res.results.length || plan.words.length < 2) return { results: res.results, searched: searched, fixed: plan.fixed, loose: false };
    // No page has every word: search each one, most words matched first.
    return Promise.all(plan.words.map(function (w) { return pf.search(w); })).then(function (all) {
      var byId = {};
      all.forEach(function (r) {
        r.results.forEach(function (hit) {
          var seen = byId[hit.id];
          if (seen) { seen.n += 1; seen.score += hit.score; } else byId[hit.id] = { hit: hit, n: 1, score: hit.score };
        });
      });
      var merged = Object.keys(byId).map(function (k) { return byId[k]; })
        .sort(function (a, b) { return b.n - a.n || b.score - a.score; })
        .map(function (x) { return x.hit; });
      return { results: merged, searched: searched, fixed: plan.fixed, loose: merged.length > 0 };
    });
  });
}

// The source of the functions above, for the search page's inline script.
export function inlineSource() {
  return 'var SEARCH_SPELLING = ' + JSON.stringify(SPELLING) + ';\n'
    + 'var SEARCH_STOP = ' + JSON.stringify(STOP) + ';\n'
    + 'var planWords = ' + planWords.toString() + ';\n'
    + 'var searchPlan = ' + searchPlan.toString() + ';\n';
}
