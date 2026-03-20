import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFixturesByTeam } from '@/lib/api/football';
import { getTeamBySlug, getTeamByApiId } from '@/lib/teams/slugs';
import { getLeague } from '@/lib/leagues';
import { getBroadcast } from '@/lib/broadcast/mapping';
import MatchCard from '@/components/matches/MatchCard';

interface Props {
  params: { slug: string };
}

// No generateStaticParams — team pages render on-demand (ISR) to avoid API calls at build time

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const team = getTeamBySlug(params.slug);
  if (!team) return {};

  return {
    title: `Próximos Jogos do ${team.name} | Onde Assistir`,
    description: `Veja os próximos jogos do ${team.name}, horários, e onde assistir ao vivo na TV e streaming.`,
    alternates: { canonical: `/time/${team.slug}` },
    openGraph: {
      title: `Próximos Jogos do ${team.name} | Hoje Tem Jogo`,
      description: `Calendário completo do ${team.name}: próximos jogos e resultados recentes.`,
    },
  };
}

export default async function TeamPage({ params }: Props) {
  const team = getTeamBySlug(params.slug);
  if (!team || team.apiId === 0) notFound();

  const { upcoming, recent } = await getFixturesByTeam(team.apiId);

  const enrich = (f: any) => {
    const league = getLeague(f.leagueId);
    const broadcastKey = league?.broadcastKey ?? 'other';
    const homeSlug = getTeamByApiId(f.homeTeamId)?.slug ?? null;
    const awaySlug = getTeamByApiId(f.awayTeamId)?.slug ?? null;
    return { ...f, homeSlug, awaySlug, broadcast: getBroadcast(broadcastKey, homeSlug, awaySlug, f.date) };
  };

  const enrichedUpcoming = upcoming.map(enrich);
  const enrichedRecent = recent.map(enrich);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-gray-500">
        <a href="/" className="hover:text-green-700">Início</a>
        <span className="mx-1">›</span>
        <span>{team.name}</span>
      </nav>

      {/* Team header */}
      <div className="mb-6 flex items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Jogos do {team.name}
        </h1>
      </div>

      {/* Upcoming */}
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-800">Próximos Jogos</h2>
        {enrichedUpcoming.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhum jogo programado encontrado.</p>
        ) : (
          <div className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            {enrichedUpcoming.map((fixture) => (
              <MatchCard key={fixture.id} fixture={fixture} showLeague />
            ))}
          </div>
        )}
      </section>

      {/* Recent */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-800">Últimos Resultados</h2>
        {enrichedRecent.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhum resultado encontrado.</p>
        ) : (
          <div className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            {enrichedRecent.map((fixture) => (
              <MatchCard key={fixture.id} fixture={fixture} showLeague />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
