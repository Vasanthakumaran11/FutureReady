import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";

const HIGHLIGHTS = [
  "Resume analysis and AI-assisted refinement grounded in your own experience",
  "Role and company-specific interview preparation across DSA, coding, technical, project and HR",
  "Explained job matching — every score shows the skills behind it",
];

export function AuthLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary-foreground/15">
            <Sparkles className="size-4" aria-hidden />
          </span>
          <span className="font-display text-sm font-semibold">FutureReady</span>
        </div>
        <div className="max-w-md">
          <h2 className="font-display text-3xl font-semibold leading-tight">
            One connected career journey, from profile to offer.
          </h2>
          <ul className="mt-8 space-y-4 text-sm text-primary-foreground/85">
            {HIGHLIGHTS.map((h) => (
              <li key={h} className="flex gap-3">
                <span aria-hidden>—</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-primary-foreground/70">
          AI-powered career readiness platform
        </p>
      </div>

      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="size-4" aria-hidden />
            </span>
            <span className="font-display text-sm font-semibold">FutureReady</span>
          </div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
