"use client";

import Image from "next/image";
import { LayoutDashboard, LogOut, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAuthByEmail } from "@/features/auth-by-email/model/use-auth-by-email";
import { Button } from "@/shared/ui/button";

export function DashboardContent() {
  const t = useTranslations("dashboard");
  const { logout, isLoading } = useAuthByEmail();

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="flex h-16 items-center justify-between border-b bg-background px-8">
        <div className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Orbitto Logo"
            width={200}
            height={40}
            priority
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          isLoading={isLoading}
          className="text-muted-foreground hover:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t("sign_out")}
        </Button>
      </header>

      <main className="mx-auto max-w-7xl p-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border bg-background p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3 text-primary">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">{t("profile_status")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("auth_status")}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-3/4 bg-primary" />
              </div>
              <p className="text-right text-xs text-muted-foreground">
                {t("completion")}
              </p>
            </div>
          </div>

          {[1, 2].map((item) => (
            <div
              key={item}
              className="rounded-xl border bg-background p-6 opacity-50 shadow-sm"
            >
              <div className="mb-4 h-6 w-32 rounded bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-2/3 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
