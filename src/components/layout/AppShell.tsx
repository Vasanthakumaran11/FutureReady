import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  BriefcaseBusiness,
  ChevronLeft,
  FileText,
  LayoutDashboard,
  LogOut,
  MessagesSquare,
  Search,
  Settings,
  Sparkles,
  Target,
  User as UserIcon,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Resume", href: "/resume", icon: FileText },
  { label: "Interview Preparation", href: "/interview", icon: MessagesSquare },
  { label: "Job Search", href: "/jobs", icon: Search },
  { label: "Skill Development", href: "/skills", icon: Target },
  { label: "Applications", href: "/applications", icon: BriefcaseBusiness },
  { label: "Profile", href: "/profile", icon: UserIcon },
  { label: "Settings", href: "/settings", icon: Settings },
] as const;

const MOBILE_NAV = NAV.slice(0, 5);

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AppShell({
  title,
  children,
  showSearch = false,
}: {
  title: string;
  children: ReactNode;
  showSearch?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const handleLogout = async () => {
    await logout();
    void navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 lg:flex",
          collapsed ? "w-[72px]" : "w-64",
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Sparkles className="size-4" aria-hidden />
          </span>
          {!collapsed ? (
            <span className="truncate font-display text-sm font-semibold">FutureReady</span>
          ) : null}
        </div>

        <nav aria-label="Main" className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className={cn("size-4 shrink-0", active && "text-sidebar-primary")} aria-hidden />
                {!collapsed ? <span className="truncate">{item.label}</span> : null}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} aria-hidden />
            {!collapsed ? "Collapse" : null}
          </Button>
        </div>
      </aside>

      <div className={cn("flex min-h-screen flex-col", collapsed ? "lg:pl-[72px]" : "lg:pl-64")}>
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-surface/95 px-4 backdrop-blur sm:px-6">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground lg:hidden">
            <Sparkles className="size-4" aria-hidden />
          </span>
          <h2 className="min-w-0 flex-1 truncate font-display text-sm font-semibold sm:text-base">
            {title}
          </h2>

          {showSearch ? (
            <div className="hidden w-64 md:block">
              <label className="sr-only" htmlFor="global-search">
                Search
              </label>
              <Input id="global-search" placeholder="Search jobs, skills, questions" />
            </div>
          ) : null}

          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="size-4" aria-hidden />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-md px-1.5 py-1 text-left transition-colors hover:bg-secondary">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                  {initials(user?.name ?? "FR")}
                </span>
                <span className="hidden text-sm font-medium sm:block">{user?.name ?? "Guest"}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="truncate">{user?.email ?? "Not signed in"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => void handleLogout()}>
                <LogOut className="size-4" aria-hidden /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 px-4 pb-24 pt-6 sm:px-6 lg:pb-10">
          <div className="mx-auto w-full max-w-[1400px] space-y-6">{children}</div>
        </main>
      </div>

      <nav
        aria-label="Mobile"
        className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-surface lg:hidden"
      >
        {MOBILE_NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
                active ? "text-primary" : "text-muted-foreground",
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="size-4" aria-hidden />
              <span className="truncate px-1">{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
