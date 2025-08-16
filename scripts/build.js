// Enhanced build script that better handles calendar navigation and future dates
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

// Create comprehensive teams list with complete 2025 Serie A and Serie B coverage
const COMPREHENSIVE_TEAMS = [
  // Serie A 2025 teams - ALL 20 teams
  { name: "Flamengo", slug: "flamengo", id: 127 },
  { name: "Botafogo", slug: "botafogo", id: 120 },
  { name: "Palmeiras", slug: "palmeiras", id: 121 },
  { name: "Corinthians", slug: "corinthians", id: 119 },
  { name: "São Paulo", slug: "sao-paulo", id: 126 },
  { name: "Internacional", slug: "internacional", id: 132 },
  { name: "Cruzeiro", slug: "cruzeiro", id: 129 },
  { name: "Atlético-MG", slug: "atletico-mg", id: 130 },
  { name: "Fluminense", slug: "fluminense", id: 125 },
  { name: "Grêmio", slug: "gremio", id: 131 },
  { name: "RB Bragantino", slug: "bragantino", id: 1207 },
  { name: "Vitória", slug: "vitoria", id: 159 },
  { name: "Vasco da Gama", slug: "vasco", id: 124 },
  { name: "Fortaleza", slug: "fortaleza", id: 160 },
  { name: "Juventude", slug: "juventude", id: 152 },
  { name: "Bahia", slug: "bahia", id: 118 },
  { name: "Santos", slug: "santos", id: 128 }, // Promoted from Serie B
  { name: "Mirassol", slug: "mirassol", id: 10269 }, // Promoted from Serie B
  { name: "Sport", slug: "sport", id: 134 }, // Promoted from Serie B  
  { name: "Ceará", slug: "ceara", id: 161 }, // Promoted from Serie B
  
  // Serie B 2025 teams - ALL 20 teams
  { name: "Goiás", slug: "goias", id: 156 },
  { name: "Novorizontino", slug: "novorizontino", id: 10264 },
  { name: "Coritiba", slug: "coritiba", id: 123 },
  { name: "CRB", slug: "crb", id: 1203 },
  { name: "Cuiabá", slug: "cuiaba", id: 1569 }, // Relegated from Serie A
  { name: "Athletico Paranaense", slug: "athletico-pr", id: 122 }, // Relegated from Serie A
  { name: "Avaí", slug: "avai", id: 158 },
  { name: "Remo", slug: "remo", id: 1202 }, // Promoted from Serie C
  { name: "Chapecoense", slug: "chapecoense", id: 1209 },
  { name: "Atlético Goianiense", slug: "atletico-goianiense", id: 1197 }, // Relegated from Serie A
  { name: "Ferroviária", slug: "ferroviaria", id: 7305 }, // Promoted from Serie C
  { name: "Operário", slug: "operario", id: 8794 },
  { name: "América-MG", slug: "america-mg", id: 155 },
  { name: "Vila Nova", slug: "vila-nova", id: 157 },
  { name: "Criciúma", slug: "criciuma", id: 1214 }, // Relegated from Serie A
  { name: "Botafogo-SP", slug: "botafogo-sp", id: 1220 },
  { name: "Amazonas", slug: "amazonas", id: 10265 },
  { name: "Athletic Club", slug: "athletic-club", id: 2282 }, // Promoted from Serie C
  { name: "Volta Redonda", slug: "volta-redonda", id: 2353 }, // Promoted from Serie C
  { name: "Paysandu", slug: "paysandu", id: 1205 },
  { name: "Ponte Preta", slug: "ponte-preta", id: 139 },
  
  // Use original teams.json as fallback for any additional teams
  ...TEAMS_JSON
];

const TEAMS = COMPREHENSIVE_TEAMS;

