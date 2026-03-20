export type FixtureStatus =
  | 'NS'    // Not Started
  | '1H'    // First Half
  | 'HT'    // Halftime
  | '2H'    // Second Half
  | 'ET'    // Extra Time
  | 'BT'    // Break Time
  | 'P'     // Penalty In Progress
  | 'SUSP'  // Suspended
  | 'INT'   // Interrupted
  | 'FT'    // Full Time
  | 'AET'   // After Extra Time
  | 'PEN'   // After Penalties
  | 'PST'   // Postponed
  | 'CANC'  // Cancelled
  | 'ABD'   // Abandoned
  | 'AWD'   // Technical Loss
  | 'WO'    // Walk Over
  | 'LIVE'; // Live (generic)

export interface Fixture {
  id: number;
  date: string; // ISO 8601 from API (UTC)
  status: FixtureStatus;
  elapsed: number | null;
  venue: string | null;
  city: string | null;
  leagueId: number;
  leagueName: string;
  leagueLogo: string;
  round: string;
  season: number;
  homeTeamId: number;
  homeTeamName: string;
  homeTeamLogo: string;
  awayTeamId: number;
  awayTeamName: string;
  awayTeamLogo: string;
  homeGoals: number | null;
  awayGoals: number | null;
}

export interface FixtureGroup {
  leagueId: number;
  leagueName: string;
  leagueLogo: string;
  priority: number;
  fixtures: Fixture[];
}
