import { getTranslations } from 'next-intl/server';
import { AuthLayout } from '@/widgets/auth/ui/auth-layout';
import { ResetPasswordForm } from '@/features/auth-by-email/ui/reset-password-form';

export default async function ResetPasswordPage() {
  const t = await getTranslations('auth.reset_password');

  return (
    <AuthLayout 
      title={t('title')} 
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}
