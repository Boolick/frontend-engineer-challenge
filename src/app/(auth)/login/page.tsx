import { LoginForm } from "@/widgets/auth/ui/login-form";
import { AuthLayout } from "@/widgets/auth/ui/auth-layout";

export default function LoginPage() {
  return (
    <AuthLayout 
      title="Welcome back" 
      description="Enter your credentials to access your account"
    >
      <LoginForm />
    </AuthLayout>
  );
}
