"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-button)] text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 overflow-hidden active:scale-[0.98] active:transition-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 active:bg-primary/80 after:absolute after:inset-0 after:z-[-1] after:block after:bg-white/20 after:opacity-0 hover:after:opacity-100 active:after:opacity-0 after:transition-opacity after:duration-300 disabled:bg-primary/50 disabled:shadow-none",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:bg-destructive/80 after:absolute after:inset-0 after:z-[-1] after:block after:bg-white/20 after:opacity-0 hover:after:opacity-100 active:after:opacity-0 after:transition-opacity after:duration-300 disabled:bg-destructive/50",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground active:bg-accent/80 disabled:bg-muted disabled:text-muted-foreground disabled:border-muted",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 active:bg-secondary/70 after:absolute after:inset-0 after:z-[-1] after:block after:bg-white/20 after:opacity-0 hover:after:opacity-100 active:after:opacity-0 after:transition-opacity after:duration-300 disabled:bg-secondary/50",
        ghost:
          "hover:bg-accent hover:text-accent-foreground active:bg-accent/80 disabled:text-muted-foreground",
        link: "text-primary underline-offset-4 hover:underline active:text-primary/80 disabled:text-primary/50",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 px-3",
        lg: "h-12 px-8",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
          </span>
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
