const puppeteer = require('puppeteer');
const fs = require('fs');

async function testCalendarNavigation() {
  console.log('🔍 Testing final fixes and calendar navigation...\n');
  
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  // Test main page
  console.log('📄 Testing main page (index.html)...');
  await page.goto('file://' + __dirname + '/index.html');
  await page.waitForTimeout(2000);
  
  // Check if only major tournaments are displayed
  console.log('🏆 Checking tournament filtering...');
  const games = await page.evaluate(() => {
    const articles = document.querySelectorAll('article[data-search]');
    return Array.from(articles).map(article => {
      const league = article.querySelector('.font-semibold').textContent;
      const teams = article.querySelector('[data-search]').getAttribute('data-search');
      return { league, teams };
    });
  });
  
  console.log(`Found ${games.length} games on main page:`);
  games.forEach((game, i) => {
    console.log(`  ${i+1}. ${game.league}: ${game.teams}`);
  });
  
  // Test calendar navigation - click on a date
  console.log('\n📅 Testing calendar navigation...');
  
  // Find a date with games
  const calendarLinks = await page.$$eval('a[href*="/dias/"]', links => 
    links.map(link => ({
      href: link.href,
      text: link.textContent.trim(),
      hasGames: link.textContent.includes('⚽')
    }))
  );
  
  const dateWithGames = calendarLinks.find(link => link.hasGames);
  if (dateWithGames) {
    console.log(`Clicking on date: ${dateWithGames.text}`);
    await page.click(`a[href="${dateWithGames.href.split('file://')[1]}"]`);
    await page.waitForTimeout(2000);
    
    // Check if page loaded correctly
    const title = await page.title();
    console.log(`Navigated to: ${title}`);
    
    // Check games on this date
    const dayGames = await page.evaluate(() => {
      const articles = document.querySelectorAll('article[data-search]');
      return Array.from(articles).map(article => {
        const league = article.querySelector('.font-semibold')?.textContent || 'Unknown';
        const teams = article.querySelector('[data-search]')?.getAttribute('data-search') || 'Unknown';
        return { league, teams };
      });
    });
    
    console.log(`Games on this date: ${dayGames.length}`);
    dayGames.forEach((game, i) => {
      console.log(`  ${i+1}. ${game.league}: ${game.teams}`);
    });
  }
  
  // Test team logo loading
  console.log('\n🖼️ Testing team logo loading...');
  const logoResults = await page.evaluate(() => {
    const logos = document.querySelectorAll('img[alt*="Bahia"], img[alt*="Ceará"], img[alt*="Vitória"], img[alt*="Juventude"], img[alt*="Ponte Preta"]');
    return Array.from(logos).map(img => ({
      alt: img.alt,
      src: img.src,
      loaded: img.complete && img.naturalHeight !== 0
    }));
  });
  
  logoResults.forEach(logo => {
    console.log(`  ${logo.alt}: ${logo.loaded ? '✅ Loaded' : '❌ Failed'} (${logo.src})`);
  });
  
  // Check data files for tournament filtering
  console.log('\n📊 Analyzing data files...');
  const dataFiles = fs.readdirSync('./data').filter(f => f.endsWith('.json'));
  let totalGames = 0;
  const tournamentCounts = {};
  
  dataFiles.forEach(file => {
    const data = JSON.parse(fs.readFileSync(`./data/${file}`, 'utf8'));
    totalGames += data.length;
    
    data.forEach(fixture => {
      const league = fixture.league?.name || 'Unknown';
      tournamentCounts[league] = (tournamentCounts[league] || 0) + 1;
    });
  });
  
  console.log(`Total games across all dates: ${totalGames}`);
  console.log('Tournaments included:');
  Object.entries(tournamentCounts).forEach(([tournament, count]) => {
    console.log(`  ${tournament}: ${count} games`);
  });
  
  // Verify no unwanted tournaments
  const unwantedTournaments = [
    'Copa Paulista', 'Paulista Série B', 'Copa Rio', 'Carioca A2', 'Carioca C',
    'Alagoano - 2', 'Brasileiro U17', 'Catarinense U20', 'Liga Pro Serie B', 'Toppserien'
  ];
  
  const foundUnwanted = unwantedTournaments.filter(tournament => 
    Object.keys(tournamentCounts).some(included => included.includes(tournament))
  );
  
  if (foundUnwanted.length === 0) {
    console.log('✅ No unwanted tournaments found - filtering working correctly!');
  } else {
    console.log('❌ Found unwanted tournaments:', foundUnwanted);
  }
  
  console.log('\n🎯 SUMMARY:');
  console.log(`- Tournament filtering: ${foundUnwanted.length === 0 ? '✅ WORKING' : '❌ NEEDS FIX'}`);
  console.log(`- Calendar navigation: ${dateWithGames ? '✅ WORKING' : '❌ NO DATES WITH GAMES'}`);
  console.log(`- Team logos: ${logoResults.filter(l => l.loaded).length}/${logoResults.length} loaded successfully`);
  console.log(`- Only major tournaments: ${Object.keys(tournamentCounts).join(', ')}`);
  
  await browser.close();
}

testCalendarNavigation().catch(console.error);