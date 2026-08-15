export type Id = string;

export interface User {
  id: Id;
  name: string;
  email: string;
  location?: string;
  avatarUrl?: string;
}

export interface Education {
  id: Id;
  degree: string;
  institution: string;
  graduationYear: string;
  coursework?: string;
}

export interface Experience {
  id: Id;
  title: string;
  company: string;
  period: string;
  summary: string;
}

export interface Project {
  id: Id;
  name: string;
  description: string;
  stack: string[];
}

export interface Certification {
  id: Id;
  name: string;
  issuer: string;
  year: string;
}

export type SkillLevel = "strong" | "moderate" | "missing";

export interface Skill {
  name: string;
  level: SkillLevel;
  evidence?: string;
}

export interface TargetRoles {
  major: string;
  optional: string[];
}

export interface CareerPreferences {
  jobTypes: string[];
  workMode: "remote" | "onsite" | "hybrid" | "any";
  locations: string[];
  minExperienceYears: number;
}

export interface Profile {
  user: User;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  targetRoles: TargetRoles;
  preferences: CareerPreferences;
  completion: number;
}

/* ---------------- Resume ---------------- */

export type IssueSeverity = "critical" | "improve" | "good";

export interface ResumeIssue {
  id: Id;
  section: string;
  severity: IssueSeverity;
  message: string;
  recommendation: string;
}

export interface ResumeSectionScore {
  section: string;
  score: number;
  note: string;
}

export interface ResumeAnalysis {
  overallScore: number;
  targetRole: string;
  sections: ResumeSectionScore[];
  issues: ResumeIssue[];
}

export interface ResumeSuggestion {
  id: Id;
  section: string;
  current: string;
  suggestion: string;
  rationale: string;
}

export interface ResumeFileMeta {
  name: string;
  sizeKb: number;
  uploadedAt: string;
}

export interface ResumeState {
  hasResume: boolean;
  file?: ResumeFileMeta;
  lastAnalyzedAt?: string;
  score?: number;
}

/* ---------------- Interview ---------------- */

export type InterviewCategory = "dsa" | "coding" | "technical" | "project" | "hr";

export interface InterviewSetup {
  role: string;
  company: string;
  focus: InterviewCategory[];
}

export interface InterviewPlan {
  setup: InterviewSetup;
  readiness: number;
  completedTasks: number;
  pendingTasks: number;
  dailyGoal: string;
  strongAreas: string[];
  weakAreas: string[];
  categoryProgress: { category: InterviewCategory; label: string; progress: number }[];
}

export interface DsaTopic {
  id: Id;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  solved: number;
  total: number;
  accuracy: number;
}

export interface CodingTask {
  id: Id;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: "not-started" | "in-progress" | "completed";
  lastAttempt?: string;
  score?: number;
}

export interface InterviewQuestion {
  id: Id;
  category: InterviewCategory;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  status: "unattempted" | "attempted" | "reviewed";
  feedback?: string;
  answer?: string;
}

/* ---------------- Skills ---------------- */

export interface DailyTask {
  id: Id;
  title: string;
  category: InterviewCategory | "learning";
  categoryLabel: string;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedMinutes: number;
  status: "pending" | "in-progress" | "completed" | "skipped";
  details: string;
  linkedGap?: string;
}

export interface SkillGapItem {
  id: Id;
  skill: string;
  requirement: string;
  evidence: string;
  status: SkillLevel;
  priority: "high" | "medium" | "low";
  learningTask: string;
}

/* ---------------- Jobs ---------------- */

export interface JobSkillMatch {
  skill: string;
  status: "matched" | "partial" | "missing";
}

export interface Job {
  id: Id;
  title: string;
  company: string;
  location: string;
  workMode: "Remote" | "Onsite" | "Hybrid";
  experience: string;
  salary?: string;
  postedAt: string;
  source: string;
  matchScore: number;
  skills: JobSkillMatch[];
  matchReasons: string[];
  description: string;
}

export interface JobMatchBreakdown {
  skillMatch: number;
  experienceMatch: number;
  roleMatch: number;
  locationMatch: number;
  semanticRelevance: number;
}

export interface JobMatchDetail {
  job: Job;
  breakdown: JobMatchBreakdown;
  recommendedBecause: string[];
  skillsToImprove: string[];
}

export interface JobSearchQuery {
  q?: string;
  location?: string;
  experience?: string;
  workMode?: string;
  page?: number;
  pageSize?: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/* ---------------- Applications ---------------- */

export type ApplicationStatus = "saved" | "applied" | "interview" | "offer" | "rejected";

export interface Application {
  id: Id;
  jobId: Id;
  jobTitle: string;
  company: string;
  location: string;
  appliedDate: string;
  status: ApplicationStatus;
  matchScore: number;
  notes: string;
}

/* ---------------- Dashboard ---------------- */

export interface NextAction {
  id: Id;
  title: string;
  description: string;
  module: string;
  href: string;
}

export interface DashboardData {
  summary: {
    careerReadiness: number;
    resumeScore: number;
    interviewReadiness: number;
    skillGaps: number;
    jobMatches: number;
    activeApplications: number;
  };
  readinessTrend: { week: string; readiness: number }[];
  skillGapChart: { skill: string; required: number; current: number }[];
  interviewProgress: { category: string; progress: number }[];
  jobMatchStats: { bucket: string; jobs: number }[];
  applicationStatus: { status: string; count: number }[];
  taskCompletion: { day: string; completed: number; planned: number }[];
  nextActions: NextAction[];
}
