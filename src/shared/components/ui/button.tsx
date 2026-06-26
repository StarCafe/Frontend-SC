"use client";

import * as React from "react";
import { cn } from "@/shared/utils/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

const variantClasses = {
  primary: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-strong)]",
  secondary: "bg-[var(--color-secondary)] text-white hover:opacity-90",
  ghost: "bg-transparent text-[var(--color-ink)] hover:bg-white/70",
  danger: "bg-[var(--color-danger)] text-white hover:opacity-90",
};

const sizeClasses = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-sm",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, ...props }, ref) => {
    const classes = cn(
      "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
      variantClasses[variant],
      sizeClasses[size],
      className,
    );

    if (asChild && React.isValidElement(props.children)) {
      const child = props.children as React.ReactElement<{ className?: string }>;

      return React.cloneElement(child, {
        className: cn(classes, child.props.className),
      });
    }

    return <button ref={ref} className={classes} {...props} />;
  },
);

Button.displayName = "Button";
