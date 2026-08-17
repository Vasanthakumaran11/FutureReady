import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "@/services/auth/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Synchronous initialization from localStorage prevents any guest account flicker upon refresh
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem("futureready_user");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [ready, setReady] = useState(false);

  const saveUser = (u) => {
    setUser(u);
    try {
      if (u) {
        localStorage.setItem("futureready_user", JSON.stringify(u));
      } else {
        localStorage.removeItem("futureready_user");
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    let mounted = true;
    async function initAuth() {
      try {
        const currentUser = await authService.getCurrentUser();
        if (mounted) {
          saveUser(currentUser);
        }
      } catch {
        if (mounted) {
          saveUser(null);
        }
      } finally {
        if (mounted) setReady(true);
      }
    }
    initAuth();
    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const loggedUser = await authService.login(credentials);
    saveUser(loggedUser);
    return loggedUser;
  }, []);

  const register = useCallback(async (payload) => {
    const newUser = await authService.register(payload);
    saveUser(newUser);
    return newUser;
  }, []);

  const loginWithGoogle = useCallback(async (payload) => {
    const loggedUser = await authService.loginWithGoogle(payload);
    saveUser(loggedUser);
    return loggedUser;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    saveUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      status: !ready && !user ? "loading" : user ? "authenticated" : "anonymous",
      login,
      register,
      loginWithGoogle,
      logout,
    }),
    [user, ready, login, register, loginWithGoogle, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
