"use client";

import * as React from "react";
import { useMachine } from "@xstate/react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { sessionApi } from "@/entities/session/api/session.api";
import { authMachine } from "@/entities/session/model/auth.machine";
import {
  ForgotPasswordFormData,
  LoginFormData,
  RegisterFormData,
  ResetPasswordFormData,
} from "@/features/auth-by-email/model/auth-by-email.schemas";

type AuthApiError = {
  status?: number;
  error?: string;
  retryAfter?: number;
};

const DASHBOARD_ROUTE = "/dashboard";
const LOGIN_ROUTE = "/login";

function isRateLimited(error: AuthApiError) {
  return (
    error.status === 429 ||
    error.error === "too many requests" ||
    error.error === "too many reset requests"
  );
}

function getAuthErrorKey(error: AuthApiError, fallbackKey: string) {
  if (isRateLimited(error)) {
    return "rate_limited";
  }

  if (error.status === 503 || error.error === "backend_unavailable") {
    return "backend_unavailable";
  }

  if (error.error === "invalid credentials") {
    return "invalid_credentials";
  }

  return error.error || fallbackKey;
}

export function useAuthByEmail() {
  const router = useRouter();
  const [state, send] = useMachine(authMachine);

  // Используем React Query для кэширования результата health check
  // Таким образом, даже при переходе между страницами авторизации,
  // запрос не будет отправляться повторно, пока не истечет staleTime (в providers.tsx он установлен на 1 минуту)
  const {
    data: isBackendAvailable = true,
    isLoading: isCheckingBackend,
    refetch: refetchHealth,
  } = useQuery({
    queryKey: ["backend-health"],
    queryFn: async () => {
      try {
        return await sessionApi.health();
      } catch {
        return false;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  const error =
    state.context.error ||
    (!isCheckingBackend && !isBackendAvailable ? "backend_unavailable" : null);

  const checkBackendHealth = React.useCallback(async () => {
    const { data } = await refetchHealth();
    return data ?? false;
  }, [refetchHealth]);

  const login = async (data: LoginFormData) => {
    const backendAvailable = await checkBackendHealth();

    if (!backendAvailable) {
      return;
    }

    send({ type: "SUBMIT" });

    try {
      const { user } = await sessionApi.login(data);
      send({ type: "SUCCESS", user });
      router.push(DASHBOARD_ROUTE);
    } catch (rawError) {
      const error = rawError as AuthApiError;

      if (isRateLimited(error)) {
        send({ type: "RATE_LIMITED", retryAfter: error.retryAfter || 60 });
        return;
      }

      send({
        type: "FAILURE",
        error: getAuthErrorKey(error, "login_failed"),
      });
    }
  };

  const register = async (data: RegisterFormData) => {
    const backendAvailable = await checkBackendHealth();

    if (!backendAvailable) {
      return;
    }

    send({ type: "SUBMIT" });

    try {
      const { user } = await sessionApi.register(data);
      send({ type: "SUCCESS", user });
      router.push(DASHBOARD_ROUTE);
    } catch (rawError) {
      const error = rawError as AuthApiError;

      if (isRateLimited(error)) {
        send({ type: "RATE_LIMITED", retryAfter: error.retryAfter || 60 });
        return;
      }

      send({
        type: "FAILURE",
        error: getAuthErrorKey(error, "registration_failed"),
      });
    }
  };

  const logout = async () => {
    await sessionApi.logout();
    send({ type: "LOGOUT" });
    router.push(LOGIN_ROUTE);
  };

  const requestPasswordReset = async (data: ForgotPasswordFormData) => {
    const backendAvailable = await checkBackendHealth();

    if (!backendAvailable) {
      return false;
    }

    send({ type: "SUBMIT" });

    try {
      await sessionApi.requestPasswordReset(data);
      send({ type: "FAILURE", error: "" });
      return true;
    } catch (rawError) {
      const error = rawError as AuthApiError;

      if (isRateLimited(error)) {
        send({ type: "RATE_LIMITED", retryAfter: error.retryAfter || 60 });
      } else {
        send({
          type: "FAILURE",
          error: getAuthErrorKey(error, "password_reset_request_failed"),
        });
      }

      return false;
    }
  };

  const resetPassword = async (
    data: ResetPasswordFormData & { token: string },
  ) => {
    const backendAvailable = await checkBackendHealth();

    if (!backendAvailable) {
      return;
    }

    send({ type: "SUBMIT" });

    try {
      const { user } = await sessionApi.resetPassword(data);
      send({ type: "SUCCESS", user });
      router.push(DASHBOARD_ROUTE);
    } catch (rawError) {
      const error = rawError as AuthApiError;

      if (isRateLimited(error)) {
        send({ type: "RATE_LIMITED", retryAfter: error.retryAfter || 60 });
        return;
      }

      send({
        type: "FAILURE",
        error: getAuthErrorKey(error, "password_reset_failed"),
      });
    }
  };

  return {
    state,
    login,
    register,
    logout,
    requestPasswordReset,
    resetPassword,
    checkBackendHealth,
    isBackendAvailable,
    isCheckingBackend,
    isLoading: state.matches("submitting"),
    isSuccess: state.matches("authenticated"),
    error,
    retryAfter: state.context.retryAfter,
  };
}
