// scripts/build.js
// Generates static HTML pages (index + /dias + /times) with server-side data.
// Run on Vercel build or GitHub Actions. Requires API key in env: API_FOOTBALL_KEY
import fs from "fs";
import path from "path";
const API = "https://v3.football.api-sports.io";
const TZ = process.env.TZ || "America/Sao_Paulo";
const OUT = process.cwd();
const DATA_DIR = path.join(OUT, "data");
const DIAS_DIR = path.join(OUT, "dias");
const TIMES_DIR = path.join(OUT, "times");
const TEAMS = JSON.parse(fs.readFileSync(path.join("assets","teams.json"), "utf-8"));

async function api(pathname, params){
  const url = new URL(API + pathname);
  Object.entries(params).forEach(([k,v]) => url.searchParams.set(k, v));
  const res = await fetch(url, { headers: { "x-apisports-key": process.env.API_FOOTBALL_KEY || "" }});
  if(!res.ok) throw new Error(`API error ${res.status}`);
  const j = await res.json();
  return j.response || [];
}

function fmtDate(d){
  const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,"0"), da=String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${da}`;
}

// Load template
const tpl = fs.readFileSync(path.join("scripts","template_index.html"), "utf-8");
function renderCards(fixtures){
  // read card template from scripts helper (inlined by build, simpler: placeholder string replaced)
  // In this simplified build, we will inline minimal markup here too.
  function cardHTML(f){
    const league = f.league || {};
    const home = f.teams?.home || {};
    const away = f.teams?.away || {};
    const statusShort = f.fixture?.status?.short || "";
    const ts = f.fixture?.date || "";
    const venue = f.fixture?.venue?.name || "";
    const gh = f.goals?.home;
    const ga = f.goals?.away;
    const score = (gh!=null && ga!=null) ? `${gh} - ${ga}` : "";
    const live = ["1H","2H","LIVE"].includes(statusShort);
    const h = home.name || "", a = away.name || "";
    const q = `onde assistir ${h} x ${a}`.replaceAll(" ","+");
    const google = `https://www.google.com/search?q=${q}`;
    const dataSearch = `${h} ${a} ${league.name||""} ${venue}`.toLowerCase();
    return `<article class="card flex flex-col gap-2" data-search="${dataSearch}">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <img src="${league.logo||""}" alt="${league.name||""}" class="h-5 w-5 object-contain"/>
          <span class="font-medium">${league.name||""}</span>
          ${league.round ? `<span class="badge" title="Rodada">${league.round}</span>` : ""}
        </div>
        ${live ? '<span class="badge bg-red-50 border-red-200 text-red-700">AO VIVO</span>' : ""}
      </div>
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-2 min-w-0">
          <img src="${home.logo||''}" alt="${h}" class="h-6 w-6 object-contain" />
          <span class="truncate">${h}</span>
        </div>
        <div class="text-slate-500 text-sm">${ts}${score ? " • " + score : ""}</div>
        <div class="flex items-center gap-2 min-w-0">
          <span class="truncate">${a}</span>
          <img src="${away.logo||''}" alt="${a}" class="h-6 w-6 object-contain" />
        </div>
      </div>
      <div class="flex items-center justify-between text-sm text-slate-600">
        <div class="truncate">${venue}</div>
        <div class="flex items-center gap-3">
          <a href="${google}" target="_blank" rel="nofollow noopener" class="text-sky-600 hover:underline">Onde assistir</a>
        </div>
      </div>
    </article>`;
  }
  return fixtures.map(cardHTML).join("\n");
}

function jsonLD(fixtures){
  const list = fixtures.slice(0,10).map((f,i)=>{
    const ts = f.fixture?.date || "";
    const home = f.teams?.home?.name || "";
    const away = f.teams?.away?.name || "";
    return {
      "@type":"ListItem",
      position:i+1,
      url:"https://hojetemjogo.com.br/",
      item:{
        "@type":"SportsEvent",
        name: `${home} x ${away}`,
        startDate: ts,
        sport: "Soccer",
        location: { "@type":"Place", name: f.fixture?.venue?.name || "" }
      }
    };
  });
  return JSON.stringify({"@context":"https://schema.org","@type":"ItemList","itemListElement":list});
}

