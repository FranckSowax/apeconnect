"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Student } from "@/types";
import { useAuth } from "./AuthContext";

interface StudentContextType {
  students: Student[];
  currentStudent: Student | null;
  loading: boolean;
  setCurrentStudent: (student: Student) => void;
  fetchStudents: () => Promise<void>;
  addStudent: (student: Omit<Student, "id" | "parent_id" | "created_at" | "updated_at">) => Promise<{ error: Error | null }>;
  updateStudent: (id: string, updates: Partial<Student>) => Promise<{ error: Error | null }>;
  deleteStudent: (id: string) => Promise<{ error: Error | null }>;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

const STORAGE_KEY = "ape_connect_current_student_id";

// Create supabase client outside component to ensure stable reference
let supabaseInstance: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!supabaseInstance) {
    supabaseInstance = createClient();
  }
  return supabaseInstance;
}

export function StudentProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [currentStudent, setCurrentStudentState] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  // Stable supabase reference
  const supabase = useMemo(() => getSupabase(), []);

  // Prevent re-initialization using ref
  const initializedRef = useRef(false);
  const userIdRef = useRef<string | undefined>(undefined);

  const fetchStudents = useCallback(async () => {
    if (!user) {
      setStudents([]);
      setCurrentStudentState(null);
      setLoading(false);
      return;
    }

    try {
      const timeoutPromise = new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), 5000)
      );

      const fetchPromise = supabase
        .from("students")
        .select("*")
        .eq("parent_id", user.id)
        .order("full_name");

      const result = await Promise.race([fetchPromise, timeoutPromise]);

      if (!result) {
        setStudents([]);
        setLoading(false);
        return;
      }

      const { data, error } = result;

      if (error) {
        console.error("Error fetching students:", error);
        setLoading(false);
        return;
      }

      setStudents(data as Student[]);

      // Restore previously selected student
      if (typeof window !== "undefined" && data && data.length > 0) {
        const savedId = localStorage.getItem(STORAGE_KEY);
        if (savedId) {
          const saved = data.find((s: Student) => s.id === savedId);
          if (saved) {
            setCurrentStudentState(saved);
          } else {
            setCurrentStudentState(data[0]);
          }
        } else {
          setCurrentStudentState(data[0]);
        }
      }
    } catch (err) {
      console.error("Unexpected error in fetchStudents:", err);
    } finally {
      setLoading(false);
    }
  }, [supabase, user]);

  const setCurrentStudent = useCallback((student: Student) => {
    setCurrentStudentState(student);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, student.id);
    }
  }, []);

  const addStudent = useCallback(async (
    studentData: Omit<Student, "id" | "parent_id" | "created_at" | "updated_at">
  ): Promise<{ error: Error | null }> => {
    if (!user) {
      return { error: new Error("User not authenticated") };
    }

    try {
      const { data, error } = await supabase
        .from("students")
        .insert({
          ...studentData,
          parent_id: user.id,
          establishment_id: user.establishment_id,
        })
        .select()
        .single();

      if (error) {
        return { error: error as Error };
      }

      // Add to local state
      setStudents(prev => [...prev, data as Student]);

      // Set as current if it's the first student
      if (students.length === 0) {
        setCurrentStudent(data as Student);
      }

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  }, [supabase, user, students.length, setCurrentStudent]);

  const updateStudent = useCallback(async (
    id: string,
    updates: Partial<Student>
  ): Promise<{ error: Error | null }> => {
    try {
      const { data, error } = await supabase
        .from("students")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return { error: error as Error };
      }

      // Update local state
      setStudents(prev => prev.map(s => s.id === id ? data as Student : s));

      // Update current if it's the one being updated
      if (currentStudent?.id === id) {
        setCurrentStudentState(data as Student);
      }

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  }, [supabase, currentStudent]);

  const deleteStudent = useCallback(async (id: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase
        .from("students")
        .delete()
        .eq("id", id);

      if (error) {
        return { error: error as Error };
      }

      // Remove from local state
      const newStudents = students.filter(s => s.id !== id);
      setStudents(newStudents);

      // Update current if deleted
      if (currentStudent?.id === id) {
        setCurrentStudentState(newStudents[0] || null);
        if (newStudents[0]) {
          localStorage.setItem(STORAGE_KEY, newStudents[0].id);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  }, [supabase, students, currentStudent]);

  // Fetch students when user changes
  useEffect(() => {
    if (user?.id !== userIdRef.current) {
      userIdRef.current = user?.id;
      initializedRef.current = false;
    }

    if (initializedRef.current) return;
    if (!user) {
      setStudents([]);
      setCurrentStudentState(null);
      setLoading(false);
      return;
    }

    initializedRef.current = true;
    fetchStudents();
  }, [user, fetchStudents]);

  const contextValue = useMemo(
    () => ({
      students,
      currentStudent,
      loading,
      setCurrentStudent,
      fetchStudents,
      addStudent,
      updateStudent,
      deleteStudent,
    }),
    [students, currentStudent, loading, setCurrentStudent, fetchStudents, addStudent, updateStudent, deleteStudent]
  );

  return (
    <StudentContext.Provider value={contextValue}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudents() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error("useStudents must be used within a StudentProvider");
  }
  return context;
}
