import puppeteer from 'puppeteer';
import fs from 'fs';

async function testLiveWebsite() {
  console.log('🚀 Testing live website at https://hojetemjogo.com.br');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1280, height: 720 }
  });
  
  try {
    const page = await browser.newPage();
    
    // Navigate to the live website
    console.log('📍 Navigating to https://hojetemjogo.com.br');
    await page.goto('https://hojetemjogo.com.br', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Take screenshot of main page
    console.log('📸 Taking screenshot of main page...');
    await page.screenshot({ 
      path: 'live-website-main.png',
      fullPage: true
    });
    
    // Check what date is being displayed
    console.log('🗓️ Checking current date display...');
    const pageTitle = await page.title();
    console.log('Page title:', pageTitle);
    
    // Extract date from title or content
    const dateMatch = pageTitle.match(/\((\d{4}-\d{2}-\d{2})\)/);
    if (dateMatch) {
      console.log('📅 Date shown in title:', dateMatch[1]);
      console.log('🚨 Expected date: 2025-08-15');
      console.log('❌ Date mismatch detected!', dateMatch[1] !== '2025-08-15');
    }
    
    // Check for Hoje section
    console.log('🔍 Checking Hoje (Today) section...');
    const hojeSection = await page.$('#hoje-section, .hoje-section, [data-section="hoje"]');
    if (hojeSection) {
      const hojeText = await page.evaluate(el => el.textContent, hojeSection);
      console.log('Hoje section content preview:', hojeText.substring(0, 200));
    }
    
    // Check for Amanhã section  
    console.log('🔍 Checking Amanhã (Tomorrow) section...');
    const amanhaSection = await page.$('#amanha-section, .amanha-section, [data-section="amanha"]');
    if (amanhaSection) {
      const amanhaText = await page.evaluate(el => el.textContent, amanhaSection);
      console.log('Amanhã section content preview:', amanhaText.substring(0, 200));
      
      // Look specifically for Fluminense x Fortaleza
      const hasFluminenseFortaleza = amanhaText.toLowerCase().includes('fluminense') && 
                                     amanhaText.toLowerCase().includes('fortaleza');
      console.log('🔍 Fluminense x Fortaleza found in Amanhã:', hasFluminenseFortaleza);
    }
    
    // Check for Próximos Jogos section
    console.log('🔍 Checking Próximos Jogos section...');
    const proximosSection = await page.$('#proximos-section, .proximos-section, [data-section="proximos"]');
    if (proximosSection) {
      const proximosText = await page.evaluate(el => el.textContent, proximosSection);
      console.log('Próximos Jogos content preview:', proximosText.substring(0, 200));
    }
    
    // Test calendar navigation - click on a future date
    console.log('🗓️ Testing calendar navigation...');
    const calendarLinks = await page.$$('a[href*="/dias/"]');
    console.log(`Found ${calendarLinks.length} calendar links`);
    
    if (calendarLinks.length > 1) {
      // Click on second calendar day (tomorrow)
      console.log('📅 Clicking on tomorrow calendar link...');
      await calendarLinks[1].click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Take screenshot of tomorrow page
      await page.screenshot({ 
        path: 'live-website-tomorrow.png',
        fullPage: true
      });
      
      // Check if we're on the right page
      const tomorrowUrl = page.url();
      console.log('Tomorrow page URL:', tomorrowUrl);
      
      // Check for games on tomorrow page
      const tomorrowContent = await page.content();
      const hasFluminenseFortaleza = tomorrowContent.toLowerCase().includes('fluminense') && 
                                     tomorrowContent.toLowerCase().includes('fortaleza');
      console.log('🔍 Fluminense x Fortaleza found on tomorrow page:', hasFluminenseFortaleza);
    }
    
    console.log('✅ Live website testing completed');
    
  } catch (error) {
    console.error('❌ Error testing live website:', error.message);
  } finally {
    await browser.close();
  }
}

testLiveWebsite().catch(console.error);