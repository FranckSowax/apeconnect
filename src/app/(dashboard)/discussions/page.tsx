"use client";

import { GroupesList } from "@/components/discussions";
import { MessageSquare } from "lucide-react";

export default function DiscussionsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Discussions par classe
          </h1>
        </div>
        <p className="text-muted-foreground">
          Échangez avec les parents et professeurs de vos classes
        </p>
      </div>

      {/* Groupes list */}
      <GroupesList />
    </div>
  );
}
