'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import {
  resetPasswordSchema,
  ResetPasswordFormData,
} from '@/features/auth-by-email/model/auth-by-email.schemas';
import { useAuthByEmail } from '@/features/auth-by-email/model/use-auth-by-email';
import { AuthFeedback } from '@/features/auth-by-email/ui/auth-feedback';
import { Button } from '@/shared/ui/button';
import { FloatingInput } from '@/shared/ui/input';
import { Link } from '@/shared/lib/i18n/navigation';

function ResetPasswordFormInner() {
  const t = useTranslations('auth.reset_password');
  const errorTranslations = useTranslations('auth.errors');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { resetPassword, isLoading, error, retryAfter, isSuccess } = useAuthByEmail();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!token) {
      return;
    }

    resetPassword({ ...data, token });
  };

  if (isSuccess) {
    return (
      <div className="space-y-4 text-center">
        <div className="rounded-3xl border border-primary/20 bg-primary/10 p-4 font-medium text-primary">
          {t('success_message')}
        </div>
        <Button asChild className="w-full">
          <Link href="/login">{t('login_link')}</Link>
        </Button>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="rounded-3xl border border-destructive/20 bg-destructive/10 p-4 text-center text-sm font-medium text-destructive">
        {errorTranslations('invalid_reset_token')}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <FloatingInput
          {...register('newPassword')}
          label={t('password_label')}
          type="password"
          error={errors.newPassword?.message}
          autoComplete="new-password"
        />
        <FloatingInput
          {...register('confirmPassword')}
          label={t('confirm_password_label')}
          type="password"
          error={errors.confirmPassword?.message}
          autoComplete="new-password"
        />
      </div>

      <AuthFeedback error={error} retryAfter={retryAfter} />

      <Button
        type="submit"
        className="w-full text-base font-semibold"
        isLoading={isLoading}
        disabled={!!retryAfter}
      >
        {t('submit')}
      </Button>
    </form>
  );
}

export function ResetPasswordForm() {
  const t = useTranslations('common');

  return (
    <Suspense
      fallback={
        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
          {t('loading')}
        </div>
      }
    >
      <ResetPasswordFormInner />
    </Suspense>
  );
}
