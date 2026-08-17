import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Building2, CheckCircle2, Compass, Sparkles, Target } from "lucide-react";

import { ProgressBar, StatusBadge } from "@/components/common/indicators";
import { BackendNotice, PageHeader, SectionCard, StatTile } from "@/components/common/page";
import { CardsSkeleton, EmptyState, ErrorState } from "@/components/common/states";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { useAsyncData } from "@/hooks/useAsyncData";
import { dashboardService } from "@/services/dashboard/dashboardService";

export function SkillsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");
  const jobTitle = searchParams.get("title");
  const company = searchParams.get("company");

  const { data, loading, error, reload } = useAsyncData(
    () => dashboardService.getSkillGap(jobId),
    [jobId],
  );

  const gaps = Array.isArray(data) ? data : [];
  const highPriorityGaps = gaps.filter((g) => g.priority === "high" || g.status === "missing");
  const readySkills = gaps.filter((g) => g.status === "strong");

  return (
    <AppShell title="Skill Development & Enhancements">
      {jobId ? (
        <div className="mb-4">
          <Link
            to={`/jobs/${jobId}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" /> Back to {jobTitle || "job details"}
          </Link>
        </div>
      ) : null}

      <PageHeader
        title={jobId && jobTitle ? `Targeted Learning Plan: ${jobTitle}` : "Skill Development & Enhancements"}
        description={
          jobId && company
            ? `Skill gap roadmap customized for ${jobTitle} at ${company}. Prioritizing required skills to maximize your hiring chance.`
            : "Skill enhancements and learning roadmap derived from your candidate profile and target roles."
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {jobId ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchParams({})}
                className="cursor-pointer"
              >
                Reset to General Target Role Plan
              </Button>
            ) : null}
            <Button size="sm" onClick={() => void reload()} className="cursor-pointer">
              Refresh analysis
            </Button>
          </div>
        }
      />

      {/* JOB CONTEXT BANNER */}
      {jobId ? (
        <div className="mb-6 rounded-xl border border-primary/20 bg-accent-subtle/30 p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
              <Target className="size-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                Targeting Role Requirements
              </p>
              <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span>{jobTitle || "Selected Opportunity"}</span>
                {company ? (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-normal">
                    <Building2 className="size-3.5" /> {company}
                  </span>
                ) : null}
              </p>
            </div>
          </div>
          <span className="text-xs text-muted-foreground bg-surface px-3 py-1.5 rounded-md border border-border">
            Missing skills are prioritized as <strong>High Priority Gaps</strong>
          </span>
        </div>
      ) : null}

      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {loading && !data ? <CardsSkeleton count={3} height={140} /> : null}

      {!loading && gaps.length === 0 ? (
        <EmptyState
          title="No skill gaps detected"
          description="Complete your candidate profile with target roles to generate a customized learning plan."
          actionLabel="Go to Candidate Profile"
          onAction={() => (window.location.href = "/profile")}
        />
      ) : null}

      {gaps.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatTile label="Total requirements" value={gaps.length} />
            <StatTile
              label="Gaps to close"
              value={highPriorityGaps.length}
              hint="High priority skills to address"
            />
            <StatTile
              label="Skills verified"
              value={readySkills.length}
              hint="Already matched on your profile"
            />
          </div>

          <SectionCard
            title={jobId ? "Targeted Requirements & Learning Roadmap" : "Skill Gap Analysis"}
            description="Requirement details, your profile evidence, and recommended project tasks."
          >
            <ul className="grid gap-4">
              {gaps.map((gap) => {
                const isMissing = gap.status === "missing";
                const isModerate = gap.status === "moderate";

                return (
                  <li
                    key={gap.id}
                    className="rounded-xl border border-border bg-surface p-4.5 shadow-card transition-all duration-150 ease-out hover:border-border-strong flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-base font-bold text-foreground">{gap.skill}</span>
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
                                : isModerate
                                  ? "warning"
                                  : "danger"
                            }
                          >
                            {gap.status === "strong"
                              ? "Verified in profile"
                              : isModerate
                                ? "Partial match"
                                : "Skill gap (Missing)"}
                          </StatusBadge>
                        </div>
                      </div>

                      <div className="mt-2.5 space-y-1 text-xs sm:text-sm text-muted-foreground">
                        <p>
                          <strong className="text-foreground">Requirement:</strong>{" "}
                          {gap.requirement}
                        </p>
                        <p>
                          <strong className="text-foreground">Your status:</strong> {gap.evidence}
                        </p>
                      </div>

                      <ProgressBar
                        className="mt-3.5"
                        value={gap.status === "strong" ? 100 : isModerate ? 60 : 25}
                        tone={
                          gap.status === "strong"
                            ? "success"
                            : isModerate
                              ? "warning"
                              : "danger"
                        }
                        label={`${gap.skill} readiness`}
                      />
                    </div>

                    <div className="mt-3.5 rounded-lg bg-surface-hover/80 border border-border/60 p-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                        <Sparkles className="size-3" /> Recommended Action / Learning Milestone
                      </span>
                      <p className="mt-1 text-xs sm:text-sm font-medium text-foreground">
                        {gap.learningTask}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </SectionCard>

          <BackendNotice>
            Learning roadmap is computed dynamically from candidate profile skills and the specific job requirements.
          </BackendNotice>
        </>
      ) : null}
    </AppShell>
  );
}
