// How the site search turns what someone typed into Pagefind searches (#529).
// The search page (src/pages/search.astro) and the search test
// (scripts/search-test.mjs) both run this same code (#1286), so the test
// scores what residents really get, and a change here moves both.
//
// Pagefind only returns pages that have every word, and it has no spell
// check. So a full question ("how do I apply for food stamps") or one typo
// ("medicade") used to find nothing. The plan:
//   1. Fix common misspellings from SPELLING, and say so on the page.
//   2. Drop filler words ("how", "do", "I", "near", "Morgantown"...).
//   3. Swap words our pages say another way, from SAME ("rehab" -> "treatment").
//   4. Search what was typed, the plain words, and each word on its own.
//      Pages with more of the reader's words come first.
//   5. Helper and printout pages, and group pages whose name does not match,
//      go after the guides.
//
// Everything here runs on the phone. Nothing is sent anywhere or saved.
//
// makeSearch must stay self-contained (no imports, no outside names except
// its arguments): the search page copies its source into an inline script
// with inlineSource().

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

// Words people type that our pages say another way. Found in simulated
// walkthroughs (docs/reviews/2026-10-31-simulated-walkthroughs.md):
// "detox near me" found nothing, because no page has the word "detox".
export const SAME = {
  garbage: 'trash', rubbish: 'trash', daycare: 'child care', childcare: 'child care', babysitter: 'child care', babysitting: 'child care',
  rehab: 'treatment', detox: 'treatment', senior: 'older', seniors: 'older', elderly: 'older', toothache: 'dentist', tooth: 'dentist', teeth: 'dentist', dental: 'dentist',
  suicidal: 'suicide', vaccine: 'shot', vaccines: 'shots', vaccination: 'shots', ebt: 'snap', lawyer: 'legal', attorney: 'legal',
  obamacare: 'marketplace', groceries: 'food', grocery: 'food', homeless: 'shelter', evicted: 'eviction', evict: 'eviction',
};

// Words that only get in the way: every page is about Mon County, and
// Pagefind would demand that a page have "how" or "near" too.
export const FILLER = ('a an the and or of to for in on at by from with about my me i im we our you your it its this that is are was be ' +
  'can cant do does dont how what where when who why get got need want please help near find someone some any just really ' +
  'morgantown wv west virginia mon monongalia county').split(' ');

// The search code, given the three lists. Old-style JavaScript on purpose:
// it runs as is on older phones.
export function makeSearch(SPELLING, SAME, FILLER) {
  function own(map, w) { return Object.prototype.hasOwnProperty.call(map, w) ? map[w] : null; }
  // The typed words, lower case, without apostrophes.
  function raw(q) {
    return String(q || '').toLowerCase().replace(/[’']/g, '').replace(/\bday care\b/g, 'daycare').match(/[a-z0-9]+/g) || [];
  }
  // The typed words with misspellings fixed.
  function words(q) {
    var out = [];
    raw(q).forEach(function (w) { (own(SPELLING, w) || w).split(' ').forEach(function (x) { out.push(x); }); });
    return out;
  }
  // The fixed words as one string, or '' when nothing was misspelled.
  function fixedText(q) {
    return raw(q).some(function (w) { return own(SPELLING, w); }) ? words(q).join(' ') : '';
  }
  // The words that carry the topic, in the words our pages use.
  function plain(q) {
    return words(q).filter(function (w) { return FILLER.indexOf(w) < 0; }).map(function (w) { return own(SAME, w) || w; }).join(' ');
  }
  // Help-giver and printout pages repeat what the main pages say, and group
  // profile pages crowd out the guides that answer a question, so they go last.
  // A group page stays in place when its name has every word typed, so
  // searching a group by name still finds it first. `d` is a result's data.
  function later(d, q) {
    if (/\/(print|for\/helpers)\//.test(d.url)) return 1;
    if (!/\/groups\//.test(d.url)) return 0;
    var name = ' ' + raw((d.meta && d.meta.title) || '').join(' ') + ' ';
    var typed = words(q).filter(function (w) { return FILLER.indexOf(w) < 0; });
    return typed.length && typed.every(function (w) { return name.indexOf(' ' + w + ' ') >= 0; }) ? 0 : 1;
  }
  // Search with a loaded Pagefind module. Resolves to { items, some, fixed }:
  // up to 10 results' data in order, `some` when no page had every word (so
  // pages with some of them are shown), and the fixed words if any.
  // Pages with more of the reader's words come first. Pagefind's own order
  // breaks ties, and a word a page has near the top of its results counts a bit more.
  function find(pf, q) {
    // Each word the reader typed, with the word our pages use for it.
    var units = words(q).filter(function (w, i, a) { return FILLER.indexOf(w) < 0 && a.indexOf(w) === i; })
      .map(function (w) { return own(SAME, w) ? [w, own(SAME, w)] : [w]; });
    var p = plain(q);
    var fixed = fixedText(q);
    var jobs = [{ q: fixed || q }];
    if (p && p !== String(q).toLowerCase().trim()) jobs.push({ q: p });
    if (units.length > 1 || (units[0] && units[0].length > 1)) {
      units.forEach(function (alts, u) { alts.forEach(function (w) { jobs.push({ q: w, unit: u }); }); });
    }
    return Promise.all(jobs.map(function (j) { return pf.search(j.q); })).then(function (all) {
      var score = {}, has = {}, byId = {};
      all.forEach(function (res, k) {
        var unit = jobs[k].unit;
        ((res && res.results) || []).forEach(function (r, i) {
          byId[r.id] = r;
          var near = 1 / (1 + i / 10);
          if (unit === undefined) { score[r.id] = (score[r.id] || 0) + near; return; }
          has[r.id] = has[r.id] || {};
          var best = has[r.id][unit] || 0;
          if (1 + near / 2 > best) { score[r.id] = (score[r.id] || 0) + 1 + near / 2 - best; has[r.id][unit] = 1 + near / 2; }
        });
      });
      var ids = Object.keys(byId).sort(function (x, y) { return score[y] - score[x]; });
      var some = units.length > 1 && !ids.some(function (id) { return has[id] && Object.keys(has[id]).length === units.length; });
      return Promise.all(ids.slice(0, 20).map(function (id) { return byId[id].data(); })).then(function (items) {
        items = items.map(function (d, i) { return { d: d, i: i }; })
          .sort(function (x, y) { return later(x.d, q) - later(y.d, q) || x.i - y.i; })
          .map(function (x) { return x.d; }).slice(0, 10);
        return { items: items, some: some, fixed: fixed };
      });
    });
  }
  return { raw: raw, words: words, fixedText: fixedText, plain: plain, later: later, find: find };
}

export const { raw, words, fixedText, plain, later, find } = makeSearch(SPELLING, SAME, FILLER);

// The search code for the search page's inline script: defines one global,
// SearchPlan, with the functions above.
export function inlineSource() {
  return 'var SearchPlan = (' + makeSearch.toString() + ')(' + JSON.stringify(SPELLING) + ', ' + JSON.stringify(SAME) + ', ' + JSON.stringify(FILLER) + ');\n';
}
