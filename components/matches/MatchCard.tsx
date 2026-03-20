import Image from 'next/image';
import Link from 'next/link';
import type { Fixture } from '@/lib/types';
import type { BroadcastResult } from '@/lib/broadcast/mapping';
import BroadcastBadge from './BroadcastBadge';
import { utcToTimeBRT, isPast } from '@/lib/date';
import { getLeague } from '@/lib/leagues';

interface EnrichedFixture extends Fixture {
  homeSlug: string | null;
  awaySlug: string | null;
  broadcast: BroadcastResult;
}

interface Props {
  fixture: EnrichedFixture;
  /** Show the league name above the match (used on team pages) */
  showLeague?: boolean;
}

/** Human-readable match status string */
function statusLabel(fixture: Fixture): { text: string; live: boolean } {
  switch (fixture.status) {
    case 'NS':
      return { text: utcToTimeBRT(fixture.date), live: false };
    case '1H':
      return { text: `${fixture.elapsed ?? '?'}'`, live: true };
    case 'HT':
      return { text: 'Int.', live: true };
    case '2H':
    case 'ET':
      return { text: `${fixture.elapsed ?? '?'}'`, live: true };
    case 'P':
      return { text: 'Pen.', live: true };
    case 'FT':
      return { text: 'Encerrado', live: false };
    case 'AET':
      return { text: 'Prorr.', live: false };
    case 'PEN':
      return { text: 'Pênaltis', live: false };
    case 'PST':
      return { text: 'Adiado', live: false };
    case 'CANC':
      return { text: 'Cancelado', live: false };
    default:
      return { text: fixture.status, live: false };
  }
}

function scoreOrVs(fixture: Fixture) {
  const finished = ['FT', 'AET', 'PEN', 'AWD', 'WO'].includes(fixture.status);
  const live = ['1H', 'HT', '2H', 'ET', 'P', 'BT', 'LIVE'].includes(fixture.status);
  if (finished || live) {
    return (
      <span className="tabular-nums font-bold text-gray-900">
        {fixture.homeGoals ?? 0} – {fixture.awayGoals ?? 0}
      </span>
    );
  }
  return <span className="text-gray-400 font-medium">×</span>;
}

function TeamLogo({ src, name }: { src: string; name: string }) {
  if (!src) return <div className="h-6 w-6 rounded-full bg-gray-100" />;
  return (
    <Image
      src={src}
      alt={name}
      width={24}
      height={24}
      className="h-6 w-6 object-contain"
      unoptimized // logos from api-sports CDN are small PNGs; skip Next.js optimization
    />
  );
}

export default function MatchCard({ fixture, showLeague = false }: Props) {
  const { text: statusText, live } = statusLabel(fixture);
  const league = getLeague(fixture.leagueId);
  const past = isPast(fixture.date.slice(0, 10));

  const homeContent = (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <TeamLogo src={fixture.homeTeamLogo} name={fixture.homeTeamName} />
      <span className="truncate text-sm font-medium text-gray-900">
        {fixture.homeTeamName}
      </span>
    </div>
  );

  const awayContent = (
    <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
      <span className="truncate text-sm font-medium text-gray-900 text-right">
        {fixture.awayTeamName}
      </span>
      <TeamLogo src={fixture.awayTeamLogo} name={fixture.awayTeamName} />
    </div>
  );

  return (
    <div className="px-4 py-3">
      {showLeague && league && (
        <p className="mb-1 text-xs text-gray-400">{league.shortName} · {fixture.round}</p>
      )}

      <div className="flex items-center gap-3">
        {/* Status / time */}
        <div className="w-14 flex-shrink-0 text-center">
          <span
            className={`text-xs font-semibold ${live ? 'text-green-600' : 'text-gray-500'}`}
          >
            {live && '● '}
            {statusText}
          </span>
        </div>

        {/* Teams and score */}
        <div className="flex flex-1 items-center gap-2 min-w-0">
          {fixture.homeSlug ? (
            <Link href={`/time/${fixture.homeSlug}`} className="flex min-w-0 flex-1 items-center gap-2 hover:text-green-700">
              {homeContent}
            </Link>
          ) : homeContent}

          <div className="flex-shrink-0 text-center w-10">
            {scoreOrVs(fixture)}
          </div>

          {fixture.awaySlug ? (
            <Link href={`/time/${fixture.awaySlug}`} className="flex min-w-0 flex-1 items-center justify-end gap-2 hover:text-green-700">
              {awayContent}
            </Link>
          ) : awayContent}
        </div>

        {/* Broadcast badge */}
        {!past && (
          <div className="flex-shrink-0">
            <BroadcastBadge channel={fixture.broadcast.primary} small />
          </div>
        )}
      </div>

      {/* Broadcast note (uncertainty warning) */}
      {!past && fixture.broadcast.note && (
        <p className="mt-1 pl-[4.25rem] text-xs text-amber-600">
          {fixture.broadcast.note}
        </p>
      )}

      {/* Venue */}
      {fixture.venue && (
        <p className="mt-0.5 pl-[4.25rem] text-xs text-gray-400">
          {fixture.venue}{fixture.city ? `, ${fixture.city}` : ''}
        </p>
      )}
    </div>
  );
}
