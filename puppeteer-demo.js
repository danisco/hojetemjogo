import puppeteer from 'puppeteer';

(async () => {
  console.log('🚀 Starting Puppeteer in visible mode...');
  
  // Launch browser in visible mode (headless: false)
  const browser = await puppeteer.launch({ 
    headless: false,           // This makes the browser visible!
    slowMo: 250,              // Slow down actions by 250ms so you can see them
    devtools: true            // Open DevTools automatically
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  console.log('📖 Opening website...');
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle2' });
  
  console.log('⏳ Waiting 2 seconds...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('🔍 Testing the search functionality...');
  // Type in the search box
  await page.type('#teamSearch', 'Flamengo');
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Clear the search
  await page.click('#teamSearch', { clickCount: 3 });
  await page.type('#teamSearch', 'Palmeiras');
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('📸 Taking a screenshot...');
  await page.screenshot({ path: 'demo-screenshot.png', fullPage: true });
  
  console.log('🧭 Testing navigation...');
  // Test clicking navigation links
  await page.click('a[href="#hoje"]');
  await new Promise(resolve => setTimeout(resolve, 500));
  
  await page.click('a[href="#amanha"]');
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log('📱 Testing mobile view...');
  // Test mobile viewport
  await page.setViewport({ width: 375, height: 667 });
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Back to desktop
  await page.setViewport({ width: 1280, height: 800 });
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('✅ Demo complete! Check the browser window.');
  console.log('💡 Press Ctrl+C to close the browser when you\'re done exploring.');
  
  // Keep the browser open for manual exploration
  // Remove this line if you want it to close automatically
  await new Promise(() => {}); // This keeps the script running indefinitely
  
  // Uncomment the line below if you want it to auto-close after 30 seconds
  // await new Promise(resolve => setTimeout(resolve, 30000));
  
  await browser.close();
})();