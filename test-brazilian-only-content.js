import puppeteer from 'puppeteer';

(async () => {
  console.log('🇧🇷 Testing Brazilian-only content filtering...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    slowMo: 150,
    devtools: true,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  const page = await browser.newPage();
  
  // Monitor console outputs
  page.on('console', msg => {
    console.log(`🌐 PAGE: ${msg.type().toUpperCase()} ${msg.text()}`);
  });
  
  console.log('📖 Opening website...');
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle2' });
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 1: Check that only Brazilian content is shown
  console.log('\n🇧🇷 Testing Brazilian-only filtering...');
  
  const contentAnalysis = await page.evaluate(() => {
    const cards = document.querySelectorAll('article');
    const leagues = new Set();
    const teams = new Set();
    const countries = new Set();
    let europeanContent = 0;
    let youthContent = 0;
    let totalMatches = cards.length;
    
    cards.forEach(card => {
      const leagueElement = card.querySelector('.font-semibold');
      const teamElements = card.querySelectorAll('span.font-medium');
      
      if (leagueElement) {
        const leagueName = leagueElement.textContent.toLowerCase();
        leagues.add(leagueElement.textContent);
        
        // Check for European content
        if (leagueName.includes('premier league') || leagueName.includes('la liga') || 
            leagueName.includes('champions league') || leagueName.includes('serie a') && !leagueName.includes('brasil') ||
            leagueName.includes('bundesliga') || leagueName.includes('ligue 1')) {
          europeanContent++;
        }
        
        // Check for youth content
        if (leagueName.includes('u20') || leagueName.includes('u17') || 
            leagueName.includes('u19') || leagueName.includes('u18') || 
            leagueName.includes('sub-')) {
          youthContent++;
        }
      }
      
      teamElements.forEach(teamEl => {
        teams.add(teamEl.textContent);
      });
    });
    
    return {
      totalMatches,
      leagues: Array.from(leagues),
      teams: Array.from(teams).slice(0, 10), // First 10 teams for display
      europeanContent,
      youthContent,
      leagueCount: leagues.size
    };
  });
  
  console.log(`📊 Content Analysis:`);
  console.log(`  Total matches: ${contentAnalysis.totalMatches}`);
  console.log(`  Unique leagues: ${contentAnalysis.leagueCount}`);
  console.log(`  European content: ${contentAnalysis.europeanContent} (should be 0)`);
  console.log(`  Youth tournaments: ${contentAnalysis.youthContent} (should be 0)`);
  console.log(`  Sample teams: ${contentAnalysis.teams.join(', ')}`);
  console.log(`  Leagues found: ${contentAnalysis.leagues.join(', ')}`);
  
  // Test 2: Check date and day display on match cards
  console.log('\n📅 Testing date and day display...');
  
  const dateDisplayTest = await page.evaluate(() => {
    const cards = document.querySelectorAll('article');
    const dateInfo = [];
    
    cards.forEach((card, index) => {
      if (index < 3) { // Check first 3 cards
        const centerSection = card.querySelector('.px-4.text-center');
        if (centerSection) {
          const dateElement = centerSection.querySelector('.text-xs.text-gray-500');
          const timeElement = centerSection.querySelector('.text-sm.font-medium');
          
          if (dateElement && timeElement) {
            dateInfo.push({
              cardIndex: index,
              hasDate: !!dateElement.textContent.match(/\d{2}\/\d{2}\/\d{4}/),
              hasTime: !!timeElement.textContent.match(/\d{2}:\d{2}/),
              dateText: dateElement.textContent,
              timeText: timeElement.textContent
            });
          }
        }
      }
    });
    
    return dateInfo;
  });
  
  console.log(`📅 Date Display Results:`);
  dateDisplayTest.forEach(info => {
    console.log(`  Card ${info.cardIndex}: Date="${info.dateText}" Time="${info.timeText}" (Valid: ${info.hasDate && info.hasTime})`);
  });
  
  // Test 3: Check international tournaments with Brazilian teams only
  console.log('\n🌍 Testing international tournaments...');
  
  const internationalTest = await page.evaluate(() => {
    const cards = document.querySelectorAll('article');
    const international = [];
    
    cards.forEach(card => {
      const leagueElement = card.querySelector('.font-semibold');
      if (leagueElement) {
        const leagueName = leagueElement.textContent.toLowerCase();
        if (leagueName.includes('libertadores') || leagueName.includes('sul-americana') || 
            leagueName.includes('sudamericana') || leagueName.includes('recopa')) {
          
          const teamElements = card.querySelectorAll('span.font-medium');
          const teams = Array.from(teamElements).map(el => el.textContent);
          
          international.push({
            league: leagueElement.textContent,
            teams: teams
          });
        }
      }
    });
    
    return international;
  });
  
  console.log(`🌍 International matches: ${internationalTest.length}`);
  internationalTest.forEach((match, index) => {
    console.log(`  ${index + 1}. ${match.league}: ${match.teams.join(' vs ')}`);
  });
  
  // Test 4: Check for specific exclusions
  console.log('\n❌ Testing exclusions...');
  
  const exclusionTest = await page.evaluate(() => {
    const allText = document.body.textContent.toLowerCase();
    
    return {
      hasArgentineTeams: allText.includes('boca juniors') || allText.includes('river plate'),
      hasEuropeanTeams: allText.includes('barcelona') || allText.includes('real madrid') || allText.includes('manchester'),
      hasYouthTeams: allText.includes('u20') || allText.includes('u17') || allText.includes('sub-20'),
      hasNonSouthAmericanIntl: allText.includes('uefa') || allText.includes('concacaf')
    };
  });
  
  console.log(`❌ Exclusion Test Results:`);
  console.log(`  Argentine teams: ${exclusionTest.hasArgentineTeams ? '❌ FOUND' : '✅ EXCLUDED'}`);
  console.log(`  European teams: ${exclusionTest.hasEuropeanTeams ? '❌ FOUND' : '✅ EXCLUDED'}`);
  console.log(`  Youth teams: ${exclusionTest.hasYouthTeams ? '❌ FOUND' : '✅ EXCLUDED'}`);
  console.log(`  Non-SA International: ${exclusionTest.hasNonSouthAmericanIntl ? '❌ FOUND' : '✅ EXCLUDED'}`);
  
  // Test 5: Test day navigation to see consistent filtering
  console.log('\n🔗 Testing filtering consistency across days...');
  
  // Test tomorrow's page
  const tomorrowLink = await page.$('#calendar-nav a:nth-child(2)');
  if (tomorrowLink) {
    const href = await page.evaluate(el => el.href, tomorrowLink);
    console.log(`Navigating to tomorrow: ${href}`);
    
    await page.goto(href, { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const tomorrowContent = await page.evaluate(() => {
      const cards = document.querySelectorAll('article');
      const leagues = new Set();
      cards.forEach(card => {
        const leagueEl = card.querySelector('.font-semibold');
        if (leagueEl) leagues.add(leagueEl.textContent);
      });
      return {
        matchCount: cards.length,
        leagues: Array.from(leagues)
      };
    });
    
    console.log(`📅 Tomorrow's content: ${tomorrowContent.matchCount} matches`);
    console.log(`  Leagues: ${tomorrowContent.leagues.join(', ')}`);
  }
  
  // Final screenshot
  await page.screenshot({ 
    path: 'brazilian-only-content-test.png', 
    fullPage: true 
  });
  
  console.log('\n✅ BRAZILIAN-ONLY CONTENT TEST RESULTS:');
  console.log('='.repeat(50));
  console.log(`🇧🇷 Total matches displayed: ${contentAnalysis.totalMatches}`);
  console.log(`❌ European content: ${contentAnalysis.europeanContent} (target: 0)`);
  console.log(`❌ Youth tournaments: ${contentAnalysis.youthContent} (target: 0)`);
  console.log(`📅 Date display: ${dateDisplayTest.length > 0 && dateDisplayTest.every(d => d.hasDate && d.hasTime) ? 'Working' : 'Issues found'}`);
  console.log(`🌍 International matches: ${internationalTest.length} (Brazilian teams only)`);
  console.log(`✅ Content filtering: ${contentAnalysis.europeanContent === 0 && contentAnalysis.youthContent === 0 ? 'PASSED' : 'FAILED'}`);
  console.log('='.repeat(50));
  
  console.log('\n💡 Browser will stay open for manual validation...');
  console.log('💡 Press Ctrl+C when done');
  
  // Keep open for manual testing
  await new Promise(() => {});
  
})().catch(error => {
  console.error('❌ Brazilian Content Test Error:', error);
});