"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UnreadBadge } from "./UnreadBadge";
import { Users, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import type { GroupeWithUnread } from "@/types";
import Link from "next/link";

interface GroupeCardProps {
  groupe: GroupeWithUnread;
}

export function GroupeCard({ groupe }: GroupeCardProps) {
  const initials = groupe.classe_nom
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const timeAgo = groupe.last_message_at
    ? formatDistanceToNow(new Date(groupe.last_message_at), {
        addSuffix: true,
        locale: fr,
      })
    : null;

  return (
    <Link href={`/discussions/${groupe.groupe_id}`}>
      <Card className="hover:shadow-md transition-all cursor-pointer border-0 shadow-sm rounded-2xl">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <Avatar className="h-14 w-14 rounded-xl bg-primary/10">
              <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-bold text-foreground truncate">
                    {groupe.classe_nom}
                  </h3>
                  {groupe.classe_niveau && (
                    <p className="text-xs text-muted-foreground">
                      {groupe.classe_niveau}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  {timeAgo && (
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {timeAgo}
                    </span>
                  )}
                  <UnreadBadge count={groupe.unread_count} />
                </div>
              </div>

              {/* Last message preview */}
              {groupe.last_message_preview ? (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  <span className="font-medium text-foreground">
                    {groupe.last_message_auteur}:
                  </span>{" "}
                  {groupe.last_message_preview}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground mt-2 italic">
                  Aucun message
                </p>
              )}

              {/* Members count */}
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>{groupe.total_members} membres</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
