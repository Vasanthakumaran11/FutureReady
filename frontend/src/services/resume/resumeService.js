import { mockDelay } from "@/services/apiClient";
import { mockResumeAnalysis, mockResumeSuggestions } from "@/services/mock/data";

let state = { hasResume: false };

export const resumeService = {
  getResume() {
    return mockDelay(state, 400);
  },
  async uploadResume(file) {
    await mockDelay(null, 900);
    state = {
      hasResume: true,
      file: {
        name: file.name,
        sizeKb: Math.max(1, Math.round(file.size / 1024)),
        uploadedAt: new Date().toISOString(),
      },
    };
    return state;
  },
  async removeResume() {
    await mockDelay(null, 250);
    state = { hasResume: false };
    return state;
  },
  async analyzeResume() {
    const analysis = await mockDelay(mockResumeAnalysis, 1100);
    state = { ...state, lastAnalyzedAt: new Date().toISOString(), score: analysis.overallScore };
    return analysis;
  },
  getSuggestions() {
    return mockDelay(mockResumeSuggestions, 900);
  },
  saveGeneratedResume(payload) {
    void payload;
    return mockDelay({ ok: true }, 700);
  },
};
