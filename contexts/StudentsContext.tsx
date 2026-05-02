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
import { STUDENTS_STORAGE_KEY } from "@/lib/authConstants";

type StudentsContextValue = {
  students: Student[];
  addStudent: (input: Omit<Student, "id" | "joinedAt"> & { joinedAt?: string }) => Student;
  removeStudent: (id: string) => void;
  replaceStudents: (next: Student[]) => void;
};

const StudentsContext = createContext<StudentsContextValue | null>(null);

function readStudents(): Student[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STUDENTS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Student[];
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStudents(list: Student[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(list));
}

export function StudentsProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStudents();
    setStudents(stored ?? [...seedStudents]);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeStudents(students);
  }, [students, hydrated]);

  const addStudent = useCallback(
    (input: Omit<Student, "id" | "joinedAt"> & { joinedAt?: string }) => {
      const row: Student = {
        ...input,
        id: `s-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        joinedAt: input.joinedAt ?? new Date().toISOString(),
      };
      setStudents((prev) => [...prev, row]);
      return row;
    },
    [],
  );

  const removeStudent = useCallback((id: string) => {
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
