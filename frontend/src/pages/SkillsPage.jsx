import { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  CheckCircle2,
  ChevronRight,
  Compass,
  ExternalLink,
  GraduationCap,
  Layers,
  PlayCircle,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  Youtube,
  Zap,
} from "lucide-react";

import { ProgressBar, StatusBadge } from "@/components/common/indicators";
import { BackendNotice, PageHeader, SectionCard, StatTile } from "@/components/common/page";
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
import { skillService } from "@/services/skills/skillService";
import { cn } from "@/lib/utils";

export function SkillsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");
  const jobTitle = searchParams.get("title");
  const jobCompany = searchParams.get("company");

  // State
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(searchParams.get("role") || "");
  const [gapData, setGapData] = useState(null);
  const [learningProgressList, setLearningProgressList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Skill Detail Modal State
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [skillResources, setSkillResources] = useState([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [updatingResource, setUpdatingResource] = useState(false);

  // Load Roles & Gap Analysis
  const loadSkillData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch available career tracks
      const roleList = await skillService.getRoles();
      setRoles(roleList || []);

      // 2. Fetch Skill Gap Analysis
      const currentRoleParam = searchParams.get("role") || selectedRole;
      const currentJobParam = currentRoleParam ? "" : (jobId || "");

      const gaps = await skillService.getSkillGapAnalysis({
        role: currentRoleParam,
        jobId: currentJobParam,
      });
      setGapData(gaps);
      if (!selectedRole && gaps?.targetRole) {
        setSelectedRole(gaps.targetRole);
      }

      // 3. Fetch User Learning Progress
      const progress = await skillService.getLearningProgress();
      setLearningProgressList(progress || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load skill development data");
    } finally {
      setLoading(false);
    }
  }, [selectedRole, jobId, searchParams]);

  useEffect(() => {
    loadSkillData();
  }, [loadSkillData]);

  // Open Skill Detail Modal
  const openSkillDetail = async (skillItem) => {
    setSelectedSkill(skillItem);
    setModalOpen(true);
    setResourcesLoading(true);
    try {
      const res = await skillService.getSkillResources(skillItem.skill, {
        role: gapData?.targetRole || selectedRole,
        difficulty: skillItem.targetLevel,
      });
      setSkillResources(res || []);
    } catch {
      toast.error("Failed to load learning resources");
    } finally {
      setResourcesLoading(false);
    }
  };

  // Toggle Resource Completion Checkbox
  const toggleResourceCompletion = async (resourceId) => {
    if (!selectedSkill) return;
    setUpdatingResource(true);

    const currentProgressRecord = learningProgressList.find(
      (p) => p.skill.toLowerCase() === selectedSkill.skill.toLowerCase(),
    );
    const completedList = currentProgressRecord?.completed_resources || [];
    const isCompleted = completedList.includes(resourceId);
    const nextCompletedState = !isCompleted;

    try {
      const updated = await skillService.updateProgress({
        skill: selectedSkill.skill,
        resourceId: resourceId,
        completed: nextCompletedState,
      });

      // Update local state
      setLearningProgressList((prev) => {
        const filtered = prev.filter(
          (p) => p.skill.toLowerCase() !== selectedSkill.skill.toLowerCase(),
        );
        return [...filtered, updated];
      });

      // Update selected skill progress in gapData
      if (gapData) {
        const updateSkillInList = (list) =>
          list.map((s) =>
            s.skill.toLowerCase() === selectedSkill.skill.toLowerCase()
              ? { ...s, progress: updated.progress, status: updated.status }
              : s,
          );

        setGapData({
          ...gapData,
          missingSkills: updateSkillInList(gapData.missingSkills || []),
          weakSkills: updateSkillInList(gapData.weakSkills || []),
          verifiedSkills: updateSkillInList(gapData.verifiedSkills || []),
          allGaps: updateSkillInList(gapData.allGaps || []),
        });
      }

      if (nextCompletedState) {
        toast.success(`Resource completed! ${selectedSkill.skill} progress updated to ${updated.progress}%`);
      } else {
        toast.info(`Progress updated to ${updated.progress}%`);
      }
    } catch {
      toast.error("Failed to update progress");
    } finally {
      setUpdatingResource(false);
    }
  };

  const readinessScore = gapData?.overallReadiness || 0;
  const missingSkills = gapData?.missingSkills || [];
  const weakSkills = gapData?.weakSkills || [];
  const verifiedSkills = gapData?.verifiedSkills || [];
  const allActionGaps = [...missingSkills, ...weakSkills];

  // Active progress record for the modal
  const activeModalProgressRecord = selectedSkill
    ? learningProgressList.find(
        (p) => p.skill.toLowerCase() === selectedSkill.skill.toLowerCase(),
      )
    : null;
  const activeCompletedResources = activeModalProgressRecord?.completed_resources || [];
  const activeProgressPercentage = activeModalProgressRecord?.progress ?? selectedSkill?.progress ?? 0;

  return (
    <AppShell title="Skill Development & Learning Resources">
      {/* JOB CONTEXT BACK LINK */}
      {jobId ? (
        <div className="mb-3">
          <Link
            to={`/jobs/${jobId}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" /> Back to {jobTitle || "Job Opportunities"}
          </Link>
        </div>
      ) : null}

      <PageHeader
        title={jobId && jobTitle ? `Targeted Learning: ${jobTitle}` : "Skill Development"}
        description={
          jobId && jobCompany
            ? `Skill gap roadmap prioritized for ${jobTitle} at ${jobCompany}. Close missing technical requirements to maximize your hiring match.`
            : "Identify technical skill gaps for your target career role, access curated YouTube courses, and track your learning progress."
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {jobId ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchParams({});
                  setSelectedRole("");
                }}
                className="cursor-pointer"
              >
                Reset to Target Role
              </Button>
            ) : null}
            <Button
              variant="outline"
              size="sm"
              onClick={() => void loadSkillData()}
              className="cursor-pointer gap-1.5"
            >
              <RefreshCw className="size-3.5" /> Refresh Analysis
            </Button>
          </div>
        }
      />

      {/* JOB CONTEXT BANNER */}
      {jobId ? (
        <div className="mb-5 rounded-xl border border-primary/20 bg-accent-subtle/30 p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-xs">
              <Target className="size-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Role Requirement Prioritization
              </p>
              <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span>{jobTitle || "Targeted Opportunity"}</span>
                {jobCompany ? (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-normal">
                    <Building2 className="size-3.5" /> {jobCompany}
                  </span>
                ) : null}
              </p>
            </div>
          </div>
          <span className="text-xs text-muted-foreground bg-surface px-3 py-1.5 rounded-md border border-border">
            Prioritizing job skills as <strong>High Priority Gaps</strong>
          </span>
        </div>
      ) : null}

      {/* TARGET ROLE SELECTOR & OVERALL READINESS HEADER */}
      <div className="grid gap-4 md:grid-cols-[1fr_320px] mb-6">
        <SectionCard
          title="Target Career Track"
          description="Switch your target engineering role to re-evaluate skill requirements across our 10-role career roadmap."
        >
          <div className="flex flex-wrap gap-2 pt-1">
            {roles.map((r) => {
              const isSelected =
                r.role.toLowerCase() === (gapData?.targetRole || selectedRole).toLowerCase();
              return (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => {
                    setSelectedRole(r.role);
                    setSearchParams({ role: r.role });
                  }}
                  className={cn(
                    "rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer border",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-surface text-secondary hover:bg-surface-hover hover:text-foreground border-border",
                  )}
                >
                  {r.role}
                </button>
              );
            })}
          </div>
        </SectionCard>

        {/* OVERALL READINESS SCORE CARD */}
        <SectionCard title="Overall Skill Readiness">
          <div className="flex flex-col justify-between h-full pt-1">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {gapData?.targetRole || "Role"} Readiness
              </span>
              <span
                className={cn(
                  "text-2xl font-extrabold",
                  readinessScore >= 75
                    ? "text-success"
                    : readinessScore >= 50
                      ? "text-warning"
                      : "text-tertiary",
                )}
              >
                {readinessScore}%
              </span>
            </div>
            <ProgressBar
              value={readinessScore}
              tone={readinessScore >= 75 ? "success" : readinessScore >= 50 ? "warning" : "primary"}
              label="Overall role readiness"
              className="mt-2"
            />
            <p className="mt-2 text-[11px] text-muted-foreground">
              {verifiedSkills.length} of {gapData?.totalRequirements || 0} core skills verified in your candidate profile.
            </p>
          </div>
        </SectionCard>
      </div>

      {error ? <ErrorState message={error} onRetry={loadSkillData} /> : null}
      {loading && !gapData ? <CardsSkeleton count={3} height={160} /> : null}

      {!loading && gapData ? (
        <div className="space-y-8">
          {/* STATS TILES */}
          <div className="grid gap-4 sm:grid-cols-3">
            <StatTile
              label="Missing Skill Gaps"
              value={missingSkills.length}
              hint="High priority skills to address"
            />
            <StatTile
              label="Skills to Improve"
              value={weakSkills.length}
              hint="Moderate/Beginner level"
            />
            <StatTile
              label="Verified Proficiencies"
              value={verifiedSkills.length}
              hint="Ready for technical interviews"
            />
          </div>

          {/* 1. SKILL GAPS SECTION (MISSING & WEAK SKILLS) */}
          <SectionCard
            title="Skill Gaps to Address"
            description="High-priority technical requirements identified as missing or requiring improvement for your target role."
          >
            {allActionGaps.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground">
                🎉 No skill gaps detected! You have verified proficiency across all core requirements for this track.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {allActionGaps.map((gap) => {
                  const isMissing = gap.currentLevel === "Missing";
                  return (
                    <div
                      key={gap.id}
                      className="rounded-xl border border-border bg-surface p-4 shadow-card hover:border-border-strong transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-bold text-foreground truncate">
                            {gap.skill}
                          </h4>
                          <StatusBadge tone={isMissing ? "danger" : "warning"}>
                            {isMissing ? "Missing" : "Needs Improvement"}
                          </StatusBadge>
                        </div>

                        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                          {gap.whyItMatters || gap.requirement}
                        </p>

                        {/* Topics Pill Tags */}
                        {gap.topics && gap.topics.length > 0 ? (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {gap.topics.slice(0, 3).map((t) => (
                              <span
                                key={t}
                                className="rounded bg-surface-hover px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>

                      <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground">
                          Target: <strong>{gap.targetLevel}</strong>
                        </span>
                        <Button
                          size="sm"
                          onClick={() => openSkillDetail(gap)}
                          className="cursor-pointer gap-1 text-xs"
                        >
                          <PlayCircle className="size-3.5" /> Start Learning
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>

          {/* 2. CURRENT VERIFIED SKILLS SECTION */}
          <SectionCard
            title="Current Verified Skills"
            description="Technical competencies already verified in your candidate profile & resume."
          >
            {verifiedSkills.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">
                No matching skills verified yet. Update your candidate profile or complete guided learning milestones.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {verifiedSkills.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => openSkillDetail(v)}
                    className="rounded-lg border border-border bg-surface p-3 hover:bg-surface-hover transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-foreground truncate">{v.skill}</p>
                      <p className="text-[11px] text-muted-foreground">{v.currentLevel || "Intermediate"}</p>
                    </div>
                    <CheckCircle2 className="size-4 text-success shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* 3. LEARNING PROGRESS TRACKER */}
          <SectionCard
            title="Learning Progress Tracker"
            description="Track real-time learning milestone completion and course progress across active skills."
          >
            {gapData.allGaps.length === 0 ? (
              <p className="text-xs text-muted-foreground">No active skills being tracked.</p>
            ) : (
              <div className="space-y-4">
                {gapData.allGaps.map((skill) => {
                  const record = learningProgressList.find(
                    (p) => p.skill.toLowerCase() === skill.skill.toLowerCase(),
                  );
                  const progressVal = record?.progress ?? skill.progress ?? 0;
                  const isComplete = progressVal >= 100;

                  return (
                    <div
                      key={skill.id}
                      className="rounded-lg border border-border bg-surface p-3.5 hover:border-border-strong transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground">{skill.skill}</span>
                          {isComplete ? (
                            <StatusBadge tone="success">Completed</StatusBadge>
                          ) : progressVal > 0 ? (
                            <StatusBadge tone="primary">{progressVal}% In Progress</StatusBadge>
                          ) : (
                            <StatusBadge tone="neutral">Not Started</StatusBadge>
                          )}
                        </div>
                        <ProgressBar
                          value={progressVal}
                          tone={isComplete ? "success" : "primary"}
                          className="mt-2 max-w-md"
                          label={`${skill.skill} learning progress`}
                        />
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openSkillDetail(skill)}
                        className="cursor-pointer shrink-0 text-xs gap-1"
                      >
                        <BookOpen className="size-3.5" /> View Resources
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>
        </div>
      ) : null}

      {/* SKILL DETAIL MODAL / LEARNING RESOURCES DRAWER */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl bg-surface border-border p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Skill Development Module
              </span>
              <StatusBadge
                tone={
                  selectedSkill?.currentLevel === "Missing"
                    ? "danger"
                    : selectedSkill?.currentLevel === "Beginner"
                      ? "warning"
                      : "success"
                }
              >
                Level: {selectedSkill?.currentLevel || "Missing"}
              </StatusBadge>
            </div>
            <DialogTitle className="text-xl font-extrabold text-foreground mt-1">
              {selectedSkill?.skill}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Target Level: <strong className="text-foreground">{selectedSkill?.targetLevel || "Intermediate"}</strong> ·{" "}
              {selectedSkill?.whyItMatters || "Core requirement for your target career role."}
            </DialogDescription>
          </DialogHeader>

          {/* PROGRESS SUMMARY BAR */}
          <div className="rounded-lg bg-surface-hover/80 border border-border p-3.5 my-2">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-foreground">Learning Milestone Progress</span>
              <span className="font-bold text-primary">{activeProgressPercentage}%</span>
            </div>
            <ProgressBar
              value={activeProgressPercentage}
              tone={activeProgressPercentage >= 100 ? "success" : "primary"}
              label="Skill milestone progress"
            />
          </div>

          {/* CURATED LEARNING RESOURCES LIST */}
          <div className="mt-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Youtube className="size-4 text-destructive" /> Curated YouTube Courses & Documentation
            </h4>

            {resourcesLoading ? (
              <CardsSkeleton count={2} height={100} />
            ) : skillResources.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">
                Loading resources for {selectedSkill?.skill}...
              </p>
            ) : (
              <div className="space-y-3">
                {skillResources.map((res, index) => {
                  const isDone = activeCompletedResources.includes(res.id || `res-${index + 1}`);
                  const resId = res.id || `res-${index + 1}`;

                  return (
                    <div
                      key={resId}
                      className={cn(
                        "rounded-xl border p-4 transition-all flex flex-col justify-between gap-3",
                        isDone
                          ? "border-success/30 bg-success-bg/20"
                          : "border-border bg-surface-hover/40",
                      )}
                    >
                      <div>
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                              <span className="size-5 rounded-full bg-accent-subtle text-accent text-[11px] font-bold flex items-center justify-center shrink-0">
                                {index + 1}
                              </span>
                              {res.title}
                            </span>
                            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                              {res.description}
                            </p>
                          </div>
                          <StatusBadge tone="neutral">{res.difficulty}</StatusBadge>
                        </div>

                        {res.topic ? (
                          <p className="mt-2 text-[11px] text-tertiary">
                            Topic: <strong className="text-foreground/80">{res.topic}</strong>
                          </p>
                        ) : null}
                      </div>

                      {/* Action Links */}
                      <div className="pt-2 border-t border-border/40 flex flex-wrap items-center justify-between gap-2">
                        <Button
                          size="sm"
                          asChild
                          className="cursor-pointer gap-1 text-xs"
                        >
                          <a
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open original YouTube resource in new tab"
                          >
                            <PlayCircle className="size-3.5" /> Start Learning on YouTube <ExternalLink className="size-3 ml-0.5" />
                          </a>
                        </Button>

                        {/* Mark Complete Checkbox Button */}
                        <Button
                          size="sm"
                          variant={isDone ? "default" : "outline"}
                          disabled={updatingResource}
                          onClick={() => toggleResourceCompletion(resId)}
                          className={cn(
                            "cursor-pointer text-xs gap-1.5",
                            isDone && "bg-success hover:bg-success/90 text-success-foreground border-success",
                          )}
                        >
                          <CheckCircle2 className="size-3.5" />
                          {isDone ? "Completed" : "Mark Complete"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
