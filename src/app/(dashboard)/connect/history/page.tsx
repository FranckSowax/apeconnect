"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, Eye, Filter, RefreshCw } from "lucide-react";
import Link from "next/link";
import type { Absence, Student } from "@/types";

type AbsenceWithStudent = Absence & { student: Student };

export default function AbsenceHistoryPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [absences, setAbsences] = useState<AbsenceWithStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchAbsences = async () => {
    if (!user) return;

    setIsLoading(true);

    let query = supabase
      .from("absences")
      .select(`
        *,
        student:students(*)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching absences:", error);
    } else {
      setAbsences(data as AbsenceWithStudent[]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchAbsences();
  }, [user, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-[#9FE870]/20 text-[#062F28] hover:bg-[#9FE870]/30 border-0 rounded-full">Approuvée</Badge>;
      case "pending":
        return <Badge className="bg-[#F7D66E]/20 text-[#B8860B] hover:bg-[#F7D66E]/30 border-0 rounded-full">En attente</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="rounded-full bg-[#FFB2DD]/20 text-[#E91E8C] hover:bg-[#FFB2DD]/30 border-0">Refusée</Badge>;
      default:
        return <Badge variant="outline" className="rounded-full">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-white bg-white/50" asChild>
            <Link href="/connect">
              <ArrowLeft className="h-5 w-5 text-[#062F28]" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#062F28]">Historique des absences</h1>
            <p className="text-sm text-muted-foreground">
              Consultez toutes vos demandes d&apos;absence
            </p>
          </div>
        </div>
        <Button variant="outline" size="icon" onClick={fetchAbsences} className="ml-auto sm:ml-0 hidden sm:flex rounded-full border-0 bg-white shadow-sm hover:bg-[#F9FAFB] text-[#062F28]">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <Card className="border-0 shadow-sm rounded-[32px] bg-white overflow-hidden">
        <CardHeader className="bg-[#F9FAFB] border-b border-[#F3F4F6] p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-[#062F28] font-bold text-xl">Mes absences</CardTitle>
              <CardDescription>
                {absences.length} absence(s) au total
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Filter className="h-4 w-4 text-[#062F28]" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px] rounded-full border-0 bg-white h-10 shadow-sm text-sm">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-[#E5E7EB]">
                  <SelectItem key="all" value="all" className="rounded-lg">Tous</SelectItem>
                  <SelectItem key="pending" value="pending" className="rounded-lg">En attente</SelectItem>
                  <SelectItem key="approved" value="approved" className="rounded-lg">Approuvées</SelectItem>
                  <SelectItem key="rejected" value="rejected" className="rounded-lg">Refusées</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/4 rounded-full" />
                    <Skeleton className="h-4 w-1/3 rounded-full" />
                  </div>
                  <Skeleton className="h-8 w-20 rounded-full" />
                </div>
              ))}
            </div>
          ) : absences.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[#062F28] font-medium mb-4">
                Aucune absence trouvée
              </p>
              <Button asChild className="rounded-full bg-[#062F28] text-white hover:bg-[#062F28]/90 font-bold">
                <Link href="/connect/new">Signaler une absence</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-[#F3F4F6]">
                    <TableHead className="pl-6 min-w-[150px] font-bold text-[#062F28]">Élève</TableHead>
                    <TableHead className="min-w-[150px] font-bold text-[#062F28]">Date</TableHead>
                    <TableHead className="min-w-[200px] font-bold text-[#062F28]">Motif</TableHead>
                    <TableHead className="min-w-[100px] font-bold text-[#062F28]">Statut</TableHead>
                    <TableHead className="min-w-[150px] font-bold text-[#062F28]">Soumis le</TableHead>
                    <TableHead className="text-right pr-6 min-w-[80px] font-bold text-[#062F28]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {absences.map((absence) => (
                    <TableRow key={absence.id} className="hover:bg-[#F9FAFB] border-[#F3F4F6] transition-colors">
                      <TableCell className="pl-6 font-medium text-[#062F28]">
                        {absence.student?.full_name || "N/A"}
                      </TableCell>
                      <TableCell className="text-[#062F28]">
                        {format(new Date(absence.date), "dd MMM yyyy", { locale: fr })}
                        {absence.end_date && (
                          <span className="text-muted-foreground">
                            {" "}- {format(new Date(absence.end_date), "dd MMM yyyy", { locale: fr })}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-muted-foreground">
                        {absence.reason_text || "-"}
                      </TableCell>
                      <TableCell>{getStatusBadge(absence.status)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(absence.created_at), "dd/MM/yyyy HH:mm", { locale: fr })}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-[#F3F4F6]" asChild>
                          <Link href={`/connect/${absence.id}`}>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
