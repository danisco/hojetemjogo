'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getTodayBRT, addDays, formatShort, isToday, isTomorrow } from '@/lib/date';

interface Props {
  currentDate: string;
}

function getDayLabel(dateStr: string): string {
  if (isToday(dateStr)) return 'Hoje';
  if (isTomorrow(dateStr)) return 'Amanhã';
  const yesterday = addDays(getTodayBRT(), -1);
  if (dateStr === yesterday) return 'Ontem';
  // Short weekday
  const [y, m, d] = dateStr.split('-').map(Number);
  const weekday = new Date(y, m - 1, d).toLocaleDateString('pt-BR', { weekday: 'short' });
  return weekday.replace('.', '');
}

export default function DateNavigator({ currentDate }: Props) {
  const router = useRouter();
  const today = getTodayBRT();

  // 7-day strip: today-3 → today+3
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i - 3));

  const prev = addDays(currentDate, -1);
  const next = addDays(currentDate, 1);

  return (
    <nav aria-label="Navegação por data" className="flex items-center gap-2">
      {/* Previous arrow */}
      <Link
        href={`/dia/${prev}`}
        aria-label="Dia anterior"
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:border-green-600 hover:text-green-700"
      >
        ‹
      </Link>

      {/* 7-day strip */}
      <div className="flex flex-1 gap-1 overflow-x-auto no-scrollbar">
        {days.map((day) => {
          const active = day === currentDate;
          return (
            <Link
              key={day}
              href={`/dia/${day}`}
              className={`flex flex-shrink-0 flex-col items-center justify-center rounded-lg px-3 py-1.5 text-center transition ${
                active
                  ? 'bg-green-700 text-white font-semibold'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-green-600 hover:text-green-700'
              }`}
            >
              <span className="text-[10px] uppercase tracking-wide">
                {getDayLabel(day)}
              </span>
              <span className="text-sm font-medium">{formatShort(day)}</span>
            </Link>
          );
        })}
      </div>

      {/* Next arrow */}
      <Link
        href={`/dia/${next}`}
        aria-label="Próximo dia"
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:border-green-600 hover:text-green-700"
      >
        ›
      </Link>
    </nav>
  );
}
