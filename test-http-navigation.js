// Test calendar navigation using HTTP server
import puppeteer from 'puppeteer';

async function testHttpNavigation() {
  console.log('🌐 Testing calendar navigation via HTTP server...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    slowMo: 500
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    
    // Navigate to the HTTP server
    console.log('📂 Loading: http://localhost:63025');
    await page.goto('http://localhost:63025', { waitUntil: 'domcontentloaded' });
    
    // Wait for page to load
    await page.waitForSelector('#calendar-nav');
    console.log('✅ Main page loaded');
    
    // Test dates that should have games based on our build
    const testDates = [
      { date: '2025-08-17', expected: 'games' },
      { date: '2025-08-18', expected: 'games' },
      { date: '2025-08-16', expected: 'no-games' },
      { date: '2025-08-24', expected: 'games' }
    ];
    
    for (const test of testDates) {
      console.log(`\n🔗 Testing ${test.date} (expecting ${test.expected})...`);
      
      // Click on the date
      const selector = `a[href="/dias/${test.date}/"]`;
      const link = await page.$(selector);
      
      if (link) {
        await link.click();
        
        // Wait for navigation
        try {
          await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 5000 });
          
          const newUrl = page.url();
          console.log(`   ✅ Navigated to: ${newUrl}`);
          
          // Check page content
          const pageContent = await page.evaluate(() => {
            const todaySection = document.querySelector('#list-today');
            const articles = todaySection ? todaySection.querySelectorAll('article') : [];
            const noGamesDiv = todaySection ? todaySection.querySelector('.text-center.py-12') : null;
            
            // Get team names if games exist
            const teams = Array.from(articles).map(article => {
              const homeTeam = article.querySelector('.font-medium.text-gray-800.truncate')?.textContent;
              const awayTeam = article.querySelector('.flex-row-reverse .font-medium.text-gray-800.truncate')?.textContent;
              return homeTeam && awayTeam ? `${homeTeam} x ${awayTeam}` : 'Unknown match';
            });
            
            return {
              gamesCount: articles.length,
              hasNoGamesMessage: !!noGamesDiv,
              title: document.title,
              url: window.location.href,
              teams: teams.slice(0, 3) // First 3 games
            };
          });
          
          console.log(`   📊 Games found: ${pageContent.gamesCount}`);
          if (pageContent.teams.length > 0) {
            console.log(`   ⚽ Matches: ${pageContent.teams.join(', ')}`);
          }
          
          // Verify expectation
          if (test.expected === 'games' && pageContent.gamesCount > 0) {
            console.log(`   ✅ SUCCESS: Expected games, found ${pageContent.gamesCount} games!`);
          } else if (test.expected === 'no-games' && (pageContent.gamesCount === 0 || pageContent.hasNoGamesMessage)) {
            console.log(`   ✅ SUCCESS: Expected no games, page shows correct message!`);
          } else {
            console.log(`   ❌ MISMATCH: Expected ${test.expected}, but got ${pageContent.gamesCount} games`);
          }
          
          // Go back to main page for next test
          await page.goto('http://localhost:63025', { waitUntil: 'domcontentloaded' });
          
        } catch (error) {
          console.log(`   ❌ Navigation failed: ${error.message}`);
        }
      } else {
        console.log(`   ❌ Link not found for ${test.date}`);
      }
    }
    
    console.log('\n✅ Calendar navigation test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testHttpNavigation();