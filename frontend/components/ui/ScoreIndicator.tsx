"use client";

import { getScoreColor } from "@/lib/utils";

interface ScoreIndicatorProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function ScoreIndicator({ score, size = "md", showLabel = true }: ScoreIndicatorProps) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const color = getScoreColor(clampedScore);

  // SVG arc parameters
  const sizeMap = {
    sm: { w: 72, cx: 36, cy: 36, r: 28, stroke: 5, fontSize: "text-lg", labelSize: "text-2xs" },
    md: { w: 100, cx: 50, cy: 50, r: 40, stroke: 6, fontSize: "text-2xl", labelSize: "text-xs" },
    lg: { w: 140, cx: 70, cy: 70, r: 56, stroke: 8, fontSize: "text-4xl", labelSize: "text-sm" },
  };

  const { w, cx, cy, r, stroke, fontSize, labelSize } = sizeMap[size];
  const circumference = 2 * Math.PI * r;
  // Only show 75% of circle (start top, end bottom-left)
  const arcLength = circumference * 0.75;
  const offset = arcLength - (clampedScore / 100) * arcLength;
  const rotation = -225; // start from bottom-left going clockwise

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: w, height: w }}>
        <svg width={w} height={w} viewBox={`0 0 ${w} ${w}`}>
          {/* Background track */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={stroke}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
            transform={`rotate(${rotation} ${cx} ${cy})`}
          />
          {/* Progress arc */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(${rotation} ${cx} ${cy})`}
            style={{ transition: "stroke-dashoffset 0.8s ease-out, stroke 0.3s ease" }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold leading-none`} style={{ fontSize: size === "lg" ? "2rem" : size === "md" ? "1.4rem" : "1rem", color }}>
            {clampedScore}
          </span>
          {showLabel && (
            <span className={`${labelSize} font-medium text-gray-400 mt-0.5`}>/ 100</span>
          )}
        </div>
      </div>
    </div>
  );
}
