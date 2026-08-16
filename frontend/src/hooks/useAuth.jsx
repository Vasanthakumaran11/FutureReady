import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "@/services/auth/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function initAuth() {
      try {
        const currentUser = await authService.getCurrentUser();
        if (mounted) setUser(currentUser);
      } catch {
        if (mounted) setUser(null);
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
    setUser(loggedUser);
    return loggedUser;
  }, []);

  const register = useCallback(async (payload) => {
    const newUser = await authService.register(payload);
    setUser(newUser);
    return newUser;
  }, []);

  const loginWithGoogle = useCallback(async (payload) => {
    const loggedUser = await authService.loginWithGoogle(payload);
    setUser(loggedUser);
    return loggedUser;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      status: !ready ? "loading" : user ? "authenticated" : "anonymous",
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
