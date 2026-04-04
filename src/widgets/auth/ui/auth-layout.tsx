"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { cn } from "@/shared/lib/utils";
import { Layers } from "lucide-react";
import { LanguageToggle } from "@/features/i18n/ui/language-toggle";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function AuthLayout({
  children,
  title,
  description,
  className,
}: AuthLayoutProps) {
  const t = useTranslations("common");

  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-background">
      <section className="w-full lg:w-[45%] flex flex-col p-8 lg:p-16">
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/logo.svg"
              alt="Orbitto Logo"
              width={200}
              height={40}
              priority
            />
          </div>
          <div className="relative z-50">
            <LanguageToggle />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-[400px] w-full mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={cn("flex flex-col", className)}
          >
            <div className="flex flex-col space-y-2 mb-10 text-left">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                {title}
              </h1>
              {description && (
                <p className="text-sm text-muted-foreground mt-2">
                  {description}
                </p>
              )}
            </div>
            {children}
          </motion.div>
        </div>
      </section>

      <section className="hidden lg:flex w-[55%] bg-background-illustration relative items-center justify-center overflow-hidden">
        <div className="absolute w-32 h-32 bg-primary rounded-full blur-[40px] opacity-80 top-1/4 left-1/4" />
        <div className="absolute w-24 h-24 bg-primary rounded-full blur-[30px] opacity-70 bottom-[20%] right-[30%]" />
        <div className="absolute w-16 h-16 bg-primary rounded-full blur-[20px] opacity-60 top-[30%] right-[25%]" />
        <div
          className="absolute w-[450px] h-[450px] rounded-full bg-white/40 flex items-center justify-center"
          style={{
            backdropFilter: "blur(var(--backdrop-blur-glass))",
            borderColor: "var(--color-glass-border)",
            borderWidth: "1px",
            borderStyle: "solid",
          }}
        />
      </section>
    </main>
  );
}
