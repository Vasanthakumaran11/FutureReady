import { mockDelay } from "@/services/apiClient";
import { mockDashboard, mockSkillGaps } from "@/services/mock/data";

export const dashboardService = {
  getDashboardData() {
    return mockDelay(mockDashboard, 650);
  },
  getSkillGap() {
    return mockDelay(mockSkillGaps, 500);
  },
};
