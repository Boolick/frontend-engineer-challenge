"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMachine } from "@xstate/react";
import { errorMachine } from "@/entities/error/model/error.machine";
import { ErrorNotificationLayer } from "@/shared/ui/error/error-notification-layer";
import type { ClientError } from "@/entities/error/model/error.types";

type GlobalErrorContextValue = {
  notifications: ClientError[];
  pushError: (error: ClientError) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
};

const GlobalErrorContext = React.createContext<GlobalErrorContextValue | null>(
  null,
);

export function useGlobalError(): GlobalErrorContextValue {
  const ctx = React.useContext(GlobalErrorContext);
  if (!ctx) {
    throw new Error("useGlobalError must be used within <Providers>");
  }
  return ctx;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: false,
          },
        },
      }),
  );

  const [errorState, sendError] = useMachine(errorMachine);

  React.useEffect(() => {
    // Cold start mitigation: wake up the backend on mount
    fetch("/api/auth/health").catch(() => {});
  }, []);

  const errorContextValue = React.useMemo<GlobalErrorContextValue>(
    () => ({
      notifications: errorState.context.notifications,
      pushError: (error: ClientError) =>
        sendError({ type: "PUSH_ERROR", error }),
      dismiss: (id: string) => sendError({ type: "DISMISS", id }),
      dismissAll: () => sendError({ type: "DISMISS_ALL" }),
    }),
    [errorState.context.notifications, sendError],
  );

  return (
    <GlobalErrorContext.Provider value={errorContextValue}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ErrorNotificationLayer />
      </QueryClientProvider>
    </GlobalErrorContext.Provider>
  );
}

