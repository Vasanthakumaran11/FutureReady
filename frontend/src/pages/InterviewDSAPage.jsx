import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowUpDown,
  CheckCircle2,
  ChevronRight,
  Cpu,
  GitFork,
  Link2,
  Network,
  Repeat,
  RotateCcw,
  Search,
  Sparkles,
} from "lucide-react";

import { ProgressBar, StatusBadge } from "@/components/common/indicators";
import { PageHeader, SectionCard } from "@/components/common/page";
import { CardsSkeleton, EmptyState, ErrorState } from "@/components/common/states";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAsyncData } from "@/hooks/useAsyncData";
import { interviewService } from "@/services/interview/interviewService";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS = {
  searching: Search,
  sorting: ArrowUpDown,
  linkedlist: Link2,
  recursion: Repeat,
  tree: GitFork,
  graph: Network,
  dp: Cpu,
};

export function InterviewDSAPage() {
  const { data, loading, error, reload, setData } = useAsyncData(() =>
    interviewService.getDsaCategories(),
  );

  // Selected Category Modal State
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toggling, setToggling] = useState(null);

  const openCategoryModal = (cat) => {
    setSelectedCategory(cat);
    setModalOpen(true);
  };

  // Toggle problem completion
  const handleToggleProblem = async (problem, categoryId) => {
    setToggling(problem.id);
    const nextState = !problem.completed;
    try {
      await interviewService.toggleComplete({
        itemId: problem.id,
        category: `dsa_${categoryId}`,
        completed: nextState,
        title: problem.title,
      });

      // Update local state in the category list
      setData((prev) => {
        const prevList = Array.isArray(prev) ? prev : [];
        return prevList.map((cat) => {
          if (cat.id === categoryId) {
            const updatedProblems = (cat.problems || []).map((p) =>
              p.id === problem.id ? { ...p, completed: nextState } : p,
            );
            const newSolved = updatedProblems.filter((p) => p.completed).length;
            const newProgress = Math.round((newSolved / (cat.total || 1)) * 100);
            return {
              ...cat,
              problems: updatedProblems,
              solved: newSolved,
              progress: newProgress,
            };
          }
          return cat;
        });
      });

      // Update selected category in modal view
      setSelectedCategory((prev) => {
        if (!prev) return prev;
        const updatedProblems = (prev.problems || []).map((p) =>
          p.id === problem.id ? { ...p, completed: nextState } : p,
        );
        const newSolved = updatedProblems.filter((p) => p.completed).length;
        const newProgress = Math.round((newSolved / (prev.total || 1)) * 100);
        return {
          ...prev,
          problems: updatedProblems,
          solved: newSolved,
          progress: newProgress,
        };
      });

      if (nextState) {
        toast.success(`Problem "${problem.title}" marked as completed!`);
      } else {
        toast.info("Marked as incomplete.");
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setToggling(null);
    }
  };

  const categoriesList = Array.isArray(data) ? data : [];
  const totalProblemsAll = categoriesList.reduce((acc, c) => acc + (c.total || 0), 0);
  const totalSolvedAll = categoriesList.reduce((acc, c) => acc + (c.solved || 0), 0);
  const totalPctAll = totalProblemsAll > 0 ? Math.round((totalSolvedAll / totalProblemsAll) * 100) : 0;

  return (
    <AppShell title="DSA Practice & Algorithms">
      <div className="mb-3">
        <Link
          to="/interview"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" /> Back to Interview Preparation Dashboard
        </Link>
      </div>

      <PageHeader
        title="Data Structures & Algorithms"
        description="Select a problem category to explore high-frequency patterns, study problem breakdowns, and mark problems as done."
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground bg-surface px-3 py-1.5 rounded-lg border border-border">
              Total Progress: <strong className="text-primary">{totalSolvedAll}/{totalProblemsAll}</strong> ({totalPctAll}%)
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void reload()}
              className="cursor-pointer gap-1.5"
            >
              <RotateCcw className="size-3.5" /> Refresh Categories
            </Button>
          </div>
        }
      />

      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {loading && categoriesList.length === 0 ? <CardsSkeleton count={6} height={140} /> : null}

      {/* DSA CATEGORIES GRID */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categoriesList.map((cat) => {
          const IconComp = CATEGORY_ICONS[cat.id] || Cpu;
          const isComplete = cat.solved >= cat.total && cat.total > 0;

          return (
            <div
              key={cat.id}
              onClick={() => openCategoryModal(cat)}
              className={cn(
                "rounded-xl border border-border bg-surface p-5 shadow-card hover:border-border-strong hover:bg-surface-hover/50 transition-all cursor-pointer flex flex-col justify-between group",
                isComplete && "border-success/40 bg-success-bg/10",
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                    <IconComp className="size-5" />
                  </div>
                  <StatusBadge tone={isComplete ? "success" : cat.solved > 0 ? "primary" : "neutral"}>
                    {cat.solved}/{cat.total} Solved
                  </StatusBadge>
                </div>

                <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {cat.title}
                </h4>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/50">
                <div className="flex items-center justify-between text-[11px] mb-1.5 font-semibold text-muted-foreground">
                  <span>Category Progress</span>
                  <span>{cat.progress}%</span>
                </div>
                <ProgressBar
                  value={cat.progress}
                  tone={isComplete ? "success" : "primary"}
                  label={`${cat.title} progress`}
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-3 text-xs cursor-pointer justify-between group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all"
                >
                  <span>Explore 7-8 Problems</span>
                  <ChevronRight className="size-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CATEGORY PROBLEMS MODAL WITH OPACITY & GLASS BACKDROP */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl bg-surface/95 backdrop-blur-md border-border p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                DSA Problem Set
              </span>
              <StatusBadge
                tone={
                  selectedCategory?.solved >= selectedCategory?.total
                    ? "success"
                    : selectedCategory?.solved > 0
                      ? "primary"
                      : "neutral"
                }
              >
                {selectedCategory?.solved}/{selectedCategory?.total} Completed
              </StatusBadge>
            </div>
            <DialogTitle className="text-xl font-extrabold text-foreground mt-1">
              {selectedCategory?.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              {selectedCategory?.description}
            </DialogDescription>
          </DialogHeader>

          {/* CATEGORY PROGRESS BAR */}
          <div className="rounded-lg bg-surface-hover/80 border border-border p-3.5 my-2">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-foreground">Topic Mastery</span>
              <span className="font-bold text-primary">{selectedCategory?.progress || 0}%</span>
            </div>
            <ProgressBar
              value={selectedCategory?.progress || 0}
              tone={selectedCategory?.progress >= 100 ? "success" : "primary"}
              label="Topic mastery progress"
            />
          </div>

          {/* PROBLEMS LIST */}
          <div className="mt-3 space-y-3">
            {(selectedCategory?.problems || []).map((p, idx) => {
              const isDone = Boolean(p.completed);

              return (
                <div
                  key={p.id}
                  className={cn(
                    "rounded-xl border p-4 transition-all flex flex-col justify-between gap-3",
                    isDone
                      ? "border-success/40 bg-success-bg/20"
                      : "border-border bg-surface-hover/40",
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="size-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <h4 className="text-sm font-bold text-foreground">{p.title}</h4>
                        <StatusBadge
                          tone={
                            p.difficulty === "Hard"
                              ? "danger"
                              : p.difficulty === "Medium"
                                ? "warning"
                                : "success"
                          }
                        >
                          {p.difficulty}
                        </StatusBadge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed pl-7">
                        {p.description}
                      </p>
                    </div>

                    {/* Mark as Done Toggle Button */}
                    <Button
                      size="sm"
                      variant={isDone ? "default" : "outline"}
                      disabled={toggling === p.id}
                      onClick={() => handleToggleProblem(p, selectedCategory.id)}
                      className={cn(
                        "cursor-pointer text-xs gap-1.5 shrink-0",
                        isDone &&
                          "bg-success hover:bg-success/90 text-success-foreground border-success",
                      )}
                    >
                      <CheckCircle2 className="size-3.5" />
                      {isDone ? "Completed" : "Mark as Done"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-border flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(false)}
              className="cursor-pointer"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
