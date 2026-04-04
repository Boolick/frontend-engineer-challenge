import { getTranslations } from 'next-intl/server';
import { AuthLayout } from "@/widgets/auth/ui/auth-layout";
import { ForgotPasswordForm } from '@/features/auth-by-email/ui/forgot-password-form';

export default async function ForgotPasswordPage() {
  const t = await getTranslations('auth.forgot_password');

  return (
    <AuthLayout 
      title={t('title')} 
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
