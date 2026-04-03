"use client";

import { useMachine } from "@xstate/react";
import { useRouter } from "next/navigation";
import { authMachine } from "@/features/auth/model/auth.machine";
import { authApi } from "@/shared/api/auth";
import {
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
} from "@/entities/session/model/types";

export function useAuth() {
  const router = useRouter();
  const [state, send] = useMachine(authMachine);

  const login = async (data: LoginFormData) => {
    send({ type: "SUBMIT" });
    try {
      const { user } = await authApi.login(data);
      send({ type: "SUCCESS", user });
      router.push("/dashboard");
    } catch (error: any) {
      if (error.status === 429) {
        send({ type: "RATE_LIMITED", retryAfter: error.retryAfter || 60 });
      } else {
        send({ type: "FAILURE", error: error.error || "Login failed" });
      }
    }
  };

  const register = async (data: RegisterFormData) => {
    send({ type: "SUBMIT" });
    try {
      const { user } = await authApi.register(data);
      send({ type: "SUCCESS", user });
      router.push("/dashboard");
    } catch (error: any) {
      if (error.status === 429) {
        send({ type: "RATE_LIMITED", retryAfter: error.retryAfter || 60 });
      } else {
        send({ type: "FAILURE", error: error.error || "Registration failed" });
      }
    }
  };

  const logout = async () => {
    await authApi.logout();
    send({ type: "LOGOUT" });
    router.push("/login");
  };

  const requestPasswordReset = async (data: ForgotPasswordFormData) => {
    send({ type: "SUBMIT" });
    try {
      await authApi.requestPasswordReset(data);
      send({ type: "FAILURE", error: "" }); // Just to reset submitting state, UI handles success
      return true;
    } catch (error: any) {
      if (error.status === 429) {
        send({ type: "RATE_LIMITED", retryAfter: error.retryAfter || 60 });
      } else {
        send({
          type: "FAILURE",
          error: error.error || "Failed to request reset",
        });
      }
      return false;
    }
  };

  const resetPassword = async (
    data: ResetPasswordFormData & { token: string },
  ) => {
    send({ type: "SUBMIT" });
    try {
      const { user } = await authApi.resetPassword(data);
      send({ type: "SUCCESS", user });
      router.push("/dashboard");
    } catch (error: any) {
      if (error.status === 429) {
        send({ type: "RATE_LIMITED", retryAfter: error.retryAfter || 60 });
      } else {
        send({
          type: "FAILURE",
          error: error.error || "Failed to reset password",
        });
      }
    }
  };

  return {
    state,
    login,
    register,
    logout,
    requestPasswordReset,
    resetPassword,
    isLoading: state.matches("submitting"),
    error: state.context.error,
    retryAfter: state.context.retryAfter,
  };
}

