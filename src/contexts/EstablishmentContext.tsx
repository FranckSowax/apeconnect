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
    console.log("[ESTABLISHMENT] fetchEstablishments called");
    try {
      console.log("[ESTABLISHMENT] Fetching establishments from database...");
      const { data, error } = await supabase
        .from("establishments")
        .select("*")
        .order("name");

      if (error) {
        console.error("[ESTABLISHMENT] Error fetching establishments:", error);
        setLoading(false);
        return;
      }

      console.log("[ESTABLISHMENT] Fetched", data?.length || 0, "establishments");
      setEstablishments(data as Establishment[]);

      // Restore previously selected establishment
      if (typeof window !== "undefined") {
        const savedId = localStorage.getItem(STORAGE_KEY);
        console.log("[ESTABLISHMENT] Saved establishment ID from localStorage:", savedId);
        if (savedId && data) {
          const saved = data.find((e: { id: string }) => e.id === savedId);
          if (saved) {
            console.log("[ESTABLISHMENT] Restoring saved establishment:", saved.name);
            setCurrentEstablishmentState(saved as Establishment);
          } else if (data.length > 0) {
            console.log("[ESTABLISHMENT] Saved not found, defaulting to first:", data[0].name);
            setCurrentEstablishmentState(data[0] as Establishment);
          }
        } else if (data && data.length > 0) {
          console.log("[ESTABLISHMENT] No saved ID, defaulting to first:", data[0].name);
          setCurrentEstablishmentState(data[0] as Establishment);
        }
      }
    } catch (err) {
      console.error("[ESTABLISHMENT] Unexpected error:", err);
    } finally {
      console.log("[ESTABLISHMENT] Setting loading to false");
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
    console.log("[ESTABLISHMENT] useEffect triggered, initializedRef:", initializedRef.current);
    if (initializedRef.current) {
      console.log("[ESTABLISHMENT] Already initialized, skipping");
      return;
    }
    initializedRef.current = true;
    console.log("[ESTABLISHMENT] Starting initialization...");
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
