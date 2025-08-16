// Test with recent dates to validate API works for international leagues
const API = "https://v3.football.api-sports.io";
const apiKey = process.env.API_FOOTBALL_KEY || "64dbbac01db6ca5c41fefe0e061937a8";

async function testLeague(leagueId, leagueName, date) {
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
      fixtures.slice(0, 3).forEach(f => { // Show first 3 games
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

async function checkAllAvailableFixtures(date) {
  console.log(`\n🌍 Checking ALL fixtures for ${date} (no league filter)...`);
  
  try {
    const url = new URL(API + '/fixtures');
    url.searchParams.set('date', date);
    url.searchParams.set('timezone', 'America/Sao_Paulo');
    
    const response = await fetch(url, {
      headers: { "x-apisports-key": apiKey }
    });
    
    if (!response.ok) {
      console.log(`❌ API error: ${response.status}`);
      return;
    }
    
    const data = await response.json();
    const fixtures = data.response || [];
    
    console.log(`📊 Total fixtures available: ${fixtures.length}`);
    
    // Filter for Brazilian teams or international competitions
    const internationalFixtures = fixtures.filter(f => {
      const league = f.league?.name?.toLowerCase() || '';
      const homeTeam = f.teams?.home?.name?.toLowerCase() || '';
      const awayTeam = f.teams?.away?.name?.toLowerCase() || '';
      const country = f.league?.country?.toLowerCase() || '';
      
      const isInternational = league.includes('libertadores') || 
                             league.includes('sudamericana') ||
                             league.includes('sul-americana') ||
                             league.includes('champions') ||
                             league.includes('europa');
      
      const brazilianTeams = ['flamengo', 'botafogo', 'palmeiras', 'corinthians', 'são paulo', 'santos'];
      const hasBrazilianTeam = brazilianTeams.some(team => 
        homeTeam.includes(team) || awayTeam.includes(team)
      );
      
      return isInternational && (hasBrazilianTeam || country === 'world');
    });
    
    console.log(`🇧🇷 International games with potential Brazilian involvement: ${internationalFixtures.length}`);
    
    internationalFixtures.slice(0, 5).forEach(f => {
      const home = f.teams?.home?.name || 'Unknown';
      const away = f.teams?.away?.name || 'Unknown';
      const league = f.league?.name || 'Unknown League';
      const time = new Date(f.fixture?.date).toLocaleTimeString('pt-BR', {timeZone: 'America/Sao_Paulo'});
      console.log(`  ⚽ ${time} - ${home} vs ${away} (${league})`);
    });
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

async function main() {
  console.log('🔍 Testing API-Football with various approaches...\n');
  
  // Test with recent dates that should have data
  const testDates = [
    '2024-08-20', // Past date that should have data
    '2024-12-10', // Recent past date
    '2025-01-15', // Recent date
    '2025-08-16'  // Current date
  ];
  
  const internationalLeagues = [
    { id: '13', name: 'CONMEBOL Libertadores' },
    { id: '11', name: 'CONMEBOL Sudamericana' }
  ];
  
  for (const date of testDates) {
    console.log(`\n📅 === TESTING ${date} ===`);
    
    // Check specific international leagues
    for (const league of internationalLeagues) {
      const fixtures = await testLeague(league.id, league.name, date);
      await new Promise(resolve => setTimeout(resolve, 200)); // Rate limiting
    }
    
    // Check all available fixtures for this date
    await checkAllAvailableFixtures(date);
    
    console.log('---');
  }
}

main().catch(console.error);