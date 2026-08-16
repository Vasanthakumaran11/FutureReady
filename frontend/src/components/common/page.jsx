import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({ title, description, actions }) {
  return (
    <header className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[28px] sm:leading-tight">
          {title}
        </h1>
        <p className="mt-1.5 max-w-2xl text-xs sm:text-sm leading-normal text-muted-foreground">
          {description}
        </p>
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0">{actions}</div>
      ) : null}
    </header>
  );
}

export function SectionCard({ title, description, actions, children, className, bodyClassName }) {
  return (
    <section
      className={cn(
        "rounded-md border border-border bg-surface shadow-card transition-colors duration-150",
        className,
      )}
    >
      {title ? (
        <div className="flex flex-col gap-2 border-b border-border px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-[16px] font-semibold leading-snug text-foreground sm:text-[17px]">
              {title}
            </h2>
            {description ? (
              <p className="mt-0.5 text-xs text-muted-foreground sm:text-[13px]">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-2 pt-1 sm:pt-0">{actions}</div> : null}
        </div>
      ) : null}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

function AnimatedNumber({ value }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const duration = 500; // 500ms count-up
    const startValue = 0;
    const endValue = value;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out quad
      const easeProgress = progress * (2 - progress);
      const current = Math.floor(startValue + (endValue - startValue) * easeProgress);
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(endValue);
      }
    };

    window.requestAnimationFrame(step);
  }, [value]);

  return <span>{displayValue}</span>;
}

export function StatTile({ label, value, hint, suffix }) {
  const isNumeric =
    typeof value === "number" ||
    (!isNaN(Number(value)) && typeof value === "string" && value.trim() !== "");
  const numericVal = isNumeric ? Number(value) : null;

  return (
    <div className="group rounded-md border border-border bg-surface p-5 shadow-card transition-all duration-150 hover:border-border-strong">
      <p className="text-eyebrow">{label}</p>
      <div className="mt-2 flex items-baseline gap-1 text-stat-num text-foreground">
        {numericVal !== null ? <AnimatedNumber value={numericVal} /> : value}
        {suffix ? <span className="text-sm font-medium text-tertiary">{suffix}</span> : null}
      </div>
      {hint ? <p className="mt-1.5 text-xs text-muted-foreground leading-normal">{hint}</p> : null}
    </div>
  );
}

export function BackendNotice({ children }) {
  return (
    <p className="text-xs text-tertiary leading-normal">
      {children ??
        "Backend integration pending — this action calls a frontend service stub that will be replaced by the FastAPI endpoint."}
    </p>
  );
}
