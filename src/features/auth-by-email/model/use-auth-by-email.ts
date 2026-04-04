"use client";

import { useMachine } from "@xstate/react";
import { useRouter } from "next/navigation";
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

  if (error.error === "invalid credentials") {
    return "invalid_credentials";
  }

  return error.error || fallbackKey;
}

export function useAuthByEmail() {
  const router = useRouter();
  const [state, send] = useMachine(authMachine);

  const login = async (data: LoginFormData) => {
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
    isLoading: state.matches("submitting"),
    isSuccess: state.matches("authenticated"),
    error: state.context.error,
    retryAfter: state.context.retryAfter,
  };
}

