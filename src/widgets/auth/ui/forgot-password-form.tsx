'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/entities/session/model/types';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { FloatingInput } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import * as React from 'react';

export function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const { requestPasswordReset, isLoading, error, retryAfter } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const success = await requestPasswordReset(data);
    if (success) {
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center space-y-4">
        <div className="p-4 rounded-xl bg-primary/10 text-primary font-medium">
          Check your email for reset instructions
        </div>
        <Button asChild variant="outline" className="w-full">
          <Link href="/login">Back to login</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FloatingInput
        {...register('email')}
        label="Email address"
        type="email"
        error={errors.email?.message}
        autoComplete="email"
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

      <Button 
        type="submit" 
        className="w-full h-12 text-base font-semibold" 
        isLoading={isLoading}
      >
        Send reset link
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Remember your password?{' '}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </form>
  );
}
