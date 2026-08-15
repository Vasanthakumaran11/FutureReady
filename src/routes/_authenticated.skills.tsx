import { createFileRoute } from "@tanstack/react-router";

import { JourneyStrip } from "@/components/common/JourneyStrip";
import { ProgressBar, StatusBadge } from "@/components/common/indicators";
import { BackendNotice, PageHeader, SectionCard, StatTile } from "@/components/common/page";
import { CardsSkeleton, ErrorState } from "@/components/common/states";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { useAsyncData } from "@/hooks/useAsyncData";
import { dashboardService } from "@/services/dashboard/dashboardService";

export const Route = createFileRoute("/_authenticated/skills")({
  head: () => ({
    meta: [
      { title: "Skill Development — FutureReady" },
      {
        name: "description",
        content: "Daily skill tasks and gap analysis comparing your current skills to target role requirements.",
      },
      { property: "og:title", content: "Skill Development — FutureReady" },
      { property: "og:description", content: "Close skill gaps with daily, adaptive tasks." },
    ],
  }),
  component: SkillsPage,
});

function SkillsPage() {
  const { data, loading, error, reload } = useAsyncData(() => dashboardService.getSkillGap());
  const high = data?.filter((g) => g.priority === "high").length ?? 0;

  return (
    <AppShell title="Skill development">
      <JourneyStrip current="Skill gaps" />
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
            <StatTile label="Ready skills" value={data.filter((g) => g.status === "advanced").length} />
          </div>

          <SectionCard title="Gap analysis" description="Requirement, your evidence and the recommended learning task.">
            <ul className="grid gap-3">
              {data.map((gap) => (
                <li key={gap.id} className="rounded-lg border border-border p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold">{gap.skill}</span>
                    <StatusBadge tone={gap.priority === "high" ? "danger" : gap.priority === "medium" ? "warning" : "neutral"}>
                      {gap.priority} priority
                    </StatusBadge>
                    <StatusBadge tone="primary">{gap.status}</StatusBadge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">Required: {gap.requirement}</p>
                  <p className="text-sm text-muted-foreground">Your evidence: {gap.evidence}</p>
                  <ProgressBar
                    className="mt-3"
                    value={gap.status === "advanced" ? 90 : gap.status === "intermediate" ? 60 : 30}
                    tone={gap.priority === "high" ? "warning" : "success"}
                    label={`${gap.skill} level`}
                  />
                  <p className="mt-3 text-sm">
                    <span className="text-eyebrow">Today's task</span>
                    <br />
                    {gap.learningTask}
                  </p>
                  <div className="mt-3 flex gap-2">
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
            Task generation and progress updates run against FastAPI, which re-scores your gaps after
            each completed task.
          </BackendNotice>
        </>
      ) : null}
    </AppShell>
  );
}
