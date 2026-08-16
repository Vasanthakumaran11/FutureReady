import { Link, useNavigate } from "react-router-dom";
import { Check, ChevronDown, FileText, Loader2, Plus, Sparkles, UserCheck, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { AiLabel, ProgressBar, StatusBadge } from "@/components/common/indicators";
import { PageHeader, SectionCard } from "@/components/common/page";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { profileService } from "@/services/profile/profileService";
import { resumeService } from "@/services/resume/resumeService";

const STEPS = [
  { key: "personal", label: "Personal details" },
  { key: "education", label: "Education" },
  { key: "skills", label: "Skills" },
  { key: "projects", label: "Projects" },
  { key: "experience", label: "Experience" },
  { key: "certifications", label: "Certifications" },
  { key: "role", label: "Target role" },
  { key: "review", label: "Review" },
];

const TEMPLATES = [
  { id: "classic", name: "Classic", note: "Single column, ATS-safe, dense." },
  { id: "modern", name: "Modern", note: "Single column with a skills sidebar block." },
];

const TARGET_ROLE_OPTIONS = [
  "Full Stack Developer",
  "Backend Software Engineer",
  "Frontend Engineer",
  "DevOps / Cloud Engineer",
  "Data Scientist / ML Engineer",
  "Mobile App Developer (iOS / Android)",
  "Cybersecurity Analyst",
  "QA / Automation Engineer",
  "Systems & Network Engineer",
  "Product Engineer",
];

const DEGREE_OPTIONS = [
  "B.Tech / B.E. in Computer Science & Engineering",
  "B.Tech / B.E. in Information Technology",
  "B.Tech / B.E. in Artificial Intelligence & Data Science",
  "B.Tech / B.E. in Electronics & Communication",
  "B.Tech / B.E. in Electrical & Electronics",
  "B.Sc / BCA in Computer Science",
  "M.Tech / M.E. in Computer Science",
  "MCA (Master of Computer Applications)",
  "Diploma in Computer Engineering",
  "Other / Custom Degree",
];

const GRADUATION_YEAR_OPTIONS = [
  "2029",
  "2028",
  "2027",
  "2026",
  "2025",
  "2024",
  "2023",
  "2022",
  "2021",
];

const POPULAR_SKILLS = {
  Languages: ["Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "SQL"],
  Frontend: ["React", "Next.js", "HTML5", "CSS3", "Tailwind CSS", "Redux", "Vue.js"],
  Backend: ["FastAPI", "Node.js", "Express.js", "Django", "Flask", "Spring Boot", "REST APIs"],
  Databases: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "SQLite"],
  "Cloud & DevOps": [
    "Docker",
    "Kubernetes",
    "AWS",
    "Google Cloud (GCP)",
    "Azure",
    "CI/CD",
    "Git",
    "Linux",
  ],
  "AI / ML": [
    "Machine Learning",
    "Deep Learning",
    "TensorFlow",
    "PyTorch",
    "Pandas",
    "Scikit-Learn",
  ],
};

const POPULAR_CERTS = [
  "AWS Certified Solutions Architect - Associate",
  "AWS Certified Developer - Associate",
  "Google Cloud Associate Cloud Engineer",
  "Meta Frontend Developer Professional Certificate",
  "Microsoft Certified: Azure Fundamentals (AZ-900)",
  "MongoDB Certified Developer Associate",
  "Postman API Fundamentals Student Expert",
  "Docker Certified Associate (DCA)",
];

export function ResumeCreatePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [template, setTemplate] = useState("classic");
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  // AI Bullet Variants State
  const [variantsModal, setVariantsModal] = useState({ open: false, field: null, variants: [] });
  const [variantLoading, setVariantLoading] = useState(false);

  const [values, setValues] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    degree: "",
    institution: "",
    graduationYear: "2026",
    skills: "",
    projects: "",
    experience: "",
    certifications: "",
    targetRole: "Full Stack Developer",
  });
  const [errors, setErrors] = useState({});
  const [aiSummary, setAiSummary] = useState(null);

  // Pre-fill from existing profile so the user doesn't start from an empty page
  useEffect(() => {
    async function loadExistingProfile() {
      try {
        const prof = await profileService.getProfile();
        if (prof) {
          const skillsString = Array.isArray(prof.skills)
            ? prof.skills.map((s) => (typeof s === "string" ? s : s.name)).join(", ")
            : "";
          setValues((prev) => ({
            ...prev,
            fullName: prof.name || user?.name || "",
            email: prof.email || user?.email || "",
            phone: prof.phone || "",
            location: prof.location || "",
            skills: skillsString || prev.skills,
            targetRole: prof.targetRoles?.major || prev.targetRole || "Full Stack Developer",
          }));
        }
      } catch {
        // ignore
      }
    }
    loadExistingProfile();
  }, [user]);

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const toggleSkill = (skill) => {
    const currentList = values.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (currentList.includes(skill)) {
      setValues((v) => ({
        ...v,
        skills: currentList.filter((s) => s !== skill).join(", "),
      }));
    } else {
      setValues((v) => ({
        ...v,
        skills: [...currentList, skill].join(", "),
      }));
    }
  };

  const addCert = (cert) => {
    const currentList = values.certifications
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    if (!currentList.includes(cert)) {
      setValues((v) => ({
        ...v,
        certifications: [...currentList, cert].join(", "),
      }));
      toast.success(`Added ${cert}`);
    }
  };

  const validateStep = (key) => {
    const next = {};
    if (key === "personal") {
      if (!values["fullName"]) next["fullName"] = "Full name is required.";
      if (!values["email"]) next["email"] = "Email is required.";
    }
    if (key === "role") {
      if (!values["targetRole"]) next["targetRole"] = "Target role is required.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const next = () => {
    const currentKey = STEPS[step].key;
    if (validateStep(currentKey)) {
      setStep((s) => Math.min(STEPS.length - 1, s + 1));
    }
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  const refine = async () => {
    if (!values["summary"]) {
      toast.error("Please enter a summary first.");
      return;
    }
    setGenerating(true);
    try {
      const res = await resumeService.refineSection(
        values["summary"],
        values["targetRole"] || "Software Engineer",
      );
      setAiSummary(res.suggested || res);
      toast.success("AI refined your summary wording");
    } catch {
      toast.error("Refinement unavailable. Check server connection.");
    } finally {
      setGenerating(false);
    }
  };

  const generateVariantsForField = async (fieldName) => {
    const rawText = values[fieldName];
    if (!rawText || !rawText.trim()) {
      toast.error(`Please enter a brief description for ${fieldName} first.`);
      return;
    }
    setVariantLoading(true);
    try {
      const skillsArray = values.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const res = await resumeService.generateBullets(rawText, skillsArray);
      if (res.variants && res.variants.length > 0) {
        setVariantsModal({ open: true, field: fieldName, variants: res.variants });
      } else {
        toast.info("No variants generated.");
      }
    } catch {
      toast.error("AI bullet generation unavailable.");
    } finally {
      setVariantLoading(false);
    }
  };

  const applyVariant = (text) => {
    if (variantsModal.field) {
      setValues((v) => ({ ...v, [variantsModal.field]: text }));
      setVariantsModal({ open: false, field: null, variants: [] });
      toast.success("AI bullet applied to your resume!");
    }
  };

  const saveDraft = async () => {
    setSaving(true);
    try {
      await profileService.updateProfile({
        name: values.fullName,
        email: values.email,
        phone: values.phone,
        location: values.location,
        skills: values.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        targetRoles: { major: values.targetRole, secondary: "" },
      });
      toast.success("Resume draft saved to profile");
    } catch {
      toast.error("Failed to save draft");
    } finally {
      setSaving(false);
    }
  };

  const generate = async () => {
    setSaving(true);
    try {
      const skillsList = values.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      await resumeService.confirmAndSaveResume({
        profileData: {
          personal: {
            name: values.fullName,
            email: values.email,
            phone: values.phone,
            location: values.location,
          },
          skills: skillsList,
          education: values.degree
            ? [
                {
                  degree: values.degree,
                  institution: values.institution,
                  year: values.graduationYear,
                },
              ]
            : [],
          experience: values.experience
            ? [
                {
                  role: values.targetRole || "Engineer",
                  company: "Company",
                  description: values.experience,
                },
              ]
            : [],
          projects: values.projects
            ? [
                {
                  title: "Key Project",
                  description: values.projects,
                  techStack: skillsList.slice(0, 4),
                },
              ]
            : [],
          certifications: values.certifications
            ? values.certifications
                .split(",")
                .map((c) => c.trim())
                .filter(Boolean)
            : [],
          targetRole: values.targetRole,
        },
        template,
      });
      toast.success("Resume generated and saved to MongoDB!");
      navigate("/resume/analyze");
    } catch {
      toast.error("Failed to generate resume.");
    } finally {
      setSaving(false);
    }
  };

  const current = STEPS[step];
  const activeSkillsList = values.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <AppShell title="Build resume">
      <PageHeader
        title="Resume builder (Skills-Driven)"
        description="Select from dropdowns and let FutureReady's AI craft your ATS-ready resume."
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
            <li
              key={s.key}
              className={i <= step ? "font-semibold text-accent" : "text-muted-foreground"}
            >
              {i + 1}. {s.label}
            </li>
          ))}
        </ol>
      </SectionCard>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <SectionCard title={current.label}>
          <div className="space-y-4">
            {/* Step 1: Personal Details */}
            {current.key === "personal" ? (
              <>
                <Field
                  id="fullName"
                  label="Full name *"
                  value={values["fullName"] ?? ""}
                  onChange={set("fullName")}
                  placeholder="e.g. Vasantha Kumar A"
                  error={errors["fullName"]}
                />
                <Field
                  id="email"
                  label="Email address *"
                  value={values["email"] ?? ""}
                  onChange={set("email")}
                  placeholder="e.g. vasanthakumar@example.com"
                  error={errors["email"]}
                />
                <Field
                  id="phone"
                  label="Phone number"
                  value={values["phone"] ?? ""}
                  onChange={set("phone")}
                  placeholder="e.g. +91 98765 43210"
                />
                <Field
                  id="location"
                  label="Location"
                  value={values["location"] ?? ""}
                  onChange={set("location")}
                  placeholder="e.g. Chennai, India"
                />
                <div className="space-y-2">
                  <Label htmlFor="summary">Professional summary</Label>
                  <Textarea
                    id="summary"
                    rows={3}
                    value={values["summary"] ?? ""}
                    onChange={set("summary")}
                    placeholder="Brief career overview (e.g. Passionate software engineer with hands-on experience in full-stack web applications)..."
                  />
                </div>
                <div className="rounded-sm border border-accent/20 bg-accent-subtle/50 p-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <AiLabel>AI-assisted refinement</AiLabel>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => void refine()}
                      disabled={generating}
                    >
                      {generating ? (
                        <Loader2 className="size-3.5 animate-spin mr-1" aria-hidden />
                      ) : (
                        <Sparkles className="size-3.5 mr-1" aria-hidden />
                      )}
                      Refine wording
                    </Button>
                  </div>
                  {aiSummary ? (
                    <div className="mt-3 p-2.5 bg-surface border border-accent/30 rounded-sm">
                      <p className="text-xs sm:text-sm text-foreground">{aiSummary}</p>
                      <Button
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          setValues((v) => ({ ...v, summary: aiSummary }));
                          setAiSummary(null);
                          toast.success("Applied AI summary!");
                        }}
                      >
                        Accept suggestion
                      </Button>
                    </div>
                  ) : null}
                </div>
              </>
            ) : null}

            {/* Step 2: Education with Dropdown Selection */}
            {current.key === "education" ? (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="degreeSelect" className="text-xs font-medium text-secondary">
                    Degree / Academic Qualification
                  </Label>
                  <select
                    id="degreeSelect"
                    value={DEGREE_OPTIONS.includes(values.degree) ? values.degree : "Other"}
                    onChange={(e) => {
                      if (e.target.value !== "Other") {
                        setValues((v) => ({ ...v, degree: e.target.value }));
                      }
                    }}
                    className="w-full rounded-sm border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
                  >
                    <option value="">-- Select Degree from Dropdown --</option>
                    {DEGREE_OPTIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                    <option value="Other">Custom / Type manually...</option>
                  </select>
                </div>

                <Field
                  id="degree"
                  label="Degree Title (or customize below)"
                  value={values["degree"] ?? ""}
                  onChange={set("degree")}
                  placeholder="e.g. B.Tech in Computer Science and Engineering"
                />

                <Field
                  id="institution"
                  label="Institution / University Name"
                  value={values["institution"] ?? ""}
                  onChange={set("institution")}
                  placeholder="e.g. Anna University / Kongu Engineering College"
                />

                <div className="space-y-1.5">
                  <Label htmlFor="gradYearSelect" className="text-xs font-medium text-secondary">
                    Graduation Year
                  </Label>
                  <select
                    id="gradYearSelect"
                    value={values.graduationYear}
                    onChange={set("graduationYear")}
                    className="w-full rounded-sm border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
                  >
                    {GRADUATION_YEAR_OPTIONS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : null}

            {/* Step 3: Skills with Category Dropdown Selectors */}
            {current.key === "skills" ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="skills">
                    Active Selected Skills (comma separated or picked below)
                  </Label>
                  <Textarea
                    id="skills"
                    rows={3}
                    value={values["skills"] ?? ""}
                    onChange={set("skills")}
                    placeholder="Python, React, FastAPI, SQL, Docker, Git..."
                  />
                </div>

                <div className="rounded-sm border border-border bg-surface-hover/30 p-4 space-y-4">
                  <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Sparkles className="size-3.5 text-accent" /> Select skills by category from
                    dropdowns:
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {Object.entries(POPULAR_SKILLS).map(([category, skills]) => {
                      const categorySelected = skills.filter((s) => activeSkillsList.includes(s));
                      return (
                        <div
                          key={category}
                          className="space-y-2 rounded-sm border border-border/80 bg-surface p-3"
                        >
                          <Label className="text-xs font-medium text-secondary">{category}</Label>
                          <select
                            value=""
                            onChange={(e) => {
                              if (e.target.value) {
                                toggleSkill(e.target.value);
                              }
                            }}
                            className="w-full rounded-sm border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground focus:border-accent focus:outline-none"
                          >
                            <option value="">+ Add {category} skill...</option>
                            {skills.map((skill) => (
                              <option
                                key={skill}
                                value={skill}
                                disabled={activeSkillsList.includes(skill)}
                              >
                                {skill} {activeSkillsList.includes(skill) ? "✓ (Added)" : ""}
                              </option>
                            ))}
                          </select>

                          {/* Selected tags for this category */}
                          {categorySelected.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {categorySelected.map((skill) => (
                                <span
                                  key={skill}
                                  className="inline-flex items-center gap-1 rounded-sm border border-accent/40 bg-accent-subtle px-2 py-0.5 text-[11px] font-medium text-accent"
                                >
                                  {skill}
                                  <button
                                    type="button"
                                    onClick={() => toggleSkill(skill)}
                                    className="hover:text-destructive transition-colors ml-0.5"
                                    aria-label={`Remove ${skill}`}
                                  >
                                    <X className="size-3" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Step 4: Projects with AI Generator */}
            {current.key === "projects" ? (
              <div className="space-y-3">
                <Label htmlFor="projects">Projects & Applications Built</Label>
                <Textarea
                  id="projects"
                  rows={5}
                  value={values["projects"] ?? ""}
                  onChange={set("projects")}
                  placeholder="Describe your project informally (e.g. Built a candidate job matching portal using React, FastAPI and MongoDB with JWT authentication and resume parsing)..."
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => generateVariantsForField("projects")}
                  disabled={variantLoading}
                >
                  {variantLoading ? (
                    <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  ) : (
                    <Sparkles className="size-3.5 mr-1.5 text-accent" />
                  )}
                  Generate 3 AI bullet variants
                </Button>
              </div>
            ) : null}

            {/* Step 5: Experience with AI Generator */}
            {current.key === "experience" ? (
              <div className="space-y-3">
                <Label htmlFor="experience">Work Experience / Internships</Label>
                <Textarea
                  id="experience"
                  rows={5}
                  value={values["experience"] ?? ""}
                  onChange={set("experience")}
                  placeholder="Describe your role or internship duties (e.g. Developed REST APIs for user authentication, reduced database latency by 20% using MongoDB indexing)..."
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => generateVariantsForField("experience")}
                  disabled={variantLoading}
                >
                  {variantLoading ? (
                    <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  ) : (
                    <Sparkles className="size-3.5 mr-1.5 text-accent" />
                  )}
                  Generate 3 AI bullet variants
                </Button>
              </div>
            ) : null}

            {/* Step 6: Certifications with Dropdown Quick-Add */}
            {current.key === "certifications" ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="certifications">
                    Certifications (comma separated or select below)
                  </Label>
                  <Textarea
                    id="certifications"
                    rows={3}
                    value={values["certifications"] ?? ""}
                    onChange={set("certifications")}
                    placeholder="e.g. AWS Certified Solutions Architect, Meta Frontend Professional"
                  />
                </div>

                <div className="rounded-sm border border-border bg-surface-hover/30 p-3.5 space-y-3">
                  <Label htmlFor="certSelect" className="text-xs font-semibold text-foreground">
                    Select Industry Certification from Dropdown:
                  </Label>
                  <select
                    id="certSelect"
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        addCert(e.target.value);
                      }
                    }}
                    className="w-full rounded-sm border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
                  >
                    <option value="">+ Select certification to add...</option>
                    {POPULAR_CERTS.map((cert) => (
                      <option key={cert} value={cert}>
                        {cert}
                      </option>
                    ))}
                  </select>

                  {/* Active certifications tag display */}
                  {values.certifications ? (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {values.certifications
                        .split(",")
                        .map((c) => c.trim())
                        .filter(Boolean)
                        .map((cert) => (
                          <span
                            key={cert}
                            className="inline-flex items-center gap-1 rounded-sm border border-accent/40 bg-accent-subtle px-2 py-0.5 text-[11px] font-medium text-accent"
                          >
                            {cert}
                            <button
                              type="button"
                              onClick={() => {
                                const list = values.certifications
                                  .split(",")
                                  .map((c) => c.trim())
                                  .filter(Boolean)
                                  .filter((c) => c !== cert);
                                setValues((v) => ({ ...v, certifications: list.join(", ") }));
                              }}
                              className="hover:text-destructive transition-colors ml-0.5"
                              aria-label={`Remove ${cert}`}
                            >
                              <X className="size-3" />
                            </button>
                          </span>
                        ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            {/* Step 7: Target Role with Dropdown Select */}
            {current.key === "role" ? (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="roleSelect" className="text-xs font-medium text-secondary">
                    Select Target Engineering Role *
                  </Label>
                  <select
                    id="roleSelect"
                    value={
                      TARGET_ROLE_OPTIONS.includes(values.targetRole) ? values.targetRole : "Custom"
                    }
                    onChange={(e) => {
                      if (e.target.value !== "Custom") {
                        setValues((v) => ({ ...v, targetRole: e.target.value }));
                      }
                    }}
                    className="w-full rounded-sm border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
                  >
                    {TARGET_ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                    <option value="Custom">Custom Role...</option>
                  </select>
                </div>

                <Field
                  id="targetRole"
                  label="Target Role Title"
                  value={values["targetRole"] ?? ""}
                  onChange={set("targetRole")}
                  error={errors["targetRole"]}
                  placeholder="e.g. Full Stack Software Engineer"
                />
              </div>
            ) : null}

            {/* Step 8: Review Step */}
            {current.key === "review" ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Review your information before generating your ATS resume.
                </p>
                <dl className="grid gap-2 sm:grid-cols-2">
                  {Object.entries(values)
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                      <div key={k} className="rounded-sm border border-border p-3">
                        <dt className="text-eyebrow capitalize">{k.replace(/([A-Z])/g, " $1")}</dt>
                        <dd className="mt-1 text-xs text-foreground line-clamp-2">{v}</dd>
                      </div>
                    ))}
                </dl>
              </div>
            ) : null}

            {/* Stepper Navigation */}
            <div className="flex justify-between pt-4 border-t border-border">
              <Button variant="outline" onClick={back} disabled={step === 0}>
                Back
              </Button>
              {step < STEPS.length - 1 ? (
                <Button onClick={next}>Continue</Button>
              ) : (
                <Button onClick={() => void generate()} disabled={saving}>
                  {saving ? (
                    <Loader2 className="size-4 animate-spin mr-1.5" />
                  ) : (
                    <UserCheck className="size-4 mr-1.5" />
                  )}
                  Generate ATS Resume
                </Button>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Live ATS Preview */}
        <SectionCard title="ATS preview & template">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplate(t.id)}
                  className={`rounded-sm border p-3 text-left transition-all ${
                    template === t.id
                      ? "border-accent bg-accent-subtle/40 shadow-xs"
                      : "border-border hover:bg-surface-hover"
                  }`}
                >
                  <p className="text-xs font-semibold text-foreground">{t.name}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{t.note}</p>
                </button>
              ))}
            </div>

            <div className="rounded-sm border border-border bg-surface p-4 font-mono text-[11.5px] leading-relaxed text-foreground min-h-64 max-h-96 overflow-y-auto">
              <div className="border-b border-border pb-2 text-center">
                <p className="font-bold text-sm tracking-tight">{values.fullName || "YOUR NAME"}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {[values.email, values.phone, values.location].filter(Boolean).join(" · ") ||
                    "contact@email.com · location"}
                </p>
                {values.targetRole ? (
                  <p className="text-[11px] font-semibold text-accent mt-1 uppercase tracking-wider">
                    {values.targetRole}
                  </p>
                ) : null}
              </div>

              {values.skills ? (
                <div className="mt-3">
                  <p className="font-bold text-[11px] uppercase tracking-wider text-accent border-b border-border/50 pb-0.5">
                    TECHNICAL SKILLS
                  </p>
                  <p className="mt-1 text-[11px]">{values.skills}</p>
                </div>
              ) : null}

              {values.projects ? (
                <div className="mt-3">
                  <p className="font-bold text-[11px] uppercase tracking-wider text-accent border-b border-border/50 pb-0.5">
                    PROJECTS
                  </p>
                  <p className="mt-1 text-[11px] whitespace-pre-line">{values.projects}</p>
                </div>
              ) : null}

              {values.experience ? (
                <div className="mt-3">
                  <p className="font-bold text-[11px] uppercase tracking-wider text-accent border-b border-border/50 pb-0.5">
                    EXPERIENCE
                  </p>
                  <p className="mt-1 text-[11px] whitespace-pre-line">{values.experience}</p>
                </div>
              ) : null}

              {values.education || values.degree ? (
                <div className="mt-3">
                  <p className="font-bold text-[11px] uppercase tracking-wider text-accent border-b border-border/50 pb-0.5">
                    EDUCATION
                  </p>
                  <p className="mt-1 text-[11px]">
                    {values.degree} — {values.institution} ({values.graduationYear})
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </SectionCard>
      </div>

      {/* AI Bullet Variants Selection Modal */}
      {variantsModal.open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-md border border-border bg-surface p-5 shadow-raised space-y-4">
            <div>
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="size-4.5 text-accent" />
                Select an AI Bullet Option
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Choose the emphasis that best fits your experience. Information is grounded strictly
                in what you wrote.
              </p>
            </div>

            <div className="space-y-3">
              {variantsModal.variants.map((v, i) => (
                <div
                  key={i}
                  className="rounded-sm border border-border bg-surface-hover/50 p-3.5 transition-colors hover:border-accent/40"
                >
                  <div className="flex items-center justify-between">
                    <StatusBadge tone="primary">
                      {v.emphasis === "technical_depth"
                        ? "Technical Depth"
                        : v.emphasis === "impact"
                          ? "Quantified Impact"
                          : "Leadership & Collaboration"}
                    </StatusBadge>
                    <Button size="sm" onClick={() => applyVariant(v.text)}>
                      Use this
                    </Button>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm text-foreground">{v.text}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => setVariantsModal({ open: false, field: null, variants: [] })}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}

function Field({ id, label, value, onChange, placeholder, error }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-semibold text-foreground">
        {label}
      </Label>
      <Input
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
      />
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
