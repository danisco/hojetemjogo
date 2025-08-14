import puppeteer from 'puppeteer';

(async () => {
  console.log('🚀 Starting advanced Puppeteer demo...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    slowMo: 200,
    args: ['--start-maximized']
  });
  
  const page = await browser.newPage();
  
  // Listen to console logs from the webpage
  page.on('console', msg => console.log('🌐 PAGE LOG:', msg.text()));
  
  // Listen to network requests
  page.on('request', request => {
    console.log('📡 REQUEST:', request.method(), request.url());
  });
  
  // Listen to responses
  page.on('response', response => {
    console.log('📥 RESPONSE:', response.status(), response.url());
  });
  
  await page.goto('http://localhost:8000');
  
  console.log('📊 Getting page metrics...');
  const metrics = await page.metrics();
  console.log('Memory used:', Math.round(metrics.JSHeapUsedSize / 1024 / 1024), 'MB');
  
  console.log('🎯 Testing element interactions...');
  
  // Hover over elements to show hover effects
  await page.hover('header a');
  await page.waitForTimeout(1000);
  
  // Test search with different teams
  const teams = ['Flamengo', 'Corinthians', 'São Paulo', 'Palmeiras'];
  
  for (const team of teams) {
    console.log(`🔍 Searching for: ${team}`);
    await page.click('#teamSearch', { clickCount: 3 });
    await page.type('#teamSearch', team);
    await page.waitForTimeout(1500);
  }
  
  // Clear search
  await page.click('#teamSearch', { clickCount: 3 });
  await page.keyboard.press('Delete');
  
  console.log('📱 Testing responsive design...');
  
  // Test different screen sizes
  const viewports = [
    { width: 1920, height: 1080, name: 'Desktop Large' },
    { width: 1280, height: 720, name: 'Desktop' },
    { width: 768, height: 1024, name: 'Tablet' },
    { width: 375, height: 667, name: 'Mobile' }
  ];
  
  for (const viewport of viewports) {
    console.log(`📐 Testing ${viewport.name} (${viewport.width}x${viewport.height})`);
    await page.setViewport(viewport);
    await page.waitForTimeout(2000);
    
    // Take screenshot for each viewport
    await page.screenshot({ 
      path: `screenshot-${viewport.name.toLowerCase().replace(' ', '-')}.png`,
      fullPage: true 
    });
  }
  
  console.log('⚡ Testing page performance...');
  
  // Reset to desktop view
  await page.setViewport({ width: 1280, height: 800 });
  
  // Measure page load performance
  const performanceMetrics = await page.evaluate(() => {
    const perfData = performance.getEntriesByType('navigation')[0];
    return {
      loadTime: perfData.loadEventEnd - perfData.fetchStart,
      domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
      firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0
    };
  });
  
  console.log('⏱️ Performance metrics:');
  console.log(`   Load time: ${Math.round(performanceMetrics.loadTime)}ms`);
  console.log(`   DOM ready: ${Math.round(performanceMetrics.domContentLoaded)}ms`);
  console.log(`   First paint: ${Math.round(performanceMetrics.firstPaint)}ms`);
  
  console.log('🎨 Testing CSS and styling...');
  
  // Get computed styles of key elements
  const headerStyle = await page.evaluate(() => {
    const header = document.querySelector('header');
    const styles = window.getComputedStyle(header);
    return {
      backgroundColor: styles.backgroundColor,
      position: styles.position,
      zIndex: styles.zIndex
    };
  });
  
  console.log('🎯 Header styles:', headerStyle);
  
  console.log('✅ Advanced demo complete!');
  console.log('💡 Browser will stay open for 30 seconds for manual exploration...');
  
  await page.waitForTimeout(30000);
  await browser.close();
  
})();