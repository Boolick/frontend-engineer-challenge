import { LoginFormData, RegisterFormData, ForgotPasswordFormData, ResetPasswordFormData, User } from '@/entities/session/model/types';

export const authApi = {
  login: async (data: LoginFormData): Promise<{ user: User }> => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result;
  },

  register: async (data: RegisterFormData): Promise<{ user: User }> => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result;
  },

  logout: async (): Promise<void> => {
    await fetch('/api/auth/logout', { method: 'POST' });
  },

  requestPasswordReset: async (data: ForgotPasswordFormData): Promise<void> => {
    const response = await fetch('/api/auth/password-reset/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const result = await response.json();
      throw result;
    }
  },

  resetPassword: async (data: ResetPasswordFormData & { token: string }): Promise<{ user: User }> => {
    const response = await fetch('/api/auth/password-reset/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result;
  },
};
