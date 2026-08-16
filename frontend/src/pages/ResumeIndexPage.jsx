import { Link, useNavigate } from "react-router-dom";
import { Check, FileText, Loader2, Sparkles, Trash2, Upload, UserCheck } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { ProgressBar, StatusBadge } from "@/components/common/indicators";
import { PageHeader, SectionCard } from "@/components/common/page";
import { ErrorState, RowsSkeleton } from "@/components/common/states";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAsyncData } from "@/hooks/useAsyncData";
import { resumeService } from "@/services/resume/resumeService";

const ACCEPTED = [".pdf", ".docx"];

export function ResumeIndexPage() {
  const navigate = useNavigate();
  const { data, loading, error, reload, setData } = useAsyncData(() => resumeService.getResume());

  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const inputRef = useRef(null);

  // Extracted data confirmation state
  const [extractedData, setExtractedData] = useState(null);
  const [fileMeta, setFileMeta] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [savingConfirmation, setSavingConfirmation] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    const valid = ACCEPTED.some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!valid) {
      setUploadError("Only PDF and DOCX files (max 5MB) are supported.");
      return;
    }
    setUploadError(null);
    setUploading(true);
    setProgress(20);
    const timer = setInterval(() => setProgress((p) => Math.min(85, p + 15)), 200);

    try {
      // Step 1: Upload & Extract Raw Text
      const uploadRes = await resumeService.uploadFile(file);
      setProgress(90);
      setFileMeta({
        name: uploadRes.filename,
        sizeKb: uploadRes.sizeKb,
        uploadedAt: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      });

      // Step 2: Gemini Structured Extraction & Skill Normalization
      setExtracting(true);
      const extractRes = await resumeService.extractFields(uploadRes.extracted_text);
      setExtractedData(extractRes.data);
      setProgress(100);
      setConfirmModalOpen(true);
      toast.success("Resume text and skills extracted successfully!");
    } catch (err) {
      const errMsg = err?.message || "Upload or extraction failed. Please try again.";
      setUploadError(errMsg);
      toast.error(errMsg);
    } finally {
      clearInterval(timer);
      setUploading(false);
      setExtracting(false);
    }
  };

  const handleConfirmAndSave = async () => {
    if (!extractedData) return;
    setSavingConfirmation(true);
    try {
      const saveRes = await resumeService.confirmAndSaveResume({
        profileData: extractedData,
        fileMeta: fileMeta,
        template: "classic",
      });
      setData(saveRes.data);
      setConfirmModalOpen(false);
      toast.success("Candidate profile updated with extracted skills!");
      navigate("/resume/analyze");
    } catch {
      toast.error("Failed to save confirmed resume profile.");
    } finally {
      setSavingConfirmation(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    void handleFile(e.dataTransfer.files?.[0]);
  };

  const remove = async () => {
    setData(await resumeService.removeResume());
    setProgress(0);
    toast.success("Resume removed");
  };

  return (
    <AppShell title="Resume">
      <PageHeader
        title="Resume Hub"
        description="Two paths: extract and refine an existing resume, or let FutureReady build an ATS-tailored resume based on your skills."
        actions={
          <Button variant="outline" asChild>
            <Link to="/resume/create">Start guided builder</Link>
          </Button>
        }
      />

      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {loading && !data ? <RowsSkeleton count={2} /> : null}

      {data ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {/* Path A: Existing Resume */}
          <SectionCard
            title="Path A — I already have a resume"
            description="Upload → AI extraction → review & normalize skills → section critique → refinement."
          >
            {!data.hasResume ? (
              <>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                  className={`flex flex-col items-center justify-center rounded-sm border-2 border-dashed px-6 py-10 text-center transition-all duration-150 ease-out ${
                    dragging
                      ? "border-accent bg-accent-subtle/60"
                      : "border-border-strong bg-surface-hover/50 hover:bg-surface-hover hover:border-accent/60"
                  }`}
                >
                  <div className="flex size-10 items-center justify-center rounded-full bg-accent-subtle text-accent mb-2">
                    <Upload className="size-5" aria-hidden />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    Drag and drop your resume here
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">PDF or DOCX, up to 5 MB</p>
                  <div className="mt-2 flex gap-1.5 text-[11px] font-medium text-tertiary">
                    <span className="rounded bg-surface px-1.5 py-0.5 border border-border">
                      .PDF
                    </span>
                    <span className="rounded bg-surface px-1.5 py-0.5 border border-border">
                      .DOCX
                    </span>
                  </div>
                  <Button
                    className="mt-4"
                    onClick={() => inputRef.current?.click()}
                    disabled={uploading || extracting}
                  >
                    {uploading || extracting ? (
                      <Loader2 className="size-4 animate-spin mr-2" aria-hidden />
                    ) : null}
                    {extracting
                      ? "Extracting skills with AI…"
                      : uploading
                        ? "Uploading…"
                        : "Choose file"}
                  </Button>
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".pdf,.docx"
                    className="sr-only"
                    aria-label="Upload resume"
                    onChange={(e) => void handleFile(e.target.files?.[0])}
                  />
                </div>
                {uploading || extracting ? (
                  <ProgressBar
                    value={progress}
                    className="mt-4"
                    label="Upload & extraction progress"
                  />
                ) : null}
                {uploadError ? (
                  <div className="mt-3 rounded-sm border border-destructive/20 bg-danger-soft p-3 text-xs sm:text-sm text-destructive">
                    {uploadError}
                  </div>
                ) : null}
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 rounded-sm border border-border bg-surface-hover/50 p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-[6px] bg-accent-subtle text-accent">
                      <FileText className="size-5" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {data.file?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {data.file?.sizeKb} KB · {data.file?.uploadedAt || "Uploaded"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
                      Replace
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => void remove()}
                      aria-label="Remove resume"
                      className="text-muted-foreground hover:text-destructive hover:bg-danger-soft"
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </Button>
                    <input
                      ref={inputRef}
                      type="file"
                      accept=".pdf,.docx"
                      className="sr-only"
                      aria-label="Replace resume"
                      onChange={(e) => void handleFile(e.target.files?.[0])}
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => void navigate("/resume/analyze")}>
                    <Sparkles className="size-4 mr-1.5" /> Analyse resume
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/resume/create">Open in builder</Link>
                  </Button>
                </div>
              </div>
            )}
          </SectionCard>

          {/* Path B: Guided Builder */}
          <SectionCard
            title="Path B — I don't have a resume yet"
            description="Build a perfect, ATS-tailored resume based on your selected skills and experience."
          >
            <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check className="size-4 text-accent mt-0.5 shrink-0" />
                <span>
                  <strong>Skills-driven</strong>: Automatically tailors sections based on your
                  candidate skills and target role.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-4 text-accent mt-0.5 shrink-0" />
                <span>
                  <strong>AI Bullet Generator</strong>: Converts brief descriptions into 3
                  professional variants (technical depth, impact, leadership).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-4 text-accent mt-0.5 shrink-0" />
                <span>
                  <strong>ATS-Optimized Templates</strong>: Clean, single-column structures
                  engineered for high ATS parsing accuracy.
                </span>
              </li>
            </ul>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Button asChild>
                <Link to="/resume/create">Start guided builder</Link>
              </Button>
              <StatusBadge tone="primary">Zero experience hallucination</StatusBadge>
            </div>
          </SectionCard>
        </div>
      ) : null}

      {/* Confirmation & Review Modal for Extracted Data */}
      <Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="size-5 text-accent" />
              Review Extracted Resume Data
            </DialogTitle>
            <DialogDescription>
              Review the information extracted from your resume. Confirmed skills will be placed
              directly into your candidate profile.
            </DialogDescription>
          </DialogHeader>

          {extractedData ? (
            <div className="space-y-4 py-2 text-sm">
              {/* Personal Info */}
              <div className="rounded-sm border border-border p-3 bg-surface-hover/30">
                <p className="text-eyebrow text-tertiary">Candidate Info</p>
                <p className="font-semibold text-foreground mt-0.5">
                  {extractedData.personal?.name || "Name not specified"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {[
                    extractedData.personal?.email,
                    extractedData.personal?.phone,
                    extractedData.personal?.location,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>

              {/* Technical Skills with Normalization Status */}
              <div>
                <p className="text-eyebrow text-tertiary mb-1.5">
                  Extracted Skills (
                  {extractedData.skills_normalized?.technical?.length ||
                    extractedData.skills?.technical?.length ||
                    0}
                  )
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {extractedData.skills_normalized?.technical?.map((s, idx) => (
                    <span
                      key={idx}
                      className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-medium border ${
                        s.normalized
                          ? "border-accent/30 bg-accent-subtle text-accent"
                          : "border-border bg-surface-hover text-foreground"
                      }`}
                    >
                      {s.canonical}
                      {s.normalized ? <Check className="size-3" /> : null}
                    </span>
                  )) ||
                    extractedData.skills?.technical?.map((s, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center rounded-sm border border-border bg-surface-hover px-2 py-0.5 text-xs text-foreground"
                      >
                        {s}
                      </span>
                    ))}
                </div>
              </div>

              {/* Projects */}
              {extractedData.projects && extractedData.projects.length > 0 ? (
                <div>
                  <p className="text-eyebrow text-tertiary mb-1.5">
                    Projects ({extractedData.projects.length})
                  </p>
                  <div className="space-y-2">
                    {extractedData.projects.map((p, i) => (
                      <div key={i} className="rounded-sm border border-border p-2.5 bg-surface">
                        <p className="font-semibold text-foreground text-xs">{p.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{p.description}</p>
                        {p.techStack && p.techStack.length > 0 ? (
                          <p className="text-[11px] text-tertiary mt-1">
                            Tech: {p.techStack.join(", ")}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Experience */}
              {extractedData.experience && extractedData.experience.length > 0 ? (
                <div>
                  <p className="text-eyebrow text-tertiary mb-1.5">
                    Experience ({extractedData.experience.length})
                  </p>
                  <div className="space-y-2">
                    {extractedData.experience.map((x, i) => (
                      <div key={i} className="rounded-sm border border-border p-2.5 bg-surface">
                        <p className="font-semibold text-foreground text-xs">
                          {x.role} · {x.company}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {x.startDate} - {x.endDate}
                        </p>
                        {x.description ? (
                          <p className="text-xs text-muted-foreground mt-0.5">{x.description}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void handleConfirmAndSave()} disabled={savingConfirmation}>
              {savingConfirmation ? (
                <Loader2 className="size-4 animate-spin mr-1.5" />
              ) : (
                <UserCheck className="size-4 mr-1.5" />
              )}
              Confirm & Save to Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
