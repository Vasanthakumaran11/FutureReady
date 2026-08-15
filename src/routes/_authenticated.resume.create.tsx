import { Link, createFileRoute } from "@tanstack/react-router";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { JourneyStrip } from "@/components/common/JourneyStrip";
import { AiLabel, ProgressBar, StatusBadge } from "@/components/common/indicators";
import { BackendNotice, PageHeader, SectionCard } from "@/components/common/page";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { resumeService } from "@/services/resume/resumeService";

export const Route = createFileRoute("/_authenticated/resume/create")({
  head: () => ({
    meta: [
      { title: "Resume Builder — FutureReady" },
      {
        name: "description",
        content:
          "Build a professional resume step by step from your profile, with AI-assisted wording you review before it is used.",
      },
      { property: "og:title", content: "Resume Builder — FutureReady" },
      { property: "og:description", content: "A guided multi-step resume builder with draft saving." },
    ],
  }),
  component: ResumeBuilderPage,
});

const STEPS = [
  { key: "personal", label: "Personal details" },
  { key: "education", label: "Education" },
  { key: "skills", label: "Skills" },
  { key: "projects", label: "Projects" },
  { key: "experience", label: "Experience" },
  { key: "certifications", label: "Certifications" },
  { key: "role", label: "Target role" },
  { key: "review", label: "Review" },
] as const;

const TEMPLATES = [
  { id: "classic", name: "Classic", note: "Single column, ATS-safe, dense." },
  { id: "modern", name: "Modern", note: "Single column with a skills sidebar block." },
];

type FormKey = (typeof STEPS)[number]["key"];

