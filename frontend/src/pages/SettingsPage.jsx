import { useNavigate } from "react-router-dom";
import { LogOut, Monitor, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader, SectionCard, BackendNotice } from "@/components/common/page";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const NOTIFICATIONS = [
  { id: "daily", label: "Daily task reminder", description: "A morning summary of today's plan." },
  { id: "matches", label: "New job matches", description: "When a job above 75% match appears." },
  {
    id: "apps",
    label: "Application updates",
    description: "Status changes on tracked applications.",
  },
];

export function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [prefs, setPrefs] = useState({
    daily: true,
    matches: true,
    apps: false,
  });

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const themes = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "system", label: "System", icon: Monitor },
  ];

  return (
    <AppShell title="Settings">
      <PageHeader
        title="Settings"
        description="Account details, visual theme, notification preferences and career defaults."
      />

      {/* Appearance / Theme control */}
      <SectionCard title="Appearance & Theme" description="Choose how FutureReady looks to you.">
        <div className="space-y-3">
          <Label className="text-xs font-semibold text-secondary uppercase tracking-wider">
            Color theme
          </Label>
          <div className="flex flex-wrap gap-2.5">
            {themes.map((t) => {
              const Icon = t.icon;
              const active = theme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-sm border px-4 py-2.5 text-xs font-medium transition-all duration-150 ease-out cursor-pointer",
                    active
                      ? "border-accent bg-accent-subtle text-accent shadow-xs"
                      : "border-border bg-surface text-foreground hover:bg-surface-hover hover:border-border-strong",
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground pt-1">
            {theme === "system"
              ? "Automatically adjusts based on your operating system preferences."
              : `Currently set to ${theme} mode.`}
          </p>
        </div>
      </SectionCard>

      <SectionCard title="Account" description="Signed-in account details.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="acc-name" className="text-xs font-medium text-secondary">
              Name
            </Label>
            <Input id="acc-name" defaultValue={user?.name ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="acc-email" className="text-xs font-medium text-secondary">
              Email
            </Label>
            <Input id="acc-email" type="email" defaultValue={user?.email ?? ""} />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button onClick={() => toast.success("Account preferences updated.")}>
            Save changes
          </Button>
          <BackendNotice />
        </div>
      </SectionCard>

      <SectionCard title="Notifications" description="Choose what FutureReady alerts you about.">
        <ul className="divide-y divide-border">
          {NOTIFICATIONS.map((n) => (
            <li
              key={n.id}
              className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{n.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.description}</p>
              </div>
              <Switch
                checked={prefs[n.id] ?? false}
                onCheckedChange={(v) => setPrefs((p) => ({ ...p, [n.id]: v }))}
                aria-label={n.label}
              />
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard
        title="Career preferences"
        description="Used for job matching and daily task generation."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="pref-locations" className="text-xs font-medium text-secondary">
              Preferred locations
            </Label>
            <Input id="pref-locations" defaultValue="Chennai, Bengaluru, Remote" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pref-mode" className="text-xs font-medium text-secondary">
              Preferred work mode
            </Label>
            <Input id="pref-mode" defaultValue="Hybrid" />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Privacy" description="How your profile data is used.">
        <ul className="space-y-1.5 text-xs text-muted-foreground leading-relaxed">
          <li>• Your resume and profile stay strictly within your FutureReady account.</li>
          <li>
            • AI requests are proxied by the FastAPI backend; no API keys exist in this frontend.
          </li>
          <li>• Job search requests never transmit personally identifiable information.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Session">
        <Button variant="destructive" onClick={() => void handleLogout()}>
          <LogOut className="size-4" aria-hidden /> Log out
        </Button>
      </SectionCard>
    </AppShell>
  );
}
