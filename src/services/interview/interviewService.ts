import { mockDelay } from "@/services/apiClient";
import {
  mockCodingTasks,
  mockDailyTasks,
  mockDsaTopics,
  mockInterviewPlan,
  mockQuestions,
} from "@/services/mock/data";
import type {
  CodingTask,
  DailyTask,
  DsaTopic,
  InterviewCategory,
  InterviewPlan,
  InterviewQuestion,
  InterviewSetup,
} from "@/types";

let plan: InterviewPlan = mockInterviewPlan;

export const interviewService = {
  getInterviewPlan(): Promise<InterviewPlan> {
    return mockDelay(plan, 500);
  },
  async saveSetup(setup: InterviewSetup): Promise<InterviewPlan> {
    plan = { ...plan, setup };
    return mockDelay(plan, 500);
  },
  getDsaTopics(): Promise<DsaTopic[]> {
    return mockDelay(mockDsaTopics, 450);
  },
  getCodingTasks(): Promise<CodingTask[]> {
    return mockDelay(mockCodingTasks, 450);
  },
  getInterviewQuestions(category: InterviewCategory): Promise<InterviewQuestion[]> {
    return mockDelay(
      mockQuestions.filter((q) => q.category === category),
      500,
    );
  },
  /** Backend proxies this to Gemini — no AI keys exist on the client. */
  generateQuestions(category: InterviewCategory): Promise<InterviewQuestion[]> {
    return mockDelay(
      mockQuestions.filter((q) => q.category === category),
      1200,
    );
  },
  submitInterviewAnswer(questionId: string, answer: string): Promise<{ feedback: string }> {
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
  getDailyTasks(): Promise<DailyTask[]> {
    return mockDelay(mockDailyTasks, 450);
  },
  generatePracticeSet(): Promise<DailyTask[]> {
    return mockDelay(mockDailyTasks, 1200);
  },
};
