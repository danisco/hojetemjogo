import puppeteer from 'puppeteer';

(async () => {
  console.log('🚀 Testing the fixed website...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    slowMo: 300,
    devtools: true,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  const page = await browser.newPage();
  
  // Listen to console logs
  page.on('console', msg => {
    console.log(`🌐 PAGE: ${msg.type().toUpperCase()} ${msg.text()}`);
  });
  
  // Monitor network requests
  page.on('response', response => {
    const status = response.status();
    const url = response.url();
    if (url.includes('api-sports.io')) {
      console.log(`📡 API: ${status} ${url}`);
    }
  });
  
  console.log('📖 Opening the fixed website...');
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle2' });
  
  console.log('⏳ Waiting for content to load...');
  await new Promise(resolve => setTimeout(resolve, 8000)); // Wait longer for API calls
  
  // Check if matches are now showing
  const todayContent = await page.$eval('#list-today', el => el.textContent);
  const tomorrowContent = await page.$eval('#list-tomorrow', el => el.textContent);
  
  console.log('📊 Today section content length:', todayContent.length);
  console.log('📊 Tomorrow section content length:', tomorrowContent.length);
  
  if (todayContent.includes('Carregando')) {
    console.log('⚠️ Still showing loading state');
  } else if (todayContent.length > 50) {
    console.log('✅ Today section has content! Sample:', todayContent.substring(0, 100) + '...');
  } else {
    console.log('❌ Today section appears empty');
  }
  
  if (tomorrowContent.includes('Carregando')) {
    console.log('⚠️ Tomorrow still showing loading state');
  } else if (tomorrowContent.length > 50) {
    console.log('✅ Tomorrow section has content! Sample:', tomorrowContent.substring(0, 100) + '...');
  } else {
    console.log('❌ Tomorrow section appears empty');
  }
  
  // Count cards
  const todayCards = await page.$$eval('#list-today .card', cards => cards.length);
  const tomorrowCards = await page.$$eval('#list-tomorrow .card', cards => cards.length);
  
  console.log(`🎮 Found ${todayCards} cards for today`);
  console.log(`🎮 Found ${tomorrowCards} cards for tomorrow`);
  
  // Test search functionality
  console.log('\n🔍 Testing search functionality...');
  await page.type('#teamSearch', 'Santos');
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const cardsAfterSearch = await page.$$eval('#list-today .card', cards => 
    cards.filter(card => card.style.display !== 'none').length
  );
  console.log(`🔍 Visible cards after searching "Santos": ${cardsAfterSearch}`);
  
  await page.screenshot({ path: 'fixed-website-test.png', fullPage: true });
  console.log('📸 Screenshot saved as fixed-website-test.png');
  
  console.log('\n✅ Test complete! Browser staying open for manual inspection...');
  console.log('💡 Press Ctrl+C when done');
  
  // Keep open for manual inspection
  await new Promise(() => {});
  
})().catch(error => {
  console.error('❌ Error:', error);
});