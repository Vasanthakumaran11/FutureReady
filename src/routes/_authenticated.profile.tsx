import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { JourneyStrip } from "@/components/common/JourneyStrip";
import { ProgressBar, SkillBadge, StatusBadge } from "@/components/common/indicators";
import { BackendNotice, PageHeader, SectionCard } from "@/components/common/page";
import { CardsSkeleton, ErrorState } from "@/components/common/states";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/common/fields";
import { ROLE_OPTIONS } from "@/lib/options";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAsyncData } from "@/hooks/useAsyncData";
import { profileService } from "@/services/profile/profileService";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Candidate Profile — FutureReady" },
      {
        name: "description",
        content:
          "Your education, experience, skills, projects, certifications and target roles — the source for every FutureReady module.",
      },
      { property: "og:title", content: "Candidate Profile — FutureReady" },
      { property: "og:description", content: "The central data source for your career journey." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { data, loading, error, reload, setData } = useAsyncData(() => profileService.getProfile());
  const [editingRoles, setEditingRoles] = useState(false);
  const [roleDraft, setRoleDraft] = useState({ major: "", o1: "", o2: "" });
  const [saving, setSaving] = useState(false);

  const openRoles = () => {
    if (!data) return;
    setRoleDraft({
      major: data.targetRoles.major,
      o1: data.targetRoles.optional[0] ?? "",
      o2: data.targetRoles.optional[1] ?? "",
    });
    setEditingRoles(true);
  };

  const saveRoles = async () => {
    setSaving(true);
    const updated = await profileService.updateTargetRoles(
      roleDraft.major,
      [roleDraft.o1, roleDraft.o2].filter(Boolean),
    );
    setData(updated);
    setSaving(false);
    setEditingRoles(false);
    toast.success("Target roles updated");
  };

  return (
    <AppShell title="Profile">
      <JourneyStrip current="Profile" />
      <PageHeader
        title="Candidate profile"
        description="Everything FutureReady knows about you. Resume analysis, interview preparation, skill gaps and job matching all read from here."
      />

      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {loading && !data ? <CardsSkeleton count={4} height={160} /> : null}

      {data ? (
        <>
          <SectionCard title="Profile completeness" description="Complete sections improve match accuracy.">
            <div className="flex items-center gap-4">
              <ProgressBar value={data.completion} label="Profile completeness" />
              <span className="shrink-0 text-sm font-semibold">{data.completion}%</span>
            </div>
          </SectionCard>

          <div className="grid gap-4 xl:grid-cols-2">
            <SectionCard
              title="Personal information"
              actions={
                <Button variant="outline" size="sm" onClick={() => toast("Inline editing connects to the FastAPI profile endpoint.")}>
                  <Pencil className="size-3.5" aria-hidden /> Edit
                </Button>
              }
            >
              <dl className="grid gap-3 sm:grid-cols-2">
                <Detail label="Name" value={data.user.name} />
                <Detail label="Email" value={data.user.email} />
                <Detail label="Location" value={data.user.location ?? "—"} />
              </dl>
            </SectionCard>

            <SectionCard
              title="Target roles"
              description="1 major role and up to 2 optional roles."
              actions={
                <Button variant="outline" size="sm" onClick={openRoles}>
                  <Pencil className="size-3.5" aria-hidden /> Edit roles
                </Button>
              }
            >
              <div className="space-y-3">
                <div>
                  <p className="text-eyebrow">Major</p>
                  <p className="mt-1 text-sm font-semibold">{data.targetRoles.major}</p>
                </div>
                <div>
                  <p className="text-eyebrow">Optional</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {data.targetRoles.optional.length ? (
                      data.targetRoles.optional.map((r) => <StatusBadge key={r}>{r}</StatusBadge>)
                    ) : (
                      <p className="text-sm text-muted-foreground">No optional roles yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Education">
              <ul className="space-y-4">
                {data.education.map((e) => (
                  <li key={e.id}>
                    <p className="text-sm font-semibold">{e.degree}</p>
                    <p className="text-sm text-muted-foreground">
                      {e.institution} · {e.graduationYear}
                    </p>
                    {e.coursework ? (
                      <p className="mt-1 text-sm text-muted-foreground">Coursework: {e.coursework}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </SectionCard>

            <SectionCard title="Experience">
              <ul className="space-y-4">
                {data.experience.map((x) => (
                  <li key={x.id}>
                    <p className="text-sm font-semibold">
                      {x.title} · {x.company}
                    </p>
                    <p className="text-xs text-muted-foreground">{x.period}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{x.summary}</p>
                  </li>
                ))}
              </ul>
            </SectionCard>

            <SectionCard title="Skills" description="Status is derived from the evidence in your profile.">
              <div className="flex flex-wrap gap-2">
                {data.skills.map((s) => (
                  <SkillBadge key={s.name} name={s.name} level={s.level} />
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Projects">
              <ul className="space-y-4">
                {data.projects.map((p) => (
                  <li key={p.id}>
                    <p className="text-sm font-semibold">{p.name}</p>
                    <p className="text-sm text-muted-foreground">{p.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {p.stack.map((t) => (
                        <StatusBadge key={t}>{t}</StatusBadge>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </SectionCard>

            <SectionCard title="Certifications">
              <ul className="space-y-3">
                {data.certifications.map((c) => (
                  <li key={c.id} className="text-sm">
                    <span className="font-semibold">{c.name}</span>
                    <span className="text-muted-foreground"> · {c.issuer} · {c.year}</span>
                  </li>
                ))}
              </ul>
            </SectionCard>

            <SectionCard title="Career preferences">
              <dl className="grid gap-3 sm:grid-cols-2">
                <Detail label="Work mode" value={data.preferences.workMode} />
                <Detail label="Job types" value={data.preferences.jobTypes.join(", ")} />
                <Detail label="Preferred locations" value={data.preferences.locations.join(", ")} />
                <Detail label="Minimum experience" value={`${data.preferences.minExperienceYears} years`} />
              </dl>
            </SectionCard>
          </div>

          <SectionCard
            title="Resume"
            description="Managed in the Resume module."
            actions={
              <Button variant="outline" size="sm" asChild>
                <a href="/resume">Open resume module</a>
              </Button>
            }
          >
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge tone="warning">No resume linked yet</StatusBadge>
              <p className="text-sm text-muted-foreground">
                Upload an existing resume or build one from this profile.
              </p>
            </div>
          </SectionCard>

          <BackendNotice>
            Profile edits currently update the in-memory profile service; they will persist once the
            FastAPI + MongoDB profile endpoints are connected.
          </BackendNotice>
        </>
      ) : null}

      <Dialog open={editingRoles} onOpenChange={setEditingRoles}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit target roles</DialogTitle>
            <DialogDescription>
              Target roles drive resume relevance, interview preparation and job matching.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <SelectField
              id="major"
              label="Major role"
              value={roleDraft.major}
              onChange={(value) => setRoleDraft((d) => ({ ...d, major: value }))}
              options={ROLE_OPTIONS}
              placeholder="Select your major role"
            />
            <SelectField
              id="o1"
              label="Optional role 1"
              value={roleDraft.o1}
              onChange={(value) => setRoleDraft((d) => ({ ...d, o1: value }))}
              options={ROLE_OPTIONS}
              placeholder="Select an optional role"
            />
            <SelectField
              id="o2"
              label="Optional role 2"
              value={roleDraft.o2}
              onChange={(value) => setRoleDraft((d) => ({ ...d, o2: value }))}
              options={ROLE_OPTIONS}
              placeholder="Select an optional role"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRoles(false)}>
              Cancel
            </Button>
            <Button onClick={() => void saveRoles()} disabled={!roleDraft.major || saving}>
              <Plus className="size-3.5" aria-hidden /> Save roles
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-eyebrow">{label}</dt>
      <dd className="mt-0.5 text-sm capitalize">{value}</dd>
    </div>
  );
}
