/**
 * Brazilian TV broadcast rights engine.
 *
 * API-Football does NOT include Brazilian broadcast data, so we use
 * a hardcoded rules engine based on publicly known rights agreements.
 *
 * Ported and improved from assets/broadcast-info.js.
 */

export type ChannelType = 'tv-aberta' | 'tv-fechada' | 'ppv' | 'streaming' | 'streaming-gratuito';

export interface Channel {
  name: string;
  type: ChannelType;
  /** Tailwind bg-color class for the badge */
  color: string;
}

export const CHANNELS: Record<string, Channel> = {
  Globo:              { name: 'Globo',              type: 'tv-aberta',          color: 'bg-blue-600'   },
  SporTV:             { name: 'SporTV',             type: 'tv-fechada',         color: 'bg-green-700'  },
  Premiere:           { name: 'Premiere',           type: 'ppv',                color: 'bg-orange-600' },
  Globoplay:          { name: 'Globoplay',          type: 'streaming',          color: 'bg-red-600'    },
  'Amazon Prime':     { name: 'Amazon Prime',       type: 'streaming',          color: 'bg-sky-500'    },
  'Paramount+':       { name: 'Paramount+',         type: 'streaming',          color: 'bg-blue-800'   },
  SBT:                { name: 'SBT',                type: 'tv-aberta',          color: 'bg-yellow-600' },
  ESPN:               { name: 'ESPN',               type: 'tv-fechada',         color: 'bg-red-700'    },
  'Pluto TV':         { name: 'Pluto TV',           type: 'streaming-gratuito', color: 'bg-purple-600' },
};

export interface BroadcastResult {
  /** Primary channel to highlight */
  primary: Channel;
  /** All channels that may air this match */
  all: Channel[];
  /** Uncertainty hint — show when rights aren't certain */
  note?: string;
}

interface LeagueRules {
  channels: string[];
  primaryChannel: string;
}

const LEAGUE_RULES: Record<string, LeagueRules> = {
  'brasileirao': {
    primaryChannel: 'Premiere',
    channels: ['Premiere', 'SporTV', 'Globoplay'],
  },
  'serie-b': {
    primaryChannel: 'Premiere',
    channels: ['Premiere', 'SporTV', 'Globoplay'],
  },
  'copa-do-brasil': {
    primaryChannel: 'Amazon Prime',
    channels: ['Amazon Prime', 'SporTV', 'Globoplay'],
  },
  'libertadores': {
    primaryChannel: 'Paramount+',
    channels: ['Paramount+', 'SBT', 'ESPN', 'Pluto TV'],
  },
  'sul-americana': {
    primaryChannel: 'Paramount+',
    channels: ['Paramount+', 'SBT', 'ESPN'],
  },
  'copa-nordeste': {
    primaryChannel: 'SporTV',
    channels: ['SporTV', 'Globoplay'],
  },
  'carioca': {
    primaryChannel: 'SporTV',
    channels: ['SporTV', 'Globoplay'],
  },
  'paulista': {
    primaryChannel: 'SporTV',
    channels: ['SporTV', 'Globoplay'],
  },
  'mineiro': {
    primaryChannel: 'SporTV',
    channels: ['SporTV', 'Premiere'],
  },
  'gaucho': {
    primaryChannel: 'SporTV',
    channels: ['SporTV', 'Premiere'],
  },
};

/** Slugs of "big clubs" — Globo typically picks them for prime slots */
const BIG_CLUBS = new Set([
  'flamengo', 'corinthians', 'palmeiras', 'sao-paulo',
  'atletico-mg', 'gremio', 'internacional', 'fluminense',
  'santos', 'vasco', 'botafogo',
]);

function toChannel(name: string): Channel {
  return CHANNELS[name] ?? { name, type: 'tv-fechada', color: 'bg-gray-600' };
}

function isGloboSlot(isoDate: string): boolean {
  const d = new Date(isoDate);
  // Convert to BRT (UTC-3)
  const brt = new Date(d.getTime() - 3 * 60 * 60 * 1000);
  const dow = brt.getUTCDay(); // 0=Sun, 6=Sat
  const hour = brt.getUTCHours();
  // Classic Globo slots: Sat 19h or Sun 16h / 18h30
  return (dow === 6 && hour === 19) || (dow === 0 && (hour === 16 || hour === 18));
}

/**
 * Returns broadcast info for a fixture.
 *
 * @param broadcastKey - League broadcast key from lib/leagues.ts
 * @param homeTeamSlug - URL slug of home team (optional)
 * @param awayTeamSlug - URL slug of away team (optional)
 * @param isoDate      - ISO 8601 date string from API
 */
export function getBroadcast(
  broadcastKey: string,
  homeTeamSlug: string | null,
  awayTeamSlug: string | null,
  isoDate: string
): BroadcastResult {
  const rules = LEAGUE_RULES[broadcastKey];

  if (!rules) {
    return {
      primary: toChannel('SporTV'),
      all: [toChannel('SporTV'), toChannel('Globoplay')],
      note: 'Verifique a programação',
    };
  }

  let primaryName = rules.primaryChannel;

  // Override: Brasileirão marquee Globo slot
  if (broadcastKey === 'brasileirao') {
    const hasBigClub =
      (homeTeamSlug && BIG_CLUBS.has(homeTeamSlug)) ||
      (awayTeamSlug && BIG_CLUBS.has(awayTeamSlug));

    if (hasBigClub && isGloboSlot(isoDate)) {
      primaryName = 'Globo';
      const channels = ['Globo', 'Globoplay'];
      return {
        primary: toChannel('Globo'),
        all: channels.map(toChannel),
        note: 'Horário típico da Globo — confirme na programação',
      };
    }
  }

  const allChannels = rules.channels.map(toChannel);
  return {
    primary: toChannel(primaryName),
    all: allChannels,
  };
}
