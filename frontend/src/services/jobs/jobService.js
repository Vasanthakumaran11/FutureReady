import { apiRequest } from "../apiClient";

export const jobService = {
  async getJobs() {
    return await apiRequest("/jobs");
  },

  async getJob(id) {
    return await apiRequest(`/jobs/${id}`);
  },

  async getApplications() {
    return await apiRequest("/applications");
  },

  async saveJob(job) {
    return await apiRequest("/applications", {
      method: "POST",
      json: {
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        location: job.location || "",
        matchScore: job.matchScore || 0,
        status: "saved",
        notes: "Saved from Job Search",
      },
    });
  },

  async updateApplicationStatus(id, status) {
    return await apiRequest(`/applications/${id}`, {
      method: "PATCH",
      json: { status },
    });
  },
};
