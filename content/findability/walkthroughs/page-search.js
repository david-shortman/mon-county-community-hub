// Runs every query in content/findability/search-queries.yaml through the real
// /search/ page in a browser, so the score is what residents get (#529, wave 8).
// npm run search-test scores src/lib/search-plan.mjs instead, which the page
// does not fully use. Simulated queries, not resident searches.
// Usage, from the repo root, with site/dist served on port 4321:
//   node content/findability/walkthroughs/page-search.js out.json
// Prints the top 3 count and each miss: query | expected | rank | top 3.
const fs=require('fs'),path=require('path');const {createRequire}=require('module');
const {chromium}=require('playwright');
const YAML=createRequire(path.resolve('site/package.json'))('yaml');
const {queries}=YAML.parse(fs.readFileSync('content/findability/search-queries.yaml','utf8'));
(async()=>{const b=await chromium.launch();const p=await b.newPage();const out=[];
for(const it of queries){await p.goto('http://localhost:4321/search/#q='+encodeURIComponent(it.q));
await p.waitForFunction(()=>{const s=document.getElementById('search-status').textContent;return s&&!/Searching/.test(s)},null,{timeout:15000}).catch(()=>{});
const urls=await p.evaluate(()=>[...document.querySelectorAll('#search-results li a')].map(a=>new URL(a.href).pathname));
const rank=urls.findIndex(u=>it.expect.includes(u));out.push({q:it.q,kind:it.kind,expect:it.expect,rank:rank<0?null:rank+1,hit:rank>=0&&rank<3,top3:urls.slice(0,3)});}
fs.writeFileSync(process.argv[2],JSON.stringify(out,null,1));
const h=out.filter(r=>r.hit).length;console.log('page search top3',h,'of',out.length);
for(const r of out.filter(r=>!r.hit))console.log(r.q,'|',r.expect[0],'|',r.rank,'|',r.top3.join(' '));
await b.close();})();
