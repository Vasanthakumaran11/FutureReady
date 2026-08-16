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

  async getCategories() {
    return await apiRequest("/interview/categories");
  },

  async getDsaTopics() {
    return await apiRequest("/interview/dsa");
  },

  async getCodingProblems() {
    return [
      {
        id: "coding-1",
        title: "Build an LRU Cache with O(1) Operations",
        difficulty: "Medium",
        description:
          "Implement a Least Recently Used (LRU) cache supporting get and put in constant time.",
        starterCode:
          "class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n\n    def get(self, key: int) -> int:\n        pass\n\n    def put(self, key: int, value: int) -> None:\n        pass",
      },
      {
        id: "coding-2",
        title: "Rate Limiter Middleware",
        difficulty: "Medium",
        description: "Implement a sliding-window counter rate limiter for an API route.",
        starterCode:
          "class RateLimiter:\n    def __init__(self, limit: int, window_seconds: int):\n        pass\n\n    def allow_request(self, user_id: str) -> bool:\n        pass",
      },
    ];
  },

  async getTechnicalQuestions() {
    return [
      {
        id: "tech-1",
        question:
          "How does database indexing with B-Trees work, and when can indexing hurt performance?",
        topic: "Databases",
      },
      {
        id: "tech-2",
        question:
          "Explain the difference between process-based and thread-based concurrency in Python and how the GIL impacts CPU-bound tasks.",
        topic: "Concurrency",
      },
    ];
  },

  async getProjectQuestions() {
    return [
      {
        id: "proj-1",
        question:
          "Walk through the architectural trade-offs you made in your primary project. What would you design differently at 10x scale?",
        topic: "Architecture",
      },
    ];
  },

  async getHrQuestions() {
    return [
      {
        id: "hr-1",
        question:
          "Tell me about a time you faced a difficult technical disagreement with a teammate. How did you resolve it?",
        topic: "Behavioral",
      },
    ];
  },

  async submitAnswer(questionId, answer, category = "general") {
    return await apiRequest("/interview/feedback", {
      method: "POST",
      json: { questionId, answer, category },
    });
  },
};
