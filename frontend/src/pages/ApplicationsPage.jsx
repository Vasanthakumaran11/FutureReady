import { ChevronDown, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { StatusBadge, applicationStatusMeta } from "@/components/common/indicators";
import { PageHeader, SectionCard, StatTile } from "@/components/common/page";
import { EmptyState, ErrorState, RowsSkeleton } from "@/components/common/states";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAsyncData } from "@/hooks/useAsyncData";
import { jobService } from "@/services/jobs/jobService";

const COLUMNS = ["saved", "applied", "interview", "offer", "rejected"];

// Normalizes status strings from various sources
const normalizeStatus = (status) => {
  if (!status) return "saved";
  const s = status.toLowerCase();
  if (s === "interviewing" || s === "interview") return "interview";
  if (s === "offered" || s === "offer") return "offer";
  if (s === "reject" || s === "rejected") return "rejected";
  if (s === "applied") return "applied";
  return "saved";
};

export function ApplicationsPage() {
  const { data, loading, error, reload, setData } = useAsyncData(() =>
    jobService.getApplications(),
  );

  const applications = Array.isArray(data) ? data : [];

  const move = async (id, newStatus) => {
    try {
      await jobService.updateApplication(id, { status: newStatus });
      setData((prev) =>
        Array.isArray(prev)
          ? prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
          : []
      );
      toast.success(`Moved to ${applicationStatusMeta[newStatus]?.label || newStatus}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const remove = async (id) => {
    try {
      await jobService.removeApplication(id);
      setData((prev) => (Array.isArray(prev) ? prev.filter((item) => item.id !== id) : []));
      toast.success("Application removed from tracker");
    } catch {
      toast.error("Failed to remove application");
    }
  };

  return (
    <AppShell title="Applications">
      <PageHeader
        title="Application tracker"
        description="Every job you save or apply to is tracked here with its match score and status."
      />

      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {loading && !data ? <RowsSkeleton count={4} /> : null}

      {!loading && applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Save a matched job from Job Search to start tracking your applications."
        />
      ) : null}

      {applications.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatTile label="Total tracked" value={applications.length} />
            <StatTile
              label="In interview"
              value={applications.filter((a) => normalizeStatus(a.status) === "interview").length}
            />
            <StatTile
              label="Offers"
              value={applications.filter((a) => normalizeStatus(a.status) === "offer").length}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-5">
            {COLUMNS.map((col) => {
              const items = applications.filter((a) => normalizeStatus(a.status) === col);
              const meta = applicationStatusMeta[col] || { label: col, tone: "neutral" };
              return (
                <SectionCard
                  key={col}
                  title={meta.label}
                  description={`${items.length} tracked`}
                  bodyClassName="p-3.5"
                >
                  <ul className="grid gap-3">
                    {items.map((app) => (
                      <li
                        key={app.id}
                        className="group rounded-lg border border-border bg-surface p-3.5 shadow-card transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-border-strong flex flex-col justify-between"
                      >
                        <div>
                          <p className="text-sm font-bold text-foreground">{app.jobTitle}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {app.company} · {app.location || "Location not specified"}
                          </p>
                          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                            <StatusBadge tone={meta.tone}>
                              {app.matchScore || 0}% match
                            </StatusBadge>
                            {app.appliedDate ? (
                              <StatusBadge tone="neutral">{app.appliedDate}</StatusBadge>
                            ) : null}
                          </div>
                          {app.notes ? (
                            <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                              {app.notes}
                            </p>
                          ) : null}
                        </div>

                        {/* Status dropdown & Delete action */}
                        <div className="mt-3.5 flex items-center justify-between gap-1.5 border-t border-border/50 pt-2.5">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                              >
                                Move status{" "}
                                <ChevronDown className="size-3 ml-0.5 opacity-60" aria-hidden />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="start"
                              className="w-36 bg-surface border-border shadow-raised"
                            >
                              {COLUMNS.filter((c) => c !== col).map((c) => (
                                <DropdownMenuItem
                                  key={c}
                                  onClick={() => void move(app.id, c)}
                                  className="text-xs font-medium cursor-pointer hover:bg-surface-hover"
                                >
                                  Move to {applicationStatusMeta[c]?.label || c}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>

                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-danger-soft cursor-pointer"
                            aria-label={`Remove ${app.jobTitle}`}
                            onClick={() => void remove(app.id)}
                            title="Remove from tracker"
                          >
                            <Trash2 className="size-3.5" aria-hidden />
                          </Button>
                        </div>
                      </li>
                    ))}
                    {items.length === 0 ? (
                      <li className="py-6 text-center text-xs text-muted-foreground">
                        No jobs in this column.
                      </li>
                    ) : null}
                  </ul>
                </SectionCard>
              );
            })}
          </div>
        </>
      ) : null}
    </AppShell>
  );
}
