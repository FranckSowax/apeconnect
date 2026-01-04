"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Establishment } from "@/types";

interface EstablishmentContextType {
  currentEstablishment: Establishment | null;
  establishments: Establishment[];
  loading: boolean;
  setCurrentEstablishment: (establishment: Establishment) => void;
  fetchEstablishments: () => Promise<void>;
}

const EstablishmentContext = createContext<EstablishmentContextType | undefined>(undefined);

const STORAGE_KEY = "ape_connect_establishment_id";

// Create supabase client outside component to ensure stable reference
let supabaseInstance: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!supabaseInstance) {
    supabaseInstance = createClient();
  }
  return supabaseInstance;
}

export function EstablishmentProvider({ children }: { children: ReactNode }) {
  const [currentEstablishment, setCurrentEstablishmentState] = useState<Establishment | null>(null);
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);

  // Stable supabase reference
  const supabase = useMemo(() => getSupabase(), []);

  // Prevent re-initialization using ref (survives re-renders)
  const initializedRef = useRef(false);

  const fetchEstablishments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("establishments")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching establishments:", error);
        setLoading(false);
        return;
      }

      setEstablishments(data as Establishment[]);

      // Restore previously selected establishment
      if (typeof window !== "undefined") {
        const savedId = localStorage.getItem(STORAGE_KEY);
        if (savedId && data) {
          const saved = data.find((e: { id: string }) => e.id === savedId);
          if (saved) {
            setCurrentEstablishmentState(saved as Establishment);
          } else if (data.length > 0) {
            // Default to first if saved one not found
            setCurrentEstablishmentState(data[0] as Establishment);
          }
        } else if (data && data.length > 0) {
          // Default to first if nothing saved
          setCurrentEstablishmentState(data[0] as Establishment);
        }
      }
    } catch (err) {
      console.error("Unexpected error in fetchEstablishments:", err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const setCurrentEstablishment = useCallback((establishment: Establishment) => {
    setCurrentEstablishmentState(establishment);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, establishment.id);
    }
  }, []);

  // Initialize only once using ref
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    fetchEstablishments();
  }, [fetchEstablishments]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      currentEstablishment,
      establishments,
      loading,
      setCurrentEstablishment,
      fetchEstablishments,
    }),
    [currentEstablishment, establishments, loading, setCurrentEstablishment, fetchEstablishments]
  );

  return (
    <EstablishmentContext.Provider value={contextValue}>
      {children}
    </EstablishmentContext.Provider>
  );
}

export function useEstablishment() {
  const context = useContext(EstablishmentContext);
  if (context === undefined) {
    throw new Error("useEstablishment must be used within an EstablishmentProvider");
  }
  return context;
}
