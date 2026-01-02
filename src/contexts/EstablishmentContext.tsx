"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
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

export function EstablishmentProvider({ children }: { children: ReactNode }) {
  const [currentEstablishment, setCurrentEstablishmentState] = useState<Establishment | null>(null);
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchEstablishments = async () => {
    setLoading(true);
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
    const savedId = localStorage.getItem(STORAGE_KEY);
    if (savedId && data) {
      const saved = data.find((e: { id: string }) => e.id === savedId);
      if (saved) {
        setCurrentEstablishmentState(saved as Establishment);
      }
    }

    setLoading(false);
  };

  const setCurrentEstablishment = (establishment: Establishment) => {
    setCurrentEstablishmentState(establishment);
    localStorage.setItem(STORAGE_KEY, establishment.id);
  };

  useEffect(() => {
    fetchEstablishments();
  }, []);

  return (
    <EstablishmentContext.Provider
      value={{
        currentEstablishment,
        establishments,
        loading,
        setCurrentEstablishment,
        fetchEstablishments,
      }}
    >
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
