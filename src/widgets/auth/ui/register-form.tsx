'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { registerSchema, RegisterFormData } from '@/entities/session/model/types';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { FloatingInput } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';

export function RegisterForm() {
  const { register: registerUser, isLoading, error } = useAuth();
  
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FloatingInput
        {...register('email')}
        label="Email address"
        type="email"
        error={errors.email?.message}
        autoComplete="email"
      />
      <FloatingInput
        {...register('password')}
        label="Password"
        type="password"
        error={errors.password?.message}
        autoComplete="new-password"
      />
      <FloatingInput
        {...register('confirmPassword')}
        label="Confirm password"
        type="password"
        error={errors.confirmPassword?.message}
        autoComplete="new-password"
      />
      
      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {error}
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full h-12 text-base font-semibold" 
        isLoading={isLoading}
      >
        Create account
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </form>
  );
}
