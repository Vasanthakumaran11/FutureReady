import { Link } from "@tanstack/react-router";
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
] as const;

/** Keeps the end-to-end career journey visible on every module page. */
export function JourneyStrip({ current }: { current: (typeof STEPS)[number]["label"] }) {
  const currentIndex = STEPS.findIndex((s) => s.label === current);

  return (
    <nav aria-label="Career journey" className="-mx-1 overflow-x-auto pb-1">
      <ol className="flex min-w-max items-center gap-1 px-1">
        {STEPS.map((step, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <li key={step.label} className="flex items-center gap-1">
              <Link
                to={step.href}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : done
                      ? "bg-success-soft text-success hover:bg-success-soft/80"
                      : "text-muted-foreground hover:bg-secondary",
                )}
                aria-current={active ? "step" : undefined}
              >
                {done ? <Check className="size-3" aria-hidden /> : null}
                {step.label}
              </Link>
              {i < STEPS.length - 1 ? (
                <span aria-hidden className="text-muted-foreground/50">
                  ›
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
