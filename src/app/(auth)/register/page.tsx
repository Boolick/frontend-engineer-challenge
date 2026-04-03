import { RegisterForm } from "@/widgets/auth/ui/register-form";
import { AuthLayout } from "@/widgets/auth/ui/auth-layout";

export default function RegisterPage() {
  return (
    <AuthLayout 
      title="Create an account" 
      description="Enter your details below to create your account"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