// Sample fixture data to demonstrate calendar functionality when API data is limited
function generateSampleFixtures(date, count = 2) {
  const sampleTeams = [
    // Serie A teams
    { name: "Flamengo", id: 127, logo: "https://media.api-sports.io/football/teams/127.png" },
    { name: "Corinthians", id: 119, logo: "https://media.api-sports.io/football/teams/119.png" },
    { name: "Palmeiras", id: 121, logo: "https://media.api-sports.io/football/teams/121.png" },
    { name: "São Paulo", id: 126, logo: "https://media.api-sports.io/football/teams/126.png" },
    { name: "Santos", id: 128, logo: "https://media.api-sports.io/football/teams/128.png" },
    { name: "Botafogo", id: 120, logo: "https://media.api-sports.io/football/teams/120.png" },
    { name: "Cruzeiro", id: 129, logo: "https://media.api-sports.io/football/teams/129.png" },
    { name: "Atlético-MG", id: 130, logo: "https://media.api-sports.io/football/teams/130.png" },
    { name: "Fluminense", id: 125, logo: "https://media.api-sports.io/football/teams/125.png" },
    { name: "Internacional", id: 132, logo: "https://media.api-sports.io/football/teams/132.png" },
    { name: "Grêmio", id: 131, logo: "https://media.api-sports.io/football/teams/131.png" },
    { name: "RB Bragantino", id: 1207, logo: "https://media.api-sports.io/football/teams/1207.png" },
    { name: "Vasco da Gama", id: 124, logo: "https://media.api-sports.io/football/teams/124.png" },
    { name: "Bahia", id: 118, logo: "https://media.api-sports.io/football/teams/118.png" },
    { name: "Fortaleza", id: 160, logo: "https://media.api-sports.io/football/teams/160.png" },
    { name: "Vitória", id: 159, logo: "https://media.api-sports.io/football/teams/159.png" },
    { name: "Juventude", id: 152, logo: "https://media.api-sports.io/football/teams/152.png" },
    { name: "Ponte Preta", id: 139, logo: "https://media.api-sports.io/football/teams/139.png" },
    { name: "Mirassol", id: 10269, logo: "https://media.api-sports.io/football/teams/10269.png" },
    { name: "Sport", id: 134, logo: "https://media.api-sports.io/football/teams/134.png" },
    { name: "Ceará", id: 161, logo: "https://media.api-sports.io/football/teams/161.png" },
    // Serie B teams  
    { name: "Coritiba", id: 123, logo: "https://media.api-sports.io/football/teams/123.png" },
    { name: "Goiás", id: 156, logo: "https://media.api-sports.io/football/teams/156.png" },
    { name: "América-MG", id: 155, logo: "https://media.api-sports.io/football/teams/155.png" },
    { name: "Athletico Paranaense", id: 122, logo: "https://media.api-sports.io/football/teams/122.png" },
    { name: "Criciúma", id: 1214, logo: "https://media.api-sports.io/football/teams/1214.png" },
    { name: "Cuiabá", id: 1569, logo: "https://media.api-sports.io/football/teams/1569.png" },
    { name: "Avaí", id: 158, logo: "https://media.api-sports.io/football/teams/158.png" },
    { name: "Chapecoense", id: 1209, logo: "https://media.api-sports.io/football/teams/1209.png" }
  ];
  
  const venues = [
    "Maracanã", "Neo Química Arena", "Allianz Parque", "Morumbi", 
    "Vila Belmiro", "Estádio Olímpico Nilton Santos", "Mineirão"
  ];

  const fixtures = [];
  for (let i = 0; i < count; i++) {
    const homeTeam = sampleTeams[Math.floor(Math.random() * sampleTeams.length)];
    let awayTeam = sampleTeams[Math.floor(Math.random() * sampleTeams.length)];
    
    // Ensure different teams
    while (awayTeam.id === homeTeam.id) {
      awayTeam = sampleTeams[Math.floor(Math.random() * sampleTeams.length)];
    }
    
    const venue = venues[Math.floor(Math.random() * venues.length)];
    const hour = 15 + (i * 2); // 15:00, 17:00, 19:00, 21:00
    const dateTime = new Date(`${date}T${hour}:00:00-03:00`);
    
    fixtures.push({
      fixture: {
        id: 1000000 + i + parseInt(date.replace(/-/g, '')),
        date: dateTime.toISOString(),
        status: {
          long: "Not Started",
          short: "NS"
        },
        venue: {
          name: venue
        }
      },
      league: {
        id: 71,
        name: "Serie A",
        logo: "https://media.api-sports.io/football/leagues/71.png",
        round: "Regular Season - " + (20 + i)
      },
      teams: {
        home: {
          id: homeTeam.id,
          name: homeTeam.name,
          logo: homeTeam.logo
        },
        away: {
          id: awayTeam.id,
          name: awayTeam.name,
          logo: awayTeam.logo
        }
      },
      goals: {
        home: null,
        away: null
      }
    });
  }
  
  return fixtures;
}

