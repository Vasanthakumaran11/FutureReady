import { apiRequest } from "../apiClient";

export const resumeService = {
  async getResume() {
    return await apiRequest("/resume");
  },

  async getAnalysis() {
    return await apiRequest("/resume/analysis");
  },

  async getSuggestions() {
    return await apiRequest("/resume/suggestions");
  },

  /**
   * Path A Step 1: Upload file and extract raw text (max 5MB, PDF/DOCX only)
   */
  async uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);
    return await apiRequest("/resume/upload", {
      method: "POST",
      body: formData,
    });
  },

  /**
   * Path A Step 2: Gemini structured extraction + rapidfuzz skill normalization
   */
  async extractFields(extractedText) {
    return await apiRequest("/resume/extract", {
      method: "POST",
      json: { extracted_text: extractedText },
    });
  },

  /**
   * Section Critique: section-by-section scoring against target role
   */
  async analyzeResume(confirmedProfile = null, targetRole = "Software Engineer") {
    const payload = {};
    if (confirmedProfile) {
      payload.confirmed_profile = confirmedProfile;
    }
    if (targetRole) {
      payload.target_role = targetRole;
    }
    return await apiRequest("/resume/analyze", {
      method: "POST",
      json: payload,
    });
  },

  /**
   * Bullet Refinement: single-bullet rewrite (diff view: current vs suggested)
   */
  async refineSection(originalText, targetRole = "Software Engineer") {
    return await apiRequest("/resume/refine", {
      method: "POST",
      json: {
        original_text: originalText,
        target_role: targetRole,
      },
    });
  },

  /**
   * Path B: Content generator creating 3 variant bullets (technical depth, impact, leadership)
   */
  async generateBullets(rawText, skills = []) {
    return await apiRequest("/resume/generate-bullets", {
      method: "POST",
      json: {
        raw_text: rawText,
        skills: skills,
      },
    });
  },

  /**
   * Saves confirmed profile & resume document to MongoDB
   */
  async confirmAndSaveResume({ profileData, fileMeta, template = "classic" }) {
    return await apiRequest("/resume/confirm", {
      method: "POST",
      json: {
        profile_data: profileData,
        file_meta: fileMeta,
        template: template,
      },
    });
  },

  async removeResume() {
    return {
      hasResume: false,
      file: null,
      overallScore: 0,
      breakdown: {},
      suggestions: [],
    };
  },
};
