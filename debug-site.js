import puppeteer from 'puppeteer';

(async () => {
  console.log('🚀 Starting Puppeteer for debugging the site...');
  
  // Launch browser in visible mode with dev tools open
  const browser = await puppeteer.launch({ 
    headless: false,           // Keep browser visible
    slowMo: 250,              // Slow down for better observation
    devtools: true,           // Open DevTools automatically
    defaultViewport: null,    // Use full window size
    args: ['--start-maximized'] // Start maximized
  });
  
  const page = await browser.newPage();
  
  // Listen to console logs from the page
  page.on('console', msg => {
    console.log(`🌐 PAGE: ${msg.type().toUpperCase()} ${msg.text()}`);
  });
  
  // Listen to network requests
  page.on('request', request => {
    console.log(`📡 REQUEST: ${request.method()} ${request.url()}`);
  });
  
  // Listen to responses
  page.on('response', response => {
    const status = response.status();
    const url = response.url();
    if (status >= 400) {
      console.log(`❌ FAILED RESPONSE: ${status} ${url}`);
    } else {
      console.log(`✅ RESPONSE: ${status} ${url}`);
    }
  });
  
  // Listen to page errors
  page.on('pageerror', error => {
    console.log(`💥 PAGE ERROR: ${error.message}`);
  });
  
  console.log('📖 Opening the website...');
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle2' });
  
  console.log('⏳ Waiting for page to load...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  console.log('🔍 Checking for loading states...');
  
  // Check what's in the main sections
  const todayContent = await page.$eval('#list-today', el => el.textContent);
  const tomorrowContent = await page.$eval('#list-tomorrow', el => el.textContent);
  
  console.log('📊 Today section content:', todayContent);
  console.log('📊 Tomorrow section content:', tomorrowContent);
  
  // Check if there are any error messages
  const alertElement = await page.$('#alert');
  if (alertElement) {
    const alertText = await page.$eval('#alert', el => el.textContent);
    const alertVisible = await page.$eval('#alert', el => !el.classList.contains('hidden'));
    console.log('⚠️ Alert element:', { text: alertText, visible: alertVisible });
  }
  
  // Check network tab for failed requests
  console.log('🔍 Looking for API calls in network...');
  
  // Wait for any API calls to complete
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  console.log('✅ Debugging session ready!');
  console.log('💡 Browser will stay open - check the DevTools Network and Console tabs');
  console.log('💡 Press Ctrl+C in terminal when done debugging');
  
  // Keep the browser open for manual debugging
  await new Promise(() => {}); // This keeps the script running indefinitely
  
})().catch(error => {
  console.error('❌ Error during debugging:', error);
});