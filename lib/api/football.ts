import 'server-only';

import type { Fixture, FixtureGroup } from '@/lib/types';

const API_BASE = 'https://api.football-data.org/v4';

function getApiKey(): string | null {
  return process.env.FOOTBALL_DATA_API_KEY ?? null;
}

// ── Competition config ────────────────────────────────────────────────────────

interface Competition {
  code: string;
  id: number;
  name: string;
  shortName: string;
  priority: number;
  broadcastKey: string;
}

const COMPETITIONS: Competition[] = [
  { code: 'BSA', id: 2013, name: 'Brasileirão Série A', shortName: 'Brasileirão', priority: 1, broadcastKey: 'brasileirao'    },
  { code: 'BSB', id: 2029, name: 'Brasileirão Série B', shortName: 'Série B',      priority: 2, broadcastKey: 'serie-b'        },
  { code: 'CDB', id: 2037, name: 'Copa do Brasil',      shortName: 'Copa BR',      priority: 3, broadcastKey: 'copa-do-brasil' },
];

export { COMPETITIONS };

// ── Raw API types ─────────────────────────────────────────────────────────────

interface RawMatch {
  id: number;
  utcDate: string;
  status: string;
  matchday: number | null;
  stage: string;
  competition: { id: number; name: string; code: string; emblem: string };
  homeTeam: { id: number; name: string; shortName: string; tla: string; crest: string };
  awayTeam: { id: number; name: string; shortName: string; tla: string; crest: string };
  score: {
    winner: string | null;
    fullTime: { home: number | null; away: number | null };
    halfTime: { home: number | null; away: number | null };
  };
  venue: string | null;
}

// ── Status mapping ────────────────────────────────────────────────────────────

function mapStatus(raw: string): Fixture['status'] {
  switch (raw) {
    case 'TIMED':
    case 'SCHEDULED': return 'NS';
    case 'IN_PLAY':   return '1H';
    case 'PAUSED':    return 'HT';
    case 'FINISHED':  return 'FT';
    case 'SUSPENDED': return 'SUSP';
    case 'POSTPONED': return 'PST';
    case 'CANCELLED': return 'CANC';
    case 'AWARDED':   return 'AWD';
    default:          return 'NS';
  }
}

function mapMatch(raw: RawMatch, competition: Competition): Fixture {
  return {
    id: raw.id,
    date: raw.utcDate,
    status: mapStatus(raw.status),
    elapsed: null,
    venue: raw.venue ?? null,
    city: null,
    leagueId: competition.id,
    leagueName: competition.name,
    leagueLogo: raw.competition.emblem ?? '',
    round: raw.matchday ? `Rodada ${raw.matchday}` : raw.stage,
    season: parseInt(raw.utcDate.slice(0, 4), 10),
    homeTeamId: raw.homeTeam.id,
    homeTeamName: raw.homeTeam.name,
    homeTeamLogo: raw.homeTeam.crest ?? '',
    awayTeamId: raw.awayTeam.id,
    awayTeamName: raw.awayTeam.name,
    awayTeamLogo: raw.awayTeam.crest ?? '',
    homeGoals: raw.score.fullTime.home,
    awayGoals: raw.score.fullTime.away,
  };
}

// ── Fetch helpers ─────────────────────────────────────────────────────────────

async function fetchMatchesForCompetition(
  competition: Competition,
  dateStr: string,
  apiKey: string
): Promise<Fixture[]> {
  // football-data.org: dateTo is exclusive, so add 1 day to include the target date
  const nextDay = new Date(dateStr);
  nextDay.setDate(nextDay.getDate() + 1);
  const dateTo = nextDay.toISOString().slice(0, 10);

  const url = `${API_BASE}/competitions/${competition.code}/matches?dateFrom=${dateStr}&dateTo=${dateTo}`;

  const today = new Date().toISOString().slice(0, 10);
  const revalidate = dateStr === today ? 900 : dateStr < today ? 86400 : 3600;

  const res = await fetch(url, {
    headers: { 'X-Auth-Token': apiKey },
    next: { revalidate },
  });

  if (res.status === 403) {
    console.error(`football-data.org: 403 for ${competition.code} — check your API key`);
    return [];
  }
  if (!res.ok) {
    console.error(`football-data.org: ${res.status} for ${competition.code}`);
    return [];
  }

  const data = await res.json() as { matches: RawMatch[] };
  return (data.matches ?? []).map((m) => mapMatch(m, competition));
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function getFixturesByDate(dateStr: string): Promise<FixtureGroup[]> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error('FOOTBALL_DATA_API_KEY not set — register free at football-data.org');
    return [];
  }

  const results = await Promise.allSettled(
    COMPETITIONS.map((c) => fetchMatchesForCompetition(c, dateStr, apiKey))
  );

  return results
    .map((result, i) => {
      const comp = COMPETITIONS[i];
      const fixtures = result.status === 'fulfilled' ? result.value : [];
      if (fixtures.length === 0) return null;
      return {
        leagueId: comp.id,
        leagueName: comp.name,
        leagueLogo: fixtures[0]?.leagueLogo ?? '',
        priority: comp.priority,
        fixtures,
      } satisfies FixtureGroup;
    })
    .filter((g): g is FixtureGroup => g !== null)
    .sort((a, b) => a.priority - b.priority);
}

export async function getFixturesByTeam(
  teamApiId: number,
  limit = 10
): Promise<{ upcoming: Fixture[]; recent: Fixture[] }> {
  const apiKey = getApiKey();
  if (!apiKey) return { upcoming: [], recent: [] };

  const season = new Date().getFullYear();

  const fetchForComp = async (comp: Competition): Promise<Fixture[]> => {
    const url = `${API_BASE}/competitions/${comp.code}/matches?season=${season}&status=SCHEDULED,TIMED`;
    const res = await fetch(url, {
      headers: { 'X-Auth-Token': apiKey },
      next: { revalidate: 21600 },
    });
    if (!res.ok) return [];
    const data = await res.json() as { matches: RawMatch[] };
    return (data.matches ?? [])
      .filter((m) => m.homeTeam.id === teamApiId || m.awayTeam.id === teamApiId)
      .map((m) => mapMatch(m, comp));
  };

  const fetchRecentForComp = async (comp: Competition): Promise<Fixture[]> => {
    const url = `${API_BASE}/competitions/${comp.code}/matches?season=${season}&status=FINISHED`;
    const res = await fetch(url, {
      headers: { 'X-Auth-Token': apiKey },
      next: { revalidate: 21600 },
    });
    if (!res.ok) return [];
    const data = await res.json() as { matches: RawMatch[] };
    return (data.matches ?? [])
      .filter((m) => m.homeTeam.id === teamApiId || m.awayTeam.id === teamApiId)
      .slice(-limit)
      .map((m) => mapMatch(m, comp));
  };

  const [upcomingAll, recentAll] = await Promise.all([
    Promise.all(COMPETITIONS.map(fetchForComp)),
    Promise.all(COMPETITIONS.map(fetchRecentForComp)),
  ]);

  const upcoming = upcomingAll.flat().slice(0, limit);
  const recent = recentAll.flat().slice(-limit);
  return { upcoming, recent };
}
