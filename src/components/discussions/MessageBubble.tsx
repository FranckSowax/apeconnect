"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MoreVertical, Reply, Pencil, Trash2, Megaphone } from "lucide-react";
import type { MessageDiscussion } from "@/types";

interface MessageBubbleProps {
  message: MessageDiscussion;
  isOwn: boolean;
  onReply?: (message: MessageDiscussion) => void;
  onEdit?: (message: MessageDiscussion) => void;
  onDelete?: (messageId: string) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export function MessageBubble({
  message,
  isOwn,
  onReply,
  onEdit,
  onDelete,
  canEdit = false,
  canDelete = false,
}: MessageBubbleProps) {
  const [showActions, setShowActions] = useState(false);

  const initials = message.auteur?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "?";

  const time = format(new Date(message.created_at), "HH:mm", { locale: fr });

  const getBadgeLabel = () => {
    switch (message.auteur_type) {
      case "PROFESSEUR":
        return "Prof";
      case "ADMIN":
        return "APE";
      default:
        return null;
    }
  };

  const badge = getBadgeLabel();

  // Style pour les annonces
  if (message.is_annonce) {
    return (
      <div className="px-4 py-3 mx-2 my-2 bg-amber-50 border border-amber-200 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Megaphone className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-amber-800">
                Annonce
              </span>
              <span className="text-xs text-amber-600">
                {message.auteur?.full_name} - {time}
              </span>
            </div>
            <p className="text-amber-900 whitespace-pre-wrap break-words">
              {message.contenu}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex gap-2 px-4 py-1 group",
        isOwn ? "flex-row-reverse" : "flex-row"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar (seulement pour les autres) */}
      {!isOwn && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={message.auteur?.avatar_url || undefined} />
          <AvatarFallback className="text-xs bg-gray-200">
            {initials}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message content */}
      <div className={cn("max-w-[75%] min-w-0", isOwn ? "items-end" : "items-start")}>
        {/* Author name and badge */}
        {!isOwn && (
          <div className="flex items-center gap-2 mb-1 px-1">
            <span className="text-xs font-semibold text-foreground">
              {message.auteur?.full_name || "Inconnu"}
            </span>
            {badge && (
              <Badge
                variant="secondary"
                className={cn(
                  "text-[10px] px-1.5 py-0",
                  message.auteur_type === "PROFESSEUR" && "bg-blue-100 text-blue-700",
                  message.auteur_type === "ADMIN" && "bg-green-100 text-green-700"
                )}
              >
                {badge}
              </Badge>
            )}
          </div>
        )}

        {/* Reply reference */}
        {message.reply_message && (
          <div
            className={cn(
              "text-xs px-3 py-1.5 mb-1 rounded-lg border-l-2 bg-gray-50",
              isOwn ? "border-emerald-400" : "border-gray-300"
            )}
          >
            <span className="font-medium">
              {message.reply_message.auteur?.full_name}
            </span>
            <p className="text-muted-foreground line-clamp-1">
              {message.reply_message.contenu}
            </p>
          </div>
        )}

        {/* Bubble */}
        <div
          className={cn(
            "relative px-4 py-2 rounded-2xl",
            isOwn
              ? "bg-emerald-500 text-white rounded-tr-sm"
              : "bg-gray-100 text-foreground rounded-tl-sm"
          )}
        >
          <p className="whitespace-pre-wrap break-words text-sm">
            {message.contenu}
          </p>
          <span
            className={cn(
              "text-[10px] mt-1 block text-right",
              isOwn ? "text-emerald-100" : "text-muted-foreground"
            )}
          >
            {time}
          </span>
        </div>
      </div>

      {/* Actions */}
      {(showActions || canEdit || canDelete) && (
        <div className={cn(
          "self-center opacity-0 group-hover:opacity-100 transition-opacity",
          isOwn ? "mr-1" : "ml-1"
        )}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isOwn ? "end" : "start"}>
              {onReply && (
                <DropdownMenuItem onClick={() => onReply(message)}>
                  <Reply className="mr-2 h-4 w-4" />
                  Répondre
                </DropdownMenuItem>
              )}
              {canEdit && onEdit && (
                <DropdownMenuItem onClick={() => onEdit(message)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Modifier
                </DropdownMenuItem>
              )}
              {canDelete && onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(message.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
