import puppeteer from 'puppeteer';

async function takeFinalScreenshots() {
  console.log('📸 Taking final screenshots of the fixed website');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1280, height: 720 }
  });
  
  try {
    const page = await browser.newPage();
    
    // Take screenshot of main page (local)
    console.log('📍 Screenshot 1: Main page with fixes...');
    const indexPath = 'file://' + process.cwd().replace(/\\/g, '/') + '/index.html';
    await page.goto(indexPath, { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    await page.screenshot({ 
      path: 'website-fixed-main-page.png',
      fullPage: true
    });
    
    // Take screenshot of tomorrow's page to show Fluminense x Fortaleza
    console.log('📍 Screenshot 2: Tomorrow page with Fluminense x Fortaleza...');
    const tomorrowPath = 'file://' + process.cwd().replace(/\\/g, '/') + '/dias/2025-08-16/index.html';
    await page.goto(tomorrowPath, { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    await page.screenshot({ 
      path: 'website-fixed-tomorrow-page.png',
      fullPage: true
    });
    
    console.log('✅ Screenshots saved:');
    console.log('  - website-fixed-main-page.png');
    console.log('  - website-fixed-tomorrow-page.png');
    
  } catch (error) {
    console.error('❌ Error taking screenshots:', error.message);
  } finally {
    await browser.close();
  }
}

takeFinalScreenshots().catch(console.error);