"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { StudentsProvider } from "@/contexts/StudentsContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      themes={["light", "dark"]}
      enableColorScheme
      storageKey="xyz-academy-theme"
      disableTransitionOnChange={false}
    >
      <AuthProvider>
        <StudentsProvider>{children}</StudentsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
