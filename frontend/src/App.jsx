import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/sonner";

import { LandingPage } from "@/pages/LandingPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ResumeIndexPage } from "@/pages/ResumeIndexPage";
import { ResumeAnalyzePage } from "@/pages/ResumeAnalyzePage";
import { ResumeCreatePage } from "@/pages/ResumeCreatePage";
import { InterviewIndexPage } from "@/pages/InterviewIndexPage";
import { InterviewSetupPage } from "@/pages/InterviewSetupPage";
import { InterviewDSAPage } from "@/pages/InterviewDSAPage";
import { InterviewTechnicalPage } from "@/pages/InterviewTechnicalPage";
import { InterviewProjectPage } from "@/pages/InterviewProjectPage";
import { InterviewHRPage } from "@/pages/InterviewHRPage";
import { SkillsPage } from "@/pages/SkillsPage";
import { JobsPage } from "@/pages/JobsPage";
import { JobDetailPage } from "@/pages/JobDetailPage";
import { ApplicationsPage } from "@/pages/ApplicationsPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { SettingsPage } from "@/pages/SettingsPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";
import { OnboardingPage } from "@/pages/OnboardingPage";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Entry Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />

            {/* Core Authenticated App Routes */}
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Resume Module */}
            <Route path="/resume" element={<ResumeIndexPage />} />
            <Route path="/resume/analyze" element={<ResumeAnalyzePage />} />
            <Route path="/resume/create" element={<ResumeCreatePage />} />

            {/* Interview Module (4 Core Sections) */}
            <Route path="/interview" element={<InterviewIndexPage />} />
            <Route path="/interview/setup" element={<InterviewSetupPage />} />
            <Route path="/interview/dsa" element={<InterviewDSAPage />} />
            <Route path="/interview/technical" element={<InterviewTechnicalPage />} />
            <Route path="/interview/project" element={<InterviewProjectPage />} />
            <Route path="/interview/hr" element={<InterviewHRPage />} />
            <Route path="/interview/coding" element={<Navigate to="/interview/dsa" replace />} />

            {/* Skills Module */}
            <Route path="/skills" element={<SkillsPage />} />

            {/* Job Search & Match Module */}
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:jobId" element={<JobDetailPage />} />

            {/* Applications Tracker */}
            <Route path="/applications" element={<ApplicationsPage />} />

            {/* Profile & Settings */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </ThemeProvider>
  );
}
