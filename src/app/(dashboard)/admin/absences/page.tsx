"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, Check, X, Eye, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { Absence, Student, User, AbsenceJustification } from "@/types";

type AbsenceWithDetails = Absence & {
  student: Student;
  user: User;
  justifications: AbsenceJustification[];
};

export default function AdminAbsencesPage() {
  const { user, hasRole } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [absences, setAbsences] = useState<AbsenceWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAbsence, setSelectedAbsence] = useState<AbsenceWithDetails | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!hasRole(["censeur", "admin", "super_admin"])) {
      router.push("/dashboard");
      return;
    }

    fetchAbsences();
  }, [hasRole, router]);

  const fetchAbsences = async () => {
    setIsLoading(true);

    const { data, error } = await supabase
      .from("absences")
      .select(`
        *,
        student:students(*),
        user:users(*),
        justifications:absence_justifications(*)
      `)
      .eq("status", "pending")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching absences:", error);
    } else {
      setAbsences(data as AbsenceWithDetails[]);
    }

    setIsLoading(false);
  };

  const handleAction = async () => {
    if (!selectedAbsence || !actionType) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("absences")
        .update({
          status: actionType === "approve" ? "approved" : "rejected",
          admin_comments: comment,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", selectedAbsence.id);

      if (error) throw error;

      // Log moderation action
      await supabase.from("moderation_logs").insert({
        entity_type: "absence",
        entity_id: selectedAbsence.id,
        moderator_id: user?.id,
        action: actionType === "approve" ? "approved" : "rejected",
        comments: comment,
      });

      // TODO: Send WhatsApp notification to parent

      toast.success(
        actionType === "approve"
          ? "Absence approuvee"
          : "Absence refusee"
      );

      setSelectedAbsence(null);
      setActionType(null);
      setComment("");
      fetchAbsences();
    } catch (error) {
      console.error("Error updating absence:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getJustificationUrl = (justification: AbsenceJustification) => {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/absence-justifications/${justification.file_path}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Absences en attente</h1>
          <p className="text-muted-foreground">
            Validez ou refusez les demandes d&apos;absence
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Demandes en attente</CardTitle>
          <CardDescription>
            {absences.length} demande(s) a traiter
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : absences.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                Aucune demande en attente
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Parent</TableHead>
                    <TableHead className="min-w-[150px]">Eleve</TableHead>
                    <TableHead className="min-w-[150px]">Date</TableHead>
                    <TableHead className="min-w-[200px]">Motif</TableHead>
                    <TableHead className="min-w-[100px]">Justificatif</TableHead>
                    <TableHead className="min-w-[150px]">Soumis le</TableHead>
                    <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {absences.map((absence) => (
                    <TableRow key={absence.id}>
                      <TableCell>{absence.user?.full_name || "N/A"}</TableCell>
                      <TableCell className="font-medium">
                        {absence.student?.full_name}
                        {absence.student?.class_name && (
                          <span className="text-muted-foreground text-xs block">
                            {absence.student.class_name}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {format(new Date(absence.date), "dd MMM yyyy", { locale: fr })}
                        {absence.end_date && (
                          <span className="text-muted-foreground text-xs block">
                            - {format(new Date(absence.end_date), "dd MMM", { locale: fr })}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate">
                        {absence.reason_text || "-"}
                      </TableCell>
                      <TableCell>
                        {absence.justifications?.length > 0 ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                          >
                            <a
                              href={getJustificationUrl(absence.justifications[0])}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Voir
                            </a>
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(absence.created_at), "dd/MM HH:mm", { locale: fr })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => {
                              setSelectedAbsence(absence);
                              setActionType("approve");
                            }}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                              setSelectedAbsence(absence);
                              setActionType("reject");
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog
        open={!!selectedAbsence && !!actionType}
        onOpenChange={() => {
          setSelectedAbsence(null);
          setActionType(null);
          setComment("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Approuver" : "Refuser"} l&apos;absence
            </DialogTitle>
            <DialogDescription>
              {selectedAbsence && (
                <>
                  Absence de <strong>{selectedAbsence.student?.full_name}</strong> pour le{" "}
                  <strong>
                    {format(new Date(selectedAbsence.date), "dd MMMM yyyy", { locale: fr })}
                  </strong>
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                Commentaire {actionType === "reject" && "(obligatoire)"}
              </label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  actionType === "reject"
                    ? "Motif du refus..."
                    : "Commentaire optionnel..."
                }
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedAbsence(null);
                setActionType(null);
                setComment("");
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={handleAction}
              disabled={isSubmitting || (actionType === "reject" && !comment)}
              variant={actionType === "approve" ? "default" : "destructive"}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {actionType === "approve" ? "Approuver" : "Refuser"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
