// Test script to identify and verify calendar navigation issue
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function testCalendarNavigation() {
  console.log('🔍 Testing calendar navigation...');
  
  const browser = await puppeteer.launch({ 
    headless: false, // Set to true for CI/automated testing
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set viewport to standard desktop size
    await page.setViewport({ width: 1200, height: 800 });
    
    // Navigate to the main page
    const indexPath = path.resolve('./index.html');
    await page.goto(`file://${indexPath}`);
    
    console.log('📄 Loaded index.html');
    
    // Take screenshot of the main page
    await page.screenshot({ path: 'calendar-main-page.png', fullPage: true });
    
    // Get calendar navigation elements
    const calendarLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('#calendar-nav a'));
      return links.map(link => ({
        href: link.href,
        date: link.href.split('/').slice(-2, -1)[0], // Extract date from /dias/YYYY-MM-DD/
        text: link.textContent.trim(),
        hasGames: link.querySelector('.text-xs').textContent === '⚽'
      }));
    });
    
    console.log('📅 Found calendar links:', calendarLinks.length);
    
    // Test clicking on different dates
    const testDates = ['2025-08-16', '2025-08-17', '2025-08-18', '2025-08-19'];
    
    for (const testDate of testDates) {
      console.log(`\n🔗 Testing date: ${testDate}`);
      
      const linkElement = await page.$(`a[href*="${testDate}"]`);
      if (linkElement) {
        // Click the date link
        await linkElement.click();
        
        // Wait for navigation
        await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });
        
        // Check if we're on the right page
        const currentUrl = page.url();
        console.log(`   Current URL: ${currentUrl}`);
        
        // Check page content
        const pageContent = await page.evaluate(() => {
          const today = document.querySelector('#list-today');
          const noGames = document.querySelector('#no-games-today');
          const gamesCount = today ? today.children.length : 0;
          const hasNoGamesMessage = noGames && !noGames.classList.contains('hidden');
          
          return {
            gamesCount,
            hasNoGamesMessage,
            title: document.title,
            hasGames: gamesCount > 0,
            content: today ? today.innerHTML.length : 0
          };
        });
        
        console.log(`   Games found: ${pageContent.gamesCount}`);
        console.log(`   No games message: ${pageContent.hasNoGamesMessage}`);
        console.log(`   Page title: ${pageContent.title}`);
        
        // Take screenshot for this date
        await page.screenshot({ 
          path: `calendar-test-${testDate}.png`, 
          fullPage: true 
        });
        
        // Go back to main page for next test
        await page.goto(`file://${indexPath}`);
        await page.waitForSelector('#calendar-nav');
        
      } else {
        console.log(`   ❌ Link not found for ${testDate}`);
      }
    }
    
    // Check data files
    console.log('\n📊 Checking data files:');
    for (const testDate of testDates) {
      const dataFile = `./data/${testDate}.json`;
      if (fs.existsSync(dataFile)) {
        const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
        console.log(`   ${testDate}: ${data.length} fixtures in data file`);
      } else {
        console.log(`   ${testDate}: ❌ Data file missing`);
      }
    }
    
    console.log('\n✅ Calendar navigation test completed');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testCalendarNavigation();