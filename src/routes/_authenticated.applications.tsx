import { createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { JourneyStrip } from "@/components/common/JourneyStrip";
import { StatusBadge, applicationStatusMeta } from "@/components/common/indicators";
import { PageHeader, SectionCard, StatTile } from "@/components/common/page";
import { EmptyState, ErrorState, RowsSkeleton } from "@/components/common/states";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { useAsyncData } from "@/hooks/useAsyncData";
import { jobService } from "@/services/jobs/jobService";
import type { ApplicationStatus } from "@/types";

export const Route = createFileRoute("/_authenticated/applications")({
  head: () => ({
    meta: [
      { title: "Application Tracker — FutureReady" },
      {
        name: "description",
        content: "Track saved, applied, interviewing, offered and rejected applications in one board.",
      },
      { property: "og:title", content: "Application Tracker — FutureReady" },
      { property: "og:description", content: "Keep every job application status in one place." },
    ],
  }),
  component: ApplicationsPage,
});

const COLUMNS: ApplicationStatus[] = ["saved", "applied", "interview", "offer", "rejected"];

function ApplicationsPage() {
  const { data, loading, error, reload, setData } = useAsyncData(() => jobService.getApplications());

  const move = async (id: string, status: ApplicationStatus) => {
    setData(await jobService.updateApplication(id, { status }));
    toast.success(`Moved to ${applicationStatusMeta[status].label}`);
  };

  const remove = async (id: string) => {
    setData(await jobService.removeApplication(id));
  };

  return (
    <AppShell title="Applications">
      <JourneyStrip current="Applications" />
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
            <StatTile label="In interview" value={data.filter((a) => a.status === "interview").length} />
            <StatTile label="Offers" value={data.filter((a) => a.status === "offer").length} />
          </div>

          <div className="grid gap-4 lg:grid-cols-5">
            {COLUMNS.map((col) => {
              const items = data.filter((a) => a.status === col);
              return (
                <SectionCard key={col} title={applicationStatusMeta[col].label} description={`${items.length} tracked`}>
                  <ul className="grid gap-3">
                    {items.map((app) => (
                      <li key={app.id} className="rounded-md border border-border p-3">
                        <p className="text-sm font-medium">{app.jobTitle}</p>
                        <p className="text-xs text-muted-foreground">
                          {app.company} · {app.location}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          <StatusBadge tone={applicationStatusMeta[col].tone}>{app.matchScore}% match</StatusBadge>
                          <StatusBadge>{app.appliedDate}</StatusBadge>
                        </div>
                        {app.notes ? <p className="mt-2 text-xs text-muted-foreground">{app.notes}</p> : null}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {COLUMNS.filter((c) => c !== col).map((c) => (
                            <Button key={c} size="sm" variant="outline" onClick={() => void move(app.id, c)}>
                              {applicationStatusMeta[c].label}
                            </Button>
                          ))}
                          <Button
                            size="sm"
                            variant="ghost"
                            aria-label={`Remove ${app.jobTitle}`}
                            onClick={() => void remove(app.id)}
                          >
                            <Trash2 className="size-3.5" aria-hidden />
                          </Button>
                        </div>
                      </li>
                    ))}
                    {items.length === 0 ? <li className="text-xs text-muted-foreground">Nothing here yet.</li> : null}
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
