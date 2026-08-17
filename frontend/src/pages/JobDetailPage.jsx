import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Bookmark, ExternalLink, Sparkles } from "lucide-react";

import {
  MatchSkillBadge,
  ProgressBar,
  ProgressRing,
  StatusBadge,
} from "@/components/common/indicators";
import { BackendNotice, PageHeader, SectionCard } from "@/components/common/page";
import { CardsSkeleton, EmptyState, ErrorState } from "@/components/common/states";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { useAsyncData } from "@/hooks/useAsyncData";
import { jobService } from "@/services/jobs/jobService";

const BREAKDOWN_LABELS = {
  skillMatch: "Skill alignment",
  roleMatch: "Target role fit",
  experienceMatch: "Experience match",
  locationMatch: "Location alignment",
  semanticRelevance: "Overall relevance",
};

export function JobDetailPage() {
  const { jobId } = useParams();
  const { data, loading, error, reload } = useAsyncData(
    () => jobService.getJobMatch(jobId),
    [jobId],
  );

  return (
    <AppShell title="Job Match Details">
      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {loading && !data ? <CardsSkeleton count={3} height={180} /> : null}

      {!loading && !data ? (
        <EmptyState
          title="Job not found"
          description="This job posting is no longer available."
          actionLabel="Back to Jobs"
          onAction={() => window.history.back()}
        />
      ) : null}

      {data && data.job ? (
        <>
          <div className="mb-4">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-3.5" /> Back to job opportunities
            </Link>
          </div>

          <PageHeader
            title={data.job.title}
            description={`${data.job.company} · ${data.job.location} · ${data.job.workMode || "Hybrid"} · ${data.job.experience || "0-2 years"}`}
            actions={
              <div className="flex flex-wrap items-center gap-2">
                {data.job.sourceUrl ? (
                  <Button asChild className="gap-1.5 cursor-pointer">
                    <a
                      href={data.job.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open job application page"
                    >
                      Apply on {data.job.source || "Source"} <ExternalLink className="size-4" />
                    </a>
                  </Button>
                ) : null}

                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => {
                    void jobService.saveJob(data.job);
                    toast.success(`"${data.job.title}" saved to application tracker`);
                  }}
                >
                  <Bookmark className="size-4 mr-1.5" /> Save job
                </Button>
              </div>
            }
          />

          <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
            {/* MATCH SCORE & BREAKDOWN */}
            <SectionCard title="Match Score Breakdown">
              <div className="flex flex-col items-center justify-center p-2">
                <ProgressRing value={data.job.matchScore} caption="Overall profile match" />
                <p className="mt-3 text-xs text-muted-foreground text-center">
                  Calculated against your candidate skills, target role, and experience level.
                </p>
              </div>

              {data.breakdown ? (
                <ul className="mt-5 grid gap-3 border-t border-border pt-4">
                  {Object.entries(data.breakdown).map(([key, value]) => (
                    <li key={key}>
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="font-medium text-foreground">
                          {BREAKDOWN_LABELS[key] ?? key}
                        </span>
                        <span className="font-semibold text-muted-foreground">{value}%</span>
                      </div>
                      <ProgressBar
                        value={value}
                        className="mt-1"
                        label={BREAKDOWN_LABELS[key] ?? key}
                      />
                    </li>
                  ))}
                </ul>
              ) : null}
            </SectionCard>

            {/* DETAILS & SKILL COMPARISON */}
            <div className="grid gap-4">
              {/* SKILL COMPARISON */}
              <SectionCard
                title="Skill Comparison"
                description="Required technical skills matched against your candidate profile."
              >
                <div className="flex flex-wrap gap-1.5">
                  {data.job.skills?.map((s) => (
                    <MatchSkillBadge key={s.skill} skill={s.skill} status={s.status} />
                  ))}
                </div>
              </SectionCard>

              {/* WHY THIS WAS RECOMMENDED */}
              {data.recommendedBecause && data.recommendedBecause.length > 0 ? (
                <SectionCard title="Why this was recommended">
                  <ul className="grid gap-2">
                    {data.recommendedBecause.map((r) => (
                      <li key={r} className="text-sm text-muted-foreground flex items-start gap-2">
                        <Sparkles className="size-4 text-primary shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </SectionCard>
              ) : null}

              {/* SKILLS TO IMPROVE (SKILL GAPS) */}
              {data.skillsToImprove && data.skillsToImprove.length > 0 ? (
                <SectionCard
                  title="Skill Gaps to Address"
                  description="Close these skill gaps to increase your match percentage for this role."
                >
                  <div className="flex flex-wrap gap-1.5">
                    {data.skillsToImprove.map((s) => (
                      <StatusBadge key={s} tone="warning">
                        {s}
                      </StatusBadge>
                    ))}
                  </div>
                  <div className="pt-3">
                    <Button asChild size="sm" variant="outline" className="cursor-pointer">
                      <Link
                        to={`/skills?jobId=${encodeURIComponent(data.job.id)}&title=${encodeURIComponent(data.job.title)}&company=${encodeURIComponent(data.job.company)}`}
                      >
                        View Targeted Learning Plan for this Role
                      </Link>
                    </Button>
                  </div>
                </SectionCard>
              ) : null}

              {/* DESCRIPTION */}
              <SectionCard title="Job Description & Responsibilities">
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                  {data.job.description || "No full description provided by the source."}
                </p>
                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span>Source: {data.job.source || "Direct"}</span>
                  {data.job.salary ? <span>Compensation: {data.job.salary}</span> : null}
                </div>
              </SectionCard>
            </div>
          </div>

          <BackendNotice>
            Profile matching is computed by FutureReady using rule-based scoring across your verified candidate skills, experience level, and target role.
          </BackendNotice>
        </>
      ) : null}
    </AppShell>
  );
}
