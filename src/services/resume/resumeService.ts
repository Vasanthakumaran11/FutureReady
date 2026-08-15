import { mockDelay } from "@/services/apiClient";
import { mockResumeAnalysis, mockResumeSuggestions } from "@/services/mock/data";
import type { ResumeAnalysis, ResumeState, ResumeSuggestion } from "@/types";

let state: ResumeState = { hasResume: false };

export const resumeService = {
  getResume(): Promise<ResumeState> {
    return mockDelay(state, 400);
  },
  async uploadResume(file: File): Promise<ResumeState> {
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
  async removeResume(): Promise<ResumeState> {
    await mockDelay(null, 250);
    state = { hasResume: false };
    return state;
  },
  async analyzeResume(): Promise<ResumeAnalysis> {
    const analysis = await mockDelay(mockResumeAnalysis, 1100);
    state = { ...state, lastAnalyzedAt: new Date().toISOString(), score: analysis.overallScore };
    return analysis;
  },
  getSuggestions(): Promise<ResumeSuggestion[]> {
    return mockDelay(mockResumeSuggestions, 900);
  },
  saveGeneratedResume(payload: unknown): Promise<{ ok: true }> {
    void payload;
    return mockDelay({ ok: true } as const, 700);
  },
};
