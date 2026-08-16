import { Link } from "react-router-dom";
import {
  Check,
  Download,
  FileText,
  Loader2,
  Printer,
  RefreshCw,
  Save,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  AiLabel,
  ProgressBar,
  ProgressRing,
  SeverityBadge,
  StatusBadge,
} from "@/components/common/indicators";
import { PageHeader, SectionCard } from "@/components/common/page";
import { EmptyState, ErrorState, RowsSkeleton } from "@/components/common/states";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAsyncData } from "@/hooks/useAsyncData";
import { resumeService } from "@/services/resume/resumeService";
import emptyResume from "@/assets/illustrations/empty-resume.jpg";

function generatePrintableResumeHtml(profile) {
  const name = profile.name || "Candidate Name";
  const email = profile.email || "";
  const phone = profile.phone || "";
  const loc = profile.location || "";
  const role = profile.targetRoles?.major || "Software Engineer";
  const skills = Array.isArray(profile.skills) ? profile.skills.join(", ") : profile.skills || "";

  const projectsHtml = (profile.projects || [])
    .map(
      (p) => `
      <div style="margin-bottom: 12px;">
        <div style="font-weight: 700; font-size: 13.5px; color: #111;">${p.title || "Key Project"}</div>
        <div style="font-size: 12.5px; line-height: 1.5; color: #333; margin-top: 3px;">${p.description || ""}</div>
      </div>
    `,
    )
    .join("");

  const experienceHtml = (profile.experience || [])
    .map(
      (exp) => `
      <div style="margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 13.5px; color: #111;">
          <span>${exp.role || "Software Engineer"} &mdash; ${exp.company || "Company"}</span>
          <span>${[exp.startDate, exp.endDate].filter(Boolean).join(" - ") || ""}</span>
        </div>
        <div style="font-size: 12.5px; line-height: 1.5; color: #333; margin-top: 3px;">${exp.description || ""}</div>
      </div>
    `,
    )
    .join("");

  const educationHtml = (profile.education || [])
    .map(
      (e) => `
      <div style="display: flex; justify-content: space-between; font-size: 12.5px; line-height: 1.5; color: #222; margin-bottom: 4px;">
        <span><strong>${e.degree || "Degree"}</strong> &mdash; ${e.institution || "University"}</span>
        <span>${e.year || ""}</span>
      </div>
    `,
    )
    .join("");

  const certs = profile.certifications
    ? Array.isArray(profile.certifications)
      ? profile.certifications
      : profile.certifications.split(",")
    : [];
  const certsHtml =
    certs.length > 0
      ? `
    <div style="margin-top: 14px;">
      <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1.5px solid #222; padding-bottom: 2px; margin-bottom: 8px; color: #111;">Certifications</div>
      <div style="font-size: 12.5px; line-height: 1.5; color: #333;">${certs
        .map((c) => c.trim())
        .filter(Boolean)
        .join(" &bull; ")}</div>
    </div>
  `
      : "";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${name} - Resume</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 0.55in 0.65in;
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: #1a1a1a;
            background: #ffffff;
            line-height: 1.4;
            padding: 24px 30px;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #111;
            padding-bottom: 10px;
            margin-bottom: 14px;
          }
          .name {
            font-size: 22px;
            font-weight: 800;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            color: #000;
          }
          .contact {
            font-size: 12px;
            color: #444;
            margin-top: 4px;
          }
          .role {
            font-size: 13px;
            font-weight: 700;
            color: #2b4cba;
            margin-top: 4px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .section {
            margin-top: 14px;
          }
          .section-title {
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 1.5px solid #222;
            padding-bottom: 2px;
            margin-bottom: 8px;
            color: #111;
          }
          .skills-text {
            font-size: 12.5px;
            line-height: 1.55;
            color: #222;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="name">${name}</div>
          <div class="contact">${[email, phone, loc].filter(Boolean).join(" &nbsp;|&nbsp; ")}</div>
          ${role ? `<div class="role">${role}</div>` : ""}
        </div>

        ${
          skills
            ? `
          <div class="section">
            <div class="section-title">Technical Skills</div>
            <div class="skills-text">${skills}</div>
          </div>
        `
            : ""
        }

        ${
          projectsHtml
            ? `
          <div class="section">
            <div class="section-title">Projects</div>
            ${projectsHtml}
          </div>
        `
            : ""
        }

        ${
          experienceHtml
            ? `
          <div class="section">
            <div class="section-title">Experience</div>
            ${experienceHtml}
          </div>
        `
            : ""
        }

        ${
          educationHtml
            ? `
          <div class="section">
            <div class="section-title">Education</div>
            ${educationHtml}
          </div>
        `
            : ""
        }

        ${certsHtml}
      </body>
    </html>
  `;
}

export function ResumeAnalyzePage() {
  const resume = useAsyncData(() => resumeService.getResume());
  const analysis = useAsyncData(() => resumeService.analyzeResume());
  const suggestions = useAsyncData(() => resumeService.getSuggestions());

  const [decisions, setDecisions] = useState({});
  const [edits, setEdits] = useState({});
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const decide = (id, decision) => {
    setDecisions((d) => ({ ...d, [id]: decision }));
    toast.success(decision === "accepted" ? "Suggestion accepted" : "Suggestion rejected");
  };

  const handleSaveResume = async () => {
    setSaving(true);
    try {
      const activeProf = resume.data?.profile_snapshot || {};
      const updatedProf = { ...activeProf };

      // Update with accepted suggestions
      if (suggestions.data) {
        suggestions.data.forEach((s) => {
          const decision = decisions[s.id];
          if (decision === "accepted") {
            const finalContent = edits[s.id] || s.suggestion || s.suggested;
            if (
              s.section === "Projects" &&
              Array.isArray(updatedProf.projects) &&
              updatedProf.projects.length > 0
            ) {
              updatedProf.projects[0].description = finalContent;
            } else if (
              s.section === "Experience" &&
              Array.isArray(updatedProf.experience) &&
              updatedProf.experience.length > 0
            ) {
              updatedProf.experience[0].description = finalContent;
            }
          }
        });
      }

      await resumeService.confirmAndSaveResume({
        profileData: updatedProf,
        fileMeta: resume.data?.file,
        template: resume.data?.template || "classic",
      });

      // Update local state
      if (resume.setData && resume.data) {
        resume.setData({
          ...resume.data,
          profile_snapshot: updatedProf,
        });
      }

      toast.success("Resume and accepted refinements saved to MongoDB!");
    } catch {
      toast.error("Failed to save resume updates.");
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    const profile = resume.data?.profile_snapshot || {};
    const name = profile.name || "Candidate";
    const email = profile.email || "";
    const phone = profile.phone || "";
    const loc = profile.location || "";
    const skills = Array.isArray(profile.skills) ? profile.skills.join(", ") : profile.skills || "";
    const role = profile.targetRoles?.major || "Software Engineer";

    const content = `=====================================================
${name.toUpperCase()}
${[email, phone, loc].filter(Boolean).join(" | ")}
Target Role: ${role}
=====================================================

TECHNICAL SKILLS:
${skills || "Full Stack Web Development, API Design, Database Management"}

EXPERIENCE & PROJECTS:
${profile.projects?.map((p) => `• ${p.title || "Project"}: ${p.description || ""}`).join("\n") || "• Delivered production software features"}

EDUCATION:
${profile.education?.map((e) => `• ${e.degree || "Degree"} - ${e.institution || "University"} (${e.year || ""})`).join("\n") || "• Degree in Computer Science"}
=====================================================`;

    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${name.replace(/\s+/g, "_")}_Resume.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("ATS Plaintext Resume downloaded!");
  };

  const handlePrint = () => {
    const profile = resume.data?.profile_snapshot || {};
    const updatedProf = { ...profile };

    // Apply accepted suggestions into the generated PDF
    if (suggestions.data) {
      suggestions.data.forEach((s) => {
        if (decisions[s.id] === "accepted") {
          const finalContent = edits[s.id] || s.suggestion || s.suggested;
          if (
            s.section === "Projects" &&
            Array.isArray(updatedProf.projects) &&
            updatedProf.projects.length > 0
          ) {
            updatedProf.projects[0].description = finalContent;
          } else if (
            s.section === "Experience" &&
            Array.isArray(updatedProf.experience) &&
            updatedProf.experience.length > 0
          ) {
            updatedProf.experience[0].description = finalContent;
          }
        }
      });
    }

    const html = generatePrintableResumeHtml(updatedProf);

    const printWindow = window.open("", "_blank", "width=850,height=1000");
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 300);
    } else {
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "none";
      document.body.appendChild(iframe);
      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(html);
      doc.close();
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => document.body.removeChild(iframe), 1500);
    }
  };

  if (resume.data && !resume.data.hasResume) {
    return (
      <AppShell title="Resume analysis">
        <PageHeader title="Resume analysis" description="Upload a resume to run the analysis." />
        <EmptyState
          illustration={emptyResume}
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

  const profile = resume.data?.profile_snapshot || {};

  return (
    <AppShell title="Resume analysis">
      <PageHeader
        title="Resume analysis and refinement"
        description="Scored against your major target role. Every suggestion is rewritten from facts already in your profile."
        actions={
          <Button
            variant="outline"
            onClick={() => {
              void analysis.reload();
              void suggestions.reload();
            }}
            disabled={analysis.loading || suggestions.loading}
          >
            <RefreshCw
              className={
                analysis.loading || suggestions.loading
                  ? "size-4 animate-spin mr-1.5"
                  : "size-4 mr-1.5"
              }
              aria-hidden
            />
            Re-analyse
          </Button>
        }
      />

      {analysis.error ? <ErrorState message={analysis.error} onRetry={analysis.reload} /> : null}
      {analysis.loading && !analysis.data ? <RowsSkeleton count={4} /> : null}

      {analysis.data ? (
        <>
          <SectionCard
            title="Analysis summary"
            description={`Target role: ${analysis.data.targetRole || "Software Engineer"}`}
          >
            <div className="grid gap-6 lg:grid-cols-[auto_1fr] lg:items-center">
              <div className="flex justify-center">
                <ProgressRing value={analysis.data.overallScore || 80} caption="Resume score" />
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {(analysis.data.sections || []).map((s) => (
                  <li key={s.section}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-semibold text-foreground">{s.section}</span>
                      <span className="text-sm font-medium text-muted-foreground">{s.score}%</span>
                    </div>
                    <ProgressBar
                      value={s.score}
                      tone={s.score >= 80 ? "success" : s.score >= 65 ? "primary" : "warning"}
                      className="mt-1.5"
                      label={s.section}
                    />
                    <p className="mt-1 text-xs text-secondary">{s.note}</p>
                  </li>
                ))}
              </ul>
            </div>
          </SectionCard>

          <SectionCard
            title="Identified issues"
            description="Grouped by severity, most damaging first."
            bodyClassName="p-0"
          >
            <ul className="divide-y divide-border">
              {(analysis.data.issues || []).map((issue) => (
                <li
                  key={issue.id}
                  className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <SeverityBadge severity={issue.severity} />
                      <StatusBadge>{issue.section}</StatusBadge>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-foreground">{issue.message}</p>
                    <p className="mt-1 text-xs sm:text-sm text-secondary leading-relaxed">
                      {issue.recommendation}
                    </p>
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => void suggestions.reload()}
            disabled={suggestions.loading}
          >
            {suggestions.loading ? (
              <Loader2 className="size-3.5 animate-spin mr-1" />
            ) : (
              <RefreshCw className="size-3.5 mr-1" />
            )}
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
            {(suggestions.data || []).map((s) => {
              const decision = decisions[s.id] ?? "pending";
              return (
                <li key={s.id} className="space-y-3 px-5 py-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{s.section}</h3>
                    {decision === "accepted" ? (
                      <StatusBadge tone="success">Accepted</StatusBadge>
                    ) : decision === "rejected" ? (
                      <StatusBadge tone="danger">Rejected</StatusBadge>
                    ) : (
                      <StatusBadge tone="warning">Awaiting your review</StatusBadge>
                    )}
                  </div>

                  <div className="grid gap-3 lg:grid-cols-2">
                    <div className="rounded-sm border border-border bg-surface-hover/60 p-3.5">
                      <p className="text-eyebrow text-tertiary">Current content</p>
                      <p className="mt-1.5 text-xs sm:text-sm text-foreground leading-relaxed">
                        {s.current || s.original}
                      </p>
                    </div>
                    <div className="rounded-sm border border-accent/20 bg-accent-subtle/50 p-3.5">
                      <AiLabel />
                      {editing === s.id ? (
                        <Textarea
                          className="mt-2 text-xs sm:text-sm"
                          rows={4}
                          value={edits[s.id] ?? s.suggestion ?? s.suggested}
                          onChange={(e) => setEdits((v) => ({ ...v, [s.id]: e.target.value }))}
                        />
                      ) : (
                        <p className="mt-1.5 text-xs sm:text-sm font-semibold text-foreground leading-relaxed">
                          {edits[s.id] ?? s.suggestion ?? s.suggested}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-secondary">
                        {s.rationale || s.changesSummary}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => decide(s.id, "accepted")}>
                      <Check className="size-3.5 mr-1" /> Accept
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => decide(s.id, "rejected")}>
                      <X className="size-3.5 mr-1" /> Reject
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

      <SectionCard
        title="Final resume"
        description="Preview, save to MongoDB, and export your polished ATS resume."
      >
        <div className="rounded-sm border border-border bg-surface p-4 sm:p-5 font-mono text-xs text-foreground space-y-3">
          <div className="border-b border-border/80 pb-2 text-center">
            <p className="font-bold text-sm tracking-tight">{profile.name || "CANDIDATE NAME"}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {[profile.email, profile.phone, profile.location].filter(Boolean).join(" · ") ||
                "contact@email.com"}
            </p>
            {profile.targetRoles?.major ? (
              <p className="text-[11px] font-semibold text-accent mt-1 uppercase tracking-wider">
                {profile.targetRoles.major}
              </p>
            ) : null}
          </div>

          {profile.skills && profile.skills.length > 0 ? (
            <div>
              <p className="font-bold text-[11px] uppercase tracking-wider text-accent border-b border-border/40 pb-0.5">
                TECHNICAL SKILLS
              </p>
              <p className="mt-1 text-[11px] leading-relaxed">
                {Array.isArray(profile.skills) ? profile.skills.join(", ") : profile.skills}
              </p>
            </div>
          ) : null}

          {profile.projects && profile.projects.length > 0 ? (
            <div>
              <p className="font-bold text-[11px] uppercase tracking-wider text-accent border-b border-border/40 pb-0.5">
                PROJECTS
              </p>
              <div className="mt-1 space-y-1.5">
                {profile.projects.map((p, i) => (
                  <div key={i}>
                    <p className="font-semibold text-[11px]">{p.title || `Project ${i + 1}`}</p>
                    <p className="text-[10.5px] text-secondary">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {profile.experience && profile.experience.length > 0 ? (
            <div>
              <p className="font-bold text-[11px] uppercase tracking-wider text-accent border-b border-border/40 pb-0.5">
                EXPERIENCE
              </p>
              <div className="mt-1 space-y-1.5">
                {profile.experience.map((exp, i) => (
                  <div key={i}>
                    <p className="font-semibold text-[11px]">
                      {exp.role || "Software Engineer"} &mdash; {exp.company || "Company"}
                    </p>
                    <p className="text-[10.5px] text-secondary">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {profile.education && profile.education.length > 0 ? (
            <div>
              <p className="font-bold text-[11px] uppercase tracking-wider text-accent border-b border-border/40 pb-0.5">
                EDUCATION
              </p>
              <div className="mt-1 space-y-1">
                {profile.education.map((e, i) => (
                  <p key={i} className="text-[10.5px]">
                    {e.degree} — {e.institution} ({e.year})
                  </p>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link to="/resume/create">Edit in builder</Link>
          </Button>
          <Button onClick={() => void handleSaveResume()} disabled={saving}>
            {saving ? (
              <Loader2 className="size-4 animate-spin mr-1.5" />
            ) : (
              <Save className="size-4 mr-1.5" />
            )}
            Save resume
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="size-4 mr-1.5" /> Download (.txt)
          </Button>
          <Button onClick={handlePrint} className="bg-accent text-accent-foreground">
            <Printer className="size-4 mr-1.5" /> Print / Save as PDF
          </Button>
        </div>
      </SectionCard>
    </AppShell>
  );
}
