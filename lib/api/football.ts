import 'server-only';

import type { Fixture, FixtureGroup } from '@/lib/types';
import { LEAGUES, TRACKED_LEAGUE_IDS, getLeague, getSeasonYear } from '@/lib/leagues';

const API_BASE = 'https://v3.football.api-sports.io';

function getApiKey(): string {
  const key = process.env.FOOTBALL_API_KEY;
  if (!key) {
    throw new Error(
      'FOOTBALL_API_KEY environment variable is not set. ' +
      'Add it to .env.local (dev) or Vercel environment variables (prod).'
    );
  }
  return key;
}

/** Raw fixture shape returned by API-Football v3 */
interface RawFixture {
  fixture: {
    id: number;
    date: string;
    status: { short: string; elapsed: number | null };
    venue: { name: string | null; city: string | null };
  };
  league: {
    id: number;
    name: string;
    logo: string;
    season: number;
    round: string;
  };
  teams: {
    home: { id: number; name: string; logo: string; winner: boolean | null };
    away: { id: number; name: string; logo: string; winner: boolean | null };
  };
  goals: { home: number | null; away: number | null };
}

function mapFixture(raw: RawFixture): Fixture {
  return {
    id: raw.fixture.id,
    date: raw.fixture.date,
    status: raw.fixture.status.short as Fixture['status'],
    elapsed: raw.fixture.status.elapsed,
    venue: raw.fixture.venue.name,
    city: raw.fixture.venue.city,
    leagueId: raw.league.id,
    leagueName: raw.league.name,
    leagueLogo: raw.league.logo,
    round: raw.league.round,
    season: raw.league.season,
    homeTeamId: raw.teams.home.id,
    homeTeamName: raw.teams.home.name,
    homeTeamLogo: raw.teams.home.logo,
    awayTeamId: raw.teams.away.id,
    awayTeamName: raw.teams.away.name,
    awayTeamLogo: raw.teams.away.logo,
    homeGoals: raw.goals.home,
    awayGoals: raw.goals.away,
  };
}

async function fetchFixturesForLeague(
  leagueId: number,
  dateStr: string,
  apiKey: string
): Promise<Fixture[]> {
  const season = getSeasonYear(leagueId, dateStr);
  const url = new URL(`${API_BASE}/fixtures`);
  url.searchParams.set('league', String(leagueId));
  url.searchParams.set('season', String(season));
  url.searchParams.set('date', dateStr);
  url.searchParams.set('timezone', 'America/Sao_Paulo');

  // Determine cache revalidation based on date vs. today
  const today = new Date().toISOString().slice(0, 10); // rough UTC date, good enough for cache key
  let revalidateSeconds = 3600;
  if (dateStr === today) revalidateSeconds = 900;       // 15 min for today
  else if (dateStr < today) revalidateSeconds = 86400;  // 24 h for past

  const res = await fetch(url.toString(), {
    headers: {
      'x-apisports-key': apiKey,
    },
    next: { revalidate: revalidateSeconds },
  });

  if (!res.ok) {
    console.error(`API-Football error ${res.status} for league ${leagueId} date ${dateStr}`);
    return [];
  }

  const data = await res.json() as {
    errors: Record<string, string>;
    response: RawFixture[];
  };

  if (data.errors && Object.keys(data.errors).length > 0) {
    console.error('API-Football errors:', data.errors);
    return [];
  }

  return (data.response ?? []).map(mapFixture);
}

/**
 * Fetch and group all tracked-league fixtures for a given date (YYYY-MM-DD).
 * Returns an empty array per league if the API call fails, so the page still renders.
 */
export async function getFixturesByDate(dateStr: string): Promise<FixtureGroup[]> {
  const apiKey = getApiKey();

  const results = await Promise.allSettled(
    LEAGUES.map((league) => fetchFixturesForLeague(league.id, dateStr, apiKey))
  );

  const groups: FixtureGroup[] = [];

  results.forEach((result, i) => {
    const league = LEAGUES[i];
    const fixtures = result.status === 'fulfilled' ? result.value : [];
    if (fixtures.length > 0) {
      groups.push({
        leagueId: league.id,
        leagueName: league.name,
        leagueLogo: fixtures[0]?.leagueLogo ?? '',
        priority: league.priority,
        fixtures,
      });
    }
  });

  // Sort by priority
  return groups.sort((a, b) => a.priority - b.priority);
}

/**
 * Fetch upcoming + recent fixtures for a specific team.
 */
export async function getFixturesByTeam(
  teamApiId: number,
  limit = 10
): Promise<{ upcoming: Fixture[]; recent: Fixture[] }> {
  const apiKey = getApiKey();
  const season = new Date().getFullYear();

  const url = new URL(`${API_BASE}/fixtures`);
  url.searchParams.set('team', String(teamApiId));
  url.searchParams.set('season', String(season));
  url.searchParams.set('timezone', 'America/Sao_Paulo');
  url.searchParams.set('next', String(limit));

  const urlRecent = new URL(`${API_BASE}/fixtures`);
  urlRecent.searchParams.set('team', String(teamApiId));
  urlRecent.searchParams.set('season', String(season));
  urlRecent.searchParams.set('timezone', 'America/Sao_Paulo');
  urlRecent.searchParams.set('last', String(limit));

  const [nextRes, lastRes] = await Promise.allSettled([
    fetch(url.toString(), {
      headers: { 'x-apisports-key': apiKey },
      next: { revalidate: 21600 }, // 6 h
    }),
    fetch(urlRecent.toString(), {
      headers: { 'x-apisports-key': apiKey },
      next: { revalidate: 21600 },
    }),
  ]);

  const mapRes = async (res: PromiseSettledResult<Response>): Promise<Fixture[]> => {
    if (res.status === 'rejected' || !res.value.ok) return [];
    const data = await res.value.json() as { response: RawFixture[] };
    return (data.response ?? [])
      .filter((f) => TRACKED_LEAGUE_IDS.has(f.league.id))
      .map(mapFixture);
  };

  const [upcoming, recent] = await Promise.all([mapRes(nextRes), mapRes(lastRes)]);
  return { upcoming, recent };
}
