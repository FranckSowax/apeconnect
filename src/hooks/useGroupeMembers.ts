"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { GroupeMember } from "@/types";

export function useGroupeMembers(groupeId: string) {
  const [members, setMembers] = useState<GroupeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error: fetchError } = await supabase.rpc(
        "get_groupe_members",
        { p_groupe_id: groupeId }
      );

      if (fetchError) throw fetchError;

      // Séparer et trier les membres
      const sorted = (data || []).sort((a: GroupeMember, b: GroupeMember) => {
        // Prof principal en premier
        if (a.is_principal && !b.is_principal) return -1;
        if (!a.is_principal && b.is_principal) return 1;
        // Puis les profs
        if (a.member_type === "PROFESSEUR" && b.member_type !== "PROFESSEUR") return -1;
        if (a.member_type !== "PROFESSEUR" && b.member_type === "PROFESSEUR") return 1;
        // Puis alphabétique
        return (a.full_name || "").localeCompare(b.full_name || "");
      });

      setMembers(sorted);
      setError(null);
    } catch (err) {
      console.error("Error fetching members:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [supabase, groupeId]);

  useEffect(() => {
    if (groupeId) {
      fetchMembers();
    }
  }, [groupeId, fetchMembers]);

  const professeurs = members.filter((m) => m.member_type === "PROFESSEUR");
  const parents = members.filter((m) => m.member_type === "PARENT");
  const principalProfesseur = professeurs.find((p) => p.is_principal);

  return {
    members,
    professeurs,
    parents,
    principalProfesseur,
    loading,
    error,
    refetch: fetchMembers,
  };
}
