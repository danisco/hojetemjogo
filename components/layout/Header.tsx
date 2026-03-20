import Link from 'next/link';
import { getTodayBRT, addDays } from '@/lib/date';

export default function Header() {
  const today = getTodayBRT();
  const tomorrow = addDays(today, 1);

  return (
    <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">⚽</span>
          <span className="text-lg font-bold text-gray-900">
            Hoje Tem <span className="text-green-700">Jogo</span>
          </span>
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium text-gray-600">
          <Link href={`/dia/${today}`} className="hover:text-green-700 transition-colors">
            Hoje
          </Link>
          <Link href={`/dia/${tomorrow}`} className="hidden sm:inline hover:text-green-700 transition-colors">
            Amanhã
          </Link>
        </nav>
      </div>
    </header>
  );
}
