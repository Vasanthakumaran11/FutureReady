import { apiRequest } from "../apiClient";

export const skillService = {
  /**
   * Fetches all 10 supported career tracks and skill summaries.
   */
  async getRoles() {
    return await apiRequest("/skills/roles");
  },

  /**
   * Fetches full skill requirements and topics for a career role.
   */
  async getRoleDetails(roleName) {
    return await apiRequest(`/skills/roles/${encodeURIComponent(roleName)}`);
  },

  /**
   * Performs dynamic skill gap analysis comparing candidate profile vs role or job.
   */
  async getSkillGapAnalysis({ role = "", jobId = "" } = {}) {
    const params = new URLSearchParams();
    if (role) params.set("role", role);
    if (jobId) params.set("job_id", jobId);
    const queryString = params.toString() ? `?${params.toString()}` : "";
    return await apiRequest(`/skills/gap${queryString}`);
  },

  /**
   * Fetches curated YouTube tutorials, docs, and practice links for a specific skill.
   */
  async getSkillResources(skillName, { role = "", difficulty = "" } = {}) {
    const params = new URLSearchParams();
    if (role) params.set("role", role);
    if (difficulty) params.set("difficulty", difficulty);
    const queryString = params.toString() ? `?${params.toString()}` : "";
    return await apiRequest(`/skills/${encodeURIComponent(skillName)}/resources${queryString}`);
  },

  /**
   * Fetches all tracked learning progress and completed resource milestones.
   */
  async getLearningProgress() {
    return await apiRequest("/skills/progress");
  },

  /**
   * Updates candidate learning progress / marks resources completed.
   */
  async updateProgress({ skill, resourceId = null, completed = true, customProgress = null }) {
    return await apiRequest("/skills/progress", {
      method: "POST",
      json: {
        skill,
        resource_id: resourceId,
        completed,
        custom_progress: customProgress,
      },
    });
  },
};
