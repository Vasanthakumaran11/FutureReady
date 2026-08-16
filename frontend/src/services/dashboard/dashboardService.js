import { apiRequest } from "../apiClient";

export const dashboardService = {
  async getDashboardData() {
    return await apiRequest("/dashboard/summary");
  },

  async getDashboardSummary() {
    return await apiRequest("/dashboard/summary");
  },

  async getSkillGap() {
    return await apiRequest("/dashboard/gaps");
  },

  async getGaps() {
    return await apiRequest("/dashboard/gaps");
  },
};
