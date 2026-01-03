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
import { ArrowLeft, Check, X, Eye, Loader2, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import type { Ad, AdPhoto, User } from "@/types";

type AdWithDetails = Ad & {
  user: User;
  photos: AdPhoto[];
};

export default function AdminAdsPage() {
  const { user, hasRole } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [ads, setAds] = useState<AdWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState<AdWithDetails | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewAd, setViewAd] = useState<AdWithDetails | null>(null);

  useEffect(() => {
    if (!hasRole(["censeur", "admin", "super_admin"])) {
      router.push("/dashboard");
      return;
    }

    fetchAds();
  }, [hasRole, router]);

  const fetchAds = async () => {
    setIsLoading(true);

    const { data, error } = await supabase
      .from("ads")
      .select(`
        *,
        user:users(*),
        photos:ad_photos(*)
      `)
      .eq("status", "pending_review")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching ads:", error);
    } else {
      setAds(data as AdWithDetails[]);
    }

    setIsLoading(false);
  };

  const handleAction = async () => {
    if (!selectedAd || !actionType) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("ads")
        .update({
          status: actionType === "approve" ? "published" : "rejected",
          moderation_feedback: comment,
        })
        .eq("id", selectedAd.id);

      if (error) throw error;

      // Log moderation action
      await supabase.from("moderation_logs").insert({
        entity_type: "ad",
        entity_id: selectedAd.id,
        moderator_id: user?.id,
        action: actionType === "approve" ? "approved" : "rejected",
        comments: comment,
      });

      // TODO: Send WhatsApp notification to seller

      toast.success(
        actionType === "approve"
          ? "Annonce publiee"
          : "Annonce rejetee"
      );

      setSelectedAd(null);
      setActionType(null);
      setComment("");
      fetchAds();
    } catch (error) {
      console.error("Error updating ad:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPhotoUrl = (photo: AdPhoto) => {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ad-photos/${photo.file_path}`;
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
          <h1 className="text-3xl font-bold">Moderation des annonces</h1>
          <p className="text-muted-foreground">
            Validez ou refusez les annonces soumises
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Annonces en attente</CardTitle>
          <CardDescription>
            {ads.length} annonce(s) a moderer
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          ) : ads.length === 0 ? (
            <div className="text-center py-10">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Aucune annonce en attente de moderation
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {ads.map((ad) => (
                <Card key={ad.id} className="overflow-hidden">
                  <div className="relative h-40 bg-muted">
                    {ad.photos && ad.photos.length > 0 ? (
                      <Image
                        src={getPhotoUrl(ad.photos[0])}
                        alt={ad.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg line-clamp-1">{ad.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {ad.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {ad.subject && <Badge variant="secondary">{ad.subject}</Badge>}
                      {ad.level && <Badge variant="outline">{ad.level}</Badge>}
                    </div>
                    <p className="text-lg font-bold text-primary">
                      {ad.price?.toLocaleString()} FCFA
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Par {ad.user?.full_name} -{" "}
                      {format(new Date(ad.created_at), "dd/MM/yyyy", { locale: fr })}
                    </p>
                  </CardContent>
                  <div className="p-4 pt-0 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setViewAd(ad)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => {
                        setSelectedAd(ad);
                        setActionType("approve");
                      }}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        setSelectedAd(ad);
                        setActionType("reject");
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Ad Dialog */}
      <Dialog open={!!viewAd} onOpenChange={() => setViewAd(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewAd?.title}</DialogTitle>
          </DialogHeader>
          {viewAd && (
            <div className="space-y-4">
              {/* Photos */}
              {viewAd.photos && viewAd.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {viewAd.photos.map((photo, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                        src={getPhotoUrl(photo)}
                        alt={`Photo ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Prix:</span>
                  <p className="font-medium">{viewAd.price?.toLocaleString()} FCFA</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Vendeur:</span>
                  <p className="font-medium">{viewAd.user?.full_name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Matiere:</span>
                  <p className="font-medium capitalize">{viewAd.subject || "-"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Niveau:</span>
                  <p className="font-medium capitalize">{viewAd.level || "-"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Etat:</span>
                  <p className="font-medium capitalize">{viewAd.condition || "-"}</p>
                </div>
              </div>

              {viewAd.description && (
                <div>
                  <span className="text-muted-foreground text-sm">Description:</span>
                  <p className="text-sm mt-1">{viewAd.description}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewAd(null)}>
              Fermer
            </Button>
            <Button
              variant="default"
              onClick={() => {
                setViewAd(null);
                setSelectedAd(viewAd);
                setActionType("approve");
              }}
            >
              <Check className="h-4 w-4 mr-2" />
              Approuver
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setViewAd(null);
                setSelectedAd(viewAd);
                setActionType("reject");
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Rejeter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Dialog */}
      <Dialog
        open={!!selectedAd && !!actionType}
        onOpenChange={() => {
          setSelectedAd(null);
          setActionType(null);
          setComment("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Publier" : "Rejeter"} l&apos;annonce
            </DialogTitle>
            <DialogDescription>
              {selectedAd && (
                <>
                  Annonce: <strong>{selectedAd.title}</strong> par{" "}
                  <strong>{selectedAd.user?.full_name}</strong>
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
                    ? "Motif du rejet..."
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
                setSelectedAd(null);
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
              {actionType === "approve" ? "Publier" : "Rejeter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
