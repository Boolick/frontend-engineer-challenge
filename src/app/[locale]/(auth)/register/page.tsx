import { getTranslations } from 'next-intl/server';
import { AuthLayout } from "@/widgets/auth/ui/auth-layout";
import { RegisterForm } from '@/features/auth-by-email/ui/register-form';

export default async function RegisterPage() {
  const t = await getTranslations('auth.register');

  return (
    <AuthLayout 
      title={t('title')} 
    >
      <RegisterForm />
    </AuthLayout>
  );
}
