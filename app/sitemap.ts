import type { MetadataRoute } from 'next';
import { getTodayBRT, addDays } from '@/lib/date';
import { TEAMS_WITH_API_IDS } from '@/lib/teams/slugs';

export default function sitemap(): MetadataRoute.Sitemap {
  const today = getTodayBRT();
  const BASE = 'https://hojetemjogo.com.br';

  // Date pages: -7 days to +7 days
  const dateEntries: MetadataRoute.Sitemap = Array.from({ length: 15 }, (_, i) => {
    const offset = i - 7;
    const date = addDays(today, offset);
    const isToday = offset === 0;
    const isFuture = offset > 0;
    return {
      url: `${BASE}/dia/${date}`,
      lastModified: new Date(),
      changeFrequency: isToday ? 'hourly' : isFuture ? 'daily' : 'weekly',
      priority: isToday ? 0.9 : isFuture ? 0.7 : 0.5,
    } as const;
  });

  // Team pages
  const teamEntries: MetadataRoute.Sitemap = TEAMS_WITH_API_IDS.map((team) => ({
    url: `${BASE}/time/${team.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  // Root
  const root: MetadataRoute.Sitemap = [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
  ];

  return [...root, ...dateEntries, ...teamEntries];
}
