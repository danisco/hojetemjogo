// Scrape additional game data from reliable sources to supplement API-Football
import puppeteer from 'puppeteer';

export async function scrapeLibertadoresGames(dates) {
  console.log('🌍 Scraping Libertadores and international games...');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const scrapedGames = [];
  
  try {
    const page = await browser.newPage();
    
    // Check Globo Esporte for comprehensive Brazilian football coverage
    for (const date of dates) {
      console.log(`  📅 Checking ${date}...`);
      
      try {
        await page.goto(`https://ge.globo.com/agenda/`, { 
          waitUntil: 'networkidle2',
          timeout: 15000 
        });
        
        await page.waitForTimeout(2000);
        
        // Look for games on this date
        const dayGames = await page.evaluate((targetDate) => {
          const brazilianTeams = [
            'Flamengo', 'Botafogo', 'Palmeiras', 'Corinthians', 'São Paulo', 'Santos',
            'Fluminense', 'Grêmio', 'Internacional', 'Atlético-MG', 'Cruzeiro',
            'Bahia', 'Fortaleza', 'Vasco', 'Athletico', 'Ceará', 'Sport'
          ];
          
          const games = [];
          const dateElements = document.querySelectorAll('.agenda-item, .game, .match, .fixture');
          
          dateElements.forEach(element => {
            const text = element.textContent || '';
            const date = targetDate.slice(8, 10); // Get day from YYYY-MM-DD
            
            if (text.includes(date)) {
              // Check for Brazilian teams
              const hasBrazilianTeam = brazilianTeams.some(team => 
                text.toLowerCase().includes(team.toLowerCase())
              );
              
              // Check for international competitions
              const hasInternational = text.toLowerCase().includes('libertadores') ||
                                     text.toLowerCase().includes('sul-americana') ||
                                     text.toLowerCase().includes('sudamericana');
              
              if (hasBrazilianTeam && hasInternational) {
                games.push({
                  text: text.replace(/\s+/g, ' ').trim().substring(0, 200),
                  source: 'Globo Esporte'
                });
              }
            }
          });
          
          return games;
        }, date);
        
        if (dayGames.length > 0) {
          console.log(`    ✅ Found ${dayGames.length} games on ${date}`);
          scrapedGames.push({ date, games: dayGames });
        }
        
      } catch (error) {
        console.log(`    ❌ Error checking ${date}: ${error.message}`);
      }
      
      await page.waitForTimeout(1000); // Rate limiting
    }
    
  } catch (error) {
    console.error('❌ Scraping error:', error.message);
  } finally {
    await browser.close();
  }
  
  return scrapedGames;
}

// Convert scraped games to API-Football format
export function convertScrapedToApiFormat(scrapedGames) {
  const fixtures = [];
  
  scrapedGames.forEach(({ date, games }) => {
    games.forEach((game, index) => {
      // Try to extract team names and competition
      const text = game.text.toLowerCase();
      
      let competition = 'Internacional';
      if (text.includes('libertadores')) competition = 'CONMEBOL Libertadores';
      if (text.includes('sul-americana') || text.includes('sudamericana')) competition = 'CONMEBOL Sudamericana';
      
      // Create a mock fixture in API-Football format
      const fixture = {
        fixture: {
          id: `scraped_${date}_${index}`,
          date: `${date}T20:00:00-03:00`, // Default evening time
          status: {
            long: "Not Started",
            short: "NS"
          },
          venue: {
            name: "Stadium TBD"
          }
        },
        league: {
          id: competition.includes('Libertadores') ? 13 : 11,
          name: competition,
          logo: competition.includes('Libertadores') ? 
                "https://media.api-sports.io/football/leagues/13.png" :
                "https://media.api-sports.io/football/leagues/11.png",
          round: "To Be Confirmed"
        },
        teams: {
          home: {
            id: 999,
            name: "Brazilian Team",
            logo: "https://media.api-sports.io/football/teams/127.png"
          },
          away: {
            id: 998,
            name: "International Team", 
            logo: "https://media.api-sports.io/football/teams/120.png"
          }
        },
        goals: {
          home: null,
          away: null
        },
        _scraped: true,
        _originalText: game.text,
        _source: game.source
      };
      
      fixtures.push(fixture);
    });
  });
  
  return fixtures;
}

// Main function to supplement API data
export async function supplementApiData(dates, existingFixtures = {}) {
  console.log('🔍 Supplementing API data with web scraping...');
  
  // Find dates with no or few games
  const emptyDates = dates.filter(date => 
    !existingFixtures[date] || existingFixtures[date].length < 2
  );
  
  if (emptyDates.length === 0) {
    console.log('✅ All dates have sufficient game data');
    return existingFixtures;
  }
  
  console.log(`📝 Supplementing ${emptyDates.length} dates with limited data`);
  
  const scrapedData = await scrapeLibertadoresGames(emptyDates);
  const supplementalFixtures = convertScrapedToApiFormat(scrapedData);
  
  // Merge with existing data
  const enhancedFixtures = { ...existingFixtures };
  
  supplementalFixtures.forEach(fixture => {
    const date = fixture.fixture.date.split('T')[0];
    if (!enhancedFixtures[date]) {
      enhancedFixtures[date] = [];
    }
    enhancedFixtures[date].push(fixture);
  });
  
  console.log(`✅ Added ${supplementalFixtures.length} supplemental games`);
  return enhancedFixtures;
}