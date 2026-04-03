import { NextResponse } from 'next/server';

export async function GET() {
  const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';
  try {
    const response = await fetch(`${BACKEND_URL}/health`, { signal: AbortSignal.timeout(2000) });
    return NextResponse.json({ status: response.ok ? 'ok' : 'error' });
  } catch {
    return NextResponse.json({ status: 'offline' });
  }
}