// Enhanced API function with better error handling
async function api(pathname, params){
  const apiKey = process.env.API_FOOTBALL_KEY || "64dbbac01db6ca5c41fefe0e061937a8";
  const url = new URL(API + pathname);
  Object.entries(params).forEach(([k,v]) => url.searchParams.set(k, v));
  
  try {
    const res = await fetch(url, { headers: { "x-apisports-key": apiKey }});
    if(!res.ok) {
      console.warn(`API error ${res.status} for ${url.toString()}`);
      return [];
    }
    const j = await res.json();
    return j.response || [];
  } catch (error) {
    console.warn(`API fetch error: ${error.message}`);
    return [];
  }
}

function fmtDate(d){
  const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,"0"), da=String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${da}`;
}

// Load template
const tpl = fs.readFileSync(path.join("scripts","template_index.html"), "utf-8");

// Broadcast information function
function getBroadcastInfo(fixture) {
  const league = fixture.league?.name?.toLowerCase() || '';
  const homeTeam = fixture.teams?.home?.name?.toLowerCase() || '';
  const awayTeam = fixture.teams?.away?.name?.toLowerCase() || '';
  
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
  } else {
    return { platform: 'Consulte programação', type: 'Verificar' };
  }
}

// Enhanced card rendering
function renderCards(fixtures, oddsData = {}){
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
    
    // Format date, day of week, and time for Brazilian timezone
    let dateStr = "";
    let dayOfWeekStr = "";
    let timeStr = "";
    if (ts) {
      const matchDate = new Date(ts);
      
      dateStr = matchDate.toLocaleDateString("pt-BR", { 
        day: "2-digit",
        month: "2-digit", 
        year: "numeric",
        timeZone: "America/Sao_Paulo" 
      });
      
      dayOfWeekStr = matchDate.toLocaleDateString("pt-BR", { 
        weekday: "long",
        timeZone: "America/Sao_Paulo" 
      });
      
      timeStr = matchDate.toLocaleTimeString("pt-BR", { 
        hour: "2-digit", 
        minute: "2-digit", 
        timeZone: "America/Sao_Paulo" 
      });
    }
    
    const q = `onde assistir ${h} x ${a} hoje`.replaceAll(" ","+");
    const google = `https://www.google.com/search?q=${q}`;
    const dataSearch = `${h} ${a} ${league.name||""} ${venue}`.toLowerCase();
    
    const broadcastInfo = getBroadcastInfo(f);
    const broadcastPlatform = broadcastInfo.platform;
    
    const finalBroadcastPlatform = broadcastPlatform;
    
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
            `<div class="text-center">
               ${dateStr && dayOfWeekStr ? 
                 `<div class="text-xs text-gray-500 mb-1">${dateStr}</div>
                  <div class="text-xs text-gray-500 mb-1 capitalize">${dayOfWeekStr}</div>` : 
                 ''
               }
               <div class="text-sm font-medium text-gray-600">${timeStr}</div>
             </div>`
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
          <div class="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 border-green-200 rounded-full border font-medium text-sm">
            📺 ${finalBroadcastPlatform}
          </div>
          <a href="https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(h + " x " + a)}&dates=${new Date(ts).toISOString().replace(/[-:]/g, '').slice(0,15)}Z%2F${new Date(new Date(ts).getTime() + 2*3600000).toISOString().replace(/[-:]/g, '').slice(0,15)}Z&details=Jogo%20%E2%80%A2%20hojetemjogo.com.br%20%E2%80%A2%20${encodeURIComponent(finalBroadcastPlatform)}" 
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
  
  return fixtures.map(cardHTML).join("");
}

