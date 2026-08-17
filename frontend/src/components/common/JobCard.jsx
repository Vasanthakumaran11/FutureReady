import { Link } from "react-router-dom";
import { Bookmark, Building2, ExternalLink, MapPin } from "lucide-react";

import { ProgressBar, StatusBadge } from "@/components/common/indicators";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function JobCard({ job, onSave }) {
  const matchScore = job.matchScore || 0;
  const matchTone = matchScore >= 80 ? "success" : matchScore >= 60 ? "warning" : "neutral";

  const matchColorClass =
    matchScore >= 80 ? "text-success" : matchScore >= 60 ? "text-warning" : "text-tertiary";

  return (
    <article className="group rounded-xl border border-border bg-surface p-5 shadow-card transition-all duration-200 ease-out hover:border-border-strong hover:shadow-md flex flex-col justify-between">
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[16px] font-bold text-foreground group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground sm:text-[13px]">
              <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                <Building2 className="size-3.5 text-muted-foreground" aria-hidden /> {job.company}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3.5" aria-hidden /> {job.location}
              </span>
              <span className="rounded bg-surface-hover px-1.5 py-0.5 text-xs font-medium">
                {job.workMode || "Hybrid"}
              </span>
              <span>{job.experience || "0-2 years"}</span>
              {job.salary ? (
                <span className="font-semibold text-foreground">{job.salary}</span>
              ) : null}
            </p>
          </div>

          {/* Match Score Badge */}
          <div className="w-28 shrink-0 text-right sm:w-32 bg-accent-subtle/50 rounded-lg p-2 border border-primary/10">
            <div className="flex items-baseline justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Match</span>
              <span className={cn("text-stat-num text-lg font-extrabold", matchColorClass)}>
                {matchScore}%
              </span>
            </div>
            <ProgressBar
              value={matchScore}
              tone={matchTone === "neutral" ? "primary" : matchTone}
              label={`Match score for ${job.title}`}
              className="mt-1"
            />
          </div>
        </div>

        {/* Job Description Overview */}
        <div className="mt-3.5 rounded-lg bg-surface-hover/60 border border-border/40 p-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
            About the Role:
          </p>
          <p className="text-xs text-foreground/80 leading-relaxed line-clamp-3">
            {job.description ||
              "Explore full qualifications, tech stack requirements, and key responsibilities for this opportunity."}
          </p>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border/60">
        <div className="flex items-center gap-2">
          <StatusBadge tone="neutral">Source: {job.source || "Direct"}</StatusBadge>
          {job.sourceUrl ? (
            <a
              href={job.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              title="Open original job posting"
            >
              Apply on {job.source || "Source"} <ExternalLink className="size-3" />
            </a>
          ) : null}
        </div>

        <div className="flex gap-2">
          {onSave ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSave(job)}
              className="cursor-pointer"
              title="Save to Applications Tracker"
            >
              <Bookmark className="size-3.5" aria-hidden /> Save
            </Button>
          ) : null}
          <Button size="sm" asChild className="cursor-pointer">
            <Link to={`/jobs/${job.id}`}>View match details</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
