import { Link } from "react-router-dom";

import { JourneyStrip } from "@/components/common/JourneyStrip";
import { ProgressBar, ProgressRing, StatusBadge } from "@/components/common/indicators";
import { PageHeader, SectionCard, StatTile } from "@/components/common/page";
import { CardsSkeleton, ErrorState } from "@/components/common/states";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { useAsyncData } from "@/hooks/useAsyncData";
import { interviewService } from "@/services/interview/interviewService";

const SECTIONS = [
  { href: "/interview/dsa", label: "DSA", note: "Topic-wise problem practice and accuracy." },
  { href: "/interview/coding", label: "Coding", note: "Timed implementation tasks." },
  { href: "/interview/technical", label: "Technical", note: "Concept questions for your stack." },
  { href: "/interview/project", label: "Project", note: "Deep dives into your own projects." },
  { href: "/interview/hr", label: "HR", note: "Behavioural and communication practice." },
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
        description="Preparation is generated from your resume, skills, projects, target role, company and current skill gaps."
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
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatTile
              label="Role"
              value={data.setup.role}
              hint={`Company: ${data.setup.company}`}
            />
            <StatTile label="Completed tasks" value={data.completedTasks} />
            <StatTile label="Pending tasks" value={data.pendingTasks} />
            <StatTile label="Daily goal" value={data.dailyGoal} />
          </div>

          <SectionCard
            title="Preparation dashboard"
            description="Overall readiness and category progress."
          >
            <div className="grid gap-6 lg:grid-cols-[auto_1fr] lg:items-center">
              <div className="flex justify-center">
                <ProgressRing value={data.readiness} caption="Interview readiness" />
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {data.categoryProgress.map((c) => (
                  <li key={c.category}>
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-medium text-foreground">{c.label}</span>
                      <span className="text-sm text-muted-foreground">{c.progress}%</span>
                    </div>
                    <ProgressBar value={c.progress} className="mt-1.5" label={c.label} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-eyebrow">Strong areas</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {data.strongAreas.map((a) => (
                    <StatusBadge key={a} tone="success">
                      {a}
                    </StatusBadge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-eyebrow">Weak areas</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {data.weakAreas.map((a) => (
                    <StatusBadge key={a} tone="danger">
                      {a}
                    </StatusBadge>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {SECTIONS.map((s) => (
              <SectionCard key={s.href} title={s.label} description={s.note}>
                <Button asChild size="sm">
                  <Link to={s.href}>Open {s.label}</Link>
                </Button>
              </SectionCard>
            ))}
          </div>

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
                </li>
              ))}
            </ol>
          </SectionCard>
        </>
      ) : null}
    </AppShell>
  );
}
