"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export function useUnreadCount() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchCount = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setCount(0);
        return;
      }

      const { data, error } = await supabase.rpc(
        "get_total_unread_count",
        { p_user_id: user.id }
      );

      if (error) {
        console.error("Error fetching unread count:", error);
        return;
      }

      setCount(data || 0);
    } catch (err) {
      console.error("Error in useUnreadCount:", err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchCount();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("unread-count")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages_discussion",
        },
        () => {
          fetchCount();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "message_reads",
        },
        () => {
          fetchCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchCount, supabase]);

  return {
    count,
    loading,
    refetch: fetchCount,
  };
}
