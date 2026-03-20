import { redirect } from 'next/navigation';
import { getTodayBRT } from '@/lib/date';

// Revalidate every 5 minutes so the redirect always points to the current BRT date
export const revalidate = 300;

export default function Home() {
  redirect(`/dia/${getTodayBRT()}`);
}
