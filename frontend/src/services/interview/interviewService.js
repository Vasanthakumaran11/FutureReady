import { apiRequest } from "../apiClient";

export const interviewService = {
  async getInterviewPlan() {
    return await apiRequest("/interview/plan");
  },

  async getSetup() {
    return await apiRequest("/interview/setup");
  },

  async saveSetup(setup) {
    return await apiRequest("/interview/setup", {
      method: "POST",
      json: setup,
    });
  },

  async getDsaCategories() {
    return await apiRequest("/interview/dsa/categories");
  },

  async getDsaCategoryProblems(categoryId) {
    return await apiRequest(`/interview/dsa/category/${encodeURIComponent(categoryId)}`);
  },

  async getCategoryQuestions(category) {
    return await apiRequest(`/interview/questions/${encodeURIComponent(category)}`);
  },

  async toggleComplete({ itemId, category, completed = true, title = "" }) {
    return await apiRequest("/interview/toggle-complete", {
      method: "POST",
      json: {
        item_id: itemId,
        category,
        completed,
        title,
      },
    });
  },

  async submitAnswer(questionId, answer, category = "technical") {
    return await apiRequest("/interview/feedback", {
      method: "POST",
      json: { questionId, answer, category },
    });
  },
};
