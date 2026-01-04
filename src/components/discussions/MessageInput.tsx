"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Send, Megaphone, X, Loader2 } from "lucide-react";
import type { MessageDiscussion } from "@/types";

interface MessageInputProps {
  onSend: (content: string, isAnnonce: boolean) => Promise<void>;
  replyTo?: MessageDiscussion | null;
  onCancelReply?: () => void;
  canSendAnnonce?: boolean;
  disabled?: boolean;
}

export function MessageInput({
  onSend,
  replyTo,
  onCancelReply,
  canSendAnnonce = false,
  disabled = false,
}: MessageInputProps) {
  const [content, setContent] = useState("");
  const [isAnnonce, setIsAnnonce] = useState(false);
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [content]);

  // Focus on textarea when replying
  useEffect(() => {
    if (replyTo) {
      textareaRef.current?.focus();
    }
  }, [replyTo]);

  const handleSubmit = async () => {
    if (!content.trim() || sending || disabled) return;

    setSending(true);
    try {
      await onSend(content.trim(), isAnnonce);
      setContent("");
      setIsAnnonce(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t bg-white p-4">
      {/* Reply preview */}
      {replyTo && (
        <div className="flex items-center gap-2 mb-2 p-2 bg-gray-50 rounded-lg border-l-2 border-primary">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-primary">
              Répondre à {replyTo.auteur?.full_name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {replyTo.contenu}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onCancelReply}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Annonce mode indicator */}
      {isAnnonce && (
        <div className="flex items-center gap-2 mb-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
          <Megaphone className="h-4 w-4 text-amber-600" />
          <span className="text-xs text-amber-700 font-medium">
            Mode Annonce - Tous les membres recevront une notification WhatsApp
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 ml-auto"
            onClick={() => setIsAnnonce(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-2">
        {/* Annonce button */}
        {canSendAnnonce && !isAnnonce && (
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 flex-shrink-0 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
            onClick={() => setIsAnnonce(true)}
            disabled={disabled}
            title="Envoyer comme annonce"
          >
            <Megaphone className="h-5 w-5" />
          </Button>
        )}

        {/* Textarea */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isAnnonce ? "Rédigez votre annonce..." : "Écrivez un message..."}
            className={cn(
              "min-h-[44px] max-h-[120px] resize-none pr-12 rounded-2xl",
              isAnnonce && "border-amber-300 focus:border-amber-400"
            )}
            disabled={disabled || sending}
            rows={1}
          />
        </div>

        {/* Send button */}
        <Button
          size="icon"
          className={cn(
            "h-10 w-10 rounded-full flex-shrink-0",
            isAnnonce
              ? "bg-amber-500 hover:bg-amber-600"
              : "bg-primary hover:bg-primary/90"
          )}
          onClick={handleSubmit}
          disabled={!content.trim() || sending || disabled}
        >
          {sending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
