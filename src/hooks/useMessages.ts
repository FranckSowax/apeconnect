"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import type { MessageDiscussion } from "@/types";

type MessagePayload = RealtimePostgresChangesPayload<{
  [key: string]: unknown;
}>;

interface UseMessagesOptions {
  groupeId: string;
  limit?: number;
}

export function useMessages({ groupeId, limit = 50 }: UseMessagesOptions) {
  const [messages, setMessages] = useState<MessageDiscussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const supabase = createClient();
  const offsetRef = useRef(0);

  const fetchMessages = useCallback(async (reset = false) => {
    try {
      if (reset) {
        offsetRef.current = 0;
        setMessages([]);
      }
      setLoading(true);

      // Fetch messages without automatic relations (FK points to auth.users, not public.users)
      const { data: messagesData, error: fetchError } = await supabase
        .from("messages_discussion")
        .select("*")
        .eq("groupe_id", groupeId)
        .order("created_at", { ascending: false })
        .range(offsetRef.current, offsetRef.current + limit - 1);

      if (fetchError) throw fetchError;

      // Get unique author IDs (excluding nulls)
      const authorIds = [...new Set(
        (messagesData || [])
          .map((m: { auteur_id: string | null }) => m.auteur_id)
          .filter((id: string | null): id is string => id !== null)
      )];

      // Fetch author profiles separately
      let authorsMap: Record<string, { id: string; full_name: string; avatar_url: string | null }> = {};
      if (authorIds.length > 0) {
        const { data: authorsData } = await supabase
          .from("users")
          .select("id, full_name, avatar_url")
          .in("id", authorIds);

        if (authorsData) {
          authorsMap = authorsData.reduce((acc: typeof authorsMap, author: { id: string; full_name: string; avatar_url: string | null }) => {
            acc[author.id] = author;
            return acc;
          }, {} as typeof authorsMap);
        }
      }

      // Combine messages with author info
      type MessageRow = { auteur_id: string | null; [key: string]: unknown };
      const messagesWithAuthors = (messagesData || []).map((msg: MessageRow) => ({
        ...msg,
        auteur: msg.auteur_id ? authorsMap[msg.auteur_id] || null : null,
      }));

      const newMessages = messagesWithAuthors.reverse();

      if (reset) {
        setMessages(newMessages);
      } else {
        setMessages((prev) => [...newMessages, ...prev]);
      }

      setHasMore((messagesData?.length || 0) >= limit);
      offsetRef.current += messagesData?.length || 0;
      setError(null);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [supabase, groupeId, limit]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchMessages(false);
    }
  }, [loading, hasMore, fetchMessages]);

  // Mark messages as read
  const markAsRead = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const lastMessage = messages[messages.length - 1];
      if (!lastMessage) return;

      await supabase
        .from("message_reads")
        .upsert(
          {
            user_id: user.id,
            groupe_id: groupeId,
            last_read_at: new Date().toISOString(),
            last_read_message_id: lastMessage.id,
          },
          { onConflict: "user_id,groupe_id" }
        );
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  }, [supabase, groupeId, messages]);

  useEffect(() => {
    fetchMessages(true);
  }, [groupeId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`messages-${groupeId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages_discussion",
          filter: `groupe_id=eq.${groupeId}`,
        },
        async (payload: MessagePayload) => {
          // Fetch the full message without automatic relations
          const newRecord = payload.new as { id: string };
          if (!newRecord?.id) return;

          const { data: messageData } = await supabase
            .from("messages_discussion")
            .select("*")
            .eq("id", newRecord.id)
            .single();

          if (messageData) {
            // Fetch author info separately
            let auteur = null;
            if (messageData.auteur_id) {
              const { data: authorData } = await supabase
                .from("users")
                .select("id, full_name, avatar_url")
                .eq("id", messageData.auteur_id)
                .single();
              auteur = authorData;
            }

            setMessages((prev) => [...prev, { ...messageData, auteur }]);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages_discussion",
          filter: `groupe_id=eq.${groupeId}`,
        },
        (payload: MessagePayload) => {
          const updatedRecord = payload.new as { id: string; [key: string]: unknown };
          if (!updatedRecord?.id) return;

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === updatedRecord.id ? { ...msg, ...updatedRecord } : msg
            )
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "messages_discussion",
          filter: `groupe_id=eq.${groupeId}`,
        },
        (payload: MessagePayload) => {
          const deletedRecord = payload.old as { id: string };
          if (!deletedRecord?.id) return;

          setMessages((prev) => prev.filter((msg) => msg.id !== deletedRecord.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, groupeId]);

  return {
    messages,
    loading,
    error,
    hasMore,
    loadMore,
    markAsRead,
    refetch: () => fetchMessages(true),
  };
}
