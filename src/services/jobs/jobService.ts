import { mockDelay } from "@/services/apiClient";
import { mockApplications, mockJobMatchDetails, mockJobs } from "@/services/mock/data";
import type {
  Application,
  ApplicationStatus,
  Job,
  JobMatchDetail,
  JobSearchQuery,
  Paginated,
} from "@/types";

let applications: Application[] = mockApplications;

export const jobService = {
  async searchJobs(query: JobSearchQuery): Promise<Paginated<Job>> {
    const q = (query.q ?? "").toLowerCase().trim();
    const location = (query.location ?? "").toLowerCase().trim();
    const filtered = mockJobs.filter((job) => {
      const matchesQuery =
        !q || job.title.toLowerCase().includes(q) || job.company.toLowerCase().includes(q);
      const matchesLocation = !location || job.location.toLowerCase().includes(location);
      const matchesMode =
        !query.workMode || query.workMode === "any" || job.workMode.toLowerCase() === query.workMode;
      const matchesExp = !query.experience || job.experience === query.experience;
      return matchesQuery && matchesLocation && matchesMode && matchesExp;
    });
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 4;
    return mockDelay(
      {
        items: filtered.slice((page - 1) * pageSize, page * pageSize),
        total: filtered.length,
        page,
        pageSize,
      },
      600,
    );
  },

  getJobMatch(jobId: string): Promise<JobMatchDetail | null> {
    return mockDelay(mockJobMatchDetails[jobId] ?? null, 500);
  },

  getApplications(): Promise<Application[]> {
    return mockDelay(applications, 450);
  },

  async updateApplication(id: string, patch: Partial<Application>): Promise<Application[]> {
    applications = applications.map((a) => (a.id === id ? { ...a, ...patch } : a));
    return mockDelay(applications, 250);
  },

  async removeApplication(id: string): Promise<Application[]> {
    applications = applications.filter((a) => a.id !== id);
    return mockDelay(applications, 250);
  },

  async saveJob(job: Job): Promise<Application[]> {
    if (!applications.some((a) => a.jobId === job.id)) {
      applications = [
        {
          id: `a_${job.id}`,
          jobId: job.id,
          jobTitle: job.title,
          company: job.company,
          location: job.location,
          appliedDate: new Date().toISOString().slice(0, 10),
          status: "saved" as ApplicationStatus,
          matchScore: job.matchScore,
          notes: "",
        },
        ...applications,
      ];
    }
    return mockDelay(applications, 300);
  },
};
