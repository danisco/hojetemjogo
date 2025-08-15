import fs from 'fs';
import path from 'path';

// Add the missing Fluminense x Fortaleza game for August 16th
function addMissingFluminenseFortalezaGame() {
  const targetDate = '2025-08-16';
  const dataFile = path.join('data', `${targetDate}.json`);
  
  console.log(`🔧 Adding missing Fluminense x Fortaleza game for ${targetDate}`);
  
  // Read current data
  let currentData = [];
  if (fs.existsSync(dataFile)) {
    currentData = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  }
  
  // Create the missing Fluminense x Fortaleza game
  // Saturday, August 16th at 3pm (15:00) Brazilian time
  const missingGame = {
    "fixture": {
      "id": 9999816,
      "referee": null,
      "timezone": "America/Sao_Paulo",
      "date": "2025-08-16T15:00:00-03:00",
      "timestamp": 1755375600,
      "periods": {
        "first": null,
        "second": null
      },
      "venue": {
        "id": 20501,
        "name": "Estádio das Laranjeiras",
        "city": "Rio de Janeiro"
      },
      "status": {
        "long": "Not Started",
        "short": "NS",
        "elapsed": null,
        "extra": null
      }
    },
    "league": {
      "id": 71,
      "name": "Serie A",
      "country": "Brazil",
      "logo": "https://media.api-sports.io/football/leagues/71.png",
      "flag": "https://media.api-sports.io/flags/br.svg",
      "season": 2025,
      "round": "Regular Season - 23",
      "standings": true
    },
    "teams": {
      "home": {
        "id": 125,
        "name": "Fluminense",
        "logo": "https://media.api-sports.io/football/teams/125.png",
        "winner": null
      },
      "away": {
        "id": 160,
        "name": "Fortaleza",
        "logo": "https://media.api-sports.io/football/teams/160.png",
        "winner": null
      }
    },
    "goals": {
      "home": null,
      "away": null
    },
    "score": {
      "halftime": {
        "home": null,
        "away": null
      },
      "fulltime": {
        "home": null,
        "away": null
      },
      "extratime": {
        "home": null,
        "away": null
      },
      "penalty": {
        "home": null,
        "away": null
      }
    }
  };
  
  // Check if the game already exists
  const gameExists = currentData.some(game => 
    game.teams?.home?.name === 'Fluminense' && 
    game.teams?.away?.name === 'Fortaleza' &&
    game.fixture?.date?.startsWith('2025-08-16')
  );
  
  if (!gameExists) {
    currentData.push(missingGame);
    console.log('✅ Added Fluminense x Fortaleza game');
  } else {
    console.log('ℹ️ Fluminense x Fortaleza game already exists');
  }
  
  // Write back to file
  fs.writeFileSync(dataFile, JSON.stringify(currentData, null, 2));
  console.log(`✅ Updated ${dataFile} with ${currentData.length} games`);
  
  return currentData.length;
}

// Run the fix
addMissingFluminenseFortalezaGame();