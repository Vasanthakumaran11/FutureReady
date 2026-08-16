import { cn } from "@/lib/utils";

/** FutureReady logomark: two offset geometric planes — quiet, precise, monochrome accent. */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-sm bg-primary text-primary-foreground",
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 20 20" className="size-4" fill="none">
        <rect x="2.5" y="2.5" width="9" height="9" rx="2" fill="currentColor" opacity="0.55" />
        <rect x="8.5" y="8.5" width="9" height="9" rx="2" fill="currentColor" />
      </svg>
    </span>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <Logo />
      <span className="text-sm font-semibold tracking-tight">FutureReady</span>
    </span>
  );
}
