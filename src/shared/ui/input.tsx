"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { cn } from "@/shared/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FloatingInput = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      type,
      value,
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const t = useTranslations("auth.errors");
    const localizedError = error && t.has(error) ? t(error) : error;

    return (
      <div className="relative w-full group pb-5">
        <div
          className={cn(
            "floating-label-input relative border-b transition-colors py-2 bg-transparent",
            error
              ? "border-destructive text-destructive"
              : "border-input focus-within:border-primary text-foreground",
            className,
          )}
        >
          <input
            {...props}
            ref={ref}
            type={type}
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            className="peer block w-full bg-transparent border-0 px-0 py-1 text-foreground focus:ring-0 sm:text-sm placeholder-transparent outline-none z-10 relative"
            placeholder={label}
          />
          <label
            className={cn(
              "absolute top-2 -z-0 origin-[0] -translate-y-6 scale-75 transform duration-300 pointer-events-none",
              "peer-placeholder-shown:translate-y-1 peer-placeholder-shown:scale-100",
              "peer-focus:-translate-y-6 peer-focus:scale-75",
              error
                ? "text-destructive"
                : "text-muted-foreground peer-focus:text-primary",
            )}
          >
            {label}
          </label>
        </div>
        <AnimatePresence>
          {localizedError && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute bottom-1 left-0 text-[11px] text-destructive font-medium"
            >
              {localizedError}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  },
);
FloatingInput.displayName = "FloatingInput";

export { FloatingInput };
