import { apiRequest } from "../apiClient";

export const profileService = {
  async getProfile() {
    return await apiRequest("/profile");
  },

  async updateProfile(profile) {
    return await apiRequest("/profile", {
      method: "PUT",
      json: profile,
    });
  },

  async updateTargetRoles(major, optional = []) {
    const current = await this.getProfile();
    const updated = {
      ...current,
      targetRoles: {
        major: major || "",
        optional: optional || [],
      },
    };
    return await this.updateProfile(updated);
  },
};
