"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, AlertTriangle, WifiOff } from "lucide-react";
import { useGlobalError } from "@/app/providers";
import type { ClientError } from "@/entities/error/model/error.types";

const AUTO_DISMISS_MS = 5000;

function getErrorIcon(code: ClientError["code"]) {
  switch (code) {
    case "backend_unavailable":
      return <WifiOff className="h-4 w-4 shrink-0" />;
    default:
      return <AlertTriangle className="h-4 w-4 shrink-0" />;
  }
}

function ErrorToast({
  error,
  onDismiss,
}: {
  error: ClientError;
  onDismiss: () => void;
}) {
  React.useEffect(() => {
    if (error.code === "backend_unavailable") return; // persistent — no auto-dismiss
    const timer = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [error.code, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      role="alert"
      aria-live={error.code === "backend_unavailable" ? "assertive" : "polite"}
      className="pointer-events-auto flex w-80 items-start gap-3 rounded-xl border border-red-500/20 bg-red-950/80 p-4 text-sm text-red-200 shadow-lg backdrop-blur-md"
    >
      {getErrorIcon(error.code)}
      <span className="flex-1">{error.message}</span>
      <button
        onClick={onDismiss}
        className="shrink-0 rounded p-0.5 transition-colors hover:bg-red-900/50"
        aria-label="Dismiss notification"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
}

export function ErrorNotificationLayer() {
  const { notifications, dismiss } = useGlobalError();

  if (notifications.length === 0) return null;

  return (
    <div
      aria-label="Notifications"
      className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-2"
    >
      <AnimatePresence mode="popLayout">
        {notifications.map((n) => (
          <ErrorToast
            key={n.id}
            error={n}
            onDismiss={() => dismiss(n.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
