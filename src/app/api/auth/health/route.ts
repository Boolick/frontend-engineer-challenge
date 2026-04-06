import { NextResponse } from 'next/server';

export async function GET() {
  const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

  try {
    const response = await fetch(`${BACKEND_URL}/health`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(2000),
    });

    if (!response.ok) {
      return NextResponse.json({ status: 'error' }, { status: 503 });
    }

    return NextResponse.json({ status: 'ok' });
  } catch {
    return NextResponse.json({ status: 'offline' }, { status: 503 });
  }
}
