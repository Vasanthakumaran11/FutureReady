import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader, SectionCard, BackendNotice } from "@/components/common/page";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — FutureReady" },
      { name: "description", content: "Manage your account, notifications, career and privacy preferences." },
      { property: "og:title", content: "Settings — FutureReady" },
      { property: "og:description", content: "Account, notification, career and privacy preferences." },
    ],
  }),
  component: SettingsPage,
});

const NOTIFICATIONS = [
  { id: "daily", label: "Daily task reminder", description: "A morning summary of today's plan." },
  { id: "matches", label: "New job matches", description: "When a job above 75% match appears." },
  { id: "apps", label: "Application updates", description: "Status changes on tracked applications." },
];

function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState<Record<string, boolean>>({ daily: true, matches: true, apps: false });

  const handleLogout = async () => {
    await logout();
    void navigate({ to: "/login" });
  };

  return (
    <AppShell title="Settings">
      <PageHeader
        title="Settings"
        description="Account details, notification behaviour and career preferences."
      />

      <SectionCard title="Account" description="Signed-in account details.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="acc-name">Name</Label>
            <Input id="acc-name" defaultValue={user?.name ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="acc-email">Email</Label>
            <Input id="acc-email" type="email" defaultValue={user?.email ?? ""} />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Button onClick={() => toast("Account changes will persist once the backend is connected.")}>
            Save changes
          </Button>
          <BackendNotice />
        </div>
      </SectionCard>

      <SectionCard title="Notifications" description="Choose what FutureReady tells you about.">
        <ul className="divide-y divide-border">
          {NOTIFICATIONS.map((n) => (
            <li key={n.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium">{n.label}</p>
                <p className="text-sm text-muted-foreground">{n.description}</p>
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

      <SectionCard title="Career preferences" description="Used for job matching and daily task generation.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="pref-locations">Preferred locations</Label>
            <Input id="pref-locations" defaultValue="Chennai, Bengaluru, Remote" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pref-mode">Preferred work mode</Label>
            <Input id="pref-mode" defaultValue="Hybrid" />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Privacy" description="How your profile data is used.">
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Your resume and profile stay in your FutureReady account.</li>
          <li>• AI requests are proxied by the FastAPI backend; no keys exist in this frontend.</li>
          <li>• Job provider requests never receive your personal details.</li>
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
