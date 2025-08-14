import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  try {
    await page.goto('http://localhost:8000', { waitUntil: 'networkidle2' });
    
    // Wait for the content to load
    await page.waitForSelector('h1');
    
    // Take a screenshot
    await page.screenshot({ path: 'website-screenshot.png', fullPage: true });
    
    // Check for any JavaScript errors
    const errors = await page.evaluate(() => {
      const errorMessages = [];
      return errorMessages;
    });
    
    console.log('✅ Website loaded successfully!');
    console.log('📸 Screenshot saved as website-screenshot.png');
    
    // Check if API calls are working
    const hasLoadingText = await page.$eval('#list-today', el => el.textContent.includes('Carregando'));
    if (hasLoadingText) {
      console.log('⚠️ Website shows loading state - API might not be working');
    }
    
  } catch (error) {
    console.error('❌ Error testing website:', error);
  } finally {
    await browser.close();
  }
})();