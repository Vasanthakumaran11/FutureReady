import { Link, useNavigate } from "react-router-dom";
import { FileText, Loader2, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { JourneyStrip } from "@/components/common/JourneyStrip";
import { ProgressBar, StatusBadge } from "@/components/common/indicators";
import { BackendNotice, PageHeader, SectionCard } from "@/components/common/page";
import { ErrorState, RowsSkeleton } from "@/components/common/states";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { useAsyncData } from "@/hooks/useAsyncData";
import { resumeService } from "@/services/resume/resumeService";

const ACCEPTED = [".pdf", ".docx"];

export function ResumeIndexPage() {
  const navigate = useNavigate();
  const { data, loading, error, reload, setData } = useAsyncData(() => resumeService.getResume());
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    const valid = ACCEPTED.some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!valid) {
      setUploadError("Only PDF and DOCX files are supported.");
      return;
    }
    setUploadError(null);
    setUploading(true);
    setProgress(15);
    const timer = setInterval(() => setProgress((p) => Math.min(90, p + 15)), 180);
    try {
      const next = await resumeService.uploadResume(file);
      setData(next);
      setProgress(100);
      toast.success("Resume uploaded");
    } catch {
      setUploadError("Upload failed. Try again.");
    } finally {
      clearInterval(timer);
      setUploading(false);
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
  };

  return (
    <AppShell title="Resume">
      <PageHeader
        title="Resume"
        description="Two paths: refine the resume you already have, or build one from the profile you have already filled in."
        actions={
          <Button variant="outline" asChild>
            <Link to="/resume/create">Start resume builder</Link>
          </Button>
        }
      />

      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {loading && !data ? <RowsSkeleton count={2} /> : null}

      {data ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <SectionCard
            title="Path A — I already have a resume"
            description="Upload → analyse → identify gaps → AI refinement → review → final resume."
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
                    disabled={uploading}
                  >
                    {uploading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
                    {uploading ? "Uploading…" : "Choose file"}
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
                {uploading ? (
                  <ProgressBar value={progress} className="mt-4" label="Upload progress" />
                ) : null}
                {uploadError ? (
                  <p role="alert" className="mt-3 text-xs sm:text-sm text-destructive">
                    {uploadError}
                  </p>
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
                        {data.file?.sizeKb} KB · uploaded
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
                <Button onClick={() => void navigate("/resume/analyze")}>Analyse resume</Button>
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Path B — I don't have a resume yet"
            description="Guided builder: details → education → skills → projects → experience → certifications → target role → review."
          >
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>• Pre-filled from your profile, so you are never starting from an empty page.</li>
              <li>• AI refines wording only — it never invents experience or qualifications.</li>
              <li>• Two professional templates, both ATS-friendly.</li>
            </ul>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Button asChild>
                <Link to="/resume/create">Start resume builder</Link>
              </Button>
              <StatusBadge tone="primary">Draft saving supported</StatusBadge>
            </div>
          </SectionCard>
        </div>
      ) : null}

      <BackendNotice>
        File parsing, storage and analysis run on the FastAPI backend — uploads here are held in the
        frontend resume service until those endpoints exist.
      </BackendNotice>
    </AppShell>
  );
}
