import { mockDelay } from "@/services/apiClient";
import { mockApplications, mockJobMatchDetails, mockJobs } from "@/services/mock/data";

let applications = mockApplications;

export const jobService = {
  async searchJobs(query) {
    const q = (query.q ?? "").toLowerCase().trim();
    const location = (query.location ?? "").toLowerCase().trim();
    const filtered = mockJobs.filter((job) => {
      const matchesQuery =
        !q || job.title.toLowerCase().includes(q) || job.company.toLowerCase().includes(q);
      const matchesLocation = !location || job.location.toLowerCase().includes(location);
      const matchesMode =
        !query.workMode ||
        query.workMode === "any" ||
        job.workMode.toLowerCase() === query.workMode;
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

  getJobMatch(jobId) {
    return mockDelay(mockJobMatchDetails[jobId] ?? null, 500);
  },

  getApplications() {
    return mockDelay(applications, 450);
  },

  async updateApplication(id, patch) {
    applications = applications.map((a) => (a.id === id ? { ...a, ...patch } : a));
    return mockDelay(applications, 250);
  },

  async removeApplication(id) {
    applications = applications.filter((a) => a.id !== id);
    return mockDelay(applications, 250);
  },

  async saveJob(job) {
    if (!applications.some((a) => a.jobId === job.id)) {
      applications = [
        {
          id: `a_${job.id}`,
          jobId: job.id,
          jobTitle: job.title,
          company: job.company,
          location: job.location,
          appliedDate: new Date().toISOString().slice(0, 10),
          status: "saved",
          matchScore: job.matchScore,
          notes: "",
        },
        ...applications,
      ];
    }
    return mockDelay(applications, 300);
  },
};
