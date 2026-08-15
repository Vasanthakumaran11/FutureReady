import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { JobCard } from "@/components/common/JobCard";
import { JourneyStrip } from "@/components/common/JourneyStrip";
import { PageHeader, SectionCard } from "@/components/common/page";
import { CardsSkeleton, EmptyState, ErrorState } from "@/components/common/states";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAsyncData } from "@/hooks/useAsyncData";
import { jobService } from "@/services/jobs/jobService";
import type { Job } from "@/types";

export const Route = createFileRoute("/_authenticated/jobs/")({
  head: () => ({
    meta: [
      { title: "Job Search — FutureReady" },
      {
        name: "description",
        content: "Skill-matched job recommendations with match scores, filters and one-click saving.",
      },
      { property: "og:title", content: "Job Search — FutureReady" },
      { property: "og:description", content: "Find roles matched to your real skills." },
    ],
  }),
  component: JobsPage,
});

function JobsPage() {
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [applied, setApplied] = useState({ q: "", location: "" });
  const { data, loading, error, reload } = useAsyncData(
    () => jobService.searchJobs({ q: applied.q, location: applied.location, pageSize: 6 }),
    [applied],
  );

  const save = async (job: Job) => {
    await jobService.saveJob(job);
    toast.success(`${job.title} saved to your tracker`);
  };

  return (
    <AppShell title="Job search">
      <JourneyStrip current="Job matches" />
      <PageHeader
        title="Job search"
        description="Roles are ranked by how well your skills, experience and projects match each posting."
      />

      <SectionCard title="Filters">
        <form
          className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            setApplied({ q, location });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="q">Role or company</Label>
            <Input id="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Backend Developer" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="loc">Location</Label>
            <Input id="loc" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Bengaluru" />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </SectionCard>

      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {loading && !data ? <CardsSkeleton count={4} height={200} /> : null}

      {data && data.items.length === 0 ? (
        <EmptyState
          title="No matching jobs"
          description="Try widening your filters or clearing the location."
          actionLabel="Clear filters"
          onAction={() => {
            setQ("");
            setLocation("");
            setApplied({ q: "", location: "" });
          }}
        />
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        {data?.items.map((job) => (
          <JobCard key={job.id} job={job} onSave={(j) => void save(j)} />
        ))}
      </div>
    </AppShell>
  );
}
