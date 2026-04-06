import type { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  intlMiddlewareMock,
  createIntlMiddlewareMock,
  nextResponseNextMock,
  nextResponseRedirectMock,
} = vi.hoisted(() => {
  const intlMiddlewareMock = vi.fn();

  return {
    intlMiddlewareMock,
    createIntlMiddlewareMock: vi.fn(() => intlMiddlewareMock),
    nextResponseNextMock: vi.fn(() => ({ type: 'next' })),
    nextResponseRedirectMock: vi.fn((url: URL) => ({
      type: 'redirect',
      url: url.toString(),
    })),
  };
});

vi.mock('next-intl/middleware', () => ({
  default: createIntlMiddlewareMock,
}));

vi.mock('next/server', async () => {
  const actual = await vi.importActual<typeof import('next/server')>('next/server');

  return {
    ...actual,
    NextResponse: {
      next: nextResponseNextMock,
      redirect: nextResponseRedirectMock,
    },
  };
});

import { proxy } from '@/proxy';

type RequestOptions = {
  search?: string;
  accessToken?: string;
};

const createRequest = (
  pathname: string,
  { search = '', accessToken }: RequestOptions = {},
) =>
  ({
    nextUrl: {
      pathname,
      search,
    },
    url: `https://example.com${pathname}${search}`,
    cookies: {
      get: vi.fn((name: string) =>
        name === 'accessToken' && accessToken ? { value: accessToken } : undefined,
      ),
    },
  }) as unknown as NextRequest;

describe('proxy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    intlMiddlewareMock.mockReturnValue({ type: 'intl' });
  });

  it.each([
    '/_next/static/chunks/app.js',
    '/api/auth/login',
    '/favicon.svg',
  ])('should skip middleware for system request %s', (pathname) => {
    const response = proxy(createRequest(pathname));

    expect(nextResponseNextMock).toHaveBeenCalledTimes(1);
    expect(intlMiddlewareMock).not.toHaveBeenCalled();
    expect(response).toEqual({ type: 'next' });
  });

  it('should return next-intl response for public page', () => {
    const intlResponse = { type: 'intl-response' };
    intlMiddlewareMock.mockReturnValue(intlResponse);

    const response = proxy(createRequest('/pricing'));

    expect(intlMiddlewareMock).toHaveBeenCalledTimes(1);
    expect(nextResponseNextMock).not.toHaveBeenCalled();
    expect(nextResponseRedirectMock).not.toHaveBeenCalled();
    expect(response).toBe(intlResponse);
  });

  it('should redirect unauthenticated user from localized dashboard to localized login and preserve search params', () => {
    const response = proxy(createRequest('/en/dashboard', { search: '?_rsc=abc123' }));

    expect(intlMiddlewareMock).toHaveBeenCalledTimes(1);
    expect(nextResponseRedirectMock).toHaveBeenCalledTimes(1);
    expect(response).toEqual({
      type: 'redirect',
      url: 'https://example.com/en/login?_rsc=abc123',
    });
  });

  it('should redirect authenticated user from auth page to dashboard with default locale', () => {
    const response = proxy(
      createRequest('/login', {
        accessToken: 'token',
        search: '?from=register',
      }),
    );

    expect(intlMiddlewareMock).toHaveBeenCalledTimes(1);
    expect(nextResponseRedirectMock).toHaveBeenCalledTimes(1);
    expect(response).toEqual({
      type: 'redirect',
      url: 'https://example.com/ru/dashboard?from=register',
    });
  });
});
