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
    if (res?.user) {
      try {
        localStorage.setItem("futureready_user", JSON.stringify(res.user));
      } catch {}
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
    if (res?.user) {
      try {
        localStorage.setItem("futureready_user", JSON.stringify(res.user));
      } catch {}
    }
    return res.user;
  },

  async loginWithGoogle(payload) {
    const res = await apiRequest("/auth/google", {
      method: "POST",
      json: payload,
    });
    if (res?.session_token) {
      setSessionToken(res.session_token);
    }
    if (res?.user) {
      try {
        localStorage.setItem("futureready_user", JSON.stringify(res.user));
      } catch {}
    }
    return res.user;
  },

  async getCurrentUser() {
    const token = getSessionToken();
    if (!token) return null;
    try {
      const user = await apiRequest("/auth/me");
      if (user) {
        try {
          localStorage.setItem("futureready_user", JSON.stringify(user));
        } catch {}
      }
      return user;
    } catch {
      setSessionToken(null);
      try {
        localStorage.removeItem("futureready_user");
      } catch {}
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
      try {
        localStorage.removeItem("futureready_user");
      } catch {}
    }
  },
};
