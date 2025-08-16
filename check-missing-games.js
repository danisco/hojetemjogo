// Cross-reference games with external sources to find missing matches
import puppeteer from 'puppeteer';
import fs from 'fs';

async function checkLibertadoresGames() {
  console.log('🔍 Checking for missing Libertadores and international games...');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Check SofaScore for this week's games
    console.log('📊 Checking SofaScore for comprehensive match data...');
    await page.goto('https://www.sofascore.com/football/2025-08-16', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    await page.waitForTimeout(3000);
    
    // Look for Brazilian teams in international competitions
    const games = await page.evaluate(() => {
      const matchElements = document.querySelectorAll('[data-testid*="event"], .event, .match');
      const brazilianTeams = [
        'Flamengo', 'Botafogo', 'Palmeiras', 'Corinthians', 'São Paulo', 'Santos',
        'Fluminense', 'Grêmio', 'Internacional', 'Atlético-MG', 'Cruzeiro',
        'Bahia', 'Fortaleza', 'Vasco', 'Athletico-PR', 'Coritiba', 'Ceará'
      ];
      
      const foundGames = [];
      
      matchElements.forEach(element => {
        const text = element.textContent || '';
        const hasLibertadores = text.toLowerCase().includes('libertadores') || 
                               text.toLowerCase().includes('copa libertadores');
        const hasSulAmericana = text.toLowerCase().includes('sul-americana') ||
                               text.toLowerCase().includes('sudamericana');
        
        if (hasLibertadores || hasSulAmericana) {
          // Check if any Brazilian team is mentioned
          const hasBrazilianTeam = brazilianTeams.some(team => 
            text.toLowerCase().includes(team.toLowerCase())
          );
          
          if (hasBrazilianTeam) {
            foundGames.push({
              competition: hasLibertadores ? 'Libertadores' : 'Sul-Americana',
              text: text.substring(0, 200),
              element: element.outerHTML.substring(0, 300)
            });
          }
        }
      });
      
      return foundGames;
    });
    
    console.log(`📈 Found ${games.length} potential international games with Brazilian teams`);
    games.forEach((game, i) => {
      console.log(`  ${i+1}. ${game.competition}: ${game.text.replace(/\s+/g, ' ').trim()}`);
    });
    
    // Also check LiveSoccerTV for comprehensive fixture list
    console.log('\n📺 Checking LiveSoccerTV for broadcast information...');
    await page.goto('https://www.livesoccertv.com/schedules/2025-08-16/', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    await page.waitForTimeout(2000);
    
    const broadcastGames = await page.evaluate(() => {
      const rows = document.querySelectorAll('tr, .fixture-row, .match-row');
      const brazilianTeams = [
        'Flamengo', 'Botafogo', 'Palmeiras', 'Corinthians', 'São Paulo', 'Santos',
        'Fluminense', 'Grêmio', 'Internacional', 'Atlético-MG', 'Cruzeiro',
        'Bahia', 'Fortaleza', 'Vasco', 'Athletico'
      ];
      
      const foundGames = [];
      
      rows.forEach(row => {
        const text = row.textContent || '';
        const hasInternational = text.toLowerCase().includes('libertadores') || 
                                text.toLowerCase().includes('sul-americana') ||
                                text.toLowerCase().includes('sudamericana') ||
                                text.toLowerCase().includes('copa libertadores');
        
        if (hasInternational) {
          const hasBrazilianTeam = brazilianTeams.some(team => 
            text.toLowerCase().includes(team.toLowerCase())
          );
          
          if (hasBrazilianTeam) {
            foundGames.push({
              text: text.replace(/\s+/g, ' ').trim().substring(0, 150),
              html: row.outerHTML.substring(0, 200)
            });
          }
        }
      });
      
      return foundGames;
    });
    
    console.log(`📺 Found ${broadcastGames.length} international games on LiveSoccerTV`);
    broadcastGames.forEach((game, i) => {
      console.log(`  ${i+1}. ${game.text}`);
    });
    
    // Save results for analysis
    const results = {
      date: new Date().toISOString(),
      sofascore: games,
      livesoccertv: broadcastGames,
      analysis: {
        totalFound: games.length + broadcastGames.length,
        hasLibertadores: games.some(g => g.competition === 'Libertadores'),
        hasSulAmericana: games.some(g => g.competition === 'Sul-Americana')
      }
    };
    
    fs.writeFileSync('missing-games-analysis.json', JSON.stringify(results, null, 2));
    console.log('\n💾 Results saved to missing-games-analysis.json');
    
    return results;
    
  } catch (error) {
    console.error('❌ Error checking external sources:', error.message);
    return { error: error.message };
  } finally {
    await browser.close();
  }
}

// Also check API-Football for specific international league IDs
async function checkApiFootballLeagues() {
  console.log('\n🌍 Checking API-Football for international league IDs...');
  
  const internationalLeagues = [
    '13', // CONMEBOL Libertadores
    '11', // CONMEBOL Sudamericana
    '12', // CONMEBOL Recopa Sudamericana
    '480', // Copa Libertadores (alternative ID)
    '484'  // Copa Sudamericana (alternative ID)
  ];
  
  const API = "https://v3.football.api-sports.io";
  const apiKey = process.env.API_FOOTBALL_KEY || "64dbbac01db6ca5c41fefe0e061937a8";
  
  for (const leagueId of internationalLeagues) {
    try {
      const url = new URL(API + '/fixtures');
      url.searchParams.set('date', '2025-08-19'); // Check Tuesday
      url.searchParams.set('league', leagueId);
      url.searchParams.set('timezone', 'America/Sao_Paulo');
      
      console.log(`  🔍 Checking League ID ${leagueId}...`);
      
      const response = await fetch(url, {
        headers: { "x-apisports-key": apiKey }
      });
      
      if (response.ok) {
        const data = await response.json();
        const fixtures = data.response || [];
        
        if (fixtures.length > 0) {
          console.log(`    ✅ Found ${fixtures.length} games in league ${leagueId}`);
          fixtures.forEach(f => {
            const home = f.teams?.home?.name || 'Unknown';
            const away = f.teams?.away?.name || 'Unknown';
            const league = f.league?.name || 'Unknown League';
            console.log(`      📅 ${home} vs ${away} (${league})`);
          });
        } else {
          console.log(`    ⭕ No games found in league ${leagueId}`);
        }
      } else {
        console.log(`    ❌ API error for league ${leagueId}: ${response.status}`);
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error) {
      console.log(`    ❌ Error checking league ${leagueId}: ${error.message}`);
    }
  }
}

// Run both checks
async function main() {
  console.log('🚀 Starting comprehensive game detection...\n');
  
  // Check external sources
  const externalResults = await checkLibertadoresGames();
  
  // Check API-Football directly
  await checkApiFootballLeagues();
  
  console.log('\n📊 SUMMARY:');
  console.log('- Check missing-games-analysis.json for detailed external source results');
  console.log('- Review API-Football league IDs above');
  console.log('- Update build script with missing league IDs if games are found');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { checkLibertadoresGames, checkApiFootballLeagues };