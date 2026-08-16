import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return <div className={cn("rounded-sm bg-muted/60 skeleton-shimmer", className)} {...props} />;
}

export { Skeleton };
