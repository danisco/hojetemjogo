// Test API-Football for international leagues with Brazilian teams
const API = "https://v3.football.api-sports.io";
const apiKey = process.env.API_FOOTBALL_KEY || "64dbbac01db6ca5c41fefe0e061937a8";

async function testLeague(leagueId, leagueName, date = '2025-08-19') {
  try {
    const url = new URL(API + '/fixtures');
    url.searchParams.set('date', date);
    url.searchParams.set('league', leagueId);
    url.searchParams.set('timezone', 'America/Sao_Paulo');
    
    console.log(`🔍 Testing ${leagueName} (ID: ${leagueId}) for ${date}...`);
    
    const response = await fetch(url, {
      headers: { "x-apisports-key": apiKey }
    });
    
    if (!response.ok) {
      console.log(`  ❌ API error: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    const fixtures = data.response || [];
    
    console.log(`  📊 Found ${fixtures.length} games`);
    
    if (fixtures.length > 0) {
      fixtures.forEach(f => {
        const home = f.teams?.home?.name || 'Unknown';
        const away = f.teams?.away?.name || 'Unknown';
        const time = new Date(f.fixture?.date).toLocaleTimeString('pt-BR', {timeZone: 'America/Sao_Paulo'});
        console.log(`    ⚽ ${time} - ${home} vs ${away}`);
      });
    }
    
    return fixtures;
    
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    return [];
  }
}

async function main() {
  console.log('🌍 Testing international league coverage...\n');
  
  // Test various dates this week
  const testDates = ['2025-08-19', '2025-08-20', '2025-08-21'];
  
  // International leagues to test
  const leagues = [
    { id: '13', name: 'CONMEBOL Libertadores' },
    { id: '11', name: 'CONMEBOL Sudamericana' },
    { id: '12', name: 'Recopa Sudamericana' },
    { id: '480', name: 'Copa Libertadores (alt)' },
    { id: '484', name: 'Copa Sudamericana (alt)' },
    { id: '2', name: 'Champions League' },
    { id: '3', name: 'Europa League' },
    { id: '848', name: 'Conference League' }
  ];
  
  for (const date of testDates) {
    console.log(`\n📅 === TESTING ${date} ===`);
    
    let totalGames = 0;
    for (const league of leagues) {
      const fixtures = await testLeague(league.id, league.name, date);
      totalGames += fixtures.length;
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`\n📈 Total games found for ${date}: ${totalGames}`);
  }
  
  console.log('\n✅ Testing completed!');
}

main().catch(console.error);