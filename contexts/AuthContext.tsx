"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AUTH_STORAGE_KEY } from "@/lib/authConstants";
import { apiGet, apiPost } from "@/lib/apiClient";

export type UserRole = "admin" | "student" | "coach" | "parent";

export type AuthUser = {
  id: string;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  provider?: "email" | "google" | "twitter";
};

type AuthContextValue = {
  user: AuthUser | null;
  isReady: boolean;
  loginWithPassword: (
    identifier: string,
    password: string,
  ) => Promise<{ ok: true } | { ok: false; message: string }>;
  signupWithPassword: (input: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    password: string;
  }) => Promise<{ ok: true } | { ok: false; message: string }>;
  loginWithGoogle: () => void;
  loginWithTwitter: () => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (!parsed || typeof parsed !== "object" || !parsed.id || !parsed.role) return null;
    return parsed;
  } catch {
    return null;
  }
}

function persistUser(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (user) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  else localStorage.removeItem(AUTH_STORAGE_KEY);
}

type AuthResponse = { ok: true; user: AuthUser } | { ok: false; message: string };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function boot() {
      try {
        const data = await apiGet<{ ok: true; user: AuthUser | null }>("/api/auth/me");
        if (!mounted) return;
        if (data.ok && data.user) {
          setUser(data.user);
          persistUser(data.user);
        } else {
          setUser(readStoredUser());
        }
      } catch {
        if (!mounted) return;
        setUser(readStoredUser());
      } finally {
        if (mounted) setIsReady(true);
      }
    }

    void boot();
    return () => {
      mounted = false;
    };
  }, []);

  const loginWithPassword = useCallback(async (identifier: string, password: string) => {
    const idRaw = identifier.trim();
    if (!idRaw || !password) {
      return { ok: false as const, message: "Enter your email or phone and password." };
    }

    try {
      const data = await apiPost<AuthResponse>("/api/auth/login", {
        identifier: idRaw,
        password,
      });
      if (!data.ok) return { ok: false as const, message: data.message };
      setUser(data.user);
      persistUser(data.user);
      return { ok: true as const };
    } catch {
      return { ok: false as const, message: "Unable to login right now." };
    }
  }, []);

  const signupWithPassword = useCallback(
    async (input: {
      email: string;
      phone: string;
      firstName: string;
      lastName: string;
      password: string;
    }) => {
      const email = input.email.trim();
      const phone = input.phone.trim();
      const firstName = input.firstName.trim();
      const lastName = input.lastName.trim();
      if (!email || !phone || !firstName || !lastName || !input.password) {
        return { ok: false as const, message: "Please fill in every field." };
      }

      try {
        const data = await apiPost<AuthResponse>("/api/auth/signup", {
          email,
          phone,
          firstName,
          lastName,
          password: input.password,
        });
        if (!data.ok) return { ok: false as const, message: data.message };
        setUser(data.user);
        persistUser(data.user);
        return { ok: true as const };
      } catch {
        return { ok: false as const, message: "Unable to sign up right now." };
      }
    },
    [],
  );

  const loginWithGoogle = useCallback(() => {
    const u: AuthUser = {
      id: "social-google",
      email: "player.google@demo.xyz",
      firstName: "Google",
      lastName: "Player",
      role: "student",
      provider: "google",
    };
    setUser(u);
    persistUser(u);
  }, []);

  const loginWithTwitter = useCallback(() => {
    const u: AuthUser = {
      id: "social-x",
      email: "player.x@demo.xyz",
      firstName: "X",
      lastName: "Player",
      role: "student",
      provider: "twitter",
    };
    setUser(u);
    persistUser(u);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiPost<{ ok: boolean }>("/api/auth/logout", {});
    } catch {
      // Keep local cleanup even if network fails.
    }
    setUser(null);
    persistUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isReady,
      loginWithPassword,
      signupWithPassword,
      loginWithGoogle,
      loginWithTwitter,
      logout,
    }),
    [user, isReady, loginWithPassword, signupWithPassword, loginWithGoogle, loginWithTwitter, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
