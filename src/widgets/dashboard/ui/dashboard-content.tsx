"use client";

import Image from "next/image";
import { LogOut, User, ShieldCheck, Layers, Cpu, Send, Mail, CheckCircle2 } from "lucide-react";
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
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Добро пожаловать в систему!</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Это небольшая "пасхалка" в рамках челленджа. Так как дашборд не был строгим требованием ТЗ, 
            я решил использовать его чтобы коротко подсветить решения, примененные под капотом, и оставить свои контакты.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* Card 1: FSD */}
          <div className="rounded-xl border bg-background p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-accent p-3 text-accent-foreground">
                <Layers className="h-6 w-6" />
              </div>
              <CheckCircle2 className="h-5 w-5 text-muted-foreground/30" />
            </div>
            <h3 className="mb-2 font-semibold text-foreground">Архитектура FSD</h3>
            <p className="text-sm text-muted-foreground">
              Строгое следование Feature-Sliced Design. Отказ от свалки в <code>components/</code> в пользу 
              изолированных слоев (entities, features, widgets) для надежного масштабирования проекта.
            </p>
          </div>

          {/* Card 2: XState */}
          <div className="rounded-xl border bg-background p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-accent p-3 text-accent-foreground">
                <Cpu className="h-6 w-6" />
              </div>
              <CheckCircle2 className="h-5 w-5 text-muted-foreground/30" />
            </div>
            <h3 className="mb-2 font-semibold text-foreground">XState Automata</h3>
            <p className="text-sm text-muted-foreground">
              Авторизация и Rate Limiting (с таймером) управляются строгими конечными автоматами. 
              Это исключает неконсистентные UI-состояния вроде одновременного <code>isLoading</code> и <code>isError</code>.
            </p>
          </div>

          {/* Card 3: BFF */}
          <div className="rounded-xl border bg-background p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-accent p-3 text-accent-foreground">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <CheckCircle2 className="h-5 w-5 text-muted-foreground/30" />
            </div>
            <h3 className="mb-2 font-semibold text-foreground">BFF & Security</h3>
            <p className="text-sm text-muted-foreground">
              Прямые запросы на Go-сервер скрыты за слоем Next.js Route Handlers. 
              Токены живут только в <code>HttpOnly</code> куках, защищая фронтенд от XSS атак.
            </p>
          </div>

          {/* Card 4: Contact info (easter egg) */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 shadow-sm ring-1 ring-primary/10 transition-all hover:-translate-y-1 hover:bg-primary/10">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-primary/20 p-3 text-primary">
                <User className="h-6 w-6" />
              </div>
            </div>
            <h3 className="mb-2 font-semibold text-foreground">Связь со мной</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Александр. <br />
              Спасибо за крутой инженерный челлендж! Буду рад обсудить решения и дальнейшие шаги.
            </p>
            <div className="flex flex-col gap-3">
              <a 
                href="https://t.me/AlexanderBullo" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center text-sm font-medium text-primary hover:text-primary/80 hover:underline"
              >
                <Send className="mr-2 h-4 w-4" />
                @AlexanderBullo
              </a>
              <a 
                href="mailto:your_email@example.com" 
                className="flex items-center text-sm font-medium text-foreground hover:text-primary hover:underline"
              >
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                bulloalexander77@gmail.com
              </a>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
