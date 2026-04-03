'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/shared/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FloatingInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type, value, onChange, onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const hasValue = value !== undefined && value !== '';

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <div className="relative w-full group">
        <div className={cn(
          "relative flex items-center border rounded-lg transition-all duration-200 bg-background",
          isFocused ? "border-primary ring-1 ring-primary/20" : "border-input",
          error ? "border-destructive ring-destructive/20" : "",
          className
        )}>
          <input
            {...props}
            ref={ref}
            type={type}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="w-full px-4 pt-6 pb-2 text-sm bg-transparent outline-none placeholder-transparent"
            placeholder={label}
          />
          <motion.label
            initial={false}
            animate={{
              top: (isFocused || hasValue) ? '0.5rem' : '1.25rem',
              fontSize: (isFocused || hasValue) ? '0.75rem' : '0.875rem',
              color: error ? 'var(--color-destructive)' : (isFocused ? 'var(--color-primary)' : 'var(--color-muted-foreground)')
            }}
            className="absolute left-4 pointer-events-none transition-colors"
          >
            {label}
          </motion.label>
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-1 text-xs text-destructive font-medium"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
FloatingInput.displayName = 'FloatingInput';

export { FloatingInput };
