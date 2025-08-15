// Simple navigation test
import puppeteer from 'puppeteer';
import path from 'path';

async function testSimpleNavigation() {
  console.log('🧪 Testing simple calendar navigation...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    slowMo: 1000 // Add delay to see what's happening
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    
    // Navigate to the main page using file protocol
    const indexPath = path.resolve('./index.html');
    console.log(`📂 Loading: file://${indexPath}`);
    await page.goto(`file://${indexPath}`, { waitUntil: 'domcontentloaded' });
    
    // Wait for page to load
    await page.waitForSelector('#calendar-nav');
    console.log('✅ Main page loaded');
    
    // Check calendar state
    const calendarInfo = await page.evaluate(() => {
      const calendarLinks = Array.from(document.querySelectorAll('#calendar-nav a'));
      return calendarLinks.map(link => ({
        href: link.getAttribute('href'),
        text: link.textContent.trim(),
        hasGames: link.querySelector('.text-xs:last-child').textContent === '⚽',
        classes: link.className
      }));
    });
    
    console.log('📅 Calendar links found:', calendarInfo.length);
    
    // Show first few dates
    calendarInfo.slice(0, 8).forEach(link => {
      console.log(`  ${link.href} - ${link.hasGames ? '⚽' : '-'} - ${link.text.replace(/\s+/g, ' ')}`);
    });
    
    // Test clicking on a date that should have games (2025-08-17)
    console.log('\n🔗 Testing click on 2025-08-17...');
    const link2017 = await page.$('a[href="/dias/2025-08-17/"]');
    
    if (link2017) {
      // Take screenshot before click
      await page.screenshot({ path: 'before-click.png' });
      
      // Click the link
      await link2017.click();
      
      // Wait for navigation
      try {
        await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 5000 });
        
        const newUrl = page.url();
        console.log(`   ✅ Navigated to: ${newUrl}`);
        
        // Take screenshot after navigation
        await page.screenshot({ path: 'after-click.png' });
        
        // Check for games on the page
        const pageContent = await page.evaluate(() => {
          const todaySection = document.querySelector('#list-today');
          const articles = todaySection ? todaySection.querySelectorAll('article') : [];
          const noGamesDiv = document.querySelector('.text-center.py-12');
          
          return {
            gamesCount: articles.length,
            hasNoGamesMessage: !!noGamesDiv,
            title: document.title,
            url: window.location.href
          };
        });
        
        console.log(`   📊 Games found: ${pageContent.gamesCount}`);
        console.log(`   📄 Page title: ${pageContent.title}`);
        console.log(`   🌐 Current URL: ${pageContent.url}`);
        
        if (pageContent.gamesCount > 0) {
          console.log('   ✅ SUCCESS: Calendar navigation working - games displayed!');
        } else if (pageContent.hasNoGamesMessage) {
          console.log('   ℹ️  No games message shown (expected for some dates)');
        } else {
          console.log('   ❌ No games found and no "no games" message');
        }
        
      } catch (error) {
        console.log(`   ❌ Navigation failed: ${error.message}`);
      }
    } else {
      console.log('   ❌ Link not found');
    }
    
    // Wait a bit before closing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testSimpleNavigation();