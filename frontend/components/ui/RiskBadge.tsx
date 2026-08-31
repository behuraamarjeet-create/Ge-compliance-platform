import { cn } from "@/lib/utils";

type RiskLevel = "Low" | "Medium" | "High" | "Critical";

const riskConfig: Record<RiskLevel, { className: string; icon: string }> = {
  Low: {
    className: "bg-green-50 text-green-700 border-green-200",
    icon: "↓",
  },
  Medium: {
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: "→",
  },
  High: {
    className: "bg-red-50 text-red-700 border-red-200",
    icon: "↑",
  },
  Critical: {
    className: "bg-red-100 text-red-800 border-red-300",
    icon: "⚠",
  },
};

interface RiskBadgeProps {
  risk: string;
  showIcon?: boolean;
}

export function RiskBadge({ risk, showIcon = true }: RiskBadgeProps) {
  const config = riskConfig[risk as RiskLevel] ?? {
    className: "bg-gray-100 text-gray-600 border-gray-200",
    icon: "-",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold border rounded-full",
        config.className
      )}
    >
      {showIcon && <span className="text-xs">{config.icon}</span>}
      {risk}
    </span>
  );
}