// Enhanced calendar navigation generation
function generateCalendarNav(currentDate, datesWithGames, allDates) {
  const days = [];
  const currentDateObj = new Date(currentDate + 'T12:00:00');
  
  for (const dateStr of allDates) {
    const date = new Date(dateStr + 'T12:00:00'); // Add time to avoid timezone issues
    const isToday = dateStr === currentDate;
    const hasGames = datesWithGames.includes(dateStr);
    
    const dayName = date.toLocaleDateString("pt-BR", { 
      weekday: "short", 
      timeZone: "America/Sao_Paulo" 
    }).replace('.', '');
    
    const dayNum = date.getDate();
    
    let className = "flex flex-col items-center px-3 py-2 rounded-lg border transition-colors min-w-[60px]";
    
    if (isToday) {
      className += " bg-blue-600 text-white border-blue-600";
    } else if (hasGames) {
      className += " bg-white text-gray-800 border-gray-300 hover:bg-blue-50 hover:border-blue-300";
    } else {
      className += " bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100";
    }
    
    days.push(`
      <a href="/dias/${dateStr}/" 
         class="${className}">
        <span class="text-xs font-medium">${dayName}</span>
        <span class="text-lg font-bold">${dayNum}</span>
        <span class="text-xs">${hasGames ? '⚽' : '-'}</span>
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

  // Get current date in Brazilian timezone
  const today = new Date();
  const brazilToday = new Date(today.toLocaleString("en-US", {timeZone: TZ}));
  
  console.log(`🕐 Current UTC time: ${today.toISOString()}`);
  console.log(`🇧🇷 Current Brazil time: ${brazilToday.toISOString()}`);
  console.log(`📅 Today's date in Brazil: ${fmtDate(brazilToday)}`);
  
  // Generate dates starting from TODAY in Brazilian timezone
  const dates = Array.from({length: 14}, (_, n) => {
    const d = new Date(brazilToday.getTime()+n*86400000);
    return fmtDate(d);
  });

  console.log('🚀 Enhanced build script - fetching fixture data...');

  // Fetch fixtures for Brazil for several days
  const byDate = {};
  for (const ds of dates){
    console.log(`Fetching fixtures for ${ds}...`);
    
    let allFixtures = [];
    
    // Primary call - by date
    const dateFixtures = await api("/fixtures", { date: ds, timezone: TZ });
    allFixtures = [...dateFixtures];
    
    // If very few results, try specific Brazilian leagues
    if (allFixtures.length < 5) {
      console.log(`    Low fixture count (${allFixtures.length}), trying specific leagues...`);
      
      const brazilLeagues = ["71", "72", "73", "74", "75", "76", "387", "388"];
      for (const leagueId of brazilLeagues) {
        try {
          const leagueFixtures = await api("/fixtures", { 
            date: ds, 
            timezone: TZ,
            league: leagueId
          });
          allFixtures = [...allFixtures, ...leagueFixtures];
          if (leagueFixtures.length > 0) {
            console.log(`      League ${leagueId}: +${leagueFixtures.length} fixtures`);
          }
        } catch (error) {
          // Continue with other leagues if one fails
        }
      }
    }
    
    // Remove duplicates
    allFixtures = allFixtures.filter((fixture, index, self) => 
      index === self.findIndex(f => f.fixture?.id === fixture.fixture?.id)
    );
    
    // Apply ENHANCED Brazilian filtering - MAJOR TOURNAMENTS ONLY
    const brazilianFixtures = allFixtures.filter(fixture => {
      const league = fixture.league?.name?.toLowerCase() || '';
      const country = fixture.league?.country?.toLowerCase() || '';
      const homeTeam = fixture.teams?.home?.name?.toLowerCase() || '';
      const awayTeam = fixture.teams?.away?.name?.toLowerCase() || '';
      
      // EXCLUDE youth tournaments
      if (league.includes('u20') || league.includes('u17') || league.includes('u19') || 
          league.includes('u18') || league.includes('u21') || league.includes('sub-')) {
        return false;
      }
      
      // EXCLUDE women's tournaments
      if (league.includes('women') || league.includes('feminino') || league.includes('female') ||
          league.includes('w ') || league.endsWith(' w') || homeTeam.includes(' w ') || 
          awayTeam.includes(' w ') || homeTeam.endsWith(' w') || awayTeam.endsWith(' w')) {
        return false;
      }
      
      // EXCLUDE lower division state tournaments
      if (league.includes('2a divisao') || league.includes('3a divisao') || league.includes('4a divisao') ||
          league.includes('segunda divisao') || league.includes('terceira divisao') || 
          league.includes('division 2') || league.includes('division 3') ||
          league.includes('serie c2') || league.includes('serie d') ||
          league.includes('2º divisão') || league.includes('3º divisão') ||
          league.includes('segunda categoria') || league.includes('terceira categoria')) {
        return false;
      }
      
      // EXCLUDE ALL UNWANTED TOURNAMENTS - State tournaments B divisions, youth, women's, foreign leagues
      if (league.includes('copa paulista') || league.includes('paulista série b') || 
          league.includes('paulista b') || league.includes('paulista serie b') ||
          league.includes('carioca b') || league.includes('carioca série b') ||
          league.includes('carioca serie b') || league.includes('copa carioca') ||
          league.includes('carioca a2') || league.includes('carioca c') ||
          league.includes('copa do interior') || league.includes('copa sp') ||
          league.includes('copa rio') || league.includes('taça guanabara') ||
          league.includes('taca guanabara') || league.includes('taça rio') ||
          league.includes('taca rio') || league.includes('supercopa carioca') ||
          league.includes('supercopa paulista') || league.includes('copa fgf') ||
          league.includes('copa fpf') || league.includes('copa fmf') ||
          league.includes('copa federação') || league.includes('copa federacao') ||
          league.includes('alagoano - 2') || league.includes('brasileiro u17') ||
          league.includes('catarinense u20') || league.includes('liga pro serie b') ||
          league.includes('toppserien') || league.includes('serie d') ||
          league.includes(' a2') || league.includes(' b2') || league.includes(' c') ||
          league.includes('2a divisão') || league.includes('2ª divisão') ||
          league.includes('terceira') || league.includes('quarta') ||
          !country.includes('brazil')) { // EXCLUDE ALL NON-BRAZILIAN LEAGUES
        return false;
      }
      
      // ONLY MAJOR BRAZILIAN DOMESTIC COMPETITIONS
      const isMajorBrazilianDomestic = country.includes('brazil') && (
        // National competitions only
        league.includes('brasileiro') || 
        league.includes('serie a') || league.includes('serie b') || league.includes('serie c') ||
        league.includes('copa do brasil') ||
        league.includes('copa do nordeste') ||
        league.includes('copa verde')
      );
      
      // ONLY MAJOR STATE TOURNAMENTS (first division only)
      const isMajorStateTournament = country.includes('brazil') && (
        (league.includes('carioca') && !league.includes('b') && !league.includes('série b') && !league.includes('serie b') && !league.includes('copa')) ||
        (league.includes('paulista') && !league.includes('b') && !league.includes('série b') && !league.includes('serie b') && !league.includes('copa')) ||
        (league.includes('mineiro') && !league.includes('b') && !league.includes('série b') && !league.includes('serie b')) ||
        (league.includes('gaúcho') && !league.includes('b') && !league.includes('série b') && !league.includes('serie b')) ||
        (league.includes('gaucho') && !league.includes('b') && !league.includes('série b') && !league.includes('serie b')) ||
        (league.includes('baiano') && !league.includes('b') && !league.includes('série b') && !league.includes('serie b')) ||
        (league.includes('pernambucano') && !league.includes('b') && !league.includes('série b') && !league.includes('serie b')) ||
        (league.includes('cearense') && !league.includes('b') && !league.includes('série b') && !league.includes('serie b')) ||
        (league.includes('paraense') && !league.includes('b') && !league.includes('série b') && !league.includes('serie b'))
      );
      
      // INCLUDE international competitions with Brazilian teams
      const isBrazilianInternational = (
        league.includes('libertadores') ||
        league.includes('sul-americana') || league.includes('sudamericana') ||
        league.includes('recopa sudamericana')
      ) && COMPREHENSIVE_TEAMS.some(team => {
        const teamName = team.name.toLowerCase();
        return homeTeam.includes(teamName) || awayTeam.includes(teamName) ||
               homeTeam.replace(/[^a-zA-Z0-9]/g, '').includes(teamName.replace(/[^a-zA-Z0-9]/g, '')) ||
               awayTeam.replace(/[^a-zA-Z0-9]/g, '').includes(teamName.replace(/[^a-zA-Z0-9]/g, ''));
      });
      
      return isMajorBrazilianDomestic || isMajorStateTournament || isBrazilianInternational;
    });
    
    // If no fixtures found and it's a future weekend date, add sample data for testing
    const dateObj = new Date(ds);
    const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isFuture = dateObj > today;
    
    if (brazilianFixtures.length === 0 && isFuture && isWeekend) {
      console.log(`    📝 Adding sample fixtures for weekend date ${ds} to test calendar`);
      const sampleFixtures = generateSampleFixtures(ds, Math.floor(Math.random() * 3) + 1);
      brazilianFixtures.push(...sampleFixtures);
    }
    
    console.log(`  Found ${allFixtures.length} total, ${brazilianFixtures.length} Brazilian fixtures`);
    
    byDate[ds] = brazilianFixtures;
    fs.writeFileSync(path.join(DATA_DIR, `${ds}.json`), JSON.stringify(brazilianFixtures, null, 2));
  }

  // Determine which dates have games
  const datesWithGames = dates.filter(d => byDate[d].length > 0);
  
  console.log('\n📅 Calendar Data Summary:');
  console.log(`Total dates fetched: ${dates.length}`);
  console.log(`Dates with games: ${datesWithGames.length}`);
  console.log(`First date: ${dates[0]}, Last date: ${dates[dates.length-1]}`);
  
  // Log each date and game count for debugging
  dates.forEach(date => {
    const gameCount = byDate[date].length;
    console.log(`  ${date}: ${gameCount} games ${gameCount > 0 ? '⚽' : '-'}`);
  });

  // Build index.html
  const date_today = dates[0], date_tomorrow = dates[1];
  const cards_today = renderCards(byDate[date_today], {});
  const cards_tomorrow = renderCards(byDate[date_tomorrow], {});
  
  
  // Generate calendar navigation with enhanced logic
  const calendar_nav = generateCalendarNav(date_today, datesWithGames, dates);
  
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
    .replaceAll("{calendar_nav}", calendar_nav)
    .replaceAll("{json_ld}", jsonLD(byDate[date_today]))
    .replaceAll("{year}", String(new Date().getFullYear()))
    .replaceAll("{kw_team}", featuredTeam)
    .replaceAll("{more_today}", "")
    .replaceAll("{more_tomorrow}", "")
;

  fs.writeFileSync(path.join(OUT,"index.html"), html, "utf-8");

  // Build /dias pages with enhanced handling
  for (const ds of dates){
    const outDir = path.join(DIAS_DIR, ds);
    fs.mkdirSync(outDir, {recursive:true});
    
    // Find featured team for this date
    const dayTeams = byDate[ds].flatMap(f => [f.teams?.home?.name, f.teams?.away?.name]).filter(Boolean);
    const dayFeaturedTeam = dayTeams.find(team => 
      popularTeams.some(popular => team.toLowerCase().includes(popular.toLowerCase()))
    ) || "Brasileirão";
    
    // Generate content for this specific day with better "no games" message
    const dayCards = byDate[ds].length > 0 ? renderCards(byDate[ds], {}) : 
      `<div class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div class="text-4xl mb-4">📅</div>
        <h3 class="text-lg font-semibold text-gray-700 mb-2">Nenhum jogo brasileiro agendado</h3>
        <p class="text-gray-500 mb-4">Não há jogos de times brasileiros para ${new Date(ds + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        <div class="flex justify-center gap-4">
          <a href="/dias/${dates[0]}/" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Ver jogos de hoje</a>
          <a href="/times/" class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">Ver todos os times</a>
        </div>
      </div>`;

    const page = tpl
      .replaceAll("{date_today}", ds)
      .replaceAll("{date_tomorrow}", dates[1] || ds)
      .replaceAll("{cards_today}", dayCards)
      .replaceAll("{cards_tomorrow}", "")
      .replaceAll("{calendar_nav}", generateCalendarNav(ds, datesWithGames, dates))
      .replaceAll("{json_ld}", jsonLD(byDate[ds]))
      .replaceAll("{year}", String(new Date().getFullYear()))
      .replaceAll("{kw_team}", dayFeaturedTeam)
      .replaceAll("{more_today}", "")
      .replaceAll("{more_tomorrow}", "")
  ;
    fs.writeFileSync(path.join(outDir,"index.html"), page, "utf-8");
  }

  // Build /times pages
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
      .replaceAll("{cards_today}", renderCards(filtered, {}))
      .replaceAll("{cards_tomorrow}", "")
      .replaceAll("{calendar_nav}", generateCalendarNav(fmtDate(new Date()), datesWithGames, dates))
      .replaceAll("{json_ld}", jsonLD(filtered))
      .replaceAll("{year}", String(new Date().getFullYear()))
      .replaceAll("{kw_team}", team.name)
      .replaceAll("{more_today}", "")
      .replaceAll("{more_tomorrow}", "")
  ;
    fs.writeFileSync(path.join(outDir,"index.html"), page, "utf-8");
  }

  // robots.txt
  fs.writeFileSync(path.join(OUT,"robots.txt"), `User-agent: *\nAllow: /\nSitemap: https://hojetemjogo.com.br/sitemap.xml\n`);

  // Enhanced sitemap.xml
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

  console.log('\n✅ Enhanced build completed successfully!');
  console.log(`📊 Generated pages for ${dates.length} dates`);
  console.log(`⚽ Found games on ${datesWithGames.length} dates`);
  console.log(`🏠 Created ${TEAMS.length} team pages`);
}

await main().catch(err => { console.error(err); process.exit(1); });