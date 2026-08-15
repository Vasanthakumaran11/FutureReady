import { createFileRoute } from "@tanstack/react-router";

import { JourneyStrip } from "@/components/common/JourneyStrip";
import { StatusBadge } from "@/components/common/indicators";
import { PageHeader, SectionCard } from "@/components/common/page";
import { EmptyState, ErrorState, RowsSkeleton } from "@/components/common/states";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { useAsyncData } from "@/hooks/useAsyncData";
import { interviewService } from "@/services/interview/interviewService";

export const Route = createFileRoute("/_authenticated/interview/coding")({
  head: () => ({
    meta: [
      { title: "Coding Practice — FutureReady" },
      { name: "description", content: "Implementation tasks with difficulty, completion status and past performance." },
      { property: "og:title", content: "Coding Practice — FutureReady" },
      { property: "og:description", content: "Track coding tasks and practice history." },
    ],
  }),
  component: CodingPage,
});

function CodingPage() {
  const { data, loading, error, reload } = useAsyncData(() => interviewService.getCodingTasks());

  return (
    <AppShell title="Coding practice">
      <JourneyStrip current="Interview prep" />
      <PageHeader
        title="Coding practice"
        description="Applied implementation tasks matched to your target role."
        actions={<Button onClick={() => void reload()}>Generate practice set</Button>}
      />

      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {loading && !data ? <RowsSkeleton count={4} /> : null}

      {data && data.length === 0 ? (
        <EmptyState
          title="No coding tasks available"
          description="Generate a practice set based on your target role and current gaps."
          actionLabel="Generate practice set"
          onAction={() => void reload()}
        />
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        {data?.map((task) => (
          <SectionCard key={task.id}>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge tone={task.difficulty === "Hard" ? "danger" : task.difficulty === "Medium" ? "warning" : "success"}>
                {task.difficulty}
              </StatusBadge>
              <StatusBadge tone={task.status === "completed" ? "success" : task.status === "in-progress" ? "primary" : "neutral"}>
                {task.status.replace("-", " ")}
              </StatusBadge>
              {task.score ? <StatusBadge>Score {task.score}%</StatusBadge> : null}
            </div>
            <h3 className="mt-3 text-sm font-semibold">{task.title}</h3>
            {task.lastAttempt ? (
              <p className="mt-1 text-xs text-muted-foreground">Last attempt: {task.lastAttempt}</p>
            ) : null}
            <div className="mt-4 flex gap-2">
              <Button size="sm">{task.status === "not-started" ? "Start task" : "Continue"}</Button>
              <Button size="sm" variant="outline">
                View details
              </Button>
            </div>
          </SectionCard>
        ))}
      </div>
    </AppShell>
  );
}
