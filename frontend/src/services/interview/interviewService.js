import { mockDelay } from "@/services/apiClient";
import {
  mockCodingTasks,
  mockDailyTasks,
  mockDsaTopics,
  mockInterviewPlan,
  mockQuestions,
} from "@/services/mock/data";

let plan = mockInterviewPlan;

export const interviewService = {
  getInterviewPlan() {
    return mockDelay(plan, 500);
  },
  async saveSetup(setup) {
    plan = { ...plan, setup };
    return mockDelay(plan, 500);
  },
  getDsaTopics() {
    return mockDelay(mockDsaTopics, 450);
  },
  getCodingTasks() {
    return mockDelay(mockCodingTasks, 450);
  },
  getInterviewQuestions(category) {
    return mockDelay(
      mockQuestions.filter((q) => q.category === category),
      500,
    );
  },
  /** Backend proxies this to Gemini — no AI keys exist on the client. */
  generateQuestions(category) {
    return mockDelay(
      mockQuestions.filter((q) => q.category === category),
      1200,
    );
  },
  submitInterviewAnswer(questionId, answer) {
    void questionId;
    return mockDelay(
      {
        feedback:
          answer.trim().length < 80
            ? "Answer is too brief. Add the specific decision you made and the measurable result."
            : "Clear structure. Strengthen it by naming the trade-off you rejected and why.",
      },
      1300,
    );
  },
  getDailyTasks() {
    return mockDelay(mockDailyTasks, 450);
  },
  generatePracticeSet() {
    return mockDelay(mockDailyTasks, 1200);
  },
};
