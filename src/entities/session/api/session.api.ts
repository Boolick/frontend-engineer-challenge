import { User } from "@/entities/session/model/types";

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  email: string;
  password: string;
  confirmPassword: string;
};

type ForgotPasswordPayload = {
  email: string;
};

type ResetPasswordPayload = {
  newPassword: string;
  confirmPassword: string;
  token: string;
};

export const sessionApi = {
  health: async (): Promise<boolean> => {
    const response = await fetch("/api/auth/health", {
      cache: "no-store",
    });

    const result = await response.json().catch(() => ({}));

    return response.ok && result.status === "ok";
  },

  login: async (data: LoginPayload): Promise<{ user: User }> => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw { ...result, status: response.status };
    }

    return result;
  },

  register: async (data: RegisterPayload): Promise<{ user: User }> => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw { ...result, status: response.status };
    }

    return result;
  },

  logout: async (): Promise<void> => {
    await fetch("/api/auth/logout", { method: "POST" });
  },

  requestPasswordReset: async (data: ForgotPasswordPayload): Promise<void> => {
    const response = await fetch("/api/auth/password-reset/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const result = await response.json();
      throw { ...result, status: response.status };
    }
  },

  resetPassword: async (
    data: ResetPasswordPayload,
  ): Promise<{ user: User }> => {
    const response = await fetch("/api/auth/password-reset/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw { ...result, status: response.status };
    }

    return result;
  },
};
