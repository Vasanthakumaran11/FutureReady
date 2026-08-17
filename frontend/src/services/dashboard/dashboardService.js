import { apiRequest } from "../apiClient";

export const dashboardService = {
  async getDashboardData() {
    return await apiRequest("/dashboard/summary");
  },

  async getDashboardSummary() {
    return await apiRequest("/dashboard/summary");
  },

  async getSkillGap(jobId = null) {
    const query = jobId ? `?job_id=${encodeURIComponent(jobId)}` : "";
    return await apiRequest(`/skills/gaps${query}`);
  },

  async getGaps(jobId = null) {
    const query = jobId ? `?job_id=${encodeURIComponent(jobId)}` : "";
    return await apiRequest(`/skills/gaps${query}`);
  },
};
