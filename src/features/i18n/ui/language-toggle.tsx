'use client';

import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter, usePathname } from '@/shared/lib/i18n/navigation';
import { cn } from '@/shared/lib/utils';

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const newLocale = locale === 'ru' ? 'en' : 'ru';
    
    startTransition(() => {
      // router.replace from next-intl/navigation handles the locale switch seamlessly
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border shadow-sm",
        "bg-white hover:bg-muted text-foreground border-border",
        "hover:shadow animate-in fade-in duration-300 disabled:opacity-50"
      )}
    >
      {isPending ? (
        <Loader2 className="w-3 h-3 animate-spin text-primary" />
      ) : (
        <>
          <span className={cn(locale === 'ru' && "text-primary")}>RU</span>
          <span className="text-muted-foreground">|</span>
          <span className={cn(locale === 'en' && "text-primary")}>EN</span>
        </>
      )}
    </button>
  );
}
