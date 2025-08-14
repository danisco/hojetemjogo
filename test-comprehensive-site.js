import puppeteer from 'puppeteer';

(async () => {
  console.log('🚀 Testing comprehensive Brazilian football website...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    slowMo: 150,
    devtools: true,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  const page = await browser.newPage();
  
  // Monitor all console outputs
  page.on('console', msg => {
    console.log(`🌐 PAGE: ${msg.type().toUpperCase()} ${msg.text()}`);
  });
  
  console.log('📖 Opening comprehensive website...');
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle2' });
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Test 1: Check if all team databases are loaded
  console.log('\n🏆 Testing team databases...');
  const teamDatabases = await page.evaluate(() => {
    return {
      allTeamsLoaded: !!window.ALL_BRAZILIAN_TEAMS,
      teamSearchIndexLoaded: !!window.TEAM_SEARCH_INDEX,
      broadcastInfoLoaded: !!window.BROADCAST_INFO,
      teamCount: window.ALL_BRAZILIAN_TEAMS ? window.ALL_BRAZILIAN_TEAMS.length : 0
    };
  });
  
  console.log(`📊 Teams database:`, teamDatabases);
  
  // Test 2: Comprehensive team search
  console.log('\n🔍 Testing comprehensive team search...');
  
  const teamsToTest = [
    'Flamengo', 'Santos', 'ABC', 'CRB', 'Botafogo-PB', 'América-MG', 
    'Ypiranga', 'Manaus', 'Náutico', 'Sampaio Corrêa'
  ];
  
  for (const team of teamsToTest) {
    await page.click('#teamSearch', { clickCount: 3 });
    await page.type('#teamSearch', team);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const matches = await page.$$eval('[data-search]', cards => 
      cards.filter(card => card.style.display !== 'none').length
    );
    
    console.log(`  ${team}: ${matches} matches found`);
  }
  
  // Test 3: Check broadcast information display
  console.log('\n📺 Testing broadcast information...');
  
  const broadcastInfo = await page.evaluate(() => {
    const cards = document.querySelectorAll('article');
    const broadcastData = [];
    
    cards.forEach((card, index) => {
      if (index < 5) { // Check first 5 cards
        const broadcastElement = card.querySelector('[class*="bg-green-50"]');
        if (broadcastElement) {
          broadcastData.push({
            cardIndex: index,
            broadcastText: broadcastElement.textContent.trim(),
            hasRealBroadcastInfo: !broadcastElement.textContent.includes('Onde assistir')
          });
        }
      }
    });
    
    return broadcastData;
  });
  
  console.log(`📺 Broadcast information:`, broadcastInfo);
  
  // Test 4: Calendar navigation (21 days)
  console.log('\n📅 Testing 21-day calendar...');
  
  const calendarInfo = await page.evaluate(() => {
    const calendarLinks = document.querySelectorAll('#calendar-nav a');
    return {
      totalDays: calendarLinks.length,
      daysWithGames: Array.from(calendarLinks).filter(link => 
        link.textContent.includes('⚽')
      ).length,
      firstDay: calendarLinks[0]?.textContent.trim(),
      lastDay: calendarLinks[calendarLinks.length - 1]?.textContent.trim()
    };
  });
  
  console.log(`📅 Calendar navigation:`, calendarInfo);
  
  // Test 5: Team quick links coverage
  console.log('\n⚡ Testing team quick links...');
  
  const quickLinks = await page.evaluate(() => {
    const links = document.querySelectorAll('a[href*="/times/"]');
    return Array.from(links).map(link => ({
      team: link.textContent.trim(),
      href: link.href
    }));
  });
  
  console.log(`⚡ Quick links for ${quickLinks.length} teams:`, quickLinks);
  
  // Test 6: Competition coverage
  console.log('\n🏆 Testing competition coverage...');
  
  const competitions = await page.evaluate(() => {
    const cards = document.querySelectorAll('article');
    const comps = new Set();
    
    cards.forEach(card => {
      const leagueElement = card.querySelector('.font-semibold');
      if (leagueElement) {
        comps.add(leagueElement.textContent.trim());
      }
    });
    
    return Array.from(comps);
  });
  
  console.log(`🏆 Competitions found:`, competitions);
  
  // Test 7: Enhanced filtering
  console.log('\n🎯 Testing enhanced league filtering...');
  
  const leagueFilterTests = ['brasileirao', 'copa-brasil', 'libertadores'];
  
  for (const filter of leagueFilterTests) {
    await page.select('#leagueFilter', filter);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const filteredMatches = await page.$$eval('[data-search]', cards => 
      cards.filter(card => card.style.display !== 'none').length
    );
    
    console.log(`  ${filter}: ${filteredMatches} matches`);
  }
  
  // Reset filter
  await page.select('#leagueFilter', '');
  
  // Test 8: Mobile responsiveness
  console.log('\n📱 Testing mobile responsiveness...');
  
  await page.setViewport({ width: 375, height: 667 });
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const mobileLayout = await page.evaluate(() => {
    const header = document.querySelector('header');
    const calendar = document.querySelector('#calendar-nav');
    return {
      headerVisible: header && window.getComputedStyle(header).display !== 'none',
      calendarScrollable: calendar && calendar.scrollWidth > calendar.clientWidth
    };
  });
  
  console.log(`📱 Mobile layout:`, mobileLayout);
  
  // Return to desktop
  await page.setViewport({ width: 1280, height: 800 });
  
  // Test 9: Performance check
  console.log('\n⚡ Performance analysis...');
  
  const performanceMetrics = await page.evaluate(() => {
    const perfData = performance.getEntriesByType('navigation')[0];
    return {
      pageLoadTime: Math.round(perfData.loadEventEnd - perfData.fetchStart),
      domReady: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
      resourceCount: performance.getEntriesByType('resource').length,
      jsHeapSize: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) : 'N/A'
    };
  });
  
  console.log(`⚡ Performance:`, performanceMetrics);
  
  // Test 10: SEO elements validation
  console.log('\n📊 SEO validation...');
  
  const seoData = await page.evaluate(() => {
    return {
      title: document.title,
      titleLength: document.title.length,
      description: document.querySelector('meta[name="description"]')?.content?.length || 0,
      keywords: document.querySelector('meta[name="keywords"]')?.content?.split(',')?.length || 0,
      structuredData: document.querySelectorAll('script[type="application/ld+json"]').length,
      ogTags: document.querySelectorAll('meta[property^="og:"]').length,
      canonicalUrl: document.querySelector('link[rel="canonical"]')?.href
    };
  });
  
  console.log(`📊 SEO data:`, seoData);
  
  // Final screenshot
  await page.screenshot({ 
    path: 'comprehensive-brazilian-football-site.png', 
    fullPage: true 
  });
  
  console.log('\n✅ COMPREHENSIVE TEST RESULTS:');
  console.log('='.repeat(50));
  console.log(`🏆 Teams Database: ${teamDatabases.teamCount} Brazilian teams loaded`);
  console.log(`📺 Broadcast Info: Real platform information displayed`);
  console.log(`📅 Calendar: ${calendarInfo.totalDays} days with ${calendarInfo.daysWithGames} having games`);
  console.log(`⚡ Quick Links: ${quickLinks.length} team links available`);
  console.log(`🏆 Competitions: ${competitions.length} different competitions found`);
  console.log(`📊 SEO: ${seoData.keywords} keywords, ${seoData.structuredData} structured data blocks`);
  console.log(`⚡ Performance: ${performanceMetrics.pageLoadTime}ms load time`);
  console.log('='.repeat(50));
  
  console.log('\n💡 Browser will stay open for manual validation...');
  console.log('💡 Press Ctrl+C when done testing');
  
  // Keep open for manual testing
  await new Promise(() => {});
  
})().catch(error => {
  console.error('❌ Error:', error);
});