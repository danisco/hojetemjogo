// BRT = UTC-3 (Brazil Standard Time, used year-round since Brazil abolished DST in 2019)
const BRT_OFFSET_MS = -3 * 60 * 60 * 1000;

export function getBRTNow(): Date {
  const utcMs = Date.now();
  return new Date(utcMs + BRT_OFFSET_MS);
}

export function getTodayBRT(): string {
  return toDateString(getBRTNow());
}

/** YYYY-MM-DD → Date (local midnight, not UTC) */
export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Date → 'YYYY-MM-DD' using its local year/month/day */
export function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDays(dateStr: string, days: number): string {
  const d = parseLocalDate(dateStr);
  d.setDate(d.getDate() + days);
  return toDateString(d);
}

/** 'YYYY-MM-DD' → 'DD/MM' */
export function formatShort(dateStr: string): string {
  const d = parseLocalDate(dateStr);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** 'YYYY-MM-DD' → '20 de março' style */
export function formatLong(dateStr: string): string {
  const d = parseLocalDate(dateStr);
  const months = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
  ];
  return `${d.getDate()} de ${months[d.getMonth()]}`;
}

export function isToday(dateStr: string): boolean {
  return dateStr === getTodayBRT();
}

export function isTomorrow(dateStr: string): boolean {
  return dateStr === addDays(getTodayBRT(), 1);
}

export function isPast(dateStr: string): boolean {
  return dateStr < getTodayBRT();
}

export function isValidDate(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const d = parseLocalDate(dateStr);
  return !isNaN(d.getTime());
}

/** Convert an ISO 8601 UTC timestamp from API to BRT HH:mm */
export function utcToTimeBRT(isoDate: string): string {
  const d = new Date(isoDate);
  const brt = new Date(d.getTime() + BRT_OFFSET_MS);
  return `${String(brt.getUTCHours()).padStart(2, '0')}:${String(brt.getUTCMinutes()).padStart(2, '0')}`;
}

/** Page title helper */
export function getDatePageTitle(dateStr: string): string {
  const today = getTodayBRT();
  const tomorrow = addDays(today, 1);
  const yesterday = addDays(today, -1);

  if (dateStr === today) return 'Jogos de Hoje';
  if (dateStr === tomorrow) return 'Jogos de Amanhã';
  if (dateStr === yesterday) return 'Jogos de Ontem';
  if (isPast(dateStr)) return `Resultados — ${formatLong(dateStr)}`;
  return `Jogos — ${formatLong(dateStr)}`;
}
