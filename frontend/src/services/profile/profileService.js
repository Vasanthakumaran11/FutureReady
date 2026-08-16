import { mockDelay } from "@/services/apiClient";
import { mockProfile } from "@/services/mock/data";

/**
 * Replace each mock call with `apiRequest("/profile")` etc. once FastAPI
 * endpoints exist. Component code only ever talks to this module.
 */
let cached = mockProfile;

export const profileService = {
  getProfile() {
    return mockDelay(cached);
  },
  updateProfile(patch) {
    cached = { ...cached, ...patch };
    return mockDelay(cached, 400);
  },
  updateTargetRoles(major, optional) {
    cached = { ...cached, targetRoles: { major, optional } };
    return mockDelay(cached, 300);
  },
};
