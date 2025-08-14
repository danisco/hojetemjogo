import puppeteer from 'puppeteer';

(async () => {
  console.log('🚀 Testing the enhanced SEO-optimized website...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    slowMo: 200,
    devtools: true,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  const page = await browser.newPage();
  
  // Monitor console logs
  page.on('console', msg => {
    console.log(`🌐 PAGE: ${msg.type().toUpperCase()} ${msg.text()}`);
  });
  
  console.log('📖 Opening the enhanced website...');
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle2' });
  
  console.log('⏳ Waiting for content to load...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Test the enhanced features
  console.log('\n🔍 Testing enhanced search functionality...');
  
  // Test team search
  await page.type('#teamSearch', 'Santos');
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const visibleCards = await page.$$eval('[data-search]', cards => 
    cards.filter(card => card.style.display !== 'none').length
  );
  console.log(`🎯 Found ${visibleCards} visible cards after searching "Santos"`);
  
  // Clear search
  await page.click('#teamSearch', { clickCount: 3 });
  await page.keyboard.press('Backspace');
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Test league filter
  const leagueFilter = await page.$('#leagueFilter');
  if (leagueFilter) {
    console.log('🏆 Testing league filter...');
    await page.select('#leagueFilter', 'brasileirao');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const filteredCards = await page.$$eval('[data-search]', cards => 
      cards.filter(card => card.style.display !== 'none').length
    );
    console.log(`🏆 Found ${filteredCards} Brasileirão cards`);
  }
  
  // Test calendar navigation
  console.log('\n📅 Testing calendar navigation...');
  const calendarLinks = await page.$$('#calendar-nav a');
  console.log(`📅 Found ${calendarLinks.length} calendar navigation links`);
  
  // Test team quick links
  console.log('\n⚡ Testing team quick links...');
  const teamLinks = await page.$$eval('a[href*="/times/"]', links => 
    links.map(link => ({ text: link.textContent.trim(), href: link.href }))
  );
  console.log(`⚡ Found ${teamLinks.length} team quick links:`, teamLinks.slice(0, 3));
  
  // Check SEO elements
  console.log('\n📊 Checking SEO elements...');
  
  const title = await page.title();
  console.log(`📋 Title: ${title}`);
  
  const description = await page.$eval('meta[name="description"]', el => el.content);
  console.log(`📝 Description length: ${description.length} chars`);
  
  const keywords = await page.$eval('meta[name="keywords"]', el => el.content);
  console.log(`🔑 Keywords count: ${keywords.split(',').length} keywords`);
  
  // Check Open Graph tags
  const ogTitle = await page.$eval('meta[property="og:title"]', el => el.content);
  console.log(`🌐 OG Title: ${ogTitle}`);
  
  // Check structured data
  const structuredData = await page.$$eval('script[type="application/ld+json"]', scripts => 
    scripts.length
  );
  console.log(`📊 Found ${structuredData} structured data blocks`);
  
  // Test enhanced match cards
  console.log('\n🎮 Testing enhanced match cards...');
  const matchCards = await page.$$eval('article', cards => {
    return {
      totalCards: cards.length,
      hasWatchLinks: cards.filter(card => 
        card.textContent.includes('Onde assistir')
      ).length,
      hasCalendarLinks: cards.filter(card => 
        card.textContent.includes('Lembrete')
      ).length,
      hasVenueInfo: cards.filter(card => 
        card.textContent.includes('📍')
      ).length
    };
  });
  
  console.log(`🎮 Match cards analysis:`, matchCards);
  
  // Test performance
  console.log('\n⚡ Performance check...');
  const performanceMetrics = await page.evaluate(() => {
    const perfData = performance.getEntriesByType('navigation')[0];
    return {
      loadTime: Math.round(perfData.loadEventEnd - perfData.fetchStart),
      domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
      resourceCount: performance.getEntriesByType('resource').length
    };
  });
  
  console.log(`⚡ Performance:`, performanceMetrics);
  
  // Take final screenshot
  await page.screenshot({ 
    path: 'enhanced-website-final.png', 
    fullPage: true 
  });
  console.log('📸 Final screenshot saved as enhanced-website-final.png');
  
  console.log('\n✅ Enhanced website testing complete!');
  console.log('🎯 SEO Features:');
  console.log('  - Rich meta tags with Brazilian keywords');
  console.log('  - Calendar navigation system');
  console.log('  - Enhanced search with filters');
  console.log('  - Team quick links');
  console.log('  - Structured data for Google');
  console.log('  - Server-side rendered content');
  console.log('  - Performance optimizations');
  
  console.log('\n💡 Browser will stay open for manual inspection...');
  console.log('💡 Press Ctrl+C when done');
  
  // Keep open for manual inspection
  await new Promise(() => {});
  
})().catch(error => {
  console.error('❌ Error:', error);
});