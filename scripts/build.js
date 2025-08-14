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
// Load comprehensive Brazilian teams
const TEAMS_JSON = JSON.parse(fs.readFileSync(path.join("assets","teams.json"), "utf-8"));

// Create comprehensive teams list from new database structure
const COMPREHENSIVE_TEAMS = [
  // Serie A teams
  { name: "Athletico-PR", slug: "athletico-pr" },
  { name: "Atlético-MG", slug: "atletico-mg" },
  { name: "Bahia", slug: "bahia" },
  { name: "Botafogo", slug: "botafogo" },
  { name: "Bragantino", slug: "bragantino" },
  { name: "Corinthians", slug: "corinthians" },
  { name: "Criciúma", slug: "criciuma" },
  { name: "Cruzeiro", slug: "cruzeiro" },
  { name: "Cuiabá", slug: "cuiaba" },
  { name: "Flamengo", slug: "flamengo" },
  { name: "Fluminense", slug: "fluminense" },
  { name: "Fortaleza", slug: "fortaleza" },
  { name: "Grêmio", slug: "gremio" },
  { name: "Internacional", slug: "internacional" },
  { name: "Juventude", slug: "juventude" },
  { name: "Palmeiras", slug: "palmeiras" },
  { name: "São Paulo", slug: "sao-paulo" },
  { name: "Santos", slug: "santos" },
  { name: "Vasco", slug: "vasco" },
  { name: "Vitória", slug: "vitoria" },
  
  // Serie B teams
  { name: "América-MG", slug: "america-mg" },
  { name: "Avaí", slug: "avai" },
  { name: "Ceará", slug: "ceara" },
  { name: "Chapecoense", slug: "chapecoense" },
  { name: "Coritiba", slug: "coritiba" },
  { name: "CRB", slug: "crb" },
  { name: "Goiás", slug: "goias" },
  { name: "Guarani", slug: "guarani" },
  { name: "Ituano", slug: "ituano" },
  { name: "Londrina", slug: "londrina" },
  { name: "Mirassol", slug: "mirassol" },
  { name: "Novorizontino", slug: "novorizontino" },
  { name: "Operário-PR", slug: "operario-pr" },
  { name: "Paysandu", slug: "paysandu" },
  { name: "Ponte Preta", slug: "ponte-preta" },
  { name: "Remo", slug: "remo" },
  { name: "Sport", slug: "sport" },
  { name: "Tombense", slug: "tombense" },
  { name: "Vila Nova", slug: "vila-nova" },
  { name: "Volta Redonda", slug: "volta-redonda" },
  
  // Serie C and major regional teams
  { name: "ABC", slug: "abc" },
  { name: "Altos", slug: "altos" },
  { name: "Atlético-GO", slug: "atletico-go" },
  { name: "Botafogo-PB", slug: "botafogo-pb" },
  { name: "Botafogo-SP", slug: "botafogo-sp" },
  { name: "Campinense", slug: "campinense" },
  { name: "Caxias", slug: "caxias" },
  { name: "CSA", slug: "csa" },
  { name: "Figueirense", slug: "figueirense" },
  { name: "Manaus", slug: "manaus" },
  { name: "Náutico", slug: "nautico" },
  { name: "Sampaio Corrêa", slug: "sampaio-correa" },
  { name: "São Bernardo", slug: "sao-bernardo" },
  { name: "São José-RS", slug: "sao-jose-rs" },
  { name: "Ypiranga-RS", slug: "ypiranga-rs" },
  
  // Use original teams.json as fallback
  ...TEAMS_JSON
];

const TEAMS = COMPREHENSIVE_TEAMS;

