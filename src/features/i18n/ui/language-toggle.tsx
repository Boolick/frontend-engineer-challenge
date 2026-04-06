"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { useRouter, usePathname } from "@/shared/lib/i18n/navigation";
import { cn } from "@/shared/lib/utils";

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const newLocale = locale === "ru" ? "en" : "ru";

    startTransition(() => {
      // Использование scroll: false предотвращает сброс позиции скролла
      // router.replace from next-intl/navigation handles the locale switch seamlessly
      router.replace(pathname, { locale: newLocale, scroll: false });
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border shadow-sm",
        "bg-white hover:bg-muted text-foreground border-border",
        "hover:shadow animate-in fade-in duration-300 disabled:opacity-50",
      )}
    >
      {isPending ? (
        <Loader2 className="w-3 h-3 animate-spin text-foreground" />
      ) : (
        <>
          <span
            className={cn(
              "transition-colors",
              locale === "ru"
                ? "text-foreground font-bold"
                : "text-muted-foreground",
            )}
          >
            RU
          </span>
          <span className="text-muted-foreground/30">|</span>
          <span
            className={cn(
              "transition-colors",
              locale === "en"
                ? "text-foreground font-bold"
                : "text-muted-foreground",
            )}
          >
            EN
          </span>
        </>
      )}
    </button>
  );
}
