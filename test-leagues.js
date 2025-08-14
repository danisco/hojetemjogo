// Test Brazilian leagues instead of country filter
const API_KEY = "64dbbac01db6ca5c41fefe0e061937a8";
const API_BASE = "https://v3.football.api-sports.io";

async function testBrazilianLeagues() {
  console.log('🏆 Getting Brazilian leagues...');
  
  // First, let's try getting fixtures without country filter
  console.log('\n📊 Testing fixtures without country filter...');
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
  
  const url = new URL(API_BASE + "/fixtures");
  url.searchParams.set("date", dateStr);
  url.searchParams.set("timezone", "America/Sao_Paulo");
  // Remove country parameter
  
  const response = await fetch(url.toString(), {
    headers: { "x-apisports-key": API_KEY }
  });
  
  const data = await response.json();
  console.log(`📊 Results without country filter: ${data.results || 0}`);
  console.log(`📊 Errors:`, data.errors);
  
  if (data.response && data.response.length > 0) {
    console.log('\n🎮 Sample fixtures:');
    data.response.slice(0, 3).forEach((fixture, i) => {
      console.log(`   ${i+1}. ${fixture.teams?.home?.name} vs ${fixture.teams?.away?.name}`);
      console.log(`      League: ${fixture.league?.name} (${fixture.league?.country})`);
    });
    
    // Filter for Brazilian leagues
    const brazilianFixtures = data.response.filter(fixture => 
      fixture.league?.country?.toLowerCase().includes('brazil')
    );
    console.log(`\n🇧🇷 Brazilian fixtures found: ${brazilianFixtures.length}`);
    
    if (brazilianFixtures.length > 0) {
      console.log('\n🏆 Brazilian matches today:');
      brazilianFixtures.forEach((fixture, i) => {
        console.log(`   ${i+1}. ${fixture.teams?.home?.name} vs ${fixture.teams?.away?.name}`);
        console.log(`      League: ${fixture.league?.name}`);
        console.log(`      Time: ${fixture.fixture?.date}`);
      });
    }
  }
  
  // Now let's get leagues to see Brazilian league IDs
  console.log('\n🏆 Getting leagues...');
  const leaguesResponse = await fetch(API_BASE + "/leagues", {
    headers: { "x-apisports-key": API_KEY }
  });
  
  const leaguesData = await leaguesResponse.json();
  const brazilianLeagues = leaguesData.response?.filter(league => 
    league.country?.name?.toLowerCase().includes('brazil')
  ) || [];
  
  console.log(`\n🇧🇷 Found ${brazilianLeagues.length} Brazilian leagues:`);
  brazilianLeagues.slice(0, 10).forEach(league => {
    console.log(`   - ${league.league.name} (ID: ${league.league.id})`);
  });
}

testBrazilianLeagues();