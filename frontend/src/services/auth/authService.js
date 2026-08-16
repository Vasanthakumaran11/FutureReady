import { mockDelay } from "@/services/apiClient";
import { mockProfile } from "@/services/mock/data";

/**
 * Authentication is NOT implemented — these calls are frontend abstractions
 * only. Wire them to FastAPI (`POST /auth/login`, `/auth/register`,
 * `/auth/logout`, `GET /auth/me`) with httpOnly session cookies.
 */
const SESSION_FLAG = "futureready.session";

function readFlag() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_FLAG);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const authService = {
  async login(credentials) {
    if (!credentials.email || !credentials.password) {
      throw new Error("Email and password are required.");
    }
    const user = { ...mockProfile.user, email: credentials.email };
    await mockDelay(null, 700);
    window.localStorage.setItem(SESSION_FLAG, JSON.stringify(user));
    return user;
  },

  async register(payload) {
    const user = { id: "u_new", name: payload.name, email: payload.email };
    await mockDelay(null, 700);
    window.localStorage.setItem(SESSION_FLAG, JSON.stringify(user));
    return user;
  },

  async logout() {
    await mockDelay(null, 200);
    window.localStorage.removeItem(SESSION_FLAG);
  },

  currentUser() {
    return readFlag();
  },
};
