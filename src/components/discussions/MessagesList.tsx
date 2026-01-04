"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MessageBubble } from "./MessageBubble";
import { format, isToday, isYesterday, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import type { MessageDiscussion } from "@/types";
import { useSendMessage } from "@/hooks/useSendMessage";

interface MessagesListProps {
  messages: MessageDiscussion[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onReply: (message: MessageDiscussion) => void;
}

export function MessagesList({
  messages,
  loading,
  hasMore,
  onLoadMore,
  onReply,
}: MessagesListProps) {
  const { user, isAdmin } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(messages.length);
  const { deleteMessage, editMessage } = useSendMessage();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      // New message added
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages.length]);

  // Initial scroll to bottom
  useEffect(() => {
    if (!loading && messages.length > 0) {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
      });
    }
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleScroll = useCallback(() => {
    if (!scrollRef.current || loading || !hasMore) return;

    const { scrollTop } = scrollRef.current;
    if (scrollTop < 100) {
      onLoadMore();
    }
  }, [loading, hasMore, onLoadMore]);

  const formatDateSeparator = (date: Date) => {
    if (isToday(date)) return "Aujourd'hui";
    if (isYesterday(date)) return "Hier";
    return format(date, "d MMMM yyyy", { locale: fr });
  };

  const canEditMessage = (message: MessageDiscussion) => {
    if (message.auteur_id !== user?.id) return false;
    const messageDate = new Date(message.created_at);
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    return messageDate > fifteenMinutesAgo;
  };

  const canDeleteMessage = (message: MessageDiscussion) => {
    return message.auteur_id === user?.id || isAdmin;
  };

  const handleDelete = async (messageId: string) => {
    if (confirm("Supprimer ce message ?")) {
      await deleteMessage(messageId);
    }
  };

  // Group messages by date
  const renderMessages = () => {
    const elements: React.ReactNode[] = [];
    let lastDate: Date | null = null;

    messages.forEach((message, index) => {
      const messageDate = new Date(message.created_at);

      // Add date separator if needed
      if (!lastDate || !isSameDay(lastDate, messageDate)) {
        elements.push(
          <div
            key={`date-${message.id}`}
            className="flex items-center justify-center my-4"
          >
            <div className="px-4 py-1 bg-gray-100 rounded-full text-xs text-muted-foreground font-medium">
              {formatDateSeparator(messageDate)}
            </div>
          </div>
        );
        lastDate = messageDate;
      }

      elements.push(
        <MessageBubble
          key={message.id}
          message={message}
          isOwn={message.auteur_id === user?.id}
          onReply={onReply}
          onDelete={handleDelete}
          canEdit={canEditMessage(message)}
          canDelete={canDeleteMessage(message)}
        />
      );
    });

    return elements;
  };

  if (loading && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <span className="text-2xl">💬</span>
        </div>
        <h3 className="font-semibold text-foreground">Aucun message</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Soyez le premier à envoyer un message dans ce groupe !
        </p>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto py-4"
      onScroll={handleScroll}
    >
      {loading && hasMore && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
        </div>
      )}
      {renderMessages()}
    </div>
  );
}
