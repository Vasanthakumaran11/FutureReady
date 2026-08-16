import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold leading-8">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-[22px] text-muted-foreground">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function SectionCard({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={cn("rounded-md border border-border bg-surface-raised shadow-card", className)}
    >
      {title ? (
        <div className="flex flex-col gap-2 border-b border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-[18px] font-semibold leading-[26px]">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm leading-[22px] text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>
      ) : null}
      <div className={cn("p-6", bodyClassName)}>{children}</div>
    </section>
  );
}

export function StatTile({
  label,
  value,
  hint,
  suffix,
}: {
  label: string;
  value: string | number;
  hint?: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-md border border-border bg-surface-raised p-6 shadow-card">
      <p className="text-eyebrow">{label}</p>
      <p className="mt-3 text-metric text-foreground">
        {value}
        {suffix ? <span className="ml-0.5 text-base text-tertiary-foreground">{suffix}</span> : null}
      </p>
      {hint ? <p className="mt-2 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function BackendNotice({ children }: { children?: ReactNode }) {
  return (
    <p className="text-xs text-tertiary-foreground">
      {children ??
        "Backend integration pending — this action calls a frontend service stub that will be replaced by the FastAPI endpoint."}
    </p>
  );
}
