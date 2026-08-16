import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  BriefcaseBusiness,
  FileText,
  LayoutDashboard,
  LogOut,
  MessagesSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  Target,
  User as UserIcon,
} from "lucide-react";
import { useState } from "react";

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
import { Logo } from "@/components/common/Logo";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const MAIN_NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Resume", href: "/resume", icon: FileText },
  { label: "Interview Preparation", href: "/interview", icon: MessagesSquare },
  { label: "Job Search", href: "/jobs", icon: Search },
  { label: "Skill Development", href: "/skills", icon: Target },
  { label: "Applications", href: "/applications", icon: BriefcaseBusiness },
];

const SECONDARY_NAV = [
  { label: "Profile", href: "/profile", icon: UserIcon },
  { label: "Settings", href: "/settings", icon: Settings },
];

const MOBILE_NAV = [...MAIN_NAV.slice(0, 4), SECONDARY_NAV[0]];

function initials(name) {
  return (name || "FR")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AppShell({ title, children, showSearch = false }) {
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarHidden((prev) => !prev);
  };

  const renderNavLink = (item) => {
    const active =
      pathname === item.href ||
      (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
    const Icon = item.icon;

    return (
      <Link
        key={item.href}
        to={item.href}
        className={cn(
          "group relative flex items-center gap-3.5 rounded-md px-3.5 py-2.5 text-[13.5px] font-medium transition-all duration-150 ease-out",
          active
            ? "bg-accent-subtle text-accent font-semibold shadow-xs before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r before:bg-accent"
            : "text-muted-foreground hover:bg-surface-hover hover:text-foreground",
        )}
        aria-current={active ? "page" : undefined}
      >
        <Icon
          className={cn(
            "size-5 shrink-0 transition-transform duration-150 group-hover:scale-105",
            active ? "text-accent" : "text-muted-foreground group-hover:text-foreground",
          )}
          aria-hidden
        />
        <span className="truncate">{item.label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar Desktop */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-border bg-surface transition-all duration-300 ease-out lg:flex",
          sidebarHidden
            ? "w-0 -translate-x-full opacity-0 pointer-events-none border-r-0"
            : "w-64 translate-x-0 opacity-100",
        )}
      >
        {/* Top Header with clickable Logo to hide navbar */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="group flex h-16 w-full items-center gap-3 border-b border-border px-4.5 text-left transition-colors hover:bg-surface-hover cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          title="Click logo to hide sidebar"
          aria-label="Hide sidebar"
        >
          <Logo className="transition-transform duration-200 group-hover:scale-105" />
          <div className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold tracking-tight text-foreground">
              FutureReady
            </span>
            <span className="block text-[10px] font-medium text-tertiary uppercase tracking-wider">
              Career Hub
            </span>
          </div>
          <PanelLeftClose
            className="size-4 text-muted-foreground opacity-0 transition-opacity duration-150 group-hover:opacity-100"
            aria-hidden
          />
        </button>

        {/* Main Navigation Scroll Area */}
        <nav
          aria-label="Main navigation"
          className="flex-1 space-y-6 overflow-y-auto p-3.5 scrollbar-thin"
        >
          {/* Main Section */}
          <div className="space-y-1.5">
            <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-tertiary">
              Menu
            </p>
            {MAIN_NAV.map(renderNavLink)}
          </div>

          {/* Account & Settings Section */}
          <div className="space-y-1.5 border-t border-border/60 pt-4">
            <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-tertiary">
              Account
            </p>
            {SECONDARY_NAV.map(renderNavLink)}
          </div>
        </nav>

        {/* Sidebar Footer: User Card */}
        <div className="border-t border-border p-3 space-y-2 bg-surface">
          <div className="flex items-center justify-between rounded-md p-1.5 transition-colors hover:bg-surface-hover">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-accent-subtle text-xs font-semibold text-accent">
                {initials(user?.name ?? "FR")}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-foreground">
                  {user?.name ?? "Guest User"}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {user?.email ?? "user@example.com"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground hover:text-destructive hover:bg-danger-soft"
              onClick={() => void handleLogout()}
              title="Log out"
            >
              <LogOut className="size-3.5" aria-hidden />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area — dynamically expands when sidebar is hidden */}
      <div
        className={cn(
          "flex min-h-screen flex-col transition-all duration-300 ease-out",
          sidebarHidden ? "lg:pl-0" : "lg:pl-64",
        )}
      >
        {/* Top bar (64px) */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-surface px-4 sm:px-6">
          {/* Clickable Logo in topbar to toggle sidebar on desktop and mobile */}
          <button
            type="button"
            onClick={toggleSidebar}
            className="group flex items-center gap-2.5 rounded-md p-1 transition-colors hover:bg-surface-hover cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            title={sidebarHidden ? "Show sidebar" : "Hide sidebar"}
            aria-label={sidebarHidden ? "Show sidebar" : "Hide sidebar"}
          >
            <Logo className="transition-transform duration-200 group-hover:scale-105" />
            {sidebarHidden ? (
              <div className="hidden items-center gap-1.5 sm:flex">
                <span className="text-sm font-semibold tracking-tight text-foreground">
                  FutureReady
                </span>
                <PanelLeftOpen className="size-3.5 text-muted-foreground" aria-hidden />
              </div>
            ) : null}
          </button>

          <h2 className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground sm:text-base">
            {title}
          </h2>

          {showSearch ? (
            <div className="hidden w-64 md:block">
              <label className="sr-only" htmlFor="global-search">
                Search
              </label>
              <Input
                id="global-search"
                placeholder="Search jobs, skills, questions"
                className="h-9 text-xs"
              />
            </div>
          ) : null}

          {/* Notification bell with subtle 6px accent dot */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="size-9 rounded-sm text-muted-foreground hover:bg-surface-hover hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell className="size-4.5" aria-hidden />
            </Button>
            <span
              className="absolute right-2 top-2 size-1.5 rounded-full bg-accent ring-2 ring-surface"
              aria-hidden
            />
          </div>

          {/* User profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-2 rounded-sm p-1 text-left transition-colors duration-150 hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="User account menu"
              >
                <span className="flex size-8 items-center justify-center rounded-full border border-border bg-accent-subtle text-xs font-semibold text-accent">
                  {initials(user?.name ?? "FR")}
                </span>
                <span className="hidden text-xs font-medium text-foreground sm:block">
                  {user?.name ?? "Guest"}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 border-border bg-surface text-foreground shadow-raised"
            >
              <DropdownMenuLabel className="truncate text-xs text-muted-foreground">
                {user?.email ?? "Not signed in"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem asChild className="hover:bg-surface-hover cursor-pointer">
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-surface-hover cursor-pointer">
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem
                onSelect={() => void handleLogout()}
                className="text-destructive hover:bg-danger-soft cursor-pointer"
              >
                <LogOut className="size-4" aria-hidden /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page body — dynamically sized */}
        <main className="flex-1 px-4 py-6 sm:px-6 md:px-8 pb-24 lg:pb-12">
          <div
            className={cn(
              "mx-auto w-full transition-all duration-300 ease-out space-y-6",
              sidebarHidden ? "max-w-[1600px]" : "max-w-360",
            )}
          >
            {children}
          </div>
        </main>
      </div>

      {/* Mobile navigation */}
      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-surface lg:hidden"
      >
        {MOBILE_NAV.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium transition-colors",
                active
                  ? "text-accent font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="size-4.5" aria-hidden />
              <span className="truncate px-1">{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
