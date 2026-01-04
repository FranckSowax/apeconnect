"use client";

import { useGroupes } from "@/hooks/useGroupes";
import { GroupeCard } from "./GroupeCard";
import { MessageSquare } from "lucide-react";

export function GroupesList() {
  const { groupes, loading, error } = useGroupes();

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 bg-white rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">
          Erreur lors du chargement des groupes
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {error.message}
        </p>
      </div>
    );
  }

  if (groupes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Aucun groupe de discussion</h3>
        <p className="text-muted-foreground">
          Vous n'avez accès à aucun groupe pour le moment.
          <br />
          Les groupes sont automatiquement créés pour chaque classe.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groupes.map((groupe) => (
        <GroupeCard key={groupe.groupe_id} groupe={groupe} />
      ))}
    </div>
  );
}
