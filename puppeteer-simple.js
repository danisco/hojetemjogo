import puppeteer from 'puppeteer';

(async () => {
  console.log('🚀 Starting Puppeteer in visible mode...');
  
  // Launch browser in visible mode
  const browser = await puppeteer.launch({ 
    headless: false,           // Makes browser visible!
    slowMo: 500,              // Slow down actions so you can see them
    defaultViewport: null     // Use full screen
  });
  
  const page = await browser.newPage();
  
  console.log('📖 Opening the hojetemjogo website...');
  await page.goto('http://localhost:8000');
  
  console.log('⏳ Waiting a moment to load...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('🔍 Testing search functionality...');
  await page.type('#teamSearch', 'Flamengo');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('🔄 Clearing search and trying another team...');
  await page.click('#teamSearch', { clickCount: 3 });
  await page.type('#teamSearch', 'Corinthians');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('📱 Testing mobile view...');
  await page.setViewport({ width: 375, height: 667 });
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  console.log('💻 Back to desktop view...');
  await page.setViewport({ width: 1280, height: 800 });
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('📸 Taking final screenshot...');
  await page.screenshot({ path: 'puppeteer-demo-final.png', fullPage: true });
  
  console.log('✅ Demo complete! Browser will close in 5 seconds...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  await browser.close();
  console.log('👋 Browser closed. Demo finished!');
})();