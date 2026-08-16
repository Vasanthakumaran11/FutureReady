import { Link } from "react-router-dom";
import { Check, Pencil, Plus, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ProgressBar, SkillBadge, StatusBadge } from "@/components/common/indicators";
import { PageHeader, SectionCard } from "@/components/common/page";
import { CardsSkeleton, ErrorState } from "@/components/common/states";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { useAuth } from "@/hooks/useAuth";
import { profileService } from "@/services/profile/profileService";

export function ProfilePage() {
  const { user } = useAuth();
  const { data, loading, error, reload, setData } = useAsyncData(() => profileService.getProfile());

  const [editingRoles, setEditingRoles] = useState(false);
  const [roleDraft, setRoleDraft] = useState({ major: "", secondary: "" });

  const [editingInfo, setEditingInfo] = useState(false);
  const [infoDraft, setInfoDraft] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    workMode: "Hybrid",
    yearsExperience: "0-1",
    skills: "",
  });

  const [saving, setSaving] = useState(false);

  const openRoles = () => {
    if (!data) return;
    setRoleDraft({
      major: data.targetRoles?.major || "",
      secondary: data.targetRoles?.secondary || data.targetRoles?.optional?.[0] || "",
    });
    setEditingRoles(true);
  };

  const saveRoles = async () => {
    setSaving(true);
    try {
      const updated = await profileService.updateProfile({
        ...data,
        targetRoles: {
          major: roleDraft.major,
          secondary: roleDraft.secondary,
        },
      });
      setData(updated);
      setEditingRoles(false);
      toast.success("Target roles updated successfully");
    } catch {
      toast.error("Failed to update target roles");
    } finally {
      setSaving(false);
    }
  };

  const openInfo = () => {
    if (!data) return;
    const skillsList = Array.isArray(data.skills)
      ? data.skills.map((s) => (typeof s === "string" ? s : s.name)).join(", ")
      : "";
    setInfoDraft({
      name: data.name || user?.name || "",
      email: data.email || user?.email || "",
      phone: data.phone || "",
      location: data.location || "",
      workMode: data.workMode || "Hybrid",
      yearsExperience: data.yearsExperience || "0-1",
      skills: skillsList,
    });
    setEditingInfo(true);
  };

  const saveInfo = async () => {
    setSaving(true);
    try {
      const skillsArray = infoDraft.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const updated = await profileService.updateProfile({
        ...data,
        name: infoDraft.name,
        email: infoDraft.email,
        phone: infoDraft.phone,
        location: infoDraft.location,
        workMode: infoDraft.workMode,
        yearsExperience: infoDraft.yearsExperience,
        skills: skillsArray,
      });
      setData(updated);
      setEditingInfo(false);
      toast.success("Personal information updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Dynamic Profile Completeness calculation
  const computeCompleteness = (prof) => {
    if (!prof) return 0;
    let score = 0;
    if (prof.name || user?.name) score += 20;
    if (prof.targetRoles?.major) score += 25;
    if (prof.skills && prof.skills.length > 0) score += 25;
    if (prof.location || prof.phone) score += 15;
    if (
      (prof.education && prof.education.length > 0) ||
      (prof.experience && prof.experience.length > 0)
    )
      score += 15;
    return Math.min(100, score);
  };

  const completeness = computeCompleteness(data);

  return (
    <AppShell title="Profile">
      <PageHeader
        title="Candidate profile"
        description="Everything FutureReady knows about you. Resume analysis, interview preparation, skill gaps and job matching all read from here."
      />

      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {loading && !data ? <CardsSkeleton count={4} height={160} /> : null}

      {data ? (
        <>
          <SectionCard
            title="Profile completeness"
            description="Complete sections improve match accuracy and calculate your live readiness score."
          >
            <div className="flex items-center gap-4">
              <ProgressBar value={completeness} label="Profile completeness" />
              <span className="shrink-0 text-sm font-semibold">{completeness}%</span>
            </div>
          </SectionCard>

          <div className="grid gap-4 xl:grid-cols-2">
            {/* Personal Info */}
            <SectionCard
              title="Personal information"
              actions={
                <Button variant="outline" size="sm" onClick={openInfo}>
                  <Pencil className="size-3.5" aria-hidden /> Edit
                </Button>
              }
            >
              <dl className="grid gap-3 sm:grid-cols-2">
                <Detail label="Name" value={data.name || user?.name || "—"} />
                <Detail label="Email" value={data.email || user?.email || "—"} />
                <Detail label="Phone" value={data.phone || "—"} />
                <Detail label="Location" value={data.location || "—"} />
                <Detail label="Work Mode" value={data.workMode || "Hybrid"} />
                <Detail label="Experience" value={`${data.yearsExperience || "0-1"} years`} />
              </dl>
            </SectionCard>

            {/* Target Roles */}
            <SectionCard
              title="Target roles"
              description="1 major role and optional secondary role."
              actions={
                <Button variant="outline" size="sm" onClick={openRoles}>
                  <Pencil className="size-3.5" aria-hidden /> Edit roles
                </Button>
              }
            >
              <div className="space-y-3">
                <div>
                  <p className="text-eyebrow">Major role</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {data.targetRoles?.major || "Not specified (click Edit roles)"}
                  </p>
                </div>
                <div>
                  <p className="text-eyebrow">Secondary role</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {data.targetRoles?.secondary || data.targetRoles?.optional?.[0] ? (
                      <StatusBadge>
                        {data.targetRoles?.secondary || data.targetRoles?.optional?.[0]}
                      </StatusBadge>
                    ) : (
                      <p className="text-sm text-muted-foreground">No secondary role set.</p>
                    )}
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Skills */}
            <SectionCard
              title="Skills"
              description="Core technical proficiencies used to evaluate job match and skill gaps."
              actions={
                <Button variant="outline" size="sm" onClick={openInfo}>
                  <Plus className="size-3.5" aria-hidden /> Add skills
                </Button>
              }
            >
              {data.skills && data.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((s, idx) => {
                    const skillName = typeof s === "string" ? s : s.name;
                    return (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface-hover px-2.5 py-1 text-xs font-medium text-foreground"
                      >
                        {skillName}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <div className="py-2">
                  <p className="text-sm text-muted-foreground">No skills recorded yet.</p>
                  <Button variant="outline" size="sm" onClick={openInfo} className="mt-2">
                    Add your skills
                  </Button>
                </div>
              )}
            </SectionCard>

            {/* Education */}
            <SectionCard title="Education">
              {data.education && data.education.length > 0 ? (
                <ul className="space-y-4">
                  {data.education.map((e, i) => (
                    <li key={i}>
                      <p className="text-sm font-semibold text-foreground">{e.degree || e.field}</p>
                      <p className="text-sm text-muted-foreground">
                        {e.institution} {e.year ? `· ${e.year}` : ""}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No education history added yet.</p>
              )}
            </SectionCard>

            {/* Experience */}
            <SectionCard title="Experience">
              {data.experience && data.experience.length > 0 ? (
                <ul className="space-y-4">
                  {data.experience.map((x, i) => (
                    <li key={i}>
                      <p className="text-sm font-semibold text-foreground">
                        {x.role || x.title} · {x.company}
                      </p>
                      <p className="text-xs text-muted-foreground">{x.duration || x.period}</p>
                      {x.highlights ? (
                        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                          {x.highlights}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No professional experience recorded yet.
                </p>
              )}
            </SectionCard>

            {/* Projects */}
            <SectionCard title="Projects">
              {data.projects && data.projects.length > 0 ? (
                <ul className="space-y-4">
                  {data.projects.map((p, i) => (
                    <li key={i}>
                      <p className="text-sm font-semibold text-foreground">{p.title || p.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{p.description}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No portfolio projects linked yet.</p>
              )}
            </SectionCard>
          </div>

          {/* Resume Link Tile */}
          <SectionCard
            title="Resume"
            description="Managed in the Resume module."
            actions={
              <Button variant="outline" size="sm" asChild>
                <Link to="/resume">Open resume module</Link>
              </Button>
            }
          >
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-muted-foreground">
                Upload your resume PDF/DOCX or use our interactive builder to calculate your ATS
                scores.
              </p>
            </div>
          </SectionCard>
        </>
      ) : null}

      {/* Edit Target Roles Dialog */}
      <Dialog open={editingRoles} onOpenChange={setEditingRoles}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit target roles</DialogTitle>
            <DialogDescription>
              Target roles drive ATS resume scoring, tailored questions and job matching.
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
              id="secondary"
              label="Secondary role (optional)"
              value={roleDraft.secondary}
              onChange={(value) => setRoleDraft((d) => ({ ...d, secondary: value }))}
              options={ROLE_OPTIONS}
              placeholder="Select an optional role"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRoles(false)}>
              Cancel
            </Button>
            <Button onClick={() => void saveRoles()} disabled={!roleDraft.major || saving}>
              <Check className="size-3.5" aria-hidden /> Save roles
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Personal Info Dialog */}
      <Dialog open={editingInfo} onOpenChange={setEditingInfo}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Profile Information</DialogTitle>
            <DialogDescription>
              Update your contact information, experience level, and core technical skills.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
            <div className="space-y-1.5">
              <Label htmlFor="info-name" className="text-xs font-medium text-secondary">
                Full name
              </Label>
              <Input
                id="info-name"
                value={infoDraft.name}
                onChange={(e) => setInfoDraft((d) => ({ ...d, name: e.target.value }))}
                placeholder="Your full name"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="info-phone" className="text-xs font-medium text-secondary">
                  Phone number
                </Label>
                <Input
                  id="info-phone"
                  value={infoDraft.phone}
                  onChange={(e) => setInfoDraft((d) => ({ ...d, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="info-location" className="text-xs font-medium text-secondary">
                  Location
                </Label>
                <Input
                  id="info-location"
                  value={infoDraft.location}
                  onChange={(e) => setInfoDraft((d) => ({ ...d, location: e.target.value }))}
                  placeholder="Bengaluru, India"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SelectField
                id="workMode"
                label="Work mode"
                value={infoDraft.workMode}
                onChange={(value) => setInfoDraft((d) => ({ ...d, workMode: value }))}
                options={["Remote", "Hybrid", "In-office"]}
              />
              <SelectField
                id="yearsExperience"
                label="Years of experience"
                value={infoDraft.yearsExperience}
                onChange={(value) => setInfoDraft((d) => ({ ...d, yearsExperience: value }))}
                options={["0", "0-1", "1-3", "3-5", "5+"]}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="info-skills" className="text-xs font-medium text-secondary">
                Technical skills (comma separated)
              </Label>
              <Textarea
                id="info-skills"
                value={infoDraft.skills}
                onChange={(e) => setInfoDraft((d) => ({ ...d, skills: e.target.value }))}
                placeholder="Python, FastAPI, React, JavaScript, SQL, Docker, Tailwind CSS"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingInfo(false)}>
              Cancel
            </Button>
            <Button onClick={() => void saveInfo()} disabled={saving}>
              <Check className="size-3.5" aria-hidden /> Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <dt className="text-eyebrow">{label}</dt>
      <dd className="mt-0.5 text-sm text-foreground">{value}</dd>
    </div>
  );
}