function ResumeBuilderPage() {
  const [step, setStep] = useState(0);
  const [template, setTemplate] = useState("classic");
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    degree: "",
    institution: "",
    graduationYear: "",
    skills: "",
    projects: "",
    experience: "",
    certifications: "",
    targetRole: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  const set = (key: string) => (e: { target: { value: string } }) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const validateStep = (key: FormKey) => {
    const next: Record<string, string> = {};
    if (key === "personal") {
      if (!values["fullName"]) next["fullName"] = "Full name is required.";
      if (!/^\S+@\S+\.\S+$/.test(values["email"] ?? "")) next["email"] = "Enter a valid email.";
    }
    if (key === "education" && !values["degree"]) next["degree"] = "Degree is required.";
    if (key === "role" && !values["targetRole"]) next["targetRole"] = "Target role is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const current = STEPS[step]!;

  const next = () => {
    if (!validateStep(current.key)) return;
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const saveDraft = async () => {
    setSaving(true);
    await resumeService.saveGeneratedResume({ values, template, draft: true });
    setSaving(false);
    toast.success("Draft saved");
  };

  const refine = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 1000));
    setAiSummary(
      values["summary"]
        ? `${values["summary"].trim().replace(/\.$/, "")}, with hands-on evidence from the projects and experience listed in this resume.`
        : "Add a short summary above and FutureReady will tighten the wording using only what you have written.",
    );
    setGenerating(false);
  };

  return (
    <AppShell title="Resume builder">
      <JourneyStrip current="Resume" />
      <PageHeader
        title="Resume builder"
        description="A guided flow that turns your profile into a professional, ATS-friendly resume."
        actions={
          <Button variant="outline" onClick={() => void saveDraft()} disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            Save draft
          </Button>
        }
      />

      <SectionCard>
        <ProgressBar value={((step + 1) / STEPS.length) * 100} label="Builder progress" />
        <ol className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          {STEPS.map((s, i) => (
            <li key={s.key} className={i <= step ? "font-semibold text-primary" : "text-muted-foreground"}>
              {i + 1}. {s.label}
            </li>
          ))}
        </ol>
      </SectionCard>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <SectionCard title={current.label}>
          <div className="space-y-4">
            {current.key === "personal" ? (
              <>
                <Field id="fullName" label="Full name" value={values["fullName"] ?? ""} onChange={set("fullName")} error={errors["fullName"]} />
                <Field id="email" label="Email" value={values["email"] ?? ""} onChange={set("email")} error={errors["email"]} />
                <Field id="phone" label="Phone" value={values["phone"] ?? ""} onChange={set("phone")} />
                <Field id="location" label="Location" value={values["location"] ?? ""} onChange={set("location")} />
                <div className="space-y-2">
                  <Label htmlFor="summary">Professional summary</Label>
                  <Textarea id="summary" rows={3} value={values["summary"] ?? ""} onChange={set("summary")} />
                </div>
                <div className="rounded-md border border-ai/30 bg-ai-soft p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <AiLabel>AI-assisted refinement</AiLabel>
                    <Button size="sm" variant="outline" onClick={() => void refine()} disabled={generating}>
                      {generating ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : <Sparkles className="size-3.5" aria-hidden />}
                      Refine wording
                    </Button>
                  </div>
                  {aiSummary ? <p className="mt-2 text-sm">{aiSummary}</p> : null}
                  <p className="mt-2 text-xs text-muted-foreground">
                    Refinement rewords what you wrote. It never adds experience or qualifications.
                  </p>
                </div>
              </>
            ) : null}

            {current.key === "education" ? (
              <>
                <Field id="degree" label="Degree" value={values["degree"] ?? ""} onChange={set("degree")} error={errors["degree"]} />
                <Field id="institution" label="Institution" value={values["institution"] ?? ""} onChange={set("institution")} />
                <Field id="graduationYear" label="Graduation year" value={values["graduationYear"] ?? ""} onChange={set("graduationYear")} />
              </>
            ) : null}

            {current.key === "skills" ? (
              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Textarea id="skills" rows={3} value={values["skills"] ?? ""} onChange={set("skills")} />
              </div>
            ) : null}

            {current.key === "projects" ? (
              <div className="space-y-2">
                <Label htmlFor="projects">Projects</Label>
                <Textarea id="projects" rows={5} value={values["projects"] ?? ""} onChange={set("projects")} />
              </div>
            ) : null}

            {current.key === "experience" ? (
              <div className="space-y-2">
                <Label htmlFor="experience">Experience</Label>
                <Textarea id="experience" rows={5} value={values["experience"] ?? ""} onChange={set("experience")} />
              </div>
            ) : null}

            {current.key === "certifications" ? (
              <div className="space-y-2">
                <Label htmlFor="certifications">Certifications</Label>
                <Textarea id="certifications" rows={3} value={values["certifications"] ?? ""} onChange={set("certifications")} />
              </div>
            ) : null}

            {current.key === "role" ? (
              <Field id="targetRole" label="Target role for this resume" value={values["targetRole"] ?? ""} onChange={set("targetRole")} error={errors["targetRole"]} />
            ) : null}

            {current.key === "review" ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Review everything before generating. You can go back to any step.
                </p>
                <dl className="grid gap-2 sm:grid-cols-2">
                  {Object.entries(values)
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                      <div key={k} className="rounded-md border border-border p-3">
                        <dt className="text-eyebrow">{k}</dt>
                        <dd className="mt-1 text-sm">{v}</dd>
                      </div>
                    ))}
                </dl>
                <Button
                  onClick={() => {
                    void resumeService.saveGeneratedResume({ values, template });
                    toast.success("Resume queued for generation");
                  }}
                >
                  Generate resume
                </Button>
                <BackendNotice />
              </div>
            ) : null}
          </div>

          <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
            <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              Previous
            </Button>
            <Button onClick={next} disabled={step === STEPS.length - 1}>
              Next
            </Button>
          </div>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Template" description="Two professional templates for V1.">
            <div className="space-y-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`w-full rounded-md border p-3 text-left transition-colors ${
                    template === t.id ? "border-primary bg-primary-soft" : "border-border hover:bg-secondary"
                  }`}
                  aria-pressed={template === t.id}
                >
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.note}</p>
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Preview" description="Live outline of the resume you are building.">
            <div className="space-y-2 rounded-md border border-border bg-muted/30 p-4 text-sm">
              <p className="font-semibold">{values["fullName"] || "Your name"}</p>
              <p className="text-xs text-muted-foreground">
                {[values["email"], values["location"]].filter(Boolean).join(" · ") || "Contact details"}
              </p>
              <p className="text-muted-foreground">{values["summary"] || "Professional summary appears here."}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(values["skills"] ?? "")
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((s) => (
                    <StatusBadge key={s}>{s}</StatusBadge>
                  ))}
              </div>
            </div>
            <Button asChild variant="ghost" size="sm" className="mt-3">
              <Link to="/resume">Back to resume module</Link>
            </Button>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: { target: { value: string } }) => void;
  error?: string | undefined;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={value} onChange={onChange} aria-invalid={Boolean(error)} />
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
