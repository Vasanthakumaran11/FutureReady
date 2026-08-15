import { Link, createFileRoute } from "@tanstack/react-router";
import { Check, Download, Loader2, RefreshCw, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { JourneyStrip } from "@/components/common/JourneyStrip";
import { AiLabel, ProgressBar, ProgressRing, SeverityBadge, StatusBadge } from "@/components/common/indicators";
import { BackendNotice, PageHeader, SectionCard } from "@/components/common/page";
import { EmptyState, ErrorState, RowsSkeleton } from "@/components/common/states";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAsyncData } from "@/hooks/useAsyncData";
import { resumeService } from "@/services/resume/resumeService";

export const Route = createFileRoute("/_authenticated/resume/analyze")({
  head: () => ({
    meta: [
      { title: "Resume Analysis & Refinement — FutureReady" },
      {
        name: "description",
        content:
          "See resume completeness, structure and target-role relevance, then review AI refinement suggestions line by line.",
      },
      { property: "og:title", content: "Resume Analysis & Refinement — FutureReady" },
      { property: "og:description", content: "Issues by severity plus reviewable AI suggestions." },
    ],
  }),
  component: ResumeAnalyzePage,
});

type Decision = "pending" | "accepted" | "rejected";

function ResumeAnalyzePage() {
  const resume = useAsyncData(() => resumeService.getResume());
  const analysis = useAsyncData(() => resumeService.analyzeResume());
  const suggestions = useAsyncData(() => resumeService.getSuggestions());
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<string | null>(null);

  const decide = (id: string, decision: Decision) => {
    setDecisions((d) => ({ ...d, [id]: decision }));
    toast.success(decision === "accepted" ? "Suggestion accepted" : "Suggestion rejected");
  };

  if (resume.data && !resume.data.hasResume) {
    return (
      <AppShell title="Resume analysis">
        <JourneyStrip current="Resume" />
        <PageHeader title="Resume analysis" description="Upload a resume to run the analysis." />
        <EmptyState
          title="No resume uploaded yet"
          description="Upload a PDF or DOCX resume and FutureReady will score it against your target role."
          secondary={
            <Button asChild>
              <Link to="/resume">Upload resume</Link>
            </Button>
          }
        />
      </AppShell>
    );
  }

  return (
    <AppShell title="Resume analysis">
      <JourneyStrip current="Resume" />
      <PageHeader
        title="Resume analysis and refinement"
        description="Scored against your major target role. Every suggestion is rewritten from facts already in your profile."
        actions={
          <Button variant="outline" onClick={() => void analysis.reload()} disabled={analysis.loading}>
            <RefreshCw className={analysis.loading ? "size-4 animate-spin" : "size-4"} aria-hidden />
            Re-analyse
          </Button>
        }
      />

      {analysis.error ? <ErrorState message={analysis.error} onRetry={analysis.reload} /> : null}
      {analysis.loading && !analysis.data ? <RowsSkeleton count={4} /> : null}

      {analysis.data ? (
        <>
          <SectionCard title="Analysis summary" description={`Target role: ${analysis.data.targetRole}`}>
            <div className="grid gap-6 lg:grid-cols-[auto_1fr] lg:items-center">
              <div className="flex justify-center">
                <ProgressRing value={analysis.data.overallScore} caption="Resume score" />
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {analysis.data.sections.map((s) => (
                  <li key={s.section}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-medium">{s.section}</span>
                      <span className="text-sm text-muted-foreground">{s.score}%</span>
                    </div>
                    <ProgressBar
                      value={s.score}
                      tone={s.score >= 80 ? "success" : s.score >= 65 ? "primary" : "warning"}
                      className="mt-1.5"
                      label={s.section}
                    />
                    <p className="mt-1 text-xs text-muted-foreground">{s.note}</p>
                  </li>
                ))}
              </ul>
            </div>
          </SectionCard>

          <SectionCard title="Identified issues" description="Grouped by severity, most damaging first." bodyClassName="p-0">
            <ul className="divide-y divide-border">
              {analysis.data.issues.map((issue) => (
                <li key={issue.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <SeverityBadge severity={issue.severity} />
                      <StatusBadge>{issue.section}</StatusBadge>
                    </div>
                    <p className="mt-2 text-sm font-medium">{issue.message}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{issue.recommendation}</p>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        </>
      ) : null}

      <SectionCard
        title="AI refinement"
        description="Compare your current content with the suggested rewrite. Accept, reject or edit manually."
        actions={
          <Button variant="outline" size="sm" onClick={() => void suggestions.reload()} disabled={suggestions.loading}>
            {suggestions.loading ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : null}
            Regenerate
          </Button>
        }
        bodyClassName="p-0"
      >
        {suggestions.error ? (
          <div className="p-5">
            <ErrorState message={suggestions.error} onRetry={suggestions.reload} />
          </div>
        ) : suggestions.loading && !suggestions.data ? (
          <div className="p-5">
            <RowsSkeleton count={3} />
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {suggestions.data?.map((s) => {
              const decision = decisions[s.id] ?? "pending";
              return (
                <li key={s.id} className="space-y-3 px-5 py-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold">{s.section}</h3>
                    {decision === "accepted" ? (
                      <StatusBadge tone="success">Accepted</StatusBadge>
                    ) : decision === "rejected" ? (
                      <StatusBadge tone="danger">Rejected</StatusBadge>
                    ) : (
                      <StatusBadge tone="warning">Awaiting your review</StatusBadge>
                    )}
                  </div>

                  <div className="grid gap-3 lg:grid-cols-2">
                    <div className="rounded-md border border-border bg-muted/40 p-3">
                      <p className="text-eyebrow">Current content</p>
                      <p className="mt-1.5 text-sm text-muted-foreground">{s.current}</p>
                    </div>
                    <div className="rounded-md border border-ai/30 bg-ai-soft p-3">
                      <AiLabel />
                      {editing === s.id ? (
                        <Textarea
                          className="mt-2"
                          rows={4}
                          value={edits[s.id] ?? s.suggestion}
                          onChange={(e) => setEdits((v) => ({ ...v, [s.id]: e.target.value }))}
                        />
                      ) : (
                        <p className="mt-1.5 text-sm">{edits[s.id] ?? s.suggestion}</p>
                      )}
                      <p className="mt-2 text-xs text-muted-foreground">{s.rationale}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => decide(s.id, "accepted")}>
                      <Check className="size-3.5" aria-hidden /> Accept
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => decide(s.id, "rejected")}>
                      <X className="size-3.5" aria-hidden /> Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditing((cur) => (cur === s.id ? null : s.id))}
                    >
                      {editing === s.id ? "Done editing" : "Edit manually"}
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>

      <SectionCard title="Final resume" description="Preview and export once you have reviewed the suggestions.">
        <div className="rounded-md border border-border bg-muted/30 p-5">
          <p className="text-sm font-semibold">Preview</p>
          <p className="mt-1 text-sm text-muted-foreground">
            The rendered preview is produced by the backend document service. Accepted suggestions
            are applied to your stored resume once that endpoint is connected.
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link to="/resume/create">Edit in builder</Link>
          </Button>
          <Button onClick={() => toast("Saving connects to the FastAPI resume endpoint.")}>Save resume</Button>
          <Button variant="outline" onClick={() => toast("Export is generated by the backend document service.")}>
            <Download className="size-4" aria-hidden /> Export
          </Button>
        </div>
        <div className="mt-4">
          <BackendNotice />
        </div>
      </SectionCard>
    </AppShell>
  );
}
