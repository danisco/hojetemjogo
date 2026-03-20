/**
 * League/competition metadata used for display and broadcast mapping.
 * Source of truth for IDs is now football-data.org (lib/api/football.ts).
 */

export interface League {
  id: number;
  name: string;
  shortName: string;
  priority: number;
  broadcastKey: string;
}

// IDs match football-data.org competition IDs
export const LEAGUES: League[] = [
  { id: 2013, name: 'Brasileirão Série A', shortName: 'Brasileirão', priority: 1, broadcastKey: 'brasileirao'    },
  { id: 2029, name: 'Brasileirão Série B', shortName: 'Série B',      priority: 2, broadcastKey: 'serie-b'        },
  { id: 2037, name: 'Copa do Brasil',      shortName: 'Copa BR',      priority: 3, broadcastKey: 'copa-do-brasil' },
];

export const TRACKED_LEAGUE_IDS = new Set(LEAGUES.map((l) => l.id));

const leagueById = new Map(LEAGUES.map((l) => [l.id, l]));

export function getLeague(id: number): League | undefined {
  return leagueById.get(id);
}

// Not needed anymore (football-data.org uses competition codes, not season params)
export function getSeasonYear(_leagueId: number, _dateStr: string): number {
  return new Date().getFullYear();
}
