import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Loader2,
  RotateCcw,
  Send,
  Sparkles,
} from "lucide-react";

import { AiLabel, StatusBadge } from "@/components/common/indicators";
import { PageHeader, SectionCard } from "@/components/common/page";
import { EmptyState, ErrorState, RowsSkeleton } from "@/components/common/states";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAsyncData } from "@/hooks/useAsyncData";
import { interviewService } from "@/services/interview/interviewService";
import { cn } from "@/lib/utils";

export function CategoryWorkspace({ category, title, description }) {
  const { data, loading, error, reload, setData } = useAsyncData(
    () => interviewService.getCategoryQuestions(category),
    [category],
  );
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(null);
  const [toggling, setToggling] = useState(null);
  const [openTips, setOpenTips] = useState({});

  // Safely extract questions array under all response formats
  const questionsList = Array.isArray(data)
    ? data
    : Array.isArray(data?.questions)
      ? data.questions
      : Array.isArray(data?.data)
        ? data.data
        : [];

  // Toggle completion checkbox button
  const handleToggleComplete = async (q) => {
    setToggling(q.id);
    const nextState = !q.completed;
    try {
      await interviewService.toggleComplete({
        itemId: q.id,
        category,
        completed: nextState,
        title: q.question || q.title || q.id,
      });

      setData((prev) => {
        const prevList = Array.isArray(prev)
          ? prev
          : Array.isArray(prev?.questions)
            ? prev.questions
            : [];
        return prevList.map((item) =>
          item.id === q.id ? { ...item, completed: nextState } : item,
        );
      });

      if (nextState) {
        toast.success("Question marked as completed! Readiness updated.");
      } else {
        toast.info("Marked as incomplete.");
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setToggling(null);
    }
  };

  // Submit answer for AI feedback
  const submitAnswer = async (q) => {
    const text = answers[q.id] || q.answer || "";
    if (!text.trim()) {
      toast.error("Please write your answer before submitting");
      return;
    }

    setSubmitting(q.id);
    try {
      const res = await interviewService.submitAnswer(q.id, text, category);
      setData((prev) => {
        const prevList = Array.isArray(prev)
          ? prev
          : Array.isArray(prev?.questions)
            ? prev.questions
            : [];
        return prevList.map((item) =>
          item.id === q.id
            ? {
                ...item,
                completed: true,
                feedback: res.feedback,
                score: res.score,
                answer: text,
              }
            : item,
        );
      });
      toast.success(`Answer evaluated! Score: ${res.score}/100`);
    } catch {
      toast.error("Failed to evaluate answer");
    } finally {
      setSubmitting(null);
    }
  };

  const completedCount = questionsList.filter((q) => q.completed).length;
  const totalCount = questionsList.length;

  return (
    <AppShell title={title}>
      <div className="mb-3">
        <Link
          to="/interview"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" /> Back to Interview Preparation Dashboard
        </Link>
      </div>

      <PageHeader
        title={title}
        description={description}
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground bg-surface px-3 py-1.5 rounded-lg border border-border">
              Completed: <strong className="text-primary">{completedCount}</strong> / {totalCount}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void reload()}
              className="cursor-pointer gap-1.5"
            >
              <RotateCcw className="size-3.5" /> Refresh Questions
            </Button>
          </div>
        }
      />

      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {loading && questionsList.length === 0 ? <RowsSkeleton count={3} /> : null}

      {!loading && questionsList.length === 0 ? (
        <EmptyState
          title="No questions generated yet"
          description="Click refresh to load tailored questions for your stack."
          actionLabel="Load questions"
          onAction={() => void reload()}
        />
      ) : null}

      <div className="space-y-4">
        {questionsList.map((q, idx) => {
          const isDone = Boolean(q.completed);
          const isTipOpen = Boolean(openTips[q.id]);

          return (
            <SectionCard
              key={q.id}
              className={cn(
                "transition-all",
                isDone && "border-success/40 bg-surface/90",
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="size-6 rounded-full bg-surface-hover text-foreground text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <StatusBadge tone="primary">{q.topic}</StatusBadge>
                  <StatusBadge
                    tone={
                      q.difficulty === "Hard"
                        ? "danger"
                        : q.difficulty === "Medium"
                          ? "warning"
                          : "success"
                    }
                  >
                    {q.difficulty}
                  </StatusBadge>
                </div>

                {/* Direct Mark Done Toggle Button */}
                <Button
                  size="sm"
                  variant={isDone ? "default" : "outline"}
                  disabled={toggling === q.id}
                  onClick={() => handleToggleComplete(q)}
                  className={cn(
                    "cursor-pointer text-xs gap-1.5",
                    isDone && "bg-success hover:bg-success/90 text-success-foreground border-success",
                  )}
                >
                  <CheckCircle2 className="size-3.5" />
                  {isDone ? "Completed" : "Mark as Done"}
                </Button>
              </div>

              <p className="mt-3 text-sm font-semibold text-foreground leading-relaxed">
                {q.question || q.title}
              </p>

              {q.description && q.question ? (
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  {q.description}
                </p>
              ) : null}

              {/* Starter code preview if available */}
              {q.starterCode ? (
                <div className="mt-3 rounded-lg border border-border bg-surface-hover/70 p-3">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Implementation Stub:
                  </p>
                  <pre className="text-[11px] font-mono text-foreground/90 overflow-x-auto whitespace-pre">
                    {q.starterCode}
                  </pre>
                </div>
              ) : null}

              {/* Textarea answer input */}
              <div className="mt-3">
                <label className="sr-only" htmlFor={`answer-${q.id}`}>
                  Your answer
                </label>
                <Textarea
                  id={`answer-${q.id}`}
                  rows={4}
                  placeholder="Structure your solution approach or implementation here..."
                  value={answers[q.id] ?? q.answer ?? ""}
                  onChange={(e) =>
                    setAnswers((a) => ({ ...a, [q.id]: e.target.value }))
                  }
                  className="text-sm bg-surface-hover/30"
                />
              </div>

              {/* Action Buttons & Tip Accordion */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => submitAnswer(q)}
                    disabled={submitting === q.id}
                    className="cursor-pointer gap-1.5 text-xs"
                  >
                    {submitting === q.id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Send className="size-3.5" />
                    )}
                    Submit for AI Evaluation
                  </Button>

                  {q.solutionTip ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setOpenTips((t) => ({ ...t, [q.id]: !t[q.id] }))
                      }
                      className="cursor-pointer gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Lightbulb className="size-3.5 text-amber-500" />
                      {isTipOpen ? "Hide Strategy" : "View Key Strategy"}
                    </Button>
                  ) : null}
                </div>

                {isDone ? (
                  <span className="text-[11px] font-bold text-success flex items-center gap-1">
                    <CheckCircle2 className="size-3.5" /> Solved & Completed
                  </span>
                ) : null}
              </div>

              {/* Key Solution Strategy Tip */}
              {isTipOpen && q.solutionTip ? (
                <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-foreground leading-relaxed">
                  <p className="font-bold text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1">
                    <Lightbulb className="size-3.5" /> Recommended Architecture & Key Points:
                  </p>
                  {q.solutionTip}
                </div>
              ) : null}

              {/* AI Evaluation Feedback Card */}
              {q.feedback ? (
                <div className="mt-3 rounded-lg border border-accent/20 bg-accent-subtle/40 p-3.5">
                  <div className="flex items-center justify-between mb-1">
                    <AiLabel>AI Feedback & Scoring</AiLabel>
                    <span className="text-xs font-extrabold text-primary">Score: {q.score || 85}/100</span>
                  </div>
                  <p className="text-xs leading-relaxed text-foreground mt-1">
                    {q.feedback}
                  </p>
                </div>
              ) : null}
            </SectionCard>
          );
        })}
      </div>
    </AppShell>
  );
}
