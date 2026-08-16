import { ChevronDown, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { JourneyStrip } from "@/components/common/JourneyStrip";
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

export function ApplicationsPage() {
  const { data, loading, error, reload, setData } = useAsyncData(() =>
    jobService.getApplications(),
  );

  const move = async (id, status) => {
    setData(await jobService.updateApplication(id, { status }));
    toast.success(`Moved to ${applicationStatusMeta[status].label}`);
  };

  const remove = async (id) => {
    setData(await jobService.removeApplication(id));
  };

  return (
    <AppShell title="Applications">
      <PageHeader
        title="Application tracker"
        description="Every job you save or apply to is tracked here with its match score and status."
      />

      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {loading && !data ? <RowsSkeleton count={4} /> : null}

      {data && data.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Save a matched job from the job search to start tracking it."
        />
      ) : null}

      {data && data.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatTile label="Total tracked" value={data.length} />
            <StatTile
              label="In interview"
              value={data.filter((a) => a.status === "interview").length}
            />
            <StatTile label="Offers" value={data.filter((a) => a.status === "offer").length} />
          </div>

          <div className="grid gap-4 lg:grid-cols-5">
            {COLUMNS.map((col) => {
              const items = data.filter((a) => a.status === col);
              return (
                <SectionCard
                  key={col}
                  title={applicationStatusMeta[col].label}
                  description={`${items.length} tracked`}
                  bodyClassName="p-3.5"
                >
                  <ul className="grid gap-3">
                    {items.map((app) => (
                      <li
                        key={app.id}
                        className="group rounded-sm border border-border bg-surface p-3.5 shadow-card transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-border-strong"
                      >
                        <p className="text-sm font-semibold text-foreground">{app.jobTitle}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {app.company} · {app.location}
                        </p>
                        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                          <StatusBadge tone={applicationStatusMeta[col].tone}>
                            {app.matchScore}% match
                          </StatusBadge>
                          <StatusBadge tone="neutral">{app.appliedDate}</StatusBadge>
                        </div>
                        {app.notes ? (
                          <p className="mt-2 text-xs text-muted-foreground">{app.notes}</p>
                        ) : null}

                        {/* Consolidated status control dropdown */}
                        <div className="mt-3 flex items-center justify-between gap-1.5 border-t border-border/40 pt-2.5">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
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
                                  Move to {applicationStatusMeta[c].label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>

                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-danger-soft"
                            aria-label={`Remove ${app.jobTitle}`}
                            onClick={() => void remove(app.id)}
                          >
                            <Trash2 className="size-3.5" aria-hidden />
                          </Button>
                        </div>
                      </li>
                    ))}
                    {items.length === 0 ? (
                      <li className="py-4 text-center text-xs text-tertiary">Nothing here yet.</li>
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
