import { Link } from "react-router-dom";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Profile", href: "/profile" },
  { label: "Resume", href: "/resume" },
  { label: "Target role", href: "/interview/setup" },
  { label: "Interview prep", href: "/interview" },
  { label: "Skill development", href: "/skills" },
  { label: "Job matching", href: "/jobs" },
  { label: "Applications", href: "/applications" },
  { label: "Readiness", href: "/dashboard" },
];

/** Keeps the end-to-end career journey visible on every module page. */
export function JourneyStrip({ current }) {
  const currentIndex = STEPS.findIndex((s) => s.label === current);

  return (
    <nav aria-label="Career journey" className="-mx-1 overflow-x-auto pb-1">
      <ol className="flex min-w-max items-center gap-1.5 px-1 py-1">
        {STEPS.map((step, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <li key={step.label} className="flex items-center gap-1.5">
              <Link
                to={step.href}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-150 ease-out",
                  active
                    ? "bg-accent text-white shadow-sm font-semibold ring-1 ring-accent"
                    : done
                      ? "bg-success-bg text-success hover:opacity-90 font-medium"
                      : "bg-surface-hover text-tertiary hover:text-secondary hover:bg-border/60",
                )}
                aria-current={active ? "step" : undefined}
              >
                {done ? <Check className="size-3 stroke-[2.5]" aria-hidden /> : null}
                <span>{step.label}</span>
              </Link>
              {i < STEPS.length - 1 ? (
                <div
                  aria-hidden
                  className={cn(
                    "h-px w-3 transition-colors",
                    i < currentIndex ? "bg-success/40" : "bg-border",
                  )}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
