"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthLanding } from "@/components/auth/AuthLanding";
import { useAuth } from "@/contexts/AuthContext";

function Splash() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-emerald-50 to-cyan-100 dark:bg-zinc-950">
      <div className="h-10 w-10 animate-pulse rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 dark:bg-emerald-500/40" />
    </div>
  );
}

export default function HomePage() {
  const { user, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isReady || !user) return;
    router.replace(user.role === "admin" ? "/dashboard" : "/announcements");
  }, [user, isReady, router]);

  if (!isReady) return <Splash />;
  if (user) return <Splash />;
  return <AuthLanding />;
}
