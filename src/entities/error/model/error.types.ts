/**
 * Client-safe error types.
 * Mirror of AppErrorCode from BFF, but importable on the client
 * (no server-only Next.js imports).
 */
export type AppErrorCode =
  | 'invalid_credentials'
  | 'user_already_exists'
  | 'rate_limited'
  | 'backend_unavailable'
  | 'validation_error'
  | 'invalid_token'
  | 'unknown_error';

export type ClientError = {
  id: string;
  code: AppErrorCode;
  message: string;
  timestamp: number;
  retryAfter?: number;
};

/** Severity determines how the error is displayed in the UI */
export type ErrorSeverity = 'field' | 'toast' | 'banner';

/** Which machine should handle this error code */
export function classifyError(code: AppErrorCode): ErrorSeverity {
  switch (code) {
    case 'invalid_credentials':
    case 'user_already_exists':
    case 'validation_error':
    case 'invalid_token':
      return 'field'; // Show inline under the form field

    case 'rate_limited':
      return 'toast'; // Show as a dismissable toast notification

    case 'backend_unavailable':
    case 'unknown_error':
      return 'banner'; // Show as a persistent global banner
  }
}

let errorCounter = 0;

export function createClientError(
  code: AppErrorCode,
  message?: string,
  retryAfter?: number,
): ClientError {
  const now = Date.now();
  return {
    id: `err_${now}_${++errorCounter}`,
    code,
    message: message ?? code,
    timestamp: now,
    retryAfter,
  };
}

