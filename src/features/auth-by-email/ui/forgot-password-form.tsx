'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import {
  forgotPasswordSchema,
  ForgotPasswordFormData,
} from '@/features/auth-by-email/model/auth-by-email.schemas';
import { useAuthByEmail } from '@/features/auth-by-email/model/use-auth-by-email';
import { AuthFeedback } from '@/features/auth-by-email/ui/auth-feedback';
import { Link } from '@/shared/lib/i18n/navigation';
import { Button } from '@/shared/ui/button';
import { FloatingInput } from '@/shared/ui/input';

export function ForgotPasswordForm() {
  const t = useTranslations('auth.forgot_password');
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const { requestPasswordReset, isLoading, error, retryAfter } = useAuthByEmail();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const success = await requestPasswordReset(data);

    if (success) {
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-4 text-center">
        <div className="rounded-3xl border border-primary/20 bg-primary/10 p-4 font-medium text-primary">
          {t('success_message')}
        </div>
        <Button asChild variant="outline" className="w-full">
          <Link href="/login">{t('back_to_login')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FloatingInput
        {...register('email')}
        label={t('email_label')}
        type="email"
        error={errors.email?.message}
        autoComplete="email"
      />

      <AuthFeedback error={error} retryAfter={retryAfter} />

      <Button
        type="submit"
        className="h-12 w-full text-base font-semibold"
        isLoading={isLoading}
        disabled={!!retryAfter}
      >
        {t('submit')}
      </Button>

      <div className="mt-6 flex flex-col items-center gap-6">
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t('login_prompt')}{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            {t('login_link')}
          </Link>
        </p>
      </div>
    </form>
  );
}
