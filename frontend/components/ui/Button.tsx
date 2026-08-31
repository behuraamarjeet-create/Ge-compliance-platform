"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "ghost" | "outline" | "success" | "warning";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const variantClasses: Record<string, string> = {
  primary:
    "bg-navy-900 text-white hover:bg-navy-800 active:bg-navy-950 border border-navy-900/20 shadow-sm",
  secondary:
    "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-card",
  destructive:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 border border-red-600/20 shadow-sm",
  ghost:
    "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
  outline:
    "bg-transparent text-navy-900 border border-navy-200 hover:bg-navy-50",
  success:
    "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 border border-green-600/20 shadow-sm",
  warning:
    "bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 border border-amber-500/20 shadow-sm",
};

const sizeClasses: Record<string, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-4 py-2 text-sm rounded-lg gap-2",
  lg: "px-6 py-2.5 text-sm rounded-lg gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconPosition = "left",
  children,
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-150 select-none",
        "focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        icon && iconPosition === "left" && <span className="flex-shrink-0">{icon}</span>
      )}
      {children}
      {!loading && icon && iconPosition === "right" && (
        <span className="flex-shrink-0">{icon}</span>
      )}
    </button>
  );
}
