import { Link } from "react-router-dom";
import { ArrowRight, FileText, RefreshCw, Sparkles, UserCheck } from "lucide-react";

import {
  ApplicationStatusChart,
  InterviewProgressChart,
  JobMatchChart,
  ReadinessTrendChart,
  SkillGapChart,
  TaskCompletionChart,
} from "@/charts/DashboardCharts";
import { ProgressBar, ProgressRing, StatusBadge } from "@/components/common/indicators";
import { PageHeader, SectionCard, StatTile } from "@/components/common/page";
import { CardsSkeleton, EmptyState, ErrorState, RowsSkeleton } from "@/components/common/states";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { useAsyncData } from "@/hooks/useAsyncData";
import { dashboardService } from "@/services/dashboard/dashboardService";

const LOOP = [
  "Task completed",
  "New evidence",
  "Skill status updated",
  "Readiness recalculated",
  "Next action recommended",
];

const statusTone = {
  strong: "success",
  moderate: "warning",
  missing: "danger",
};

export function DashboardPage() {
  const dashboard = useAsyncData(() => dashboardService.getDashboardData());
  const gaps = useAsyncData(() => dashboardService.getSkillGap());

  const hasData = dashboard.data?.hasData;
  const summary = dashboard.data?.summary || {
    careerReadiness: 0,
    resumeScore: 0,
    interviewReadiness: 0,
    skillGaps: 0,
    jobMatches: 0,
    activeApplications: 0,
  };

  return (
    <AppShell title="Dashboard">
      <PageHeader
        title="Career readiness dashboard"
        description="Your current position, what is missing, and the single next action that moves you forward."
        actions={
          <Button
            variant="outline"
            onClick={() => {
              void dashboard.reload();
              void gaps.reload();
            }}
            disabled={dashboard.loading}
          >
            <RefreshCw
              className={dashboard.loading ? "size-4 animate-spin" : "size-4"}
              aria-hidden
            />
            Refresh
          </Button>
        }
      />

      {dashboard.error ? <ErrorState message={dashboard.error} onRetry={dashboard.reload} /> : null}

      {dashboard.loading && !dashboard.data ? (
        <CardsSkeleton count={6} height={92} />
      ) : dashboard.data ? (
        <>
          {/* Key Metric Tiles */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
            <StatTile
              label="Career readiness"
              value={summary.careerReadiness}
              suffix="%"
              hint={hasData ? "Weighted across all modules" : "Set up profile to begin"}
            />
            <StatTile
              label="Resume score"
              value={summary.resumeScore}
              suffix="%"
              hint={hasData ? "Calculated from active resume" : "No resume uploaded"}
            />
            <StatTile
              label="Interview readiness"
              value={summary.interviewReadiness}
              suffix="%"
              hint={hasData ? "Based on solved problems" : "Not started"}
            />
            <StatTile
              label="Skill gaps"
              value={summary.skillGaps}
              hint={hasData ? "Required vs candidate skills" : "Awaiting profile data"}
            />
            <StatTile
              label="Job matches"
              value={summary.jobMatches}
              hint={hasData ? "Matching roles found" : "Complete profile to match"}
            />
            <StatTile
              label="Active applications"
              value={summary.activeApplications}
              hint={hasData ? "Tracked in pipeline" : "0 applications"}
            />
          </div>

          {/* Recommended Next Action */}
          <SectionCard
            title="Recommended next action"
            description="Chosen based on your profile completeness, skill gaps and recent activity."
          >
            <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
              <div className="flex items-center justify-center lg:pr-6">
                <ProgressRing value={summary.careerReadiness} caption="Career readiness" />
              </div>
              <ul className="space-y-3">
                {dashboard.data.nextActions?.map((action, i) => (
                  <li
                    key={action.id}
                    className="group flex flex-col gap-3 rounded-sm border border-border bg-surface p-4 transition-all duration-150 ease-out hover:border-border-strong sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge tone={i === 0 ? "primary" : "neutral"}>
                          {i === 0 ? "Do this next" : action.module}
                        </StatusBadge>
                        <h3 className="text-sm font-semibold text-foreground">{action.title}</h3>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                        {action.description}
                      </p>
                    </div>
                    <Button
                      asChild
                      variant={i === 0 ? "default" : "outline"}
                      size="sm"
                      className="shrink-0"
                    >
                      <Link to={action.href}>
                        Open <ArrowRight className="size-3.5" aria-hidden />
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </SectionCard>

          {/* Dynamic Visualizations & Performance Breakdown */}
          {hasData ? (
            <div className="grid gap-4 xl:grid-cols-2">
              <SectionCard
                title="Career readiness progress"
                description="Progress trend based on completed milestones."
              >
                <ReadinessTrendChart data={dashboard.data.trend || []} />
              </SectionCard>
              <SectionCard
                title="Skill gap distribution"
                description="Role requirements compared with evidence in your profile."
              >
                <SkillGapChart data={gaps.data || []} />
              </SectionCard>
            </div>
          ) : (
            <SectionCard
              title="Career readiness journey"
              description="Your visual performance charts will activate as soon as you add your candidate details or upload a resume."
            >
              <div className="grid gap-4 sm:grid-cols-2 py-4">
                <div className="flex items-start gap-3 rounded-sm border border-border bg-surface-hover/50 p-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-accent-subtle text-accent">
                    <UserCheck className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      1. Complete Candidate Profile
                    </h4>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Add your target roles, years of experience, and core skills to unlock target
                      benchmark matching.
                    </p>
                    <Button asChild size="sm" variant="outline" className="mt-3">
                      <Link to="/profile">Go to profile</Link>
                    </Button>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-sm border border-border bg-surface-hover/50 p-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-accent-subtle text-accent">
                    <FileText className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">2. Add Your Resume</h4>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Upload a PDF or use our resume builder to generate ATS breakdown scores and
                      tailored suggestions.
                    </p>
                    <Button asChild size="sm" variant="outline" className="mt-3">
                      <Link to="/resume">Go to resume</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </SectionCard>
          )}
        </>
      ) : null}

      {/* Skill Gap Analyzer Table */}
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
        ) : gaps.data && gaps.data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-215 text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  {[
                    "Skill",
                    "Role requirement",
                    "Your evidence",
                    "Status",
                    "Priority",
                    "Learning task",
                  ].map((h) => (
                    <th key={h} className="px-5 py-3 text-eyebrow text-tertiary">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {gaps.data.map((gap) => (
                  <tr
                    key={gap.id}
                    className="border-b border-border transition-colors duration-150 hover:bg-surface-hover last:border-0"
                  >
                    <td className="px-5 py-3 font-medium text-foreground">{gap.skill}</td>
                    <td className="px-5 py-3 text-xs text-muted-foreground sm:text-sm">
                      {gap.requirement}
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground sm:text-sm">
                      {gap.evidence}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge tone={statusTone[gap.status] || "neutral"}>
                        {gap.status === "strong"
                          ? "Strong"
                          : gap.status === "moderate"
                            ? "Moderate"
                            : "Missing"}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge
                        tone={
                          gap.priority === "high"
                            ? "danger"
                            : gap.priority === "medium"
                              ? "warning"
                              : "neutral"
                        }
                      >
                        {gap.priority}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground sm:text-sm">
                      {gap.learningTask}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm font-medium text-foreground">No skill gaps calculated yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add your skills and target role in your profile to analyze requirements against
              industry benchmarks.
            </p>
            <Button asChild size="sm" variant="outline" className="mt-3">
              <Link to="/profile">Complete profile</Link>
            </Button>
          </div>
        )}
      </SectionCard>
    </AppShell>
  );
}
