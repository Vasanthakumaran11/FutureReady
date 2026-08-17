import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { PageHeader, SectionCard } from "@/components/common/page";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { interviewService } from "@/services/interview/interviewService";

const CATEGORIES = [
  { id: "dsa", label: "DSA" },
  { id: "coding", label: "Coding" },
  { id: "technical", label: "Technical" },
  { id: "project", label: "Project" },
  { id: "hr", label: "HR" },
];

export function InterviewSetupPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("Backend Developer");
  const [optional1, setOptional1] = useState("Python Developer");
  const [optional2, setOptional2] = useState("Full Stack Developer");
  const [company, setCompany] = useState("");
  const [focus, setFocus] = useState(["dsa", "technical", "project", "coding", "hr"]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadCurrent() {
      try {
        const setup = await interviewService.getSetup();
        if (setup?.role) setRole(setup.role);
        if (setup?.company && setup.company !== "Target Company") setCompany(setup.company);
        if (setup?.focusAreas) setFocus(setup.focusAreas);
      } catch {}
    }
    loadCurrent();
  }, []);

  const toggle = (id) => setFocus((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const save = async () => {
    setSaving(true);
    try {
      await interviewService.saveSetup({
        role,
        company: company.trim() || "Google",
        focus,
      });
      toast.success("Preparation plan configured");
      navigate("/interview");
    } catch {
      toast.error("Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell title="Interview setup">
      <PageHeader
        title="Target role configuration"
        description="Preparation adapts to the role and company you select, on top of your resume, skills and projects."
      />

      <SectionCard title="Target roles" description="One major role and up to two optional roles.">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="major">Major role</Label>
            <Input id="major" value={role} onChange={(e) => setRole(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="opt1">Optional role 1</Label>
            <Input id="opt1" value={optional1} onChange={(e) => setOptional1(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="opt2">Optional role 2</Label>
            <Input id="opt2" value={optional2} onChange={(e) => setOptional2(e.target.value)} />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Company"
        description="Leave blank for general preparation, or name a company for company-specific patterns."
      >
        <div className="max-w-sm space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            placeholder="e.g. Google, Microsoft, Stripe..."
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Preparation focus"
        description="Select the rounds you want to prioritise."
      >
        <ul className="grid gap-3 sm:grid-cols-3">
          {CATEGORIES.map((c) => (
            <li key={c.id}>
              <label className="flex items-center gap-2 rounded-sm border border-border bg-surface p-3 text-sm cursor-pointer hover:bg-surface-hover">
                <Checkbox checked={focus.includes(c.id)} onCheckedChange={() => toggle(c.id)} />
                <span className="font-medium text-foreground">{c.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </SectionCard>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => void save()} disabled={!role || saving}>
          {saving ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          Save configuration
        </Button>
        <Button variant="outline" onClick={() => navigate("/interview")}>
          Cancel
        </Button>
      </div>
    </AppShell>
  );
}
