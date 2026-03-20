import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFixturesByDate } from '@/lib/api/football';
import { isValidDate, getDatePageTitle, formatShort, formatLong, isToday, isTomorrow, isPast, addDays, getTodayBRT } from '@/lib/date';
import { getLeague } from '@/lib/leagues';
import { getBroadcast } from '@/lib/broadcast/mapping';
import { getTeamByApiId } from '@/lib/teams/slugs';
import MatchList from '@/components/matches/MatchList';
import DateNavigator from '@/components/navigation/DateNavigator';
import AdSlot from '@/components/layout/AdSlot';
import MatchListJsonLd from '@/components/seo/MatchListJsonLd';
import type { Fixture, FixtureGroup } from '@/lib/types';

interface Props {
  params: { date: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = params;
  if (!isValidDate(date)) return {};

  const today = getTodayBRT();
  const tomorrow = addDays(today, 1);
  const yesterday = addDays(today, -1);

  let title: string;
  let description: string;

  if (date === today) {
    title = 'Jogos de Hoje ao Vivo | Onde Assistir';
    description = `Todos os jogos de futebol hoje (${formatShort(date)}), horários e onde assistir ao vivo na TV e streaming.`;
  } else if (date === tomorrow) {
    title = `Jogos de Amanhã | ${formatShort(date)}`;
    description = `Jogos de amanhã (${formatShort(date)}): veja horários e onde assistir ao vivo.`;
  } else if (date === yesterday) {
    title = `Resultados de Ontem | ${formatShort(date)}`;
    description = `Resultados dos jogos de ontem (${formatLong(date)}).`;
  } else if (isPast(date)) {
    title = `Resultados | ${formatLong(date)}`;
    description = `Resultados e placares dos jogos de ${formatLong(date)}.`;
  } else {
    title = `Jogos — ${formatLong(date)} | ${formatShort(date)}`;
    description = `Jogos de futebol no dia ${formatLong(date)}: horários e onde assistir.`;
  }

  return {
    title,
    description,
    alternates: {
      canonical: `/dia/${date}`,
    },
    openGraph: {
      title,
      description,
      url: `/dia/${date}`,
    },
  };
}

export default async function DiaPage({ params }: Props) {
  const { date } = params;

  if (!isValidDate(date)) notFound();

  const groups = await getFixturesByDate(date);

  // Enrich fixtures with broadcast info and team slugs
  const enrichedGroups = groups.map((group): FixtureGroup & { broadcastKey: string } => {
    const league = getLeague(group.leagueId);
    const broadcastKey = league?.broadcastKey ?? 'other';
    return {
      ...group,
      broadcastKey,
      fixtures: group.fixtures.map((f: Fixture) => {
        const homeSlug = getTeamByApiId(f.homeTeamId)?.slug ?? null;
        const awaySlug = getTeamByApiId(f.awayTeamId)?.slug ?? null;
        return { ...f, homeSlug, awaySlug, broadcast: getBroadcast(broadcastKey, homeSlug, awaySlug, f.date) };
      }),
    };
  });

  const pageTitle = getDatePageTitle(date);
  const today = getTodayBRT();
  const isLiveDate = date === today;

  return (
    <>
      <MatchListJsonLd groups={groups} date={date} />

      <div className="mx-auto max-w-3xl px-4 py-6">
        {/* Date navigation */}
        <DateNavigator currentDate={date} />

        {/* Page heading */}
        <div className="mb-6 mt-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {pageTitle}
          </h1>
          {isLiveDate && (
            <p className="mt-1 text-sm text-green-600 font-medium">
              ● Atualizado automaticamente
            </p>
          )}
        </div>

        {/* Ad slot 1 — leaderboard below date navigator */}
        <AdSlot slot="top" className="mb-6" />

        {enrichedGroups.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <p className="text-lg font-semibold text-gray-700">Nenhum jogo encontrado</p>
            <p className="mt-1 text-sm text-gray-500">
              {isPast(date)
                ? 'Não há registros de jogos nesta data.'
                : 'Nenhum jogo programado para este dia nas ligas monitoradas.'}
            </p>
          </div>
        ) : (
          enrichedGroups.map((group, idx) => (
            <div key={group.leagueId}>
              <MatchList group={group as any} />
              {/* Ad slot 2 — between 1st and 2nd league */}
              {idx === 0 && enrichedGroups.length > 1 && (
                <AdSlot slot="mid" className="my-4" />
              )}
            </div>
          ))
        )}

        {/* Ad slot 3 — bottom */}
        {enrichedGroups.length > 0 && (
          <AdSlot slot="bottom" className="mt-6" />
        )}
      </div>
    </>
  );
}
