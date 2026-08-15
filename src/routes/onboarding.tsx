import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";

import { ProgressBar } from "@/components/common/indicators";
import { BackendNotice } from "@/components/common/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { profileService } from "@/services/profile/profileService";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Set up your profile — FutureReady" },
      {
        name: "description",
        content: "Add your education, experience, skills and target roles to personalise FutureReady.",
      },
      { property: "og:title", content: "Set up your profile — FutureReady" },
      {
        property: "og:description",
        content: "Your profile drives resume analysis, interview prep and job matching.",
      },
    ],
  }),
  component: OnboardingPage,
});

const STEPS = ["Personal", "Education", "Career", "Target roles"] as const;

function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    location: "",
    degree: "",
    institution: "",
    graduationYear: "",
    coursework: "",
    experience: "",
    field: "",
    skills: "",
    projects: "",
    certifications: "",
    major: "",
    optional1: "",
    optional2: "",
  });

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const canContinue =
    (step === 0 && form.name && form.email) ||
    (step === 1 && form.degree && form.institution) ||
    step === 2 ||
    (step === 3 && form.major);

  const finish = async () => {
    setSaving(true);
    await profileService.updateTargetRoles(
      form.major,
      [form.optional1, form.optional2].filter(Boolean),
    );
    setSaving(false);
    void navigate({ to: "/dashboard" });
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-14">
      <p className="text-eyebrow">Step {step + 1} of {STEPS.length}</p>
      <h1 className="mt-2 text-2xl font-semibold">Build your career profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        This profile is the single source of truth for your resume, interview preparation, skill
        gap analysis and job matching.
      </p>

      <div className="mt-6">
        <ProgressBar value={((step + 1) / STEPS.length) * 100} label="Onboarding progress" />
        <ol className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          {STEPS.map((s, i) => (
            <li key={s} className={i <= step ? "font-semibold text-primary" : "text-muted-foreground"}>
              {i + 1}. {s}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 space-y-5 rounded-lg border border-border bg-surface p-6 shadow-card">
        {step === 0 ? (
          <>
            <Field id="name" label="Full name" value={form.name} onChange={set("name")} />
            <Field id="email" label="Email" type="email" value={form.email} onChange={set("email")} />
            <Field id="location" label="Location" value={form.location} onChange={set("location")} />
          </>
        ) : null}

        {step === 1 ? (
          <>
            <Field id="degree" label="Degree" value={form.degree} onChange={set("degree")} />
            <Field id="institution" label="Institution" value={form.institution} onChange={set("institution")} />
            <Field id="graduationYear" label="Graduation year" value={form.graduationYear} onChange={set("graduationYear")} />
            <div className="space-y-2">
              <Label htmlFor="coursework">Relevant coursework (optional)</Label>
              <Textarea id="coursework" rows={3} value={form.coursework} onChange={set("coursework")} />
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <Field id="experience" label="Experience (years or summary)" value={form.experience} onChange={set("experience")} />
            <Field id="field" label="Target career field" value={form.field} onChange={set("field")} />
            <div className="space-y-2">
              <Label htmlFor="skills">Skills (comma separated)</Label>
              <Textarea id="skills" rows={2} value={form.skills} onChange={set("skills")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projects">Projects</Label>
              <Textarea id="projects" rows={3} value={form.projects} onChange={set("projects")} />
            </div>
            <Field id="certifications" label="Certifications" value={form.certifications} onChange={set("certifications")} />
          </>
        ) : null}

        {step === 3 ? (
          <>
            <Field id="major" label="Major job role" value={form.major} onChange={set("major")} />
            <Field id="optional1" label="Optional role 1" value={form.optional1} onChange={set("optional1")} />
            <Field id="optional2" label="Optional role 2" value={form.optional2} onChange={set("optional2")} />
            <p className="text-xs text-muted-foreground">
              You can change your target roles at any time from Profile or Interview setup.
            </p>
          </>
        ) : null}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          Previous
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canContinue}>
            Next
          </Button>
        ) : (
          <Button onClick={() => void finish()} disabled={!canContinue || saving}>
            {saving ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            Finish setup
          </Button>
        )}
      </div>
      <div className="mt-4">
        <BackendNotice />
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: { target: { value: string } }) => void;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} onChange={onChange} />
    </div>
  );
}
