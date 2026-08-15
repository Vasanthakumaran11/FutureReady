import { Link, createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { JourneyStrip } from "@/components/common/JourneyStrip";
import { MatchSkillBadge, ProgressBar, ProgressRing, StatusBadge } from "@/components/common/indicators";
import { BackendNotice, PageHeader, SectionCard } from "@/components/common/page";
import { CardsSkeleton, EmptyState, ErrorState } from "@/components/common/states";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { useAsyncData } from "@/hooks/useAsyncData";
import { jobService } from "@/services/jobs/jobService";

export const Route = createFileRoute("/_authenticated/jobs/$jobId")({
  head: () => ({
    meta: [
      { title: "Job Match Details — FutureReady" },
      {
        name: "description",
        content: "Why this role matches you: skill comparison, match breakdown and skills to improve.",
      },
      { property: "og:title", content: "Job Match Details — FutureReady" },
      { property: "og:description", content: "Transparent job match scoring and skill comparison." },
    ],
  }),
  component: JobDetailPage,
});

const BREAKDOWN_LABELS: Record<string, string> = {
  skillMatch: "Skill match",
  experienceMatch: "Experience match",
  roleMatch: "Role match",
  locationMatch: "Location match",
  semanticRelevance: "Semantic relevance",
};

function JobDetailPage() {
  const { jobId } = Route.useParams();
  const { data, loading, error, reload } = useAsyncData(() => jobService.getJobMatch(jobId), [jobId]);

  return (
    <AppShell title="Job details">
      <JourneyStrip current="Job matching" />

      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {loading && !data ? <CardsSkeleton count={3} height={160} /> : null}

      {!loading && !data ? (
        <EmptyState title="Job not found" description="This posting is no longer available." />
      ) : null}

      {data ? (
        <>
          <PageHeader
            title={data.job.title}
            description={`${data.job.company} · ${data.job.location} · ${data.job.workMode} · ${data.job.experience}`}
            actions={
              <>
                <Button
                  onClick={() => {
                    void jobService.saveJob(data.job);
                    toast.success("Saved to application tracker");
                  }}
                >
                  Save job
                </Button>
                <Button asChild variant="outline">
                  <Link to="/jobs">Back to search</Link>
                </Button>
              </>
            }
          />

          <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
            <SectionCard title="Match score">
              <div className="flex justify-center">
                <ProgressRing value={data.job.matchScore} caption="Overall match" />
              </div>
              <ul className="mt-5 grid gap-3">
                {Object.entries(data.breakdown).map(([key, value]) => (
                  <li key={key}>
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm">{BREAKDOWN_LABELS[key] ?? key}</span>
                      <span className="text-sm text-muted-foreground">{value}%</span>
                    </div>
                    <ProgressBar value={value} className="mt-1.5" label={BREAKDOWN_LABELS[key] ?? key} />
                  </li>
                ))}
              </ul>
            </SectionCard>

            <div className="grid gap-4">
              <SectionCard title="Skill comparison" description="Required skills against your verified profile.">
                <div className="flex flex-wrap gap-1.5">
                  {data.job.skills.map((s) => (
                    <MatchSkillBadge key={s.skill} skill={s.skill} status={s.status} />
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Why this was recommended">
                <ul className="grid gap-2">
                  {data.recommendedBecause.map((r) => (
                    <li key={r} className="text-sm text-muted-foreground">
                      • {r}
                    </li>
                  ))}
                </ul>
              </SectionCard>

              <SectionCard title="Skills to improve" description="Close these to raise your match score.">
                <div className="flex flex-wrap gap-1.5">
                  {data.skillsToImprove.map((s) => (
                    <StatusBadge key={s} tone="warning">
                      {s}
                    </StatusBadge>
                  ))}
                </div>
                <Button asChild size="sm" className="mt-4">
                  <Link to="/skills">Open skill plan</Link>
                </Button>
              </SectionCard>

              <SectionCard title="Description">
                <p className="text-sm text-muted-foreground">{data.job.description}</p>
              </SectionCard>
            </div>
          </div>

          <BackendNotice>
            Match scoring is computed by FastAPI using embeddings over your profile and the posting.
          </BackendNotice>
        </>
      ) : null}
    </AppShell>
  );
}
