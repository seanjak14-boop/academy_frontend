"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Student } from "@/lib/mockData";
import { students as seedStudents } from "@/lib/mockData";
import { apiDelete, apiGet, apiPost } from "@/lib/apiClient";

type StudentsContextValue = {
  students: Student[];
  addStudent: (input: Omit<Student, "id" | "joinedAt"> & { joinedAt?: string }) => Promise<Student>;
  removeStudent: (id: string) => Promise<void>;
  replaceStudents: (next: Student[]) => void;
};

const StudentsContext = createContext<StudentsContextValue | null>(null);

export function StudentsProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    let mounted = true;
    async function loadStudents() {
      try {
        const data = await apiGet<{ ok: boolean; students?: Student[]; message?: string }>("/api/students");
        if (!mounted) return;
        if (data.ok && Array.isArray(data.students)) {
          setStudents(data.students);
        } else {
          setStudents([...seedStudents]);
        }
      } catch {
        if (!mounted) return;
        setStudents([...seedStudents]);
      }
    }
    void loadStudents();
    return () => {
      mounted = false;
    };
  }, []);

  const addStudent = useCallback(
    async (input: Omit<Student, "id" | "joinedAt"> & { joinedAt?: string }) => {
      const payload = {
        ...input,
        joinedAt: input.joinedAt ?? new Date().toISOString(),
      };
      try {
        const data = await apiPost<{ ok: boolean; student?: Student; message?: string }>("/api/students", payload);
        if (!data.ok || !data.student) throw new Error(data.message || "Failed to add student");
        const created = data.student;
        setStudents((prev) => [...prev, created]);
        return created;
      } catch {
        const fallback: Student = {
          ...payload,
          id: `s-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        };
        setStudents((prev) => [...prev, fallback]);
        return fallback;
      }
    },
    [],
  );

  const removeStudent = useCallback(async (id: string) => {
    try {
      await apiDelete<{ ok: boolean }>(`/api/students/${id}`);
    } catch {
      // keep optimistic removal in fallback mode
    }
    setStudents((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const replaceStudents = useCallback((next: Student[]) => {
    setStudents(next);
  }, []);

  const value = useMemo(
    () => ({ students, addStudent, removeStudent, replaceStudents }),
    [students, addStudent, removeStudent, replaceStudents],
  );

  return <StudentsContext.Provider value={value}>{children}</StudentsContext.Provider>;
}

export function useStudents() {
  const ctx = useContext(StudentsContext);
  if (!ctx) throw new Error("useStudents must be used within StudentsProvider");
  return ctx;
}
