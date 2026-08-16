import { cn } from "@/lib/utils";

/** FutureReady brand logo icon */
export function Logo({ className }) {
  return (
    <img
      src="/FutureReady_Logo.png"
      alt="FutureReady Logo"
      className={cn(
        "size-8 shrink-0 rounded-md object-cover shadow-xs transition-transform duration-200",
        className,
      )}
    />
  );
}

export function Wordmark({ className }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <Logo />
      <span className="text-sm font-semibold tracking-tight text-foreground">FutureReady</span>
    </span>
  );
}
