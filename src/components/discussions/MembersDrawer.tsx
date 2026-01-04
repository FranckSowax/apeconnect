"use client";

import { useGroupeMembers } from "@/hooks/useGroupeMembers";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, GraduationCap, Crown } from "lucide-react";

interface MembersDrawerProps {
  groupeId: string;
  groupeName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MembersDrawer({
  groupeId,
  groupeName,
  open,
  onOpenChange,
}: MembersDrawerProps) {
  const { members, professeurs, parents, principalProfesseur, loading } =
    useGroupeMembers(groupeId);

  const getInitials = (name: string) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[340px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Membres
          </SheetTitle>
          <SheetDescription>
            {members.length} membres dans {groupeName}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="h-10 w-10 rounded-full bg-gray-200" />
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-gray-200 rounded mb-1" />
                    <div className="h-3 w-20 bg-gray-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Professeur principal */}
              {principalProfesseur && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Professeur Principal
                  </h4>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={principalProfesseur.avatar_url || undefined} />
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {getInitials(principalProfesseur.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {principalProfesseur.full_name}
                        </span>
                        <Crown className="h-4 w-4 text-amber-500" />
                      </div>
                      <Badge variant="secondary" className="mt-1 text-xs bg-blue-100 text-blue-700">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        Prof. Principal
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* Autres professeurs */}
              {professeurs.filter((p) => !p.is_principal).length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Professeurs ({professeurs.filter((p) => !p.is_principal).length})
                  </h4>
                  <div className="space-y-2">
                    {professeurs
                      .filter((p) => !p.is_principal)
                      .map((prof) => (
                        <div
                          key={prof.user_id}
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={prof.avatar_url || undefined} />
                            <AvatarFallback className="bg-blue-50 text-blue-600">
                              {getInitials(prof.full_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-medium">{prof.full_name}</span>
                            <Badge
                              variant="secondary"
                              className="ml-2 text-[10px] bg-blue-50 text-blue-600"
                            >
                              Prof
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Parents */}
              {parents.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Parents ({parents.length})
                  </h4>
                  <div className="space-y-2">
                    {parents.map((parent) => (
                      <div
                        key={parent.user_id}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={parent.avatar_url || undefined} />
                          <AvatarFallback className="bg-gray-100 text-gray-600">
                            {getInitials(parent.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium truncate block">
                            {parent.full_name}
                          </span>
                          {parent.children_count > 0 && (
                            <span className="text-xs text-muted-foreground">
                              {parent.children_count} enfant{parent.children_count > 1 ? "s" : ""} dans la classe
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
