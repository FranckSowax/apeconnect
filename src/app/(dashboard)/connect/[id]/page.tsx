"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar as CalendarIcon, Clock, FileText, User, School, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Absence, Student, User as UserType } from "@/types";

type AbsenceWithDetails = Absence & {
  student: Student;
  user: UserType;
};

export default function AbsenceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [absence, setAbsence] = useState<AbsenceWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAbsence = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("absences")
        .select(`
          *,
          student:students(*),
          user:users(*)
        `)
        .eq("id", params.id)
        .single();

      if (error) {
        console.error("Error fetching absence:", error);
        toast.error("Impossible de charger la demande d'absence");
        router.push("/connect/history");
      } else {
        setAbsence(data as AbsenceWithDetails);
      }
      setIsLoading(false);
    };

    if (params.id) {
      fetchAbsence();
    }
  }, [params.id, router, supabase]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-[#9FE870]/20 text-[#062F28] hover:bg-[#9FE870]/30 border-0 rounded-full px-4 py-1 text-sm">Approuvée</Badge>;
      case "pending":
        return <Badge className="bg-[#F7D66E]/20 text-[#B8860B] hover:bg-[#F7D66E]/30 border-0 rounded-full px-4 py-1 text-sm">En attente</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="rounded-full bg-[#FFB2DD]/20 text-[#E91E8C] hover:bg-[#FFB2DD]/30 border-0 px-4 py-1 text-sm">Refusée</Badge>;
      default:
        return <Badge variant="outline" className="rounded-full px-4 py-1 text-sm">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-16 w-16 text-[#9FE870]" />;
      case "pending":
        return <Clock className="h-16 w-16 text-[#F7D66E]" />;
      case "rejected":
        return <XCircle className="h-16 w-16 text-[#FFB2DD]" />;
      default:
        return <Clock className="h-16 w-16 text-muted-foreground" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 rounded-full" />
          </div>
        </div>
        <Card className="rounded-[32px] border-0 shadow-sm bg-white overflow-hidden">
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/2 rounded-full" />
                <Skeleton className="h-4 w-3/4 rounded-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/2 rounded-full" />
                <Skeleton className="h-4 w-3/4 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!absence) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white bg-white/50" asChild>
          <Link href="/connect/history">
            <ArrowLeft className="h-5 w-5 text-[#062F28]" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[#062F28]">Détails de l&apos;absence</h1>
          <p className="text-muted-foreground text-sm">
            Référence: #{absence.id.slice(0, 8)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Card */}
        <Card className="lg:col-span-1 border-0 shadow-sm rounded-[32px] bg-white overflow-hidden flex flex-col items-center justify-center p-8 text-center h-full">
          <div className="mb-6 p-6 rounded-full bg-[#F9FAFB]">
            {getStatusIcon(absence.status)}
          </div>
          <h2 className="text-xl font-bold text-[#062F28] mb-2">Statut de la demande</h2>
          <div className="mb-6">{getStatusBadge(absence.status)}</div>
          <p className="text-sm text-muted-foreground">
            Soumis le {format(new Date(absence.created_at), "dd MMMM yyyy à HH:mm", { locale: fr })}
          </p>
        </Card>

        {/* Details Card */}
        <Card className="lg:col-span-2 border-0 shadow-sm rounded-[32px] bg-white overflow-hidden">
          <CardHeader className="bg-[#F9FAFB] border-b border-[#F3F4F6] p-8">
            <CardTitle className="text-[#062F28] font-bold text-xl">Informations</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            {/* Student Info */}
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
                <User className="h-6 w-6 text-[#062F28]" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Élève concerné</p>
                <p className="text-lg font-bold text-[#062F28]">{absence.student?.full_name}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <School className="h-4 w-4" />
                  <span>{absence.student?.class_name || "Classe non renseignée"}</span>
                </div>
              </div>
            </div>

            {/* Date Info */}
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
                <CalendarIcon className="h-6 w-6 text-[#062F28]" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Période d&apos;absence</p>
                <p className="text-lg font-bold text-[#062F28] capitalize">
                  {format(new Date(absence.date), "EEEE dd MMMM yyyy", { locale: fr })}
                </p>
                {absence.end_date && (
                  <p className="text-sm text-muted-foreground mt-1">
                    au {format(new Date(absence.end_date), "EEEE dd MMMM yyyy", { locale: fr })}
                  </p>
                )}
              </div>
            </div>

            {/* Reason Info */}
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
                <FileText className="h-6 w-6 text-[#062F28]" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Motif déclaré</p>
                <div className="bg-[#F9FAFB] rounded-2xl p-4 border-0">
                  <p className="text-[#062F28] leading-relaxed">
                    {absence.reason_text || "Aucun motif précisé"}
                  </p>
                </div>
              </div>
            </div>

            {/* Admin Comments */}
            {absence.admin_comments && (
              <div className="mt-6 pt-6 border-t border-[#F3F4F6]">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Commentaire de l&apos;administration</p>
                <p className="text-sm text-[#062F28] bg-yellow-50 p-4 rounded-2xl border border-yellow-100">
                  {absence.admin_comments}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
