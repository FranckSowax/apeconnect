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
        return <Badge variant="default">Approuvee</Badge>;
      case "pending":
        return <Badge variant="secondary">En attente</Badge>;
      case "rejected":
        return <Badge variant="destructive">Refusee</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/connect">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold">Historique des absences</h1>
            <p className="text-sm text-muted-foreground">
              Consultez toutes vos demandes d&apos;absence
            </p>
          </div>
        </div>
        <Button variant="outline" size="icon" onClick={fetchAbsences} className="ml-auto sm:ml-0 hidden sm:flex">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Mes absences</CardTitle>
              <CardDescription>
                {absences.length} absence(s) au total
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="approved">Approuvees</SelectItem>
                  <SelectItem value="rejected">Refusees</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          ) : absences.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">
                Aucune absence trouvee
              </p>
              <Button asChild>
                <Link href="/connect/new">Signaler une absence</Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Eleve</TableHead>
                    <TableHead className="min-w-[150px]">Date</TableHead>
                    <TableHead className="min-w-[200px]">Motif</TableHead>
                    <TableHead className="min-w-[100px]">Statut</TableHead>
                    <TableHead className="min-w-[150px]">Soumis le</TableHead>
                    <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {absences.map((absence) => (
                    <TableRow key={absence.id}>
                      <TableCell className="font-medium">
                        {absence.student?.full_name || "N/A"}
                      </TableCell>
                      <TableCell>
                        {format(new Date(absence.date), "dd MMM yyyy", { locale: fr })}
                        {absence.end_date && (
                          <span className="text-muted-foreground">
                            {" "}- {format(new Date(absence.end_date), "dd MMM yyyy", { locale: fr })}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {absence.reason_text || "-"}
                      </TableCell>
                      <TableCell>{getStatusBadge(absence.status)}</TableCell>
                      <TableCell>
                        {format(new Date(absence.created_at), "dd/MM/yyyy HH:mm", { locale: fr })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/connect/${absence.id}`}>
                            <Eye className="h-4 w-4" />
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
