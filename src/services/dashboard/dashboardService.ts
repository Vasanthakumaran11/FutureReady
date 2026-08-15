import { mockDelay } from "@/services/apiClient";
import { mockDashboard, mockSkillGaps } from "@/services/mock/data";
import type { DashboardData, SkillGapItem } from "@/types";

export const dashboardService = {
  getDashboardData(): Promise<DashboardData> {
    return mockDelay(mockDashboard, 650);
  },
  getSkillGap(): Promise<SkillGapItem[]> {
    return mockDelay(mockSkillGaps, 500);
  },
};
