"use client";

import * as React from "react";
import { useMachine } from "@xstate/react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { sessionApi } from "@/entities/session/api/session.api";
import { authMachine } from "@/entities/session/model/auth.machine";
import { useGlobalError } from "@/app/providers";
import { cookies as clientCookies } from "@/shared/lib/cookie";
import {
  type AppErrorCode,
  classifyError,
  createClientError,
} from "@/entities/error/model/error.types";
import {
  ForgotPasswordFormData,
  LoginFormData,
  RegisterFormData,
  ResetPasswordFormData,
} from "@/features/auth-by-email/model/auth-by-email.schemas";

/** Shape returned by BFF route handlers on error */
type BffError = {
  code?: AppErrorCode;
  message?: string;
  retryAfter?: number;
  status?: number;
  // Legacy field support
  error?: string;
};

const DASHBOARD_ROUTE = "/dashboard";
const LOGIN_ROUTE = "/login";
const RATE_LIMIT_COOKIE = "auth_rate_limit_expiry";

export function useAuthByEmail() {
  const router = useRouter();
  const [state, send] = useMachine(authMachine);
  const { pushError } = useGlobalError();

  // Sync rate limit from cookie on mount (handles refresh/navigation/i18n switch)
  React.useEffect(() => {
    const expiry = clientCookies.get(RATE_LIMIT_COOKIE);
    if (!expiry) return;

    const remainingMs = parseInt(expiry, 10) - Date.now();
    const remainingSec = Math.ceil(remainingMs / 1000);

    if (remainingSec > 0) {
      send({ type: "RATE_LIMITED", retryAfter: remainingSec });
    } else {
      clientCookies.remove(RATE_LIMIT_COOKIE);
    }
  }, [send]);

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

  /**
   * Routes a BFF error to the right destination:
   * - field errors → authMachine (inline under form)
   * - toast/banner → global errorMachine
   */
  const handleError = React.useCallback(
    (raw: BffError, fallbackCode: AppErrorCode) => {
      const code = raw.code ?? (raw.error as AppErrorCode) ?? fallbackCode;
      const severity = classifyError(code);

      if (code === "rate_limited") {
        send({ type: "RATE_LIMITED", retryAfter: raw.retryAfter || 60 });
        pushError(createClientError(code, raw.message, raw.retryAfter));
        return;
      }

      if (severity === "field") {
        send({ type: "FAILURE", error: code });
      } else {
        send({ type: "FAILURE", error: code });
        pushError(createClientError(code, raw.message));
      }
    },
    [send, pushError],
  );

  const login = async (data: LoginFormData) => {
    const backendAvailable = await checkBackendHealth();
    if (!backendAvailable) return;

    send({ type: "SUBMIT" });

    try {
      const { user } = await sessionApi.login(data);
      send({ type: "SUCCESS", user });
      router.push(DASHBOARD_ROUTE);
    } catch (rawError) {
      handleError(rawError as BffError, "invalid_credentials");
    }
  };

  const register = async (data: RegisterFormData) => {
    const backendAvailable = await checkBackendHealth();
    if (!backendAvailable) return;

    send({ type: "SUBMIT" });

    try {
      const { user } = await sessionApi.register(data);
      send({ type: "SUCCESS", user });
      router.push(DASHBOARD_ROUTE);
    } catch (rawError) {
      handleError(rawError as BffError, "unknown_error");
    }
  };

  const logout = async () => {
    await sessionApi.logout();
    send({ type: "LOGOUT" });
    router.push(LOGIN_ROUTE);
  };

  const requestPasswordReset = async (data: ForgotPasswordFormData) => {
    const backendAvailable = await checkBackendHealth();
    if (!backendAvailable) return false;

    send({ type: "SUBMIT" });

    try {
      await sessionApi.requestPasswordReset(data);
      send({ type: "FAILURE", error: "" });
      return true;
    } catch (rawError) {
      handleError(rawError as BffError, "unknown_error");
      return false;
    }
  };

  const resetPassword = async (
    data: ResetPasswordFormData & { token: string },
  ) => {
    const backendAvailable = await checkBackendHealth();
    if (!backendAvailable) return;

    send({ type: "SUBMIT" });

    try {
      const { user } = await sessionApi.resetPassword(data);
      send({ type: "SUCCESS", user });
      router.push(DASHBOARD_ROUTE);
    } catch (rawError) {
      handleError(rawError as BffError, "unknown_error");
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

