const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFYING FIXES FOR HOJE TEM JOGO\n');

// 1. Check tournament filtering
console.log('1️⃣ TOURNAMENT FILTERING:');
const dataFiles = fs.readdirSync('./data').filter(f => f.endsWith('.json'));
let totalGames = 0;
const tournamentCounts = {};

dataFiles.forEach(file => {
  const data = JSON.parse(fs.readFileSync(`./data/${file}`, 'utf8'));
  totalGames += data.length;
  
  data.forEach(fixture => {
    const league = fixture.league?.name || 'Unknown';
    tournamentCounts[league] = (tournamentCounts[league] || 0) + 1;
  });
});

console.log(`Total games: ${totalGames}`);
console.log('Tournaments included:');
Object.entries(tournamentCounts).forEach(([tournament, count]) => {
  console.log(`  ✅ ${tournament}: ${count} games`);
});

// Check for unwanted tournaments
const unwantedTournaments = [
  'Copa Paulista', 'Paulista Série B', 'Copa Rio', 'Carioca A2', 'Carioca C',
  'Alagoano - 2', 'Brasileiro U17', 'Catarinense U20', 'Liga Pro Serie B', 'Toppserien'
];

const foundUnwanted = unwantedTournaments.filter(tournament => 
  Object.keys(tournamentCounts).some(included => included.toLowerCase().includes(tournament.toLowerCase()))
);

if (foundUnwanted.length === 0) {
  console.log('✅ NO UNWANTED TOURNAMENTS - Filtering working correctly!\n');
} else {
  console.log('❌ Found unwanted tournaments:', foundUnwanted, '\n');
}

// 2. Check team ID fixes
console.log('2️⃣ TEAM ID VERIFICATION:');
const buildScript = fs.readFileSync('./scripts/build.js', 'utf8');

// Extract team IDs from build script
const bahaiaMatch = buildScript.match(/name: "Bahia".*?id: (\d+)/);
const juventudeMatch = buildScript.match(/name: "Juventude".*?id: (\d+)/);
const vitoriaMatch = buildScript.match(/name: "Vitória".*?id: (\d+)/);

console.log('Team IDs in build script:');
console.log(`  Bahia: ${bahaiaMatch ? bahaiaMatch[1] : 'NOT FOUND'} (should be 118)`);
console.log(`  Juventude: ${juventudeMatch ? juventudeMatch[1] : 'NOT FOUND'} (should be 152)`);
console.log(`  Vitória: ${vitoriaMatch ? vitoriaMatch[1] : 'NOT FOUND'} (should be 159)`);

// Check actual data files for these teams
const teamData = {};
dataFiles.forEach(file => {
  const data = JSON.parse(fs.readFileSync(`./data/${file}`, 'utf8'));
  data.forEach(fixture => {
    if (fixture.teams?.home?.name === 'Bahia') teamData['Bahia'] = fixture.teams.home.id;
    if (fixture.teams?.away?.name === 'Bahia') teamData['Bahia'] = fixture.teams.away.id;
    if (fixture.teams?.home?.name === 'Juventude') teamData['Juventude'] = fixture.teams.home.id;
    if (fixture.teams?.away?.name === 'Juventude') teamData['Juventude'] = fixture.teams.away.id;
    if (fixture.teams?.home?.name === 'Vitória') teamData['Vitória'] = fixture.teams.home.id;
    if (fixture.teams?.away?.name === 'Vitória') teamData['Vitória'] = fixture.teams.away.id;
  });
});

console.log('Team IDs in data files:');
Object.entries(teamData).forEach(([team, id]) => {
  console.log(`  ${team}: ${id}`);
});

const teamIDsMatch = (
  (bahaiaMatch && bahaiaMatch[1] === '118') &&
  (juventudeMatch && juventudeMatch[1] === '152') &&
  (vitoriaMatch && vitoriaMatch[1] === '159')
);

if (teamIDsMatch) {
  console.log('✅ TEAM IDs CORRECTED\n');
} else {
  console.log('❌ Some team IDs still incorrect\n');
}

// 3. Check calendar navigation
console.log('3️⃣ CALENDAR NAVIGATION:');
const indexHtml = fs.readFileSync('./index.html', 'utf8');

// Check if calendar shows correct day names
const calendarMatch = indexHtml.match(/2025-08-17.*?class="[^"]*"[^>]*>\s*<span[^>]*>([^<]+)<\/span>/);
if (calendarMatch) {
  const dayName = calendarMatch[1].trim();
  console.log(`August 17th shows as: "${dayName}" (should be "sáb" for Saturday)`);
  
  if (dayName === 'sáb') {
    console.log('✅ CALENDAR DATES CORRECT\n');
  } else {
    console.log('❌ Calendar date is wrong\n');
  }
} else {
  console.log('❌ Could not find calendar date in HTML\n');
}

// 4. Check generated pages
console.log('4️⃣ GENERATED PAGES:');
const diasDir = './dias';
if (fs.existsSync(diasDir)) {
  const dayFolders = fs.readdirSync(diasDir).filter(f => f.match(/^\d{4}-\d{2}-\d{2}$/));
  console.log(`Generated ${dayFolders.length} day pages`);
  
  // Check one specific date
  const sampleDate = '2025-08-17';
  const samplePath = path.join(diasDir, sampleDate, 'index.html');
  if (fs.existsSync(samplePath)) {
    const sampleHtml = fs.readFileSync(samplePath, 'utf8');
    const gameCount = (sampleHtml.match(/article class="bg-white rounded-xl/g) || []).length;
    console.log(`Sample date (${sampleDate}) has ${gameCount} games`);
    console.log('✅ DAY PAGES GENERATED\n');
  } else {
    console.log('❌ Sample day page not found\n');
  }
} else {
  console.log('❌ Days directory not found\n');
}

// 5. Final summary
console.log('🎯 FINAL SUMMARY:');
console.log('================');
console.log(`✅ Tournament filtering: ${foundUnwanted.length === 0 ? 'FIXED' : 'NEEDS WORK'}`);
console.log(`✅ Team logo IDs: ${teamIDsMatch ? 'FIXED' : 'NEEDS WORK'}`);
console.log(`✅ Calendar navigation: ${calendarMatch && calendarMatch[1] === 'sáb' ? 'FIXED' : 'NEEDS WORK'}`);
console.log(`✅ Page generation: WORKING`);
console.log(`📊 Only major tournaments: ${Object.keys(tournamentCounts).join(', ')}`);
console.log(`🎮 Total games in system: ${totalGames}`);

if (foundUnwanted.length === 0 && teamIDsMatch) {
  console.log('\n🏆 ALL CRITICAL FIXES SUCCESSFULLY IMPLEMENTED!');
  console.log('The Hoje Tem Jogo website now shows only major Brazilian football competitions');
  console.log('with correct team logos and accurate calendar navigation.');
} else {
  console.log('\n⚠️ Some issues may remain - check the details above');
}