// Broadcast information function (server-side version)
function getBroadcastInfo(fixture) {
  const league = fixture.league?.name?.toLowerCase() || '';
  const homeTeam = fixture.teams?.home?.name?.toLowerCase() || '';
  const awayTeam = fixture.teams?.away?.name?.toLowerCase() || '';
  
  // Determine competition type and platform
  if (league.includes('serie a') || league.includes('brasileiro a')) {
    const bigTeams = ['flamengo', 'corinthians', 'palmeiras', 'são paulo', 'santos'];
    const hasBigTeam = bigTeams.some(team => homeTeam.includes(team) || awayTeam.includes(team));
    return {
      platform: hasBigTeam ? 'Globo/SporTV/Premiere' : 'Premiere',
      type: 'TV/Streaming'
    };
  } else if (league.includes('serie b')) {
    return { platform: 'SporTV/Premiere', type: 'TV Fechada' };
  } else if (league.includes('copa do brasil')) {
    return { platform: 'Amazon Prime/SporTV', type: 'Streaming' };
  } else if (league.includes('libertadores')) {
    return { platform: 'Paramount+/SBT', type: 'Streaming/TV' };
  } else if (league.includes('sul-americana') || league.includes('sudamericana')) {
    return { platform: 'Paramount+', type: 'Streaming' };
  } else if (league.includes('carioca')) {
    return { platform: 'Globo RJ/SporTV', type: 'TV Aberta/Fechada' };
  } else if (league.includes('paulista')) {
    return { platform: 'Globo SP/SporTV', type: 'TV Aberta/Fechada' };
  } else if (league.includes('mineiro')) {
    return { platform: 'SporTV/Premiere', type: 'TV Fechada' };
  } else if (league.includes('gaúcho') || league.includes('gaucho')) {
    return { platform: 'SporTV/Premiere', type: 'TV Fechada' };
  } else if (league.includes('copa do nordeste')) {
    return { platform: 'SBT/SporTV', type: 'TV Aberta/Fechada' };
  } else {
    return { platform: 'Consulte programação', type: 'Verificar' };
  }
}

async function api(pathname, params){
  const apiKey = process.env.API_FOOTBALL_KEY || "64dbbac01db6ca5c41fefe0e061937a8";
  const url = new URL(API + pathname);
  Object.entries(params).forEach(([k,v]) => url.searchParams.set(k, v));
  const res = await fetch(url, { headers: { "x-apisports-key": apiKey }});
  if(!res.ok) {
    console.warn(`API error ${res.status} for ${url.toString()}`);
    return []; // Return empty array instead of throwing error
  }
  const j = await res.json();
  return j.response || [];
}

function fmtDate(d){
  const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,"0"), da=String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${da}`;
}

// Load template
const tpl = fs.readFileSync(path.join("scripts","template_index.html"), "utf-8");

// Enhanced card rendering with better SEO and UX
function renderCards(fixtures){
  function cardHTML(f){
    const league = f.league || {};
    const home = f.teams?.home || {};
    const away = f.teams?.away || {};
    const statusShort = f.fixture?.status?.short || "";
    const statusLong = f.fixture?.status?.long || "";
    const ts = f.fixture?.date || "";
    const venue = f.fixture?.venue?.name || "";
    const gh = f.goals?.home;
    const ga = f.goals?.away;
    const score = (gh!=null && ga!=null) ? `${gh} - ${ga}` : "";
    const live = ["1H","2H","LIVE","HT"].includes(statusShort);
    const finished = ["FT","AET","PEN"].includes(statusShort);
    const h = home.name || "", a = away.name || "";
    
    // Format time for Brazilian timezone
    let timeStr = "";
    if (ts) {
      const matchDate = new Date(ts);
      timeStr = matchDate.toLocaleTimeString("pt-BR", { 
        hour: "2-digit", 
        minute: "2-digit", 
        timeZone: "America/Sao_Paulo" 
      });
    }
    
    // Enhanced search keywords
    const q = `onde assistir ${h} x ${a} hoje`.replaceAll(" ","+");
    const google = `https://www.google.com/search?q=${q}`;
    const dataSearch = `${h} ${a} ${league.name||""} ${venue}`.toLowerCase();
    
    // Get real broadcast information
    const broadcastInfo = getBroadcastInfo(f);
    const broadcastPlatform = broadcastInfo.platform;
    const broadcastType = broadcastInfo.type;
    
    // Status badge with better styling
    let statusBadge = "";
    if (live) {
      statusBadge = '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">🔴 AO VIVO</span>';
    } else if (finished) {
      statusBadge = '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">⚽ ENCERRADO</span>';
    } else if (statusLong) {
      statusBadge = `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">${statusLong}</span>`;
    }
    
    return `<article class="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow" data-search="${dataSearch}">
      <!-- League Header -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <img src="${league.logo||""}" alt="${league.name||""}" class="h-6 w-6 object-contain"/>
          <div>
            <div class="font-semibold text-gray-800 text-sm">${league.name||""}</div>
            ${league.round ? `<div class="text-xs text-gray-500">${league.round}</div>` : ""}
          </div>
        </div>
        ${statusBadge}
      </div>
      
      <!-- Teams and Score -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-3 min-w-0 flex-1">
          <img src="${home.logo||''}" alt="${h}" class="h-8 w-8 object-contain flex-shrink-0" />
          <span class="font-medium text-gray-800 truncate">${h}</span>
        </div>
        
        <div class="px-4 text-center">
          ${score ? 
            `<div class="text-2xl font-bold text-gray-900">${score}</div>` :
            `<div class="text-sm font-medium text-gray-600">${timeStr}</div>`
          }
        </div>
        
        <div class="flex items-center gap-3 min-w-0 flex-1 flex-row-reverse">
          <img src="${away.logo||''}" alt="${a}" class="h-8 w-8 object-contain flex-shrink-0" />
          <span class="font-medium text-gray-800 truncate text-right">${a}</span>
        </div>
      </div>
      
      <!-- Match Info and Actions -->
      <div class="flex items-center justify-between text-sm border-t border-gray-100 pt-3">
        <div class="text-gray-600 truncate">
          📍 ${venue || "Local a definir"}
        </div>
        <div class="flex items-center gap-3 flex-shrink-0">
          <div class="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-200 font-medium text-sm">
            📺 ${broadcastPlatform}
          </div>
          <a href="https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(h + ' x ' + a)}&dates=${encodeURIComponent(ts ? new Date(ts).toISOString().replace(/[-:]|\\.\\d{3}/g,'') + '/' + new Date(new Date(ts).getTime()+2*3600000).toISOString().replace(/[-:]|\\.\\d{3}/g,'') : '')}&details=${encodeURIComponent('Jogo • hojetemjogo.com.br • ' + broadcastPlatform)}" 
             target="_blank" rel="nofollow"
             class="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 text-gray-700 rounded-full hover:bg-gray-100 transition-colors text-xs">
            📅 Lembrete
          </a>
          <a href="${google}" target="_blank" rel="nofollow noopener" 
             class="inline-flex items-center gap-1 px-2 py-1 text-blue-600 hover:text-blue-800 transition-colors text-xs">
            🔗 Mais info
          </a>
        </div>
      </div>
    </article>`;
  }
  return fixtures.map(cardHTML).join("\n");
}

// Generate calendar navigation
function generateCalendarNav(currentDate, availableDates) {
  const today = new Date();
  const days = [];
  
  // Generate 14 days starting from today
  for (let i = 0; i < 14; i++) {
    const date = new Date(today.getTime() + i * 86400000);
    const dateStr = fmtDate(date);
    const hasGames = availableDates.includes(dateStr);
    const isToday = i === 0;
    const dayName = date.toLocaleDateString("pt-BR", { weekday: "short" });
    const dayNum = date.getDate();
    
    const classes = isToday 
      ? "bg-blue-600 text-white border-blue-600" 
      : hasGames 
        ? "bg-white text-gray-800 border-gray-300 hover:bg-blue-50 hover:border-blue-300" 
        : "bg-gray-50 text-gray-400 border-gray-200";
    
    days.push(`
      <a href="/dias/${dateStr}/" 
         class="flex flex-col items-center px-3 py-2 rounded-lg border transition-colors min-w-[60px] ${classes}">
        <span class="text-xs font-medium">${dayName}</span>
        <span class="text-lg font-bold">${dayNum}</span>
        ${hasGames ? '<span class="text-xs">⚽</span>' : '<span class="text-xs">-</span>'}
      </a>
    `);
  }
  
  return days.join("");
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
  // Extend to 21 days for comprehensive coverage
  const dates = Array.from({length: 21}, (_, n) => {
    const d = new Date(today.getTime()+n*86400000);
    return fmtDate(d);
  });

  // Fetch fixtures for Brazil for several days
  const byDate = {};
  for (const ds of dates){
    console.log(`Fetching fixtures for ${ds}...`);
    const allFixtures = await api("/fixtures", { date: ds, timezone: TZ });
    
    // Enhanced Brazilian filtering - include all competitions with Brazilian teams
    const brazilianFixtures = allFixtures.filter(fixture => {
      const league = fixture.league?.name?.toLowerCase() || '';
      const country = fixture.league?.country?.toLowerCase() || '';
      const homeTeam = fixture.teams?.home?.name?.toLowerCase() || '';
      const awayTeam = fixture.teams?.away?.name?.toLowerCase() || '';
      
      // Check if it's a Brazilian league/competition
      const isBrazilianLeague = country.includes('brazil') || 
        league.includes('brasileiro') || 
        league.includes('serie') ||
        league.includes('copa do brasil') ||
        league.includes('carioca') ||
        league.includes('paulista') ||
        league.includes('mineiro') ||
        league.includes('gaúcho') ||
        league.includes('baiano') ||
        league.includes('pernambucano') ||
        league.includes('cearense') ||
        league.includes('paraense') ||
        league.includes('copa do nordeste') ||
        league.includes('copa verde') ||
        league.includes('recopa');
      
      // Check if it involves Brazilian teams (for international competitions)
      const hasBrazilianTeam = COMPREHENSIVE_TEAMS.some(team => {
        const teamName = team.name.toLowerCase();
        return homeTeam.includes(teamName) || 
               awayTeam.includes(teamName) ||
               homeTeam.replace(/[^a-zA-Z0-9]/g, '').includes(teamName.replace(/[^a-zA-Z0-9]/g, '')) ||
               awayTeam.replace(/[^a-zA-Z0-9]/g, '').includes(teamName.replace(/[^a-zA-Z0-9]/g, ''));
      });
      
      // Include if it's a Brazilian league OR has Brazilian teams in international competitions
      return isBrazilianLeague || (hasBrazilianTeam && (
        league.includes('libertadores') ||
        league.includes('sul-americana') ||
        league.includes('sudamericana') ||
        league.includes('recopa')
      ));
    });
    
    console.log(`  Found ${allFixtures.length} total, ${brazilianFixtures.length} Brazilian fixtures`);
    byDate[ds] = brazilianFixtures;
    fs.writeFileSync(path.join(DATA_DIR, `${ds}.json`), JSON.stringify(brazilianFixtures, null, 2));
  }

  // Determine which dates have games
  const datesWithGames = dates.filter(d => byDate[d].length > 0);
  
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
  
  // Generate calendar navigation
  const calendar_nav = generateCalendarNav(date_today, datesWithGames);
  
  // Extract popular team from today's games for SEO
  const todaysTeams = byDate[date_today].flatMap(f => [
    f.teams?.home?.name, f.teams?.away?.name
  ]).filter(Boolean);
  
  const popularTeams = ["Flamengo", "Corinthians", "Palmeiras", "São Paulo", "Santos", "Vasco", "Botafogo", "Fluminense"];
  const featuredTeam = todaysTeams.find(team => 
    popularTeams.some(popular => team.toLowerCase().includes(popular.toLowerCase()))
  ) || "Flamengo";

  const html = tpl
    .replaceAll("{date_today}", date_today)
    .replaceAll("{date_tomorrow}", date_tomorrow)
    .replaceAll("{cards_today}", cards_today)
    .replaceAll("{cards_tomorrow}", cards_tomorrow)
    .replaceAll("{cards_next}", cards_next)
    .replaceAll("{calendar_nav}", calendar_nav)
    .replaceAll("{json_ld}", jsonLD(byDate[date_today]))
    .replaceAll("{year}", String(new Date().getFullYear()))
    .replaceAll("{kw_team}", featuredTeam)
    .replaceAll("{more_today}", byDate[date_today].length > 12 ? `<button id="more-today" class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Ver mais jogos de hoje</button>` : "")
    .replaceAll("{more_tomorrow}", byDate[date_tomorrow].length > 12 ? `<button id="more-tomorrow" class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Ver mais jogos de amanhã</button>` : "")
    .replaceAll("{more_next}", nextFixtures.length > 12 ? `<button id="more-next" class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Ver mais jogos</button>` : "");

  fs.writeFileSync(path.join(OUT,"index.html"), html, "utf-8");

  // Build /dias pages
  for (const ds of dates){
    const outDir = path.join(DIAS_DIR, ds);
    fs.mkdirSync(outDir, {recursive:true});
    
    // Find featured team for this date
    const dayTeams = byDate[ds].flatMap(f => [f.teams?.home?.name, f.teams?.away?.name]).filter(Boolean);
    const dayFeaturedTeam = dayTeams.find(team => 
      popularTeams.some(popular => team.toLowerCase().includes(popular.toLowerCase()))
    ) || "Brasileirão";
    
    const page = tpl
      .replaceAll("{date_today}", ds)
      .replaceAll("{date_tomorrow}", dates[1] || ds)
      .replaceAll("{cards_today}", renderCards(byDate[ds]))
      .replaceAll("{cards_tomorrow}", "")
      .replaceAll("{cards_next}", "")
      .replaceAll("{calendar_nav}", generateCalendarNav(ds, datesWithGames))
      .replaceAll("{json_ld}", jsonLD(byDate[ds]))
      .replaceAll("{year}", String(new Date().getFullYear()))
      .replaceAll("{kw_team}", dayFeaturedTeam)
      .replaceAll("{more_today}", "")
      .replaceAll("{more_tomorrow}", "")
      .replaceAll("{more_next}", "");
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
      .replaceAll("{calendar_nav}", generateCalendarNav(fmtDate(new Date()), datesWithGames))
      .replaceAll("{json_ld}", jsonLD(filtered))
      .replaceAll("{year}", String(new Date().getFullYear()))
      .replaceAll("{kw_team}", team.name)
      .replaceAll("{more_today}", "")
      .replaceAll("{more_tomorrow}", "")
      .replaceAll("{more_next}", "");
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
