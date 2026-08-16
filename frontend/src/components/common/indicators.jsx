import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const toneStyles = {
  neutral: "bg-surface-hover text-muted-foreground border border-border",
  primary: "bg-accent-subtle text-accent border border-accent/15",
  success: "bg-success-bg text-success border border-success/15",
  warning: "bg-warning-bg text-warning border border-warning/15",
  danger: "bg-danger-bg text-destructive border border-danger/15",
  info: "bg-info-bg text-info border border-info/15",
  ai: "bg-accent-subtle text-accent border border-accent/20",
};

export function StatusBadge({ children, tone = "neutral", className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12px] font-medium leading-4 tracking-[0.01em] transition-colors",
        toneStyles[tone] || toneStyles.neutral,
        className,
      )}
    >
      {children}
    </span>
  );
}

const skillTone = {
  strong: "success",
  moderate: "warning",
  missing: "danger",
};

export function SkillBadge({ name, level }) {
  const symbol = level === "strong" ? "✓" : level === "moderate" ? "⚠" : "✕";
  return (
    <StatusBadge tone={skillTone[level]}>
      <span aria-hidden className="font-mono text-[11px] font-semibold">
        {symbol}
      </span>
      <span>{name}</span>
      <span className="sr-only">{level}</span>
    </StatusBadge>
  );
}

export function MatchSkillBadge({ skill, status }) {
  const level = status === "matched" ? "strong" : status === "partial" ? "moderate" : "missing";
  return <SkillBadge name={skill} level={level} />;
}

export function SeverityBadge({ severity }) {
  const map = {
    critical: { tone: "danger", label: "Critical" },
    improve: { tone: "warning", label: "Needs improvement" },
    good: { tone: "success", label: "Good" },
  };
  const item = map[severity] || map.improve;
  return <StatusBadge tone={item.tone}>{item.label}</StatusBadge>;
}

export const applicationStatusMeta = {
  saved: { label: "Saved", tone: "neutral" },
  applied: { label: "Applied", tone: "primary" },
  interview: { label: "Interview", tone: "warning" },
  offer: { label: "Offer", tone: "success" },
  rejected: { label: "Rejected", tone: "danger" },
};

export function AiLabel({ children = "AI Suggestion" }) {
  return (
    <StatusBadge tone="ai">
      <Sparkles className="size-3.5" aria-hidden />
      <span>{children}</span>
    </StatusBadge>
  );
}

export function ProgressBar({ value, tone = "primary", label, className }) {
  const [mountedWidth, setMountedWidth] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMountedWidth(Math.min(100, Math.max(0, value)));
    }, 50);
    return () => clearTimeout(timeout);
  }, [value]);

  const fill =
    tone === "success"
      ? "bg-success"
      : tone === "warning"
        ? "bg-warning"
        : tone === "danger"
          ? "bg-destructive"
          : "bg-accent";

  return (
    <div
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-surface-hover border border-border/50",
        className,
      )}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "Progress"}
    >
      <div
        className={cn("h-full rounded-full transition-[width] duration-400 ease-out", fill)}
        style={{ width: `${mountedWidth}%` }}
      />
    </div>
  );
}

export function ProgressRing({ value, size = 96, label, caption }) {
  const stroke = 7;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const [mountedOffset, setMountedOffset] = useState(circumference);

  useEffect(() => {
    const targetOffset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;
    const timeout = setTimeout(() => {
      setMountedOffset(targetOffset);
    }, 80);
    return () => clearTimeout(timeout);
  }, [value, circumference]);

  return (
    <div className="relative flex flex-col items-center">
      <svg
        width={size}
        height={size}
        role="img"
        aria-label={`${label ?? "Score"}: ${Math.round(value)} out of 100`}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-default)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={mountedOffset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div
        className="absolute top-0 flex flex-col items-center justify-center pointer-events-none"
        style={{ width: size, height: size }}
      >
        <span className="font-bold text-foreground tracking-tight" style={{ fontSize: size / 3.2 }}>
          {Math.round(value)}
        </span>
      </div>
      {caption ? (
        <p className="mt-2.5 text-xs text-muted-foreground font-medium">{caption}</p>
      ) : null}
    </div>
  );
}

export function IconTile({ children }) {
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-accent-subtle text-accent [&_svg]:size-4.5">
      {children}
    </span>
  );
}
