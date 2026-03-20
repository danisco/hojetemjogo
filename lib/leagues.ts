export interface League {
  id: number;
  name: string;
  shortName: string;
  /** Lower = higher priority in display order */
  priority: number;
  /** Key into broadcast mapping */
  broadcastKey: string;
}

/**
 * Tracked leagues ordered by display priority.
 * To add a league: find its ID on api-football.com/docs and add an entry here.
 */
export const LEAGUES: League[] = [
  { id: 71,  name: 'Brasileirão Série A',    shortName: 'Brasileirão',   priority: 1,  broadcastKey: 'brasileirao'    },
  { id: 72,  name: 'Brasileirão Série B',    shortName: 'Série B',       priority: 2,  broadcastKey: 'serie-b'        },
  { id: 13,  name: 'CONMEBOL Libertadores',  shortName: 'Libertadores',  priority: 3,  broadcastKey: 'libertadores'   },
  { id: 11,  name: 'CONMEBOL Sudamericana',  shortName: 'Sul-Americana', priority: 4,  broadcastKey: 'sul-americana'  },
  { id: 74,  name: 'Copa do Brasil',         shortName: 'Copa BR',       priority: 5,  broadcastKey: 'copa-do-brasil' },
  { id: 75,  name: 'Copa do Nordeste',       shortName: 'Copa NE',       priority: 6,  broadcastKey: 'copa-nordeste'  },
  { id: 73,  name: 'Brasileirão Série C',    shortName: 'Série C',       priority: 7,  broadcastKey: 'serie-b'        },
  { id: 12,  name: 'Recopa Sudamericana',    shortName: 'Recopa',        priority: 8,  broadcastKey: 'sul-americana'  },
  { id: 130, name: 'Campeonato Carioca',     shortName: 'Carioca',       priority: 9,  broadcastKey: 'carioca'        },
  { id: 475, name: 'Campeonato Paulista',    shortName: 'Paulistão',     priority: 10, broadcastKey: 'paulista'       },
  { id: 472, name: 'Campeonato Mineiro',     shortName: 'Mineiro',       priority: 11, broadcastKey: 'mineiro'        },
  { id: 477, name: 'Campeonato Gaúcho',      shortName: 'Gaúcho',        priority: 12, broadcastKey: 'gaucho'         },
];

export const TRACKED_LEAGUE_IDS = new Set(LEAGUES.map((l) => l.id));

const leagueById = new Map(LEAGUES.map((l) => [l.id, l]));

export function getLeague(apiId: number): League | undefined {
  return leagueById.get(apiId);
}

/**
 * Determine the competition season year for a given league and date.
 * Brasileirão series start in April; everything else uses the calendar year.
 */
export function getSeasonYear(leagueId: number, dateStr: string): number {
  const year = parseInt(dateStr.slice(0, 4), 10);
  const month = parseInt(dateStr.slice(5, 7), 10);
  // National leagues that start ~April: if we're in Jan-Mar, use previous year
  const aprilStartLeagues = [71, 72, 73, 74, 75, 76];
  if (aprilStartLeagues.includes(leagueId) && month < 4) {
    return year - 1;
  }
  return year;
}
