"use client";

import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hoverable?: boolean;
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function Card({ children, className, padding = "md", hoverable = false }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-100 shadow-card",
        hoverable && "transition-shadow duration-200 hover:shadow-card-hover cursor-pointer",
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, className }: CardHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between mb-4", className)}>
      <div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  color?: "default" | "green" | "amber" | "red" | "blue" | "purple";
  icon?: React.ReactNode;
}

const metricColors = {
  default: "text-gray-900",
  green: "text-green-700",
  amber: "text-amber-700",
  red: "text-red-600",
  blue: "text-blue-700",
  purple: "text-purple-700",
};

export function MetricCard({ label, value, subValue, color = "default", icon }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-card p-4 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        {icon && <span className="text-gray-400">{icon}</span>}
      </div>
      <div className={cn("text-2xl font-bold leading-tight", metricColors[color])}>{value}</div>
      {subValue && <div className="text-xs text-gray-400">{subValue}</div>}
    </div>
  );
}
