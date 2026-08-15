import { mockDelay } from "@/services/apiClient";
import { mockProfile } from "@/services/mock/data";
import type { Profile } from "@/types";

/**
 * Replace each mock call with `apiRequest<...>("/profile")` etc. once FastAPI
 * endpoints exist. Component code only ever talks to this module.
 */
let cached: Profile = mockProfile;

export const profileService = {
  getProfile(): Promise<Profile> {
    return mockDelay(cached);
  },
  updateProfile(patch: Partial<Profile>): Promise<Profile> {
    cached = { ...cached, ...patch };
    return mockDelay(cached, 400);
  },
  updateTargetRoles(major: string, optional: string[]): Promise<Profile> {
    cached = { ...cached, targetRoles: { major, optional } };
    return mockDelay(cached, 300);
  },
};
