import Image from 'next/image';
import MatchCard from './MatchCard';
import type { FixtureGroup, Fixture } from '@/lib/types';
import type { BroadcastResult } from '@/lib/broadcast/mapping';

interface EnrichedFixture extends Fixture {
  homeSlug: string | null;
  awaySlug: string | null;
  broadcast: BroadcastResult;
}

interface EnrichedGroup extends Omit<FixtureGroup, 'fixtures'> {
  fixtures: EnrichedFixture[];
  broadcastKey: string;
}

interface Props {
  group: EnrichedGroup;
}

export default function MatchList({ group }: Props) {
  return (
    <section
      className="mb-4 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
      aria-label={group.leagueName}
    >
      {/* League header */}
      <header className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/60 px-4 py-2.5">
        {group.leagueLogo && (
          <Image
            src={group.leagueLogo}
            alt={group.leagueName}
            width={20}
            height={20}
            className="h-5 w-5 object-contain"
            unoptimized
          />
        )}
        <h2 className="text-sm font-semibold text-gray-800">{group.leagueName}</h2>
      </header>

      {/* Match rows */}
      <div className="divide-y divide-gray-50">
        {group.fixtures.map((fixture) => (
          <MatchCard key={fixture.id} fixture={fixture} />
        ))}
      </div>
    </section>
  );
}
