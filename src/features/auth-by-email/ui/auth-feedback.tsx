'use client';

import { useTranslations } from 'next-intl';

type AuthFeedbackProps = {
  error?: string | null;
  retryAfter?: number | null;
};

export function AuthFeedback({ error, retryAfter }: AuthFeedbackProps) {
  const t = useTranslations('auth.errors');

  if (!error) {
    return null;
  }

  const message = t.has(error) ? t(error) : error;

  return (
    <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
      {message}
      {retryAfter && retryAfter > 0 ? (
        <span className="ml-1 font-semibold">
          {t('retry_in', { seconds: retryAfter })}
        </span>
      ) : null}
    </div>
  );
}
