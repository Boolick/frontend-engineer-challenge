'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { loginSchema, LoginFormData } from '@/entities/session/model/types';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { FloatingInput } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';

export function LoginForm() {
  const { login, isLoading, error, retryAfter } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
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
        autoComplete="current-password"
      />
      
      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {error}
          {retryAfter && retryAfter > 0 && (
            <span className="ml-1 font-bold">
              Retry in {retryAfter}s
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-end">
        <Link 
          href="/forgot-password" 
          className="text-xs text-primary hover:underline font-medium"
        >
          Forgot password?
        </Link>
      </div>

      <Button 
        type="submit" 
        className="w-full h-12 text-base font-semibold" 
        isLoading={isLoading}
      >
        Sign in
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-primary hover:underline font-medium">
          Create account
        </Link>
      </p>
    </form>
  );
}
