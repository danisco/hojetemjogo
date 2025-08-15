// Brazilian Football Broadcast Information Database
// Real transmission data for different competitions and platforms

window.BROADCAST_INFO = {
  // Competition-based broadcast rules
  competitions: {
    'brasileirao': {
      name: 'Brasileirão Série A',
      platforms: [
        { name: 'Globo', type: 'TV Aberta', schedule: 'Sábados 19h, Domingos 16h e 18h30' },
        { name: 'SporTV', type: 'TV Fechada', schedule: 'Múltiplos jogos por rodada' },
        { name: 'Premiere', type: 'Pay-per-view', schedule: 'Todos os jogos exclusivos' },
        { name: 'Globoplay', type: 'Streaming', schedule: 'Jogos da Globo e SporTV' }
      ],
      defaultPlatform: 'Premiere'
    },
    'serie-b': {
      name: 'Brasileirão Série B', 
      platforms: [
        { name: 'SporTV', type: 'TV Fechada', schedule: 'Jogos selecionados' },
        { name: 'Premiere', type: 'Pay-per-view', schedule: 'Maioria dos jogos' },
        { name: 'Globoplay', type: 'Streaming', schedule: 'Jogos do SporTV' }
      ],
      defaultPlatform: 'Premiere'
    },
    'copa-do-brasil': {
      name: 'Copa do Brasil',
      platforms: [
        { name: 'Globo', type: 'TV Aberta', schedule: 'Finais e semifinais' },
        { name: 'SporTV', type: 'TV Fechada', schedule: 'Fases eliminatórias' },
        { name: 'Amazon Prime Video', type: 'Streaming', schedule: 'Transmissão exclusiva' },
        { name: 'Globoplay', type: 'Streaming', schedule: 'Jogos da Globo' }
      ],
      defaultPlatform: 'Amazon Prime Video'
    },
    'libertadores': {
      name: 'CONMEBOL Libertadores',
      platforms: [
        { name: 'SBT', type: 'TV Aberta', schedule: 'Jogos com times brasileiros' },
        { name: 'ESPN', type: 'TV Fechada', schedule: 'Jogos selecionados' },
        { name: 'Paramount+', type: 'Streaming', schedule: 'Todos os jogos' },
        { name: 'Pluto TV', type: 'Streaming Gratuito', schedule: 'Jogos selecionados' }
      ],
      defaultPlatform: 'Paramount+'
    },
    'sul-americana': {
      name: 'CONMEBOL Sul-Americana',
      platforms: [
        { name: 'SBT', type: 'TV Aberta', schedule: 'Finais' },
        { name: 'ESPN', type: 'TV Fechada', schedule: 'Fases eliminatórias' },
        { name: 'Paramount+', type: 'Streaming', schedule: 'Todos os jogos' }
      ],
      defaultPlatform: 'Paramount+'
    },
    'copa-nordeste': {
      name: 'Copa do Nordeste',
      platforms: [
        { name: 'SBT', type: 'TV Aberta', schedule: 'Finais' },
        { name: 'SporTV', type: 'TV Fechada', schedule: 'Fases eliminatórias' },
        { name: 'Globoplay', type: 'Streaming', schedule: 'Todos os jogos' }
      ],
      defaultPlatform: 'SporTV'
    },
    'carioca': {
      name: 'Campeonato Carioca',
      platforms: [
        { name: 'Globo RJ', type: 'TV Aberta', schedule: 'Finais e grandes jogos' },
        { name: 'SporTV', type: 'TV Fechada', schedule: 'Demais jogos' },
        { name: 'Globoplay', type: 'Streaming', schedule: 'Todos os jogos' }
      ],
      defaultPlatform: 'SporTV'
    },
    'paulista': {
      name: 'Campeonato Paulista',
      platforms: [
        { name: 'Globo SP', type: 'TV Aberta', schedule: 'Finais e clássicos' },
        { name: 'SporTV', type: 'TV Fechada', schedule: 'Demais jogos' },
        { name: 'Globoplay', type: 'Streaming', schedule: 'Todos os jogos' },
        { name: 'YouTube (Paulistão)', type: 'Streaming Gratuito', schedule: 'Jogos selecionados' }
      ],
      defaultPlatform: 'SporTV'
    },
    'mineiro': {
      name: 'Campeonato Mineiro',
      platforms: [
        { name: 'Globo MG', type: 'TV Aberta', schedule: 'Finais' },
        { name: 'SporTV', type: 'TV Fechada', schedule: 'Principais jogos' },
        { name: 'Premiere', type: 'Pay-per-view', schedule: 'Demais jogos' }
      ],
      defaultPlatform: 'SporTV'
    },
    'gaucho': {
      name: 'Campeonato Gaúcho',
      platforms: [
        { name: 'Globo RS', type: 'TV Aberta', schedule: 'Finais e GreNal' },
        { name: 'SporTV', type: 'TV Fechada', schedule: 'Principais jogos' },
        { name: 'Premiere', type: 'Pay-per-view', schedule: 'Demais jogos' }
      ],
      defaultPlatform: 'SporTV'
    }
  },

  // Team-specific broadcast preferences (for big teams)
  teamPreferences: {
    'flamengo': {
      mainPlatforms: ['Globo', 'SporTV', 'Premiere'],
      popularityFactor: 'high'
    },
    'corinthians': {
      mainPlatforms: ['Globo', 'SporTV', 'Premiere'],
      popularityFactor: 'high'
    },
    'palmeiras': {
      mainPlatforms: ['Globo', 'SporTV', 'Premiere'],
      popularityFactor: 'high'
    },
    'sao-paulo': {
      mainPlatforms: ['Globo', 'SporTV', 'Premiere'],
      popularityFactor: 'high'
    },
    'santos': {
      mainPlatforms: ['SporTV', 'Premiere'],
      popularityFactor: 'medium'
    },
    'vasco': {
      mainPlatforms: ['SporTV', 'Premiere'],
      popularityFactor: 'medium'
    },
    'botafogo': {
      mainPlatforms: ['SporTV', 'Premiere'],
      popularityFactor: 'medium'
    },
    'fluminense': {
      mainPlatforms: ['SporTV', 'Premiere'],
      popularityFactor: 'medium'
    }
  },

  // Time-based broadcast patterns
  timeSlots: {
    'saturday_19': { preferredPlatform: 'Globo', description: 'Jogo da Globo' },
    'sunday_16': { preferredPlatform: 'Globo', description: 'Jogo da Globo' },
    'sunday_18:30': { preferredPlatform: 'Globo', description: 'Jogo da Globo' },
    'weekday_21:30': { preferredPlatform: 'SporTV', description: 'SporTV Prime' },
    'weekday_19': { preferredPlatform: 'Premiere', description: 'Premiere Exclusivo' }
  }
};

