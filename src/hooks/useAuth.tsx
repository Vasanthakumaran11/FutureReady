import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { authService, type Credentials, type RegisterPayload } from "@/services/auth/authService";
import type { User } from "@/types";

interface AuthContextValue {
  user: User | null;
  status: "loading" | "authenticated" | "anonymous";
  login: (c: Credentials) => Promise<void>;
  register: (p: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(authService.currentUser());
    setReady(true);
  }, []);

  const login = useCallback(async (c: Credentials) => {
    setUser(await authService.login(c));
  }, []);

  const register = useCallback(async (p: RegisterPayload) => {
    setUser(await authService.register(p));
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status: !ready ? "loading" : user ? "authenticated" : "anonymous",
      login,
      register,
      logout,
    }),
    [user, ready, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
