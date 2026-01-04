"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AuteurType } from "@/types";

interface SendMessageOptions {
  groupeId: string;
  contenu: string;
  isAnnonce?: boolean;
  replyTo?: string;
}

export function useSendMessage() {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  const sendMessage = useCallback(async ({
    groupeId,
    contenu,
    isAnnonce = false,
    replyTo,
  }: SendMessageOptions) => {
    try {
      setSending(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Déterminer le type d'auteur
      const { data: auteurTypeData } = await supabase.rpc(
        "get_auteur_type",
        { p_user_id: user.id }
      );

      const auteurType: AuteurType = auteurTypeData || "PARENT";

      // Insérer le message
      const { data, error: insertError } = await supabase
        .from("messages_discussion")
        .insert({
          groupe_id: groupeId,
          auteur_id: user.id,
          auteur_type: auteurType,
          contenu: contenu.trim(),
          type_message: isAnnonce ? "ANNONCE" : "TEXT",
          is_annonce: isAnnonce,
          reply_to: replyTo || null,
        })
        .select(`
          *,
          auteur:users!auteur_id(
            id,
            full_name,
            avatar_url
          )
        `)
        .single();

      if (insertError) throw insertError;

      return { data, error: null };
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err as Error);
      return { data: null, error: err as Error };
    } finally {
      setSending(false);
    }
  }, [supabase]);

  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      setSending(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from("messages_discussion")
        .delete()
        .eq("id", messageId);

      if (deleteError) throw deleteError;

      return { error: null };
    } catch (err) {
      console.error("Error deleting message:", err);
      setError(err as Error);
      return { error: err as Error };
    } finally {
      setSending(false);
    }
  }, [supabase]);

  const editMessage = useCallback(async (messageId: string, newContenu: string) => {
    try {
      setSending(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from("messages_discussion")
        .update({ contenu: newContenu.trim() })
        .eq("id", messageId)
        .select()
        .single();

      if (updateError) throw updateError;

      return { data, error: null };
    } catch (err) {
      console.error("Error editing message:", err);
      setError(err as Error);
      return { data: null, error: err as Error };
    } finally {
      setSending(false);
    }
  }, [supabase]);

  return {
    sendMessage,
    deleteMessage,
    editMessage,
    sending,
    error,
  };
}
