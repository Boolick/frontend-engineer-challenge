'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import {
  loginSchema,
  LoginFormData,
} from '@/features/auth-by-email/model/auth-by-email.schemas';
import { useAuthByEmail } from '@/features/auth-by-email/model/use-auth-by-email';
import { AuthFeedback } from '@/features/auth-by-email/ui/auth-feedback';
import { Link } from '@/shared/lib/i18n/navigation';
import { Button } from '@/shared/ui/button';
import { FloatingInput } from '@/shared/ui/input';

export function LoginForm() {
  const t = useTranslations('auth.login');
  const { login, isLoading, isCheckingBackend, isBackendAvailable, error, retryAfter } =
    useAuthByEmail();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    await login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <FloatingInput
          {...register('email')}
          label={t('email_label')}
          type="email"
          error={errors.email?.message}
          autoComplete="email"
        />
        <FloatingInput
          {...register('password')}
          label={t('password_label')}
          type="password"
          error={errors.password?.message}
          autoComplete="current-password"
        />
      </div>

      <AuthFeedback error={error} retryAfter={retryAfter} />

      <Button
        type="submit"
        className="w-full text-base font-semibold"
        isLoading={isLoading || isCheckingBackend}
        disabled={!!retryAfter || !isBackendAvailable || isCheckingBackend}
      >
        {t('submit')}
      </Button>

      <div className="mt-6 flex flex-col items-center gap-6">
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-primary hover:underline"
        >
          {t('forgot_password')}
        </Link>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t('register_prompt')}{' '}
          <Link href="/register" className="font-medium text-primary hover:underline">
            {t('register_link')}
          </Link>
        </p>
      </div>
    </form>
  );
}
