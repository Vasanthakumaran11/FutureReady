import { AlertTriangle, RotateCw } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  illustration,
  title,
  description,
  actionLabel,
  onAction,
  secondary,
  className,
}: {
  icon?: ReactNode;
  illustration?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondary?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-md border border-dashed border-border bg-surface px-6 py-12 text-center",
        className,
      )}
    >
      {illustration ? (
        <img
          src={illustration}
          alt=""
          loading="lazy"
          width={768}
          height={768}
          className="mb-4 size-40 object-contain"
        />
      ) : icon ? (
        <div className="mb-4 flex size-10 items-center justify-center rounded-sm bg-primary-soft text-primary [&_svg]:size-5">
          {icon}
        </div>
      ) : null}
      <h3 className="text-[18px] font-semibold leading-[26px]">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-[22px] text-muted-foreground">{description}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {actionLabel && onAction ? <Button onClick={onAction}>{actionLabel}</Button> : null}
        {secondary}
      </div>
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
  className,
}: {
  message: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-start gap-3 rounded-md border border-destructive/25 bg-danger-soft px-5 py-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
        <div>
          <p className="text-sm font-semibold text-foreground">We couldn't load this section</p>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RotateCw className="size-3.5" aria-hidden /> Retry
        </Button>
      ) : null}
    </div>
  );
}

export function CardsSkeleton({ count = 3, height = 120 }: { count?: number; height?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="w-full rounded-md" style={{ height }} />
      ))}
    </div>
  );
}

export function RowsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-md" />
      ))}
    </div>
  );
}
