import { NextResponse } from 'next/server';

// Temporary debug endpoint — REMOVE after diagnosing
export async function GET() {
  const key =
    process.env.FOOTBALL_API_KEY ??
    process.env.API_FOOTBALL_KEY ??
    null;

  if (!key) {
    return NextResponse.json({ error: 'No API key found in env vars' }, { status: 500 });
  }

  // Show partial key so we can confirm it's the right one without fully exposing it
  const maskedKey = `${key.slice(0, 4)}...${key.slice(-4)}`;

  // Test call: fetch today's Libertadores fixtures
  const url = 'https://v3.football.api-sports.io/fixtures?league=13&season=2026&date=2026-03-20&timezone=America/Sao_Paulo';
  let apiResponse: unknown;

  try {
    const res = await fetch(url, {
      headers: { 'x-apisports-key': key },
      cache: 'no-store',
    });
    apiResponse = await res.json();
  } catch (e) {
    apiResponse = { fetchError: String(e) };
  }

  return NextResponse.json({ maskedKey, apiResponse });
}