async function main(){
  fs.mkdirSync(DATA_DIR, {recursive:true});
  fs.mkdirSync(DIAS_DIR, {recursive:true});
  fs.mkdirSync(TIMES_DIR, {recursive:true});

  const today = new Date();
  const dates = [0,1,2,3,4,5].map(n=>{
    const d = new Date(today.getTime()+n*86400000);
    return fmtDate(d);
  });

  // Fetch fixtures for Brazil for several days
  const byDate = {};
  for (const ds of dates){
    const fixtures = await api("/fixtures", { date: ds, timezone: TZ, country: "Brazil" });
    byDate[ds] = fixtures;
    fs.writeFileSync(path.join(DATA_DIR, `${ds}.json`), JSON.stringify(fixtures, null, 2));
  }

  // Build index.html
  const date_today = dates[0], date_tomorrow = dates[1];
  const cards_today = renderCards(byDate[date_today]);
  const cards_tomorrow = renderCards(byDate[date_tomorrow]);
  // Next days: first date after today that has fixtures
  let nextFixtures = [];
  for (let i=1;i<dates.length;i++){
    if (byDate[dates[i]].length){ nextFixtures = byDate[dates[i]]; break; }
  }
  const cards_next = renderCards(nextFixtures);

  const html = tpl
    .replaceAll("{date_today}", date_today)
    .replaceAll("{date_tomorrow}", date_tomorrow)
    .replaceAll("{cards_today}", cards_today)
    .replaceAll("{cards_tomorrow}", cards_tomorrow)
    .replaceAll("{cards_next}", cards_next)
    .replaceAll("{json_ld}", jsonLD(byDate[date_today]))
    .replaceAll("{year}", String(new Date().getFullYear()))
    .replaceAll("{kw_team}", "Flamengo");

  fs.writeFileSync(path.join(OUT,"index.html"), html, "utf-8");

  // Build /dias pages
  for (const ds of dates){
    const outDir = path.join(DIAS_DIR, ds);
    fs.mkdirSync(outDir, {recursive:true});
    const page = tpl
      .replaceAll("{date_today}", ds)
      .replaceAll("{date_tomorrow}", dates[1] || ds)
      .replaceAll("{cards_today}", renderCards(byDate[ds]))
      .replaceAll("{cards_tomorrow}", "")
      .replaceAll("{cards_next}", "")
      .replaceAll("{json_ld}", jsonLD(byDate[ds]))
      .replaceAll("{year}", String(new Date().getFullYear()))
      .replaceAll("{kw_team}", "Palmeiras");
    fs.writeFileSync(path.join(outDir,"index.html"), page, "utf-8");
  }

  // Build /times pages (upcoming fixtures containing the team name)
  // Flatten all fetched fixtures to a single list
  const allFix = dates.flatMap(d => byDate[d]);
  for (const team of TEAMS){
    const slug = team.slug;
    const filtered = allFix.filter(f => {
      const h = f?.teams?.home?.name || "";
      const a = f?.teams?.away?.name || "";
      return h.toLowerCase().includes(team.name.toLowerCase()) || a.toLowerCase().includes(team.name.toLowerCase());
    });
    const outDir = path.join(TIMES_DIR, slug);
    fs.mkdirSync(outDir, {recursive:true});
    const page = tpl
      .replaceAll("{date_today}", fmtDate(new Date()))
      .replaceAll("{date_tomorrow}", fmtDate(new Date(Date.now()+86400000)))
      .replaceAll("{cards_today}", renderCards(filtered))
      .replaceAll("{cards_tomorrow}", "")
      .replaceAll("{cards_next}", "")
      .replaceAll("{json_ld}", jsonLD(filtered))
      .replaceAll("{year}", String(new Date().getFullYear()))
      .replaceAll("{kw_team}", team.name);
    fs.writeFileSync(path.join(outDir,"index.html"), page, "utf-8");
  }

  // robots.txt
  fs.writeFileSync(path.join(OUT,"robots.txt"), `User-agent: *\nAllow: /\nSitemap: https://hojetemjogo.com.br/sitemap.xml\n`);

  // Dynamic sitemap.xml listing root, dias, and times pages
  const urls = [`https://hojetemjogo.com.br/`];
  for (const ds of dates){ urls.push(`https://hojetemjogo.com.br/dias/${ds}/`); }
  for (const t of TEAMS){ urls.push(`https://hojetemjogo.com.br/times/${t.slug}/`); }
  const lastmod = new Date().toISOString().slice(0,10);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map(u=>`  <url><loc>${u}</loc><lastmod>${lastmod}</lastmod><changefreq>hourly</changefreq></url>`).join("\n") +
    `\n</urlset>\n`;
  fs.writeFileSync(path.join(OUT,"sitemap.xml"), sitemap, "utf-8");

  // manifest.json
  fs.writeFileSync(path.join(OUT,"manifest.json"), JSON.stringify({
    name:"Hoje Tem Jogo", short_name:"HojeTemJogo", start_url:"/", display:"standalone",
    background_color:"#0ea5e9", theme_color:"#0ea5e9", icons:[]
  }, null, 2));
}

await main().catch(err => { console.error(err); process.exit(1); });
