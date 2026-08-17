import { apiRequest } from "../apiClient";

export const jobService = {
  /**
   * Fetches personalized recommendations tailored to the candidate's profile.
   */
  async getRecommendedJobs(limit = 12) {
    const res = await apiRequest(`/jobs/recommended?limit=${limit}`);
    return {
      items: res.jobs || [],
      total: res.total || (res.jobs ? res.jobs.length : 0),
      sources: res.sources || [],
      profileSummary: res.profile_summary || null,
    };
  },

  /**
   * Searches jobs across Jooble & Adzuna with keywords & location filters.
   */
  async searchJobs({ q = "", location = "", page = 1, pageSize = 15 } = {}) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (location) params.set("location", location);
    params.set("page", String(page));
    params.set("limit", String(pageSize));

    const res = await apiRequest(`/jobs/search?${params.toString()}`);
    return {
      items: res.jobs || [],
      total: res.total || (res.jobs ? res.jobs.length : 0),
      sources: res.sources || [],
      query: res.query || { keywords: q, location },
    };
  },

  /**
   * Fetches standard jobs list.
   */
  async getJobs({ q, location } = {}) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (location) params.set("location", location);
    const queryString = params.toString() ? `?${params.toString()}` : "";
    const jobs = await apiRequest(`/jobs${queryString}`);
    return {
      items: Array.isArray(jobs) ? jobs : jobs.jobs || [],
      total: Array.isArray(jobs) ? jobs.length : jobs.total || 0,
    };
  },

  /**
   * Fetches detailed job match breakdown against candidate profile.
   */
  async getJobMatch(jobId) {
    return await apiRequest(`/jobs/${jobId}`);
  },

  /**
   * Application tracker persistence.
   */
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
        notes: `Saved from ${job.source || "Job Search"}`,
      },
    });
  },

  async updateApplicationStatus(id, status) {
    return await apiRequest(`/applications/${id}`, {
      method: "PATCH",
      json: { status },
    });
  },

  async updateApplication(id, payload) {
    return await apiRequest(`/applications/${id}`, {
      method: "PATCH",
      json: payload,
    });
  },

  async removeApplication(id) {
    return await apiRequest(`/applications/${id}`, {
      method: "DELETE",
    });
  },
};
