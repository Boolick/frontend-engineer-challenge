'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import {
  registerSchema,
  RegisterFormData,
} from '@/features/auth-by-email/model/auth-by-email.schemas';
import { useAuthByEmail } from '@/features/auth-by-email/model/use-auth-by-email';
import { AuthFeedback } from '@/features/auth-by-email/ui/auth-feedback';
import { Link } from '@/shared/lib/i18n/navigation';
import { Button } from '@/shared/ui/button';
import { FloatingInput } from '@/shared/ui/input';

export function RegisterForm() {
  const t = useTranslations('auth.register');
  const { register: registerUser, isLoading, error, retryAfter } = useAuthByEmail();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    registerUser(data);
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
