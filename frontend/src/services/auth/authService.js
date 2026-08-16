import { apiRequest, setSessionToken, getSessionToken } from "../apiClient";

export const authService = {
  async register({ name, email, password }) {
    const res = await apiRequest("/auth/register", {
      method: "POST",
      json: { name, email, password },
    });
    if (res?.session_token) {
      setSessionToken(res.session_token);
    }
    return res.user;
  },

  async login({ email, password }) {
    const res = await apiRequest("/auth/login", {
      method: "POST",
      json: { email, password },
    });
    if (res?.session_token) {
      setSessionToken(res.session_token);
    }
    return res.user;
  },

  async getCurrentUser() {
    const token = getSessionToken();
    if (!token) return null;
    try {
      return await apiRequest("/auth/me");
    } catch {
      setSessionToken(null);
      return null;
    }
  },

  async logout() {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } catch {
      // ignore
    } finally {
      setSessionToken(null);
    }
  },
};
