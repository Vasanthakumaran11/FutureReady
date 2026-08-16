import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { ApplicationStatus, IssueSeverity, SkillLevel } from "@/types";

const toneStyles = {
  neutral: "bg-surface text-muted-foreground border border-border",
  primary: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-destructive",
  ai: "bg-ai-soft text-ai",
} as const;

export type Tone = keyof typeof toneStyles;

export function StatusBadge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm px-2.5 py-1 text-[12px] font-medium uppercase leading-4 tracking-[0.02em]",
        toneStyles[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const skillTone: Record<SkillLevel, Tone> = {
  strong: "success",
  moderate: "warning",
  missing: "danger",
};

export function SkillBadge({ name, level }: { name: string; level: SkillLevel }) {
  const symbol = level === "strong" ? "✓" : level === "moderate" ? "⚠" : "✕";
  return (
    <StatusBadge tone={skillTone[level]}>
      <span aria-hidden>{symbol}</span>
      <span>{name}</span>
      <span className="sr-only">{level}</span>
    </StatusBadge>
  );
}

export function MatchSkillBadge({
  skill,
  status,
}: {
  skill: string;
  status: "matched" | "partial" | "missing";
}) {
  const level: SkillLevel =
    status === "matched" ? "strong" : status === "partial" ? "moderate" : "missing";
  return <SkillBadge name={skill} level={level} />;
}

export function SeverityBadge({ severity }: { severity: IssueSeverity }) {
  const map: Record<IssueSeverity, { tone: Tone; label: string }> = {
    critical: { tone: "danger", label: "Critical" },
    improve: { tone: "warning", label: "Needs improvement" },
    good: { tone: "success", label: "Good" },
  };
  const { tone, label } = map[severity];
  return <StatusBadge tone={tone}>{label}</StatusBadge>;
}

export const applicationStatusMeta: Record<ApplicationStatus, { label: string; tone: Tone }> = {
  saved: { label: "Saved", tone: "neutral" },
  applied: { label: "Applied", tone: "primary" },
  interview: { label: "Interview", tone: "warning" },
  offer: { label: "Offer", tone: "success" },
  rejected: { label: "Rejected", tone: "danger" },
};

export function AiLabel({ children = "AI Suggestion" }: { children?: ReactNode }) {
  return (
    <StatusBadge tone="ai">
      <Sparkles className="size-3.5" aria-hidden />
      {children}
    </StatusBadge>
  );
}

export function ProgressBar({
  value,
  tone = "primary",
  label,
  className,
}: {
  value: number;
  tone?: "primary" | "success" | "warning" | "danger";
  label?: string;
  className?: string;
}) {
  const fill =
    tone === "success"
      ? "bg-success"
      : tone === "warning"
        ? "bg-warning"
        : tone === "danger"
          ? "bg-destructive"
          : "bg-primary";
  const track = tone === "danger" ? "bg-danger-soft" : "bg-border";
  return (
    <div
      className={cn("h-1.5 w-full overflow-hidden rounded-full", track, className)}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "Progress"}
    >
      <div
        className={cn("h-full rounded-full transition-[width] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]", fill)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function ProgressRing({
  value,
  size = 96,
  label,
  caption,
}: {
  value: number;
  size?: number;
  label?: string;
  caption?: string;
}) {
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={size}
        role="img"
        aria-label={`${label ?? "Score"}: ${Math.round(value)} out of 100`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          className="fill-foreground font-mono font-semibold"
          style={{ fontSize: size / 3.4, letterSpacing: "-0.02em" }}
        >
          {Math.round(value)}
        </text>
      </svg>
      {caption ? <p className="mt-3 text-xs text-muted-foreground">{caption}</p> : null}
    </div>
  );
}

export function IconTile({ children }: { children: ReactNode }) {
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-primary-soft text-primary [&_svg]:size-5">
      {children}
    </span>
  );
}
