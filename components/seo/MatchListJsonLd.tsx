import type { FixtureGroup, Fixture } from '@/lib/types';

interface Props {
  groups: FixtureGroup[];
  date: string;
}

/**
 * Injects JSON-LD SportsEvent schema for every match on the page.
 * Eligible for Google rich results in search.
 * https://schema.org/SportsEvent
 */
export default function MatchListJsonLd({ groups, date }: Props) {
  const fixtures: Fixture[] = groups.flatMap((g) => g.fixtures);

  if (fixtures.length === 0) return null;

  const events = fixtures.map((f) => ({
    '@type': 'SportsEvent',
    name: `${f.homeTeamName} x ${f.awayTeamName}`,
    startDate: f.date,
    // Assume ~2h matches
    endDate: new Date(new Date(f.date).getTime() + 2 * 60 * 60 * 1000).toISOString(),
    ...(f.venue
      ? {
          location: {
            '@type': 'SportsActivityLocation',
            name: f.venue,
            address: f.city ?? undefined,
          },
        }
      : {}),
    competitor: [
      { '@type': 'SportsTeam', name: f.homeTeamName },
      { '@type': 'SportsTeam', name: f.awayTeamName },
    ],
    superEvent: {
      '@type': 'SportsEvent',
      name: f.leagueName,
    },
    eventStatus:
      f.status === 'PST'
        ? 'https://schema.org/EventPostponed'
        : f.status === 'CANC'
        ? 'https://schema.org/EventCancelled'
        : 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    ...((['FT', 'AET', 'PEN'].includes(f.status) && f.homeGoals !== null)
      ? {
          subEvent: [
            { '@type': 'SportsEvent', name: 'Resultado', description: `${f.homeTeamName} ${f.homeGoals} – ${f.awayGoals} ${f.awayTeamName}` },
          ],
        }
      : {}),
  }));

  const schema = {
    '@context': 'https://schema.org',
    '@graph': events,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
