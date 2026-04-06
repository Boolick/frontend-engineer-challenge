import { NextResponse } from 'next/server';

/**
 * Canonical error codes returned to the client.
 * The client never sees raw backend error strings — only these codes.
 */
export type AppErrorCode =
  | 'invalid_credentials'
  | 'user_already_exists'
  | 'rate_limited'
  | 'backend_unavailable'
  | 'validation_error'
  | 'invalid_token'
  | 'unknown_error';

export type NormalizedError = {
  code: AppErrorCode;
  message: string;
  retryAfter?: number;
  status: number;
};

const ERROR_MAP: Record<string, AppErrorCode> = {
  'invalid credentials': 'invalid_credentials',
  'user already exists': 'user_already_exists',
  'email already registered': 'user_already_exists',
  'invalid token': 'invalid_token',
  'token expired': 'invalid_token',
  'too many requests': 'rate_limited',
  'too many reset requests': 'rate_limited',
};

/**
 * Maps any raw backend response into a canonical NormalizedError.
 * This is the SINGLE source of truth for error normalization in the project.
 */
export function mapBackendError(
  rawData: unknown,
  status: number,
  headers?: Headers,
): NormalizedError {
  const data = (rawData ?? {}) as Record<string, unknown>;
  const rawMsg = ((data.error ?? data.message ?? '') as string).toLowerCase();

  if (status === 429) {
    const retryAfterHeader = headers?.get('Retry-After');
    const retryAfter =
      (data.retryAfter as number) ??
      (retryAfterHeader ? parseInt(retryAfterHeader, 10) : 60);

    return {
      code: 'rate_limited',
      message: rawMsg || 'too many requests',
      retryAfter,
      status,
    };
  }

  const mapped = ERROR_MAP[rawMsg];
  if (mapped) {
    return { code: mapped, message: rawMsg, status };
  }

  if (status === 401) {
    return { code: 'invalid_credentials', message: rawMsg, status };
  }

  if (status === 409) {
    return { code: 'user_already_exists', message: rawMsg, status };
  }

  if (status === 400 || status === 422) {
    return { code: 'validation_error', message: rawMsg, status };
  }

  if (status >= 500) {
    return { code: 'backend_unavailable', message: rawMsg, status };
  }

  return { code: 'unknown_error', message: rawMsg || 'unexpected error', status };
}

export function errorResponse(normalized: NormalizedError): NextResponse {
  const response = NextResponse.json(normalized, { status: normalized.status });

  if (normalized.code === 'rate_limited' && normalized.retryAfter) {
    const expiry = Date.now() + normalized.retryAfter * 1000;
    response.cookies.set('auth_rate_limit_expiry', expiry.toString(), {
      maxAge: normalized.retryAfter,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  }

  return response;
}

