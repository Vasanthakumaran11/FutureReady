import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { JourneyStrip } from "@/components/common/JourneyStrip";
import { AiLabel, StatusBadge } from "@/components/common/indicators";
import { BackendNotice, PageHeader, SectionCard } from "@/components/common/page";
import { EmptyState, ErrorState, RowsSkeleton } from "@/components/common/states";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAsyncData } from "@/hooks/useAsyncData";
import { interviewService } from "@/services/interview/interviewService";
import type { InterviewCategory, InterviewQuestion } from "@/types";

export function CategoryWorkspace({
  category,
  title,
  description,
}: {
  category: InterviewCategory;
  title: string;
  description: string;
}) {
  const { data, loading, error, reload, setData } = useAsyncData(
    () => interviewService.getInterviewQuestions(category),
    [category],
  );
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const generate = async () => {
    setGenerating(true);
    setData(await interviewService.generateQuestions(category));
    setGenerating(false);
    toast.success("Question set refreshed");
  };

  const submit = async (q: InterviewQuestion) => {
    setBusy(q.id);
    const { feedback } = await interviewService.submitInterviewAnswer(q.id, answers[q.id] ?? "");
    setData(
      (data ?? []).map((item) =>
        item.id === q.id ? { ...item, status: "reviewed", feedback, answer: answers[q.id] ?? "" } : item,
      ),
    );
    setBusy(null);
  };

  return (
    <AppShell title={title}>
      <JourneyStrip current="Interview prep" />
      <PageHeader
        title={title}
        description={description}
        actions={
          <Button onClick={() => void generate()} disabled={generating}>
            {generating ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Sparkles className="size-4" aria-hidden />}
            Generate questions
          </Button>
        }
      />

      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {loading && !data ? <RowsSkeleton count={3} /> : null}

      {data && data.length === 0 ? (
        <EmptyState
          title="No questions generated yet"
          description="Generate a set based on your resume, projects, target role and company."
          actionLabel="Generate questions"
          onAction={() => void generate()}
        />
      ) : null}

      {data?.map((q) => (
        <SectionCard key={q.id}>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone="primary">{q.topic}</StatusBadge>
            <StatusBadge tone={q.difficulty === "Hard" ? "danger" : q.difficulty === "Medium" ? "warning" : "success"}>
              {q.difficulty}
            </StatusBadge>
            <StatusBadge>{q.status}</StatusBadge>
          </div>
          <p className="mt-3 text-sm font-medium">{q.question}</p>
          <label className="sr-only" htmlFor={`answer-${q.id}`}>
            Your answer
          </label>
          <Textarea
            id={`answer-${q.id}`}
            className="mt-3"
            rows={4}
            placeholder="Structure your answer here…"
            value={answers[q.id] ?? q.answer ?? ""}
            onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => void submit(q)} disabled={busy === q.id}>
              {busy === q.id ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : null}
              Submit answer
            </Button>
            <Button size="sm" variant="outline" onClick={() => setAnswers((a) => ({ ...a, [q.id]: "" }))}>
              Retry
            </Button>
          </div>
          {q.feedback ? (
            <div className="mt-3 rounded-md border border-ai/30 bg-ai-soft p-3">
              <AiLabel>AI Feedback</AiLabel>
              <p className="mt-1.5 text-sm">{q.feedback}</p>
            </div>
          ) : null}
        </SectionCard>
      ))}

      <BackendNotice>
        Question generation and feedback are proxied through FastAPI to Gemini — no AI keys exist in
        this frontend.
      </BackendNotice>
    </AppShell>
  );
}
