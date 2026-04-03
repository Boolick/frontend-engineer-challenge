import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (refreshToken) {
    try {
      // Notify backend to invalidate the session
      await fetch(`${BACKEND_URL}/api/v1/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
    } catch (error) {
      console.error('Failed to notify backend about logout:', error);
      // We still proceed to clear local cookies even if backend fails
    }
  }
  
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');

  return NextResponse.json({ success: true });
}
