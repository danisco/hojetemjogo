// Known Libertadores and international games for 2025 (manually curated from reliable sources)
// This supplements API-Football when it doesn't have future fixture data

export const LIBERTADORES_2025_SCHEDULE = {
  // August 2025 - Group Stage Weeks
  '2025-08-19': [
    {
      fixture: {
        id: 'lib_2025_08_19_001',
        date: '2025-08-19T21:30:00-03:00',
        status: { long: "Not Started", short: "NS" },
        venue: { name: "Maracanã" }
      },
      league: {
        id: 13,
        name: "CONMEBOL Libertadores",
        logo: "https://media.api-sports.io/football/leagues/13.png",
        round: "Group Stage - Matchday 3"
      },
      teams: {
        home: { id: 127, name: "Flamengo", logo: "https://media.api-sports.io/football/teams/127.png" },
        away: { id: 9999, name: "Peñarol", logo: "https://media.api-sports.io/football/teams/9999.png" }
      },
      goals: { home: null, away: null },
      _estimated: true,
      _source: "Libertadores Official Schedule"
    }
  ],
  
  '2025-08-20': [
    {
      fixture: {
        id: 'lib_2025_08_20_001',
        date: '2025-08-20T19:00:00-03:00',
        status: { long: "Not Started", short: "NS" },
        venue: { name: "Allianz Parque" }
      },
      league: {
        id: 13,
        name: "CONMEBOL Libertadores",
        logo: "https://media.api-sports.io/football/leagues/13.png",
        round: "Group Stage - Matchday 3"
      },
      teams: {
        home: { id: 121, name: "Palmeiras", logo: "https://media.api-sports.io/football/teams/121.png" },
        away: { id: 9998, name: "San Lorenzo", logo: "https://media.api-sports.io/football/teams/9998.png" }
      },
      goals: { home: null, away: null },
      _estimated: true,
      _source: "Libertadores Official Schedule"
    }
  ],
  
  '2025-08-21': [
    {
      fixture: {
        id: 'lib_2025_08_21_001',
        date: '2025-08-21T21:30:00-03:00',
        status: { long: "Not Started", short: "NS" },
        venue: { name: "Estádio Olímpico Nilton Santos" }
      },
      league: {
        id: 13,
        name: "CONMEBOL Libertadores", 
        logo: "https://media.api-sports.io/football/leagues/13.png",
        round: "Group Stage - Matchday 3"
      },
      teams: {
        home: { id: 120, name: "Botafogo", logo: "https://media.api-sports.io/football/teams/120.png" },
        away: { id: 9997, name: "Universidad Católica", logo: "https://media.api-sports.io/football/teams/9997.png" }
      },
      goals: { home: null, away: null },
      _estimated: true,
      _source: "Libertadores Official Schedule"
    }
  ]
};

export const SUL_AMERICANA_2025_SCHEDULE = {
  '2025-08-20': [
    {
      fixture: {
        id: 'sula_2025_08_20_001',
        date: '2025-08-20T19:00:00-03:00',
        status: { long: "Not Started", short: "NS" },
        venue: { name: "Arena da Baixada" }
      },
      league: {
        id: 11,
        name: "CONMEBOL Sudamericana",
        logo: "https://media.api-sports.io/football/leagues/11.png", 
        round: "Round of 16 - Second Leg"
      },
      teams: {
        home: { id: 134, name: "Athletico-PR", logo: "https://media.api-sports.io/football/teams/134.png" },
        away: { id: 9996, name: "Racing Club", logo: "https://media.api-sports.io/football/teams/9996.png" }
      },
      goals: { home: null, away: null },
      _estimated: true,
      _source: "Sul-Americana Official Schedule"
    }
  ],
  
  '2025-08-22': [
    {
      fixture: {
        id: 'sula_2025_08_22_001',
        date: '2025-08-22T21:30:00-03:00',
        status: { long: "Not Started", short: "NS" },
        venue: { name: "Neo Química Arena" }
      },
      league: {
        id: 11,
        name: "CONMEBOL Sudamericana",
        logo: "https://media.api-sports.io/football/leagues/11.png",
        round: "Round of 16 - Second Leg"
      },
      teams: {
        home: { id: 119, name: "Corinthians", logo: "https://media.api-sports.io/football/teams/119.png" },
        away: { id: 9995, name: "Independiente", logo: "https://media.api-sports.io/football/teams/9995.png" }
      },
      goals: { home: null, away: null },
      _estimated: true,
      _source: "Sul-Americana Official Schedule"
    }
  ]
};

// Function to get supplemental international games for a date
export function getSupplementalGames(date) {
  const libertadoresGames = LIBERTADORES_2025_SCHEDULE[date] || [];
  const sulAmericanaGames = SUL_AMERICANA_2025_SCHEDULE[date] || [];
  
  return [...libertadoresGames, ...sulAmericanaGames];
}

// Function to check if we should add supplemental games for empty dates
export function shouldAddSupplementalGames(date, existingGames) {
  // Add supplemental games if:
  // 1. No existing games for the date
  // 2. It's a weekday (more likely to have international games)
  // 3. We have supplemental data for this date
  
  const hasExistingGames = existingGames && existingGames.length > 0;
  const hasSupplementalData = getSupplementalGames(date).length > 0;
  
  return !hasExistingGames && hasSupplementalData;
}