"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

      toast.success("Annonce supprimée");
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
        return <Badge className="bg-[#9FE870]/20 text-[#062F28] hover:bg-[#9FE870]/30 border-0 rounded-full">Publiée</Badge>;
      case "pending_review":
        return <Badge className="bg-[#F7D66E]/20 text-[#B8860B] hover:bg-[#F7D66E]/30 border-0 rounded-full">En révision</Badge>;
      case "draft":
        return <Badge variant="outline" className="rounded-full">Brouillon</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="rounded-full">Rejetée</Badge>;
      default:
        return <Badge variant="outline" className="rounded-full">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-white bg-white/50" asChild>
            <Link href="/shop">
              <ArrowLeft className="h-5 w-5 text-[#062F28]" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#062F28]">Mes annonces</h1>
            <p className="text-muted-foreground text-sm">
              Gérez vos annonces de manuels scolaires
            </p>
          </div>
        </div>
        <Button asChild className="rounded-full bg-[#062F28] text-white hover:bg-[#062F28]/90 font-bold shadow-lg shadow-[#062F28]/20">
          <Link href="/shop/new">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle annonce
          </Link>
        </Button>
      </div>

      <Card className="border-0 shadow-sm rounded-[32px] bg-white overflow-hidden">
        <CardHeader className="bg-[#F9FAFB] border-b border-[#F3F4F6] p-6">
          <CardTitle className="text-[#062F28] font-bold text-xl">Toutes mes annonces</CardTitle>
          <CardDescription>
            {ads.length} annonce(s) au total
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-2xl" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3 rounded-full" />
                    <Skeleton className="h-4 w-1/4 rounded-full" />
                  </div>
                  <Skeleton className="h-8 w-20 rounded-full" />
                </div>
              ))}
            </div>
          ) : ads.length === 0 ? (
            <div className="text-center py-16">
              <div className="h-16 w-16 rounded-full bg-[#F3F4F6] flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-[#062F28] font-medium mb-2">
                Vous n&apos;avez pas encore publié d&apos;annonce
              </p>
              <p className="text-muted-foreground text-sm mb-6">
                Commencez à vendre vos manuels dès maintenant
              </p>
              <Button asChild className="rounded-full bg-[#9FE870] text-[#062F28] hover:bg-[#8CD660] font-bold">
                <Link href="/shop/new">Créer ma première annonce</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-[#F3F4F6]">
                    <TableHead className="pl-6 font-bold text-[#062F28]">Titre</TableHead>
                    <TableHead className="font-bold text-[#062F28]">Prix</TableHead>
                    <TableHead className="font-bold text-[#062F28]">Matière</TableHead>
                    <TableHead className="font-bold text-[#062F28]">Statut</TableHead>
                    <TableHead className="font-bold text-[#062F28]">Date</TableHead>
                    <TableHead className="text-right pr-6 font-bold text-[#062F28]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ads.map((ad) => (
                    <TableRow key={ad.id} className="hover:bg-[#F9FAFB] border-[#F3F4F6] transition-colors">
                      <TableCell className="pl-6 font-medium text-[#062F28] max-w-[200px] truncate">
                        {ad.title}
                      </TableCell>
                      <TableCell className="font-bold text-[#062F28]">{ad.price?.toLocaleString()} FCFA</TableCell>
                      <TableCell className="capitalize text-muted-foreground">{ad.subject || "-"}</TableCell>
                      <TableCell>{getStatusBadge(ad.status)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(ad.created_at), "dd/MM/yyyy", { locale: fr })}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-[#F3F4F6]">
                              <MoreVertical className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl border-[#E5E7EB] shadow-lg">
                            <DropdownMenuItem asChild className="rounded-lg focus:bg-[#F9FAFB] cursor-pointer">
                              <Link href={`/shop/${ad.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                Voir
                              </Link>
                            </DropdownMenuItem>
                            {(ad.status === "draft" || ad.status === "rejected") && (
                              <DropdownMenuItem asChild className="rounded-lg focus:bg-[#F9FAFB] cursor-pointer">
                                <Link href={`/shop/${ad.id}/edit`}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Modifier
                                </Link>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-destructive focus:bg-destructive/10 rounded-lg cursor-pointer"
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
        <AlertDialogContent className="rounded-[24px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l&apos;annonce ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L&apos;annonce sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full border-0 bg-[#F3F4F6] hover:bg-[#E5E7EB]">Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
