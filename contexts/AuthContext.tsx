"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ADMIN_EMAIL, ADMIN_PASSWORD, AUTH_STORAGE_KEY } from "@/lib/authConstants";

export type UserRole = "admin" | "student";

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
  loginWithPassword: (identifier: string, password: string) => { ok: true } | { ok: false; message: string };
  signupWithPassword: (input: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    password: string;
  }) => { ok: true } | { ok: false; message: string };
  loginWithGoogle: () => void;
  loginWithTwitter: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeEmail(e: string) {
  return e.trim().toLowerCase();
}

function isLikelyEmail(s: string) {
  return s.includes("@");
}

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setUser(readStoredUser());
    setIsReady(true);
  }, []);

  const loginWithPassword = useCallback((identifier: string, password: string) => {
    const idRaw = identifier.trim();
    if (!idRaw || !password) {
      return { ok: false as const, message: "Enter your email or phone and password." };
    }

    if (isLikelyEmail(idRaw)) {
      const email = normalizeEmail(idRaw);
      if (email === normalizeEmail(ADMIN_EMAIL) && password === ADMIN_PASSWORD) {
        const admin: AuthUser = {
          id: "admin",
          email: ADMIN_EMAIL,
          firstName: "Academy",
          lastName: "Admin",
          role: "admin",
          provider: "email",
        };
        setUser(admin);
        persistUser(admin);
        return { ok: true as const };
      }
    }

    const student: AuthUser = {
      id: `student-${crypto.randomUUID()}`,
      email: isLikelyEmail(idRaw) ? idRaw.trim() : "",
      phone: isLikelyEmail(idRaw) ? undefined : idRaw,
      role: "student",
      provider: "email",
    };
    setUser(student);
    persistUser(student);
    return { ok: true as const };
  }, []);

  const signupWithPassword = useCallback(
    (input: {
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

      const student: AuthUser = {
        id: `student-${crypto.randomUUID()}`,
        email,
        phone,
        firstName,
        lastName,
        role: "student",
        provider: "email",
      };
      setUser(student);
      persistUser(student);
      return { ok: true as const };
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

  const logout = useCallback(() => {
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
