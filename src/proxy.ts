import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './shared/lib/i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip i18n for API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Handle internationalization first
  const response = intlMiddleware(request);

  // If intlMiddleware redirects or does something special, use its response
  // Otherwise, continue with auth logic
  
  const accessToken = request.cookies.get('accessToken');

  // Protected routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/ru/dashboard') || pathname.startsWith('/en/dashboard')) {
    if (!accessToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Auth routes (redirect to dashboard if already logged in)
  if (pathname === '/login' || pathname === '/register' || pathname === '/ru/login' || pathname === '/en/login' || pathname === '/ru/register' || pathname === '/en/register') {
    if (accessToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  // Combine next-intl and auth matchers
  matcher: ['/', '/(ru|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)', '/dashboard/:path*', '/login', '/register'],
};
