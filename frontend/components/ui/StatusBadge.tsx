import { cn } from "@/lib/utils";

type StatusType =
  | "Pending"
  | "Processing"
  | "Verified"
  | "Rejected"
  | "Manual Review"
  | "Open"
  | "Closed"
  | "Awarded";

const statusConfig: Record<StatusType, { label: string; className: string; dot: string }> = {
  Pending: {
    label: "Pending",
    className: "bg-gray-100 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
  },
  Processing: {
    label: "Processing",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500 animate-pulse",
  },
  Verified: {
    label: "Verified",
    className: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-500",
  },
  Rejected: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
  "Manual Review": {
    label: "Manual Review",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  Open: {
    label: "Open",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  Closed: {
    label: "Closed",
    className: "bg-gray-100 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
  },
  Awarded: {
    label: "Awarded",
    className: "bg-purple-50 text-purple-700 border-purple-200",
    dot: "bg-purple-500",
  },
};

interface StatusBadgeProps {
  status: string;
  showDot?: boolean;
  size?: "xs" | "sm";
}

export function StatusBadge({ status, showDot = true, size = "sm" }: StatusBadgeProps) {
  const config = statusConfig[status as StatusType] ?? {
    label: status,
    className: "bg-gray-100 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium border rounded-full",
        size === "xs" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        config.className
      )}
    >
      {showDot && (
        <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", config.dot)} />
      )}
      {config.label}
    </span>
  );
}
