import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, RefreshCw } from "lucide-react";

import {
  ApplicationStatusChart,
  InterviewProgressChart,
  JobMatchChart,
  ReadinessTrendChart,
  SkillGapChart,
  TaskCompletionChart,
} from "@/charts/DashboardCharts";
import { JourneyStrip } from "@/components/common/JourneyStrip";
import { ProgressBar, ProgressRing, StatusBadge } from "@/components/common/indicators";
import { PageHeader, SectionCard, StatTile } from "@/components/common/page";
import { CardsSkeleton, ErrorState, RowsSkeleton } from "@/components/common/states";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { useAsyncData } from "@/hooks/useAsyncData";
import { dashboardService } from "@/services/dashboard/dashboardService";
import type { SkillLevel } from "@/types";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Career Readiness Dashboard — FutureReady" },
      {
        name: "description",
        content:
          "Track career readiness, resume score, interview preparation, skill gaps, job matches and applications in one dashboard.",
      },
      { property: "og:title", content: "Career Readiness Dashboard — FutureReady" },
      {
        property: "og:description",
        content: "Where am I, what am I missing and what should I do next.",
      },
    ],
  }),
  component: DashboardPage,
});

const LOOP = [
  "Task completed",
  "New evidence",
  "Skill status updated",
  "Readiness recalculated",
  "Next action recommended",
];

const statusTone: Record<SkillLevel, "success" | "warning" | "danger"> = {
  strong: "success",
  moderate: "warning",
  missing: "danger",
};

function DashboardPage() {
  const dashboard = useAsyncData(() => dashboardService.getDashboardData());
  const gaps = useAsyncData(() => dashboardService.getSkillGap());

  return (
    <AppShell title="Dashboard">
      <JourneyStrip current="Readiness" />

      <PageHeader
        title="Career readiness dashboard"
        description="Your current position, what is missing, and the single next action that moves you forward."
        actions={
          <Button variant="outline" onClick={() => void dashboard.reload()} disabled={dashboard.loading}>
            <RefreshCw className={dashboard.loading ? "size-4 animate-spin" : "size-4"} aria-hidden />
            Refresh
          </Button>
        }
      />

      {dashboard.error ? (
        <ErrorState message={dashboard.error} onRetry={dashboard.reload} />
      ) : null}

      {dashboard.loading && !dashboard.data ? (
        <CardsSkeleton count={6} height={92} />
      ) : dashboard.data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
            <StatTile label="Career readiness" value={dashboard.data.summary.careerReadiness} suffix="%" hint="Weighted across all modules" />
            <StatTile label="Resume score" value={dashboard.data.summary.resumeScore} suffix="%" hint="Last analysis" />
            <StatTile label="Interview readiness" value={dashboard.data.summary.interviewReadiness} suffix="%" hint="Backend Developer · Google" />
            <StatTile label="Skill gaps" value={dashboard.data.summary.skillGaps} hint="2 high priority" />
            <StatTile label="Job matches" value={dashboard.data.summary.jobMatches} hint="From your last search" />
            <StatTile label="Active applications" value={dashboard.data.summary.activeApplications} hint="Saved, applied or interviewing" />
          </div>

          <SectionCard
            title="Recommended next action"
            description="Chosen from your highest-priority gap and the modules you touched most recently."
          >
            <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
              <div className="flex items-center justify-center lg:pr-6">
                <ProgressRing value={dashboard.data.summary.careerReadiness} caption="Career readiness" />
              </div>
              <ul className="space-y-3">
                {dashboard.data.nextActions.map((action, i) => (
                  <li
                    key={action.id}
                    className="flex flex-col gap-3 rounded-md border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge tone={i === 0 ? "primary" : "neutral"}>
                          {i === 0 ? "Do this next" : action.module}
                        </StatusBadge>
                        <h3 className="text-sm font-semibold">{action.title}</h3>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{action.description}</p>
                    </div>
                    <Button asChild variant={i === 0 ? "default" : "outline"} size="sm">
                      <Link to={action.href}>
                        Open <ArrowRight className="size-3.5" aria-hidden />
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </SectionCard>

          <div className="grid gap-4 xl:grid-cols-2">
            <SectionCard title="Career readiness progress" description="Weekly readiness across the last 6 weeks.">
              <ReadinessTrendChart data={dashboard.data.readinessTrend} />
            </SectionCard>
            <SectionCard title="Skill gap" description="Role requirement compared with evidence in your profile.">
              <SkillGapChart data={dashboard.data.skillGapChart} />
            </SectionCard>
            <SectionCard title="Interview preparation" description="Progress by preparation category.">
              <InterviewProgressChart data={dashboard.data.interviewProgress} />
            </SectionCard>
            <SectionCard title="Job match distribution" description="How your matches are spread by score.">
              <JobMatchChart data={dashboard.data.jobMatchStats} />
            </SectionCard>
            <SectionCard title="Application status" description="Where your applications currently sit.">
              <ApplicationStatusChart data={dashboard.data.applicationStatus} />
            </SectionCard>
            <SectionCard title="Task completion trend" description="Planned versus completed daily tasks.">
              <TaskCompletionChart data={dashboard.data.taskCompletion} />
            </SectionCard>
          </div>
        </>
      ) : null}

      <SectionCard
        title="Skill gap analyzer"
        description="Target role requirement → your evidence → skill status → gap priority → learning task."
        actions={
          <Button asChild variant="outline" size="sm">
            <Link to="/skills">Open skill development</Link>
          </Button>
        }
        bodyClassName="p-0"
      >
        {gaps.error ? (
          <div className="p-5">
            <ErrorState message={gaps.error} onRetry={gaps.reload} />
          </div>
        ) : gaps.loading && !gaps.data ? (
          <div className="p-5">
            <RowsSkeleton />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  {["Skill", "Role requirement", "Your evidence", "Status", "Priority", "Learning task"].map((h) => (
                    <th key={h} className="px-5 py-3 text-eyebrow">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {gaps.data?.map((gap) => (
                  <tr key={gap.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 font-medium">{gap.skill}</td>
                    <td className="px-5 py-3 text-muted-foreground">{gap.requirement}</td>
                    <td className="px-5 py-3 text-muted-foreground">{gap.evidence}</td>
                    <td className="px-5 py-3">
                      <StatusBadge tone={statusTone[gap.status]}>
                        {gap.status === "strong" ? "Strong" : gap.status === "moderate" ? "Moderate" : "Missing"}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge tone={gap.priority === "high" ? "danger" : gap.priority === "medium" ? "warning" : "neutral"}>
                        {gap.priority}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{gap.learningTask}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Continuous improvement loop"
        description="Every completed task feeds back into your readiness score."
      >
        <ol className="grid gap-2 sm:grid-cols-5">
          {LOOP.map((stage, i) => (
            <li key={stage} className="rounded-md border border-border bg-muted/50 px-3 py-3">
              <p className="text-eyebrow">Step {i + 1}</p>
              <p className="mt-1 text-sm font-medium">{stage}</p>
              <ProgressBar value={((i + 1) / LOOP.length) * 100} className="mt-2" label={stage} />
            </li>
          ))}
        </ol>
      </SectionCard>
    </AppShell>
  );
}
