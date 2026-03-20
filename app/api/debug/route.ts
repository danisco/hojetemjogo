import { NextResponse } from 'next/server';

// Temporary debug endpoint — REMOVE after confirming API works
export async function GET() {
  const key = process.env.FOOTBALL_DATA_API_KEY ?? null;

  if (!key) {
    return NextResponse.json({ error: 'FOOTBALL_DATA_API_KEY not set in env vars' }, { status: 500 });
  }

  const maskedKey = `${key.slice(0, 4)}...${key.slice(-4)}`;

  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const url = `https://api.football-data.org/v4/competitions/BSA/matches?dateFrom=${today}&dateTo=${tomorrow}`;

  let apiResponse: unknown;
  try {
    const res = await fetch(url, {
      headers: { 'X-Auth-Token': key },
      cache: 'no-store',
    });
    apiResponse = await res.json();
  } catch (e) {
    apiResponse = { fetchError: String(e) };
  }

  return NextResponse.json({ maskedKey, url, apiResponse });
}
