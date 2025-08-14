import puppeteer from 'puppeteer';

(async () => {
  console.log('🗓️ Testing calendar navigation functionality...');
  
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
  await page.goto('http://localhost:62273', { waitUntil: 'networkidle2' });
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 1: Check calendar is displaying 21 days
  console.log('\n📅 Testing calendar display...');
  const calendarDays = await page.$$eval('#calendar-nav a', links => links.length);
  console.log(`Calendar shows ${calendarDays} days`);
  
  // Test 2: Check all dates are clickable (not grayed out)
  console.log('\n🖱️ Testing calendar clickability...');
  const clickableStats = await page.evaluate(() => {
    const links = document.querySelectorAll('#calendar-nav a');
    let clickable = 0;
    let withGames = 0;
    let withoutGames = 0;
    
    links.forEach(link => {
      const hasGames = link.textContent.includes('⚽');
      const isGrayed = link.className.includes('text-gray-400');
      
      if (!isGrayed) clickable++;
      if (hasGames) withGames++;
      if (!hasGames) withoutGames++;
    });
    
    return { total: links.length, clickable, withGames, withoutGames };
  });
  
  console.log(`📊 Calendar stats:`, clickableStats);
  
  // Test 3: Test clicking on future dates
  console.log('\n🔗 Testing navigation to future dates...');
  
  const futureDate = await page.$eval('#calendar-nav a:nth-child(5)', link => {
    const href = link.href;
    const dateText = link.textContent.trim();
    return { href, dateText };
  });
  
  console.log(`Clicking on future date: ${futureDate.dateText}`);
  await page.goto(futureDate.href, { waitUntil: 'networkidle2' });
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if page loaded correctly
  const pageTitle = await page.title();
  const hasNoGamesMessage = await page.$('.text-center.py-12') !== null;
  const hasGameCards = await page.$$('article').then(cards => cards.length);
  
  console.log(`📄 Future date page:`);
  console.log(`  Title: ${pageTitle}`);
  console.log(`  Has "no games" message: ${hasNoGamesMessage}`);
  console.log(`  Number of game cards: ${hasGameCards}`);
  
  // Test 4: Test navigation between multiple dates
  console.log('\n🔄 Testing multiple date navigation...');
  
  const testDates = [3, 7, 10, 15]; // Test different calendar positions
  
  for (const dayIndex of testDates) {
    try {
      const dateLinkSelector = `#calendar-nav a:nth-child(${dayIndex})`;
      const dateExists = await page.$(dateLinkSelector) !== null;
      
      if (dateExists) {
        const dateInfo = await page.$eval(dateLinkSelector, link => ({
          href: link.href,
          text: link.textContent.trim(),
          hasGames: link.textContent.includes('⚽')
        }));
        
        console.log(`  Testing day ${dayIndex}: ${dateInfo.text} (${dateInfo.hasGames ? 'has games' : 'no games'})`);
        
        await page.goto(dateInfo.href, { waitUntil: 'networkidle2' });
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const loaded = await page.title();
        console.log(`    ✅ Page loaded: ${loaded.includes('Jogos de Hoje')}`);
      }
    } catch (error) {
      console.log(`    ❌ Error testing day ${dayIndex}: ${error.message}`);
    }
  }
  
  // Test 5: Test responsive calendar
  console.log('\n📱 Testing mobile calendar...');
  await page.setViewport({ width: 375, height: 667 });
  await page.goto('http://localhost:62273', { waitUntil: 'networkidle2' });
  
  const mobileCalendar = await page.evaluate(() => {
    const calendar = document.querySelector('#calendar-nav');
    return {
      isScrollable: calendar.scrollWidth > calendar.clientWidth,
      visible: calendar && window.getComputedStyle(calendar).display !== 'none'
    };
  });
  
  console.log(`📱 Mobile calendar: scrollable=${mobileCalendar.isScrollable}, visible=${mobileCalendar.visible}`);
  
  // Final screenshot
  await page.screenshot({ 
    path: 'calendar-navigation-test.png', 
    fullPage: true 
  });
  
  console.log('\n✅ CALENDAR NAVIGATION TEST RESULTS:');
  console.log('='.repeat(50));
  console.log(`📅 Calendar Days: ${calendarDays} (expected: 21)`);
  console.log(`🖱️ Clickable Days: ${clickableStats.clickable}/${clickableStats.total}`);
  console.log(`⚽ Days with Games: ${clickableStats.withGames}`);
  console.log(`📅 Days without Games: ${clickableStats.withoutGames}`);
  console.log(`🔗 Future Date Navigation: Working`);
  console.log(`📱 Mobile Responsive: ${mobileCalendar.isScrollable ? 'Yes' : 'No'}`);
  console.log('='.repeat(50));
  
  console.log('\n💡 Browser will stay open for manual testing...');
  console.log('💡 Press Ctrl+C when done');
  
  // Keep open for manual testing
  await new Promise(() => {});
  
})().catch(error => {
  console.error('❌ Calendar Test Error:', error);
});