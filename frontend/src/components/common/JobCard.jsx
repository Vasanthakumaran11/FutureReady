import { Link } from "react-router-dom";
import { Bookmark, Building2, MapPin } from "lucide-react";

import { MatchSkillBadge, ProgressBar, StatusBadge } from "@/components/common/indicators";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function JobCard({ job, onSave }) {
  const matchTone = job.matchScore >= 80 ? "success" : job.matchScore >= 60 ? "warning" : "neutral";

  const matchColorClass =
    job.matchScore >= 80 ? "text-success" : job.matchScore >= 60 ? "text-warning" : "text-tertiary";

  return (
    <article className="group rounded-md border border-border bg-surface p-5 shadow-card transition-all duration-150 ease-out hover:border-border-strong">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[16px] font-semibold text-foreground">{job.title}</h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground sm:text-[13px]">
            <span className="inline-flex items-center gap-1 font-medium text-foreground">
              <Building2 className="size-3.5 text-muted-foreground" aria-hidden /> {job.company}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" aria-hidden /> {job.location}
            </span>
            <span>{job.workMode}</span>
            <span>{job.experience}</span>
            {job.salary ? <span className="font-medium text-foreground">{job.salary}</span> : null}
          </p>
        </div>

        {/* Tiered match percentage */}
        <div className="w-28 shrink-0 text-right sm:w-32">
          <div className="flex items-baseline justify-between">
            <span className="text-eyebrow">Match</span>
            <span className={cn("text-stat-num text-xl font-bold", matchColorClass)}>
              {job.matchScore}%
            </span>
          </div>
          <ProgressBar
            value={job.matchScore}
            tone={matchTone === "neutral" ? "primary" : matchTone}
            label={`Match score for ${job.title}`}
            className="mt-1.5"
          />
        </div>
      </div>

      {/* Skill chips */}
      <div className="mt-3.5 flex flex-wrap gap-1.5">
        {job.skills.map((s) => (
          <MatchSkillBadge key={s.skill} skill={s.skill} status={s.status} />
        ))}
      </div>

      {/* Destructured "Why this job matches" box */}
      <div className="mt-3.5 rounded-sm bg-surface-hover px-3.5 py-2.5">
        <p className="text-eyebrow text-tertiary font-semibold">Why this job matches</p>
        <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
          {job.matchReasons.slice(0, 2).map((reason) => (
            <li key={reason} className="leading-normal">
              • {reason}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/40">
        <StatusBadge tone="neutral">Source: {job.source}</StatusBadge>
        <div className="flex gap-2">
          {onSave ? (
            <Button variant="outline" size="sm" onClick={() => onSave(job)}>
              <Bookmark className="size-3.5" aria-hidden /> Save
            </Button>
          ) : null}
          <Button size="sm" asChild>
            <Link to={`/jobs/${job.id}`}>View match details</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
