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
      <section className="w-full lg:w-[45%] flex flex-col px-8 pb-8 pt-4 lg:px-16 lg:pb-16 lg:pt-4">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/logo.svg"
              alt="Orbitto Logo"
              width={200}
              height={40}
              loading="eager"
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/auth-illustration.svg"
          alt="Authentication Illustration"
          width={512}
          height={480}
          className="w-full max-w-[512px] h-auto relative z-10"
          fetchPriority="high"
          decoding="async"
        />
      </section>
    </main>
  );
}
