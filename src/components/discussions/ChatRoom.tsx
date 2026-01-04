"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useMessages } from "@/hooks/useMessages";
import { useSendMessage } from "@/hooks/useSendMessage";
import { MessagesList } from "./MessagesList";
import { MessageInput } from "./MessageInput";
import { MembersDrawer } from "./MembersDrawer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";
import type { MessageDiscussion, GroupeDiscussion } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface ChatRoomProps {
  groupeId: string;
}

export function ChatRoom({ groupeId }: ChatRoomProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [groupe, setGroupe] = useState<GroupeDiscussion | null>(null);
  const [loadingGroupe, setLoadingGroupe] = useState(true);
  const [showMembers, setShowMembers] = useState(false);
  const [replyTo, setReplyTo] = useState<MessageDiscussion | null>(null);
  const [canSendAnnonce, setCanSendAnnonce] = useState(false);

  const { messages, loading, hasMore, loadMore, markAsRead } = useMessages({
    groupeId,
  });
  const { sendMessage } = useSendMessage();

  const supabase = createClient();

  // Fetch groupe info
  useEffect(() => {
    const fetchGroupe = async () => {
      try {
        const { data, error } = await supabase
          .from("groupes_discussion")
          .select(`
            *,
            classe:classes(*)
          `)
          .eq("id", groupeId)
          .single();

        if (error) throw error;
        setGroupe(data);
      } catch (err) {
        console.error("Error fetching groupe:", err);
        router.push("/discussions");
      } finally {
        setLoadingGroupe(false);
      }
    };

    fetchGroupe();
  }, [groupeId, supabase, router]);

  // Check if user can send annonce
  useEffect(() => {
    const checkPermissions = async () => {
      if (!user) return;

      // Check if user is prof or admin
      const { data: isProfData } = await supabase.rpc("is_professeur", {
        p_user_id: user.id,
      });
      const { data: isAdminData } = await supabase.rpc("is_admin_ape", {
        p_user_id: user.id,
      });

      setCanSendAnnonce(isProfData || isAdminData);
    };

    checkPermissions();
  }, [user, supabase]);

  // Mark as read when viewing
  useEffect(() => {
    if (messages.length > 0) {
      markAsRead();
    }
  }, [messages, markAsRead]);

  const handleSend = async (content: string, isAnnonce: boolean) => {
    await sendMessage({
      groupeId,
      contenu: content,
      isAnnonce,
      replyTo: replyTo?.id,
    });
    setReplyTo(null);
  };

  if (loadingGroupe) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!groupe) {
    return null;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-white">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => router.push("/discussions")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-foreground truncate">
            {groupe.classe?.nom || groupe.nom}
          </h2>
          {groupe.classe?.niveau && (
            <p className="text-xs text-muted-foreground">
              {groupe.classe.niveau}
            </p>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowMembers(true)}
        >
          <Users className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <MessagesList
        messages={messages}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={loadMore}
        onReply={setReplyTo}
      />

      {/* Input */}
      <MessageInput
        onSend={handleSend}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
        canSendAnnonce={canSendAnnonce}
      />

      {/* Members drawer */}
      <MembersDrawer
        groupeId={groupeId}
        groupeName={groupe.classe?.nom || groupe.nom}
        open={showMembers}
        onOpenChange={setShowMembers}
      />
    </div>
  );
}
