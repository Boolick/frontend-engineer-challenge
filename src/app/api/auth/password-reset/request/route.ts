import { NextResponse } from 'next/server';
import { mapBackendError, errorResponse } from '../../_lib/map-error';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/v1/auth/password-reset/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return errorResponse(mapBackendError(data, response.status, response.headers));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Password reset request error:', error);
    return errorResponse(mapBackendError(null, 503));
  }
}