// Function to determine broadcast platform for a match
window.getBroadcastInfo = function(fixture) {
  const league = fixture.league?.name?.toLowerCase() || '';
  const homeTeam = fixture.teams?.home?.name?.toLowerCase() || '';
  const awayTeam = fixture.teams?.away?.name?.toLowerCase() || '';
  const matchDate = new Date(fixture.fixture?.date || '');
  
  // Determine competition type
  let competitionType = 'other';
  if (league.includes('serie a') || league.includes('brasileiro')) {
    competitionType = 'brasileirao';
  } else if (league.includes('serie b')) {
    competitionType = 'serie-b';
  } else if (league.includes('copa do brasil')) {
    competitionType = 'copa-do-brasil';
  } else if (league.includes('libertadores')) {
    competitionType = 'libertadores';
  } else if (league.includes('sul-americana') || league.includes('sudamericana')) {
    competitionType = 'sul-americana';
  } else if (league.includes('copa do nordeste')) {
    competitionType = 'copa-nordeste';
  } else if (league.includes('carioca')) {
    competitionType = 'carioca';
  } else if (league.includes('paulista')) {
    competitionType = 'paulista';
  } else if (league.includes('mineiro')) {
    competitionType = 'mineiro';
  } else if (league.includes('gaúcho') || league.includes('gaucho')) {
    competitionType = 'gaucho';
  }

  const competition = window.BROADCAST_INFO.competitions[competitionType];
  if (!competition) {
    return {
      platform: 'Consulte a programação',
      type: 'Verificar',
      platforms: ['SporTV', 'Premiere', 'Globoplay']
    };
  }

  // Check if it's a big team match
  const bigTeams = ['flamengo', 'corinthians', 'palmeiras', 'sao-paulo', 'santos'];
  const hasBigTeam = bigTeams.some(team => 
    homeTeam.includes(team) || awayTeam.includes(team)
  );

  // Determine primary platform
  let primaryPlatform = competition.defaultPlatform;
  
  // Special cases for big matches
  if (hasBigTeam && competitionType === 'brasileirao') {
    const hour = matchDate.getHours();
    const dayOfWeek = matchDate.getDay(); // 0 = Sunday, 6 = Saturday
    
    if (dayOfWeek === 6 && hour === 19) { // Saturday 19h
      primaryPlatform = 'Globo';
    } else if (dayOfWeek === 0 && (hour === 16 || hour === 18)) { // Sunday 16h or 18h30
      primaryPlatform = 'Globo';
    }
  }

  return {
    platform: primaryPlatform,
    type: competition.platforms.find(p => p.name === primaryPlatform)?.type || 'Streaming',
    platforms: competition.platforms.map(p => p.name),
    competition: competition.name
  };
};

// Function to get detailed broadcast information
window.getDetailedBroadcastInfo = function(fixture) {
  const broadcastInfo = window.getBroadcastInfo(fixture);
  const homeTeam = fixture.teams?.home?.name || '';
  const awayTeam = fixture.teams?.away?.name || '';
  
  return {
    ...broadcastInfo,
    searchTerm: `onde assistir ${homeTeam} x ${awayTeam}`,
    alternativeSearch: `${homeTeam} ${awayTeam} ao vivo`,
    streamingTip: 'Verifique também: Globoplay, Paramount+, Amazon Prime Video'
  };
};