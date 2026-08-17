import { Link } from "react-router-dom";
import {
  Building2,
  ChevronRight,
  Cpu,
  FolderGit2,
  GraduationCap,
  MessageSquare,
  Sparkles,
  Target,
} from "lucide-react";

import { ProgressBar, ProgressRing, StatusBadge } from "@/components/common/indicators";
import { PageHeader, SectionCard, StatTile } from "@/components/common/page";
import { CardsSkeleton, ErrorState } from "@/components/common/states";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { useAsyncData } from "@/hooks/useAsyncData";
import { interviewService } from "@/services/interview/interviewService";

const SECTIONS = [
  {
    href: "/interview/dsa",
    label: "DSA Practice",
    icon: Cpu,
    note: "Category-wise algorithms: Searching, Sorting, LinkedList, Recursion, Trees, Graphs & DP.",
  },
  {
    href: "/interview/technical",
    label: "Technical Concepts",
    icon: GraduationCap,
    note: "System design, databases, indexing, concurrency, and API architecture questions.",
  },
  {
    href: "/interview/project",
    label: "Project Deep Dive",
    icon: FolderGit2,
    note: "Resume project defense, architecture trade-offs, scaling, and production failure debugging.",
  },
  {
    href: "/interview/hr",
    label: "HR & Behavioral",
    icon: MessageSquare,
    note: "STAR methodology, leadership, conflict resolution, and career motivation narrative.",
  },
];

const LOOP = [
  "Skill gap",
  "Recommended task",
  "Your practice",
  "Result",
  "Updated skill",
  "Next task",
];

export function InterviewIndexPage() {
  const { data, loading, error, reload } = useAsyncData(() => interviewService.getInterviewPlan());

  return (
    <AppShell title="Interview Preparation">
      <PageHeader
        title="Interview preparation"
        description="Structured practice modules customized to your resume, projects, target role, company and current skill gaps."
        actions={
          <Button asChild variant="outline">
            <Link to="/interview/setup">Configure role & company</Link>
          </Button>
        }
      />

      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {loading && !data ? <CardsSkeleton count={4} height={110} /> : null}

      {data ? (
        <>
          {/* TOP 4 STAT TILES */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile
              label="Role"
              value={data.setup.role}
              hint={`Company: ${data.setup.company || "Google"}`}
            />
            <StatTile label="Completed tasks" value={data.completedTasks} />
            <StatTile label="Pending tasks" value={data.pendingTasks} />
            <StatTile label="Daily goal" value={data.dailyGoal} />
          </div>

          {/* PREPARATION DASHBOARD */}
          <SectionCard
            title="Preparation dashboard"
            description="Overall readiness and category progress."
          >
            <div className="grid gap-6 lg:grid-cols-[auto_1fr] lg:items-center">
              <div className="flex justify-center p-2">
                <ProgressRing value={data.readiness} caption="Interview readiness" />
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {data.categoryProgress.map((c) => (
                  <li key={c.category} className="rounded-lg border border-border/60 bg-surface-hover/30 p-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-medium text-foreground">{c.label}</span>
                      <span className="text-sm text-muted-foreground font-semibold">
                        {c.solved || 0}/{c.total || 1} ({c.progress}%)
                      </span>
                    </div>
                    <ProgressBar value={c.progress} className="mt-2" label={c.label} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 pt-4 border-t border-border/50">
              <div>
                <p className="text-eyebrow">Strong areas</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {data.strongAreas && data.strongAreas.length > 0 ? (
                    data.strongAreas.map((a) => (
                      <StatusBadge key={a} tone="success">
                        {a}
                      </StatusBadge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">Complete problems to identify strong areas</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-eyebrow">Weak areas</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {data.weakAreas && data.weakAreas.length > 0 ? (
                    data.weakAreas.map((a) => (
                      <StatusBadge key={a} tone="danger">
                        {a}
                      </StatusBadge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">No critical weak areas detected</span>
                  )}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* 4 CORE SECTIONS - BALANCED 4-COLUMN DESKTOP GRID */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SECTIONS.map((s) => {
              const IconComp = s.icon;
              return (
                <div
                  key={s.href}
                  className="rounded-xl border border-border bg-surface p-5 shadow-card hover:border-border-strong transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                      <IconComp className="size-5" />
                    </div>
                    <h4 className="text-base font-bold text-foreground">{s.label}</h4>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{s.note}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/40">
                    <Button asChild size="sm" className="w-full cursor-pointer justify-between">
                      <Link to={s.href}>
                        <span>Open {s.label}</span>
                        <ChevronRight className="size-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CONTINUOUS IMPROVEMENT LOOP */}
          <SectionCard
            title="Adaptive preparation loop"
            description="Each result feeds the next recommended task."
          >
            <ol className="grid gap-2.5 sm:grid-cols-3 xl:grid-cols-6">
              {LOOP.map((stage, i) => (
                <li
                  key={stage}
                  className="rounded-sm border border-border bg-surface-hover/70 p-3.5 transition-colors"
                >
                  <p className="text-eyebrow text-tertiary">Step {i + 1}</p>
                  <p className="mt-1 text-xs font-semibold text-foreground sm:text-sm">{stage}</p>
                  <ProgressBar
                    value={((i + 1) / LOOP.length) * 100}
                    className="mt-2.5"
                    label={stage}
                  />
                </li>
              ))}
            </ol>
          </SectionCard>
        </>
      ) : null}
    </AppShell>
  );
}
