"use client";

import * as React from "react";
import { buttonClasses } from "@/shared/components/ui/button-styles";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return <button ref={ref} className={buttonClasses({ className, variant, size })} {...props} />;
  },
);

Button.displayName = "Button";
