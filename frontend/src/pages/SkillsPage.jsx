import { JourneyStrip } from "@/components/common/JourneyStrip";
import { ProgressBar, StatusBadge } from "@/components/common/indicators";
import { BackendNotice, PageHeader, SectionCard, StatTile } from "@/components/common/page";
import { CardsSkeleton, ErrorState } from "@/components/common/states";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { useAsyncData } from "@/hooks/useAsyncData";
import { dashboardService } from "@/services/dashboard/dashboardService";

export function SkillsPage() {
  const { data, loading, error, reload } = useAsyncData(() => dashboardService.getSkillGap());
  const high = data?.filter((g) => g.priority === "high").length ?? 0;

  return (
    <AppShell title="Skill development">
      <PageHeader
        title="Skill development"
        description="Gaps are derived from your resume, projects and the requirements of your target roles."
        actions={<Button onClick={() => void reload()}>Refresh analysis</Button>}
      />

      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {loading && !data ? <CardsSkeleton count={3} height={120} /> : null}

      {data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatTile label="Tracked gaps" value={data.length} />
            <StatTile label="High priority" value={high} hint="Address these first" />
            <StatTile
              label="Ready skills"
              value={data.filter((g) => g.status === "strong").length}
            />
          </div>

          <SectionCard
            title="Gap analysis"
            description="Requirement, your evidence and the recommended learning task."
          >
            <ul className="grid gap-3.5">
              {data.map((gap) => (
                <li
                  key={gap.id}
                  className="rounded-sm border border-border bg-surface p-4.5 shadow-card transition-all duration-150 ease-out hover:border-border-strong"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{gap.skill}</span>
                      <StatusBadge
                        tone={
                          gap.priority === "high"
                            ? "danger"
                            : gap.priority === "medium"
                              ? "warning"
                              : "neutral"
                        }
                      >
                        {gap.priority} priority
                      </StatusBadge>
                      <StatusBadge
                        tone={
                          gap.status === "strong"
                            ? "success"
                            : gap.status === "moderate"
                              ? "warning"
                              : "danger"
                        }
                      >
                        {gap.status}
                      </StatusBadge>
                    </div>
                  </div>
                  <div className="mt-2 space-y-0.5 text-xs sm:text-sm text-muted-foreground">
                    <p>
                      <span className="font-medium text-foreground">Required:</span>{" "}
                      {gap.requirement}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">Your evidence:</span>{" "}
                      {gap.evidence}
                    </p>
                  </div>
                  <ProgressBar
                    className="mt-3"
                    value={gap.status === "strong" ? 90 : gap.status === "moderate" ? 60 : 30}
                    tone={
                      gap.status === "strong"
                        ? "success"
                        : gap.status === "moderate"
                          ? "warning"
                          : "danger"
                    }
                    label={`${gap.skill} level`}
                  />
                  <div className="mt-3 rounded-[6px] bg-surface-hover px-3 py-2">
                    <span className="text-eyebrow text-tertiary">Today's task</span>
                    <p className="mt-0.5 text-xs sm:text-sm font-medium text-foreground">
                      {gap.learningTask}
                    </p>
                  </div>
                  <div className="mt-3.5 flex gap-2">
                    <Button size="sm">Start task</Button>
                    <Button size="sm" variant="outline">
                      Mark complete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>

          <BackendNotice>
            Task generation and progress updates run against FastAPI, which re-scores your gaps
            after each completed task.
          </BackendNotice>
        </>
      ) : null}
    </AppShell>
  );
}
