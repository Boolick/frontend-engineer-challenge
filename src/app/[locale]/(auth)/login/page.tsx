import { getTranslations } from 'next-intl/server';
import { AuthLayout } from "@/widgets/auth/ui/auth-layout";
import { LoginForm } from '@/features/auth-by-email/ui/login-form';

export default async function LoginPage() {
  const t = await getTranslations('auth.login');

  return (
    <AuthLayout 
      title={t('title')} 
    >
      <LoginForm />
    </AuthLayout>
  );
}
