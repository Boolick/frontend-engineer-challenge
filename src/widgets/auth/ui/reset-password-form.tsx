'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { resetPasswordSchema, ResetPasswordFormData } from '@/entities/session/model/types';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { FloatingInput } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Suspense } from 'react';

function ResetPasswordFormInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { resetPassword, isLoading, error, retryAfter } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!token) return;
    resetPassword({ ...data, token });
  };

  if (!token) {
    return (
      <div className="p-4 rounded-xl bg-destructive/10 text-destructive font-medium text-center">
        Invalid or missing reset token. Please request a new link.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FloatingInput
        {...register('newPassword')}
        label="New Password"
        type="password"
        error={errors.newPassword?.message}
        autoComplete="new-password"
      />
      <FloatingInput
        {...register('confirmPassword')}
        label="Confirm New Password"
        type="password"
        error={errors.confirmPassword?.message}
        autoComplete="new-password"
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
        Set new password
      </Button>
    </form>
  );
}

export function ResetPasswordForm() {
  return (
    <Suspense fallback={<div className="h-32 flex items-center justify-center text-muted-foreground">Loading...</div>}>
      <ResetPasswordFormInner />
    </Suspense>
  );
}
