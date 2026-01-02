"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, Plus, MoreVertical, Edit, Trash, Eye, BookOpen } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { Ad, AdPhoto } from "@/types";

type AdWithPhotos = Ad & { photos: AdPhoto[] };

export default function MyAdsPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [ads, setAds] = useState<AdWithPhotos[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchAds = async () => {
    if (!user) return;

    setIsLoading(true);

    const { data, error } = await supabase
      .from("ads")
      .select(`
        *,
        photos:ad_photos(*)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching ads:", error);
    } else {
      setAds(data as AdWithPhotos[]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchAds();
  }, [user]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from("ads")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      toast.success("Annonce supprimee");
      fetchAds();
    } catch (error) {
      console.error("Error deleting ad:", error);
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleteId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge variant="default">Publiee</Badge>;
      case "pending_review":
        return <Badge variant="secondary">En revision</Badge>;
      case "draft":
        return <Badge variant="outline">Brouillon</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejetee</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/shop">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Mes annonces</h1>
            <p className="text-muted-foreground">
              Gerez vos annonces de manuels scolaires
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href="/shop/new">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle annonce
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Toutes mes annonces</CardTitle>
          <CardDescription>
            {ads.length} annonce(s) au total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          ) : ads.length === 0 ? (
            <div className="text-center py-10">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Vous n&apos;avez pas encore publie d&apos;annonce
              </p>
              <Button asChild>
                <Link href="/shop/new">Creer ma premiere annonce</Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Matiere</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ads.map((ad) => (
                    <TableRow key={ad.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {ad.title}
                      </TableCell>
                      <TableCell>{ad.price?.toLocaleString()} FCFA</TableCell>
                      <TableCell className="capitalize">{ad.subject || "-"}</TableCell>
                      <TableCell>{getStatusBadge(ad.status)}</TableCell>
                      <TableCell>
                        {format(new Date(ad.created_at), "dd/MM/yyyy", { locale: fr })}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/shop/${ad.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                Voir
                              </Link>
                            </DropdownMenuItem>
                            {(ad.status === "draft" || ad.status === "rejected") && (
                              <DropdownMenuItem asChild>
                                <Link href={`/shop/${ad.id}/edit`}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Modifier
                                </Link>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setDeleteId(ad.id)}
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l&apos;annonce?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irreversible. L&apos;annonce sera definitivement supprimee.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
