import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  Briefcase,
  ChevronDown,
  Code2,
  Cpu,
  FileCheck,
  FileText,
  LineChart,
  Lock,
  Moon,
  Sparkles,
  Sun,
  Users,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import darkHeroBg from "@/assets/landing-hero-bg.jpg";
import whiteHeroBg from "@/assets/Landing_page_white.png";

export function LandingPage() {
  const { user } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [resourcesOpen, setResourcesOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const isDark = resolvedTheme === "dark";

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0c] text-neutral-900 dark:text-white selection:bg-blue-600 selection:text-white font-sans antialiased overflow-x-hidden transition-colors duration-300">
      {/* HERO BACKGROUND WITH THEME-SPECIFIC OVERLAYS */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {isDark ? (
          <>
            <img
              src={darkHeroBg}
              alt="FutureReady Dark Theme Background"
              className="w-full h-full object-cover object-center opacity-40 scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c]/95 via-[#0a0a0c]/85 to-[#0a0a0c]/40" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0c]/70 via-transparent to-[#0a0a0c]" />
          </>
        ) : (
          <>
            <img
              src={whiteHeroBg}
              alt="FutureReady White Theme Background"
              className="w-full h-full object-cover object-center opacity-75 scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#f8f9fa]/95 via-[#f8f9fa]/80 to-[#f8f9fa]/30" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#f8f9fa]/50 via-transparent to-[#f8f9fa]" />
          </>
        )}
      </div>

      {/* TOP NAVIGATION BAR */}
      <header className="relative z-50 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <nav className="flex items-center justify-between rounded-2xl border border-neutral-200/90 dark:border-white/10 bg-white/95 dark:bg-[#121216]/90 px-4 sm:px-6 py-3 backdrop-blur-xl shadow-lg shadow-neutral-900/5 dark:shadow-black/50 transition-all duration-300">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm transition-transform duration-200 group-hover:scale-105 overflow-hidden">
              <img
                src="/FutureReady_Logo.png"
                alt="FutureReady Logo"
                className="h-8 w-8 object-contain"
              />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white block leading-tight">
                FutureReady
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-neutral-600 dark:text-neutral-400 uppercase block -mt-0.5">
                Your Career. Our AI.
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-1 sm:gap-2">
            <Link
              to="/"
              className="relative px-3.5 py-1.5 text-sm font-bold text-neutral-950 dark:text-white transition-colors"
            >
              Home
              <span className="absolute bottom-0 left-3.5 right-3.5 h-[2px] rounded-full bg-blue-600 shadow-sm shadow-blue-500/50" />
            </Link>
            <Link
              to={user ? "/resume" : "/login"}
              className="px-3.5 py-1.5 text-sm font-semibold text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white transition-colors"
            >
              Resume
            </Link>
            <Link
              to={user ? "/interview" : "/login"}
              className="px-3.5 py-1.5 text-sm font-semibold text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white transition-colors"
            >
              Interview Prep
            </Link>
            <Link
              to={user ? "/jobs" : "/login"}
              className="px-3.5 py-1.5 text-sm font-semibold text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white transition-colors"
            >
              Job Search
            </Link>
            <Link
              to={user ? "/dashboard" : "/login"}
              className="px-3.5 py-1.5 text-sm font-semibold text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white transition-colors"
            >
              Dashboard
            </Link>

            {/* Resources Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setResourcesOpen((o) => !o)}
                className="flex items-center gap-1 px-3.5 py-1.5 text-sm font-semibold text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white transition-colors"
              >
                Resources
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${resourcesOpen ? "rotate-180" : ""}`}
                />
              </button>
              {resourcesOpen && (
                <div className="absolute top-full left-0 mt-2 w-52 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#16161c] p-2 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95">
                  <Link
                    to={user ? "/skills" : "/login"}
                    onClick={() => setResourcesOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <Cpu className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Skill Gap Insights
                  </Link>
                  <Link
                    to={user ? "/interview/dsa" : "/login"}
                    onClick={() => setResourcesOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <Code2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    DSA & Coding Practice
                  </Link>
                  <Link
                    to={user ? "/settings" : "/login"}
                    onClick={() => setResourcesOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <Lock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    API & Security
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Action Buttons & Theme Switcher */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-amber-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors shadow-sm"
              title={`Switch to ${isDark ? "Light" : "Dark"} mode`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-amber-400 animate-in spin-in-180" />
              ) : (
                <Moon className="h-4 w-4 text-neutral-800 animate-in spin-in-180" />
              )}
            </button>

            {user ? (
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/25 hover:bg-blue-500 transition-all active:scale-95"
              >
                Go to Workspace
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-semibold text-neutral-800 hover:text-black dark:text-neutral-300 dark:hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl border border-neutral-300 dark:border-white/20 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 px-4 py-2 text-sm font-semibold shadow-sm hover:opacity-90 transition-all active:scale-95"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* HERO SECTION */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 lg:pt-24 pb-20 sm:pb-32">
        <div className="max-w-2xl lg:max-w-3xl">

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-neutral-950 dark:text-white/90 leading-[1.08]">
            Your Career. <br />
            Our AI. <br />
            <span className="text-neutral-950 dark:text-white">
              Limitless Possibilities.
            </span>
          </h1>

          {/* High-Contrast Subtitle */}
          <p className="mt-6 text-base sm:text-lg lg:text-xl font-medium text-neutral-800 dark:text-neutral-200 leading-relaxed max-w-xl">
            Build your perfect resume, prepare for interviews, find the right
            opportunities, and grow your skills — all in one AI-powered
            platform.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4">
            <Link
              to={user ? "/dashboard" : "/register"}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 sm:px-7 py-3.5 text-sm sm:text-base font-semibold text-white shadow-xl shadow-blue-600/30 hover:bg-blue-500 hover:shadow-blue-600/40 transition-all duration-200 active:scale-95 ring-1 ring-blue-400/40"
            >
              {user ? "Go to Workspace" : "Get Started Free"}
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300 dark:border-white/20 bg-white dark:bg-neutral-900/90 px-6 sm:px-7 py-3.5 text-sm sm:text-base font-semibold text-neutral-900 dark:text-white backdrop-blur-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 active:scale-95 shadow-sm"
            >
              Explore Features
            </a>
          </div>
        </div>
      </main>

      {/* CORE CAPABILITIES SECTION */}
      <section
        id="features"
        className="relative z-10 border-t border-neutral-200 dark:border-white/10 bg-white/90 dark:bg-[#0c0c10]/95 py-20 backdrop-blur-2xl"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Complete Career Pipeline
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
              Everything you need to land top engineering roles.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#14141a]/90 p-6 backdrop-blur-xl hover:border-blue-500/50 hover:shadow-lg transition-all duration-300 group shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-600/10 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 mb-5 group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-950 dark:text-white">
                AI Resume Building & Extraction
              </h3>
              <p className="mt-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Extract content page-by-page from PDFs/DOCX, normalize skills against canonical tech taxonomy, and generate ATS-perfect resumes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#14141a]/90 p-6 backdrop-blur-xl hover:border-blue-500/50 hover:shadow-lg transition-all duration-300 group shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-600/10 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 mb-5 group-hover:scale-110 transition-transform">
                <FileCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-950 dark:text-white">
                Live ATS Scoring & Refinement
              </h3>
              <p className="mt-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Critique your resume against target job requirements, receive quantified bullet refinements, and accept one-click AI improvements.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#14141a]/90 p-6 backdrop-blur-xl hover:border-blue-500/50 hover:shadow-lg transition-all duration-300 group shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-600/10 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 mb-5 group-hover:scale-110 transition-transform">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-950 dark:text-white">
                AI Mock Interview Simulator
              </h3>
              <p className="mt-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Practice tailored questions in Technical, DSA, System Design, and Behavioral HR domains with instant actionable feedback.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#14141a]/90 p-6 backdrop-blur-xl hover:border-blue-500/50 hover:shadow-lg transition-all duration-300 group shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-600/10 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 mb-5 group-hover:scale-110 transition-transform">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-950 dark:text-white">
                Job Search & Smart Skill Matching
              </h3>
              <p className="mt-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Discover active openings from top tech companies with real skill match percentages and missing competency insights.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#14141a]/90 p-6 backdrop-blur-xl hover:border-blue-500/50 hover:shadow-lg transition-all duration-300 group shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-600/10 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 mb-5 group-hover:scale-110 transition-transform">
                <LineChart className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-950 dark:text-white">
                Application & Journey Tracking
              </h3>
              <p className="mt-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Monitor your interview stages, track application statuses, and follow a clear step-by-step readiness roadmap.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#14141a]/90 p-6 backdrop-blur-xl hover:border-blue-500/50 hover:shadow-lg transition-all duration-300 group shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-600/10 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 mb-5 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-950 dark:text-white">
                Profile & Candidate Blueprint
              </h3>
              <p className="mt-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Maintain a centralized, structured engineering profile with verified certifications, academic details, and live project demos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-neutral-200 dark:border-white/10 bg-white dark:bg-[#09090c] py-10 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 overflow-hidden">
              <img
                src="/FutureReady_Logo.png"
                alt="FutureReady Logo"
                className="h-6 w-6 object-contain"
              />
            </div>
            <span className="font-bold text-neutral-950 dark:text-white">
              FutureReady
            </span>
            <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mx-100">
              © 2026 FutureReady. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
