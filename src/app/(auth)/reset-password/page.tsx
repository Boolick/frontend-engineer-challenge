import { AuthLayout } from '@/widgets/auth/ui/auth-layout';
import { ResetPasswordForm } from '@/widgets/auth/ui/reset-password-form';

export default function ResetPasswordPage() {
  return (
    <AuthLayout 
      title="Set new password" 
      description="Please enter your new password below"
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}
