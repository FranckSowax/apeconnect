"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { GroupeWithUnread } from "@/types";

export function useGroupes() {
  const [groupes, setGroupes] = useState<GroupeWithUnread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  const fetchGroupes = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setGroupes([]);
        return;
      }

      const { data, error: fetchError } = await supabase.rpc(
        "get_user_groupes_with_unread",
        { p_user_id: user.id }
      );

      if (fetchError) throw fetchError;

      setGroupes(data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching groupes:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchGroupes();

    // Subscribe to realtime updates on messages
    const channel = supabase
      .channel("groupes-updates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages_discussion",
        },
        () => {
          // Refresh groupes when a new message arrives
          fetchGroupes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchGroupes, supabase]);

  return {
    groupes,
    loading,
    error,
    refetch: fetchGroupes,
  };
}
