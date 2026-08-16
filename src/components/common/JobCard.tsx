import { Link } from "@tanstack/react-router";
import { Bookmark, Building2, MapPin } from "lucide-react";

import { MatchSkillBadge, ProgressBar, StatusBadge } from "@/components/common/indicators";
import { Button } from "@/components/ui/button";
import type { Job } from "@/types";

export function JobCard({ job, onSave }: { job: Job; onSave?: (job: Job) => void }) {
  return (
    <article className="rounded-md border border-border bg-surface-raised p-6 shadow-card transition-colors duration-150 hover:border-border-strong">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold">{job.title}</h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Building2 className="size-3.5" aria-hidden /> {job.company}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" aria-hidden /> {job.location}
            </span>
            <span>{job.workMode}</span>
            <span>{job.experience}</span>
            {job.salary ? <span>{job.salary}</span> : null}
          </p>
        </div>
        <div className="w-32 shrink-0">
          <div className="flex items-baseline justify-between">
            <span className="text-eyebrow">Match</span>
            <span className="text-num text-xl font-semibold text-primary">{job.matchScore}%</span>
          </div>
          <ProgressBar
            value={job.matchScore}
            tone={job.matchScore >= 75 ? "success" : job.matchScore >= 60 ? "primary" : "warning"}
            label={`Match score for ${job.title}`}
            className="mt-1.5"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {job.skills.map((s) => (
          <MatchSkillBadge key={s.skill} skill={s.skill} status={s.status} />
        ))}
      </div>

      <div className="mt-4 rounded-sm bg-surface px-4 py-3">
        <p className="text-eyebrow">Why this job matches</p>
        <ul className="mt-1.5 space-y-1 text-sm text-muted-foreground">
          {job.matchReasons.slice(0, 2).map((reason) => (
            <li key={reason}>• {reason}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <StatusBadge>Source: {job.source}</StatusBadge>
        <div className="flex gap-2">
          {onSave ? (
            <Button variant="outline" size="sm" onClick={() => onSave(job)}>
              <Bookmark className="size-3.5" aria-hidden /> Save
            </Button>
          ) : null}
          <Button size="sm" asChild>
            <Link to="/jobs/$jobId" params={{ jobId: job.id }}>
              View match details
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
