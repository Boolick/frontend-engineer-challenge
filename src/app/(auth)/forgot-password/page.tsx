import { ForgotPasswordForm } from "@/widgets/auth/ui/forgot-password-form";
import { AuthLayout } from "@/widgets/auth/ui/auth-layout";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout 
      title="Reset password" 
      description="Enter your email address to reset your password"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
