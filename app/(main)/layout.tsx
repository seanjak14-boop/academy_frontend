"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppShell } from "@/components/academy/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { isStudentAllowedPath } from "@/lib/navConfig";

function Splash() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-emerald-50 to-cyan-100 dark:bg-zinc-950">
      <div className="h-10 w-10 animate-pulse rounded-full bg-emerald-500/40" />
    </div>
  );
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, isReady } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isReady) return;
    if (!user) router.replace("/login");
  }, [isReady, user, router]);

  useEffect(() => {
    if (!isReady || !user) return;
    if (user.role === "student" && !isStudentAllowedPath(pathname)) {
      router.replace("/announcements");
    }
  }, [isReady, user, pathname, router]);

  if (!isReady || !user) return <Splash />;

  const isAdmin = user.role === "admin";
  if (!isAdmin && !isStudentAllowedPath(pathname)) {
    return <Splash />;
  }

  return <AppShell isAdmin={isAdmin}>{children}</AppShell>;
}
