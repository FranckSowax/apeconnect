"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, MessageCircle, Heart, Share2, ShieldCheck, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import type { Ad, AdPhoto, User } from "@/types";

type AdWithDetails = Ad & {
  photos: AdPhoto[];
  user: User;
};

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  
  const [ad, setAd] = useState<AdWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    const fetchAd = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("ads")
        .select(`
          *,
          photos:ad_photos(*),
          user:users(*)
        `)
        .eq("id", params.id)
        .single();

      if (error) {
        console.error("Error fetching ad:", error);
        toast.error("Impossible de charger l'annonce");
        router.push("/shop");
      } else {
        setAd(data as AdWithDetails);
      }
      setIsLoading(false);
    };

    if (params.id) {
      fetchAd();
    }
  }, [params.id, router, supabase]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-[500px] rounded-[32px]" />
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4 rounded-full" />
            <Skeleton className="h-8 w-1/4 rounded-full" />
            <Skeleton className="h-32 w-full rounded-[24px]" />
          </div>
        </div>
      </div>
    );
  }

  if (!ad) return null;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white bg-white/50" asChild>
          <Link href="/shop">
            <ArrowLeft className="h-5 w-5 text-[#062F28]" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold text-[#062F28]">Détails de l&apos;annonce</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Images */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[32px] bg-[#F3F4F6]">
            {ad.photos && ad.photos.length > 0 ? (
              <Image
                src={process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/ad-photos/" + ad.photos[activePhoto].file_path}
                alt={ad.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Aucune photo
              </div>
            )}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button size="icon" variant="secondary" className="rounded-full bg-white/80 backdrop-blur-md hover:bg-white text-muted-foreground hover:text-red-500 shadow-sm">
                <Heart className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="secondary" className="rounded-full bg-white/80 backdrop-blur-md hover:bg-white text-muted-foreground hover:text-[#062F28] shadow-sm">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {ad.photos && ad.photos.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {ad.photos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => setActivePhoto(index)}
                  className={`relative aspect-square w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    activePhoto === index ? "border-[#062F28]" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/ad-photos/" + photo.file_path}
                    alt={`${ad.title} - photo ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <Badge className="bg-[#9FE870] text-[#062F28] hover:bg-[#8CD660] border-0 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {ad.subject || "Autre"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Publié le {new Date(ad.created_at).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-[#062F28] mb-2 leading-tight">{ad.title}</h1>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-[#062F28]">{ad.price.toLocaleString()}</span>
              <span className="text-lg text-muted-foreground">FCFA</span>
            </div>
          </div>

          {/* Seller Card */}
          <Card className="border-0 shadow-sm rounded-[24px] bg-white overflow-hidden">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-[#F3F4F6]">
                  <AvatarImage src={ad.user?.avatar_url || undefined} />
                  <AvatarFallback className="bg-[#062F28] text-white font-bold">
                    {ad.user?.full_name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-[#062F28] text-sm">{ad.user?.full_name || "Utilisateur"}</p>
                  <div className="flex items-center gap-1 text-xs text-[#062F28]/70">
                    <ShieldCheck className="h-3 w-3 text-[#9FE870]" />
                    <span>Parent vérifié</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-full border-zinc-200 bg-white hover:bg-[#F9FAFB] text-[#062F28] font-medium shadow-sm">
                Voir profil
              </Button>
            </CardContent>
          </Card>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg text-[#062F28]">Description</h3>
            <div className="p-6 rounded-[24px] bg-white shadow-sm border-0">
              <p className="text-muted-foreground leading-relaxed">
                {ad.description || "Aucune description fournie."}
              </p>
            </div>
          </div>

          {/* Attributes Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-[24px] bg-white shadow-sm border-0">
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-bold">État</p>
              <p className="font-medium text-[#062F28] capitalize">{(ad.condition || "").replace('-', ' ')}</p>
            </div>
            <div className="p-4 rounded-[24px] bg-white shadow-sm border-0">
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-bold">Niveau</p>
              <p className="font-medium text-[#062F28] capitalize">{ad.level}</p>
            </div>
            {ad.establishment_id && (
              <div className="p-4 rounded-[24px] bg-white shadow-sm border-0 col-span-2 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#F3F4F6] flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-[#062F28]" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Établissement</p>
                  <p className="font-medium text-[#062F28]">Lycée National Léon Mba</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <Button className="w-full rounded-full h-14 text-lg font-bold shadow-lg shadow-[#062F28]/20 bg-[#062F28] text-white hover:bg-[#062F28]/90 transition-all transform hover:scale-[1.02]">
            <MessageCircle className="mr-2 h-5 w-5" />
            Contacter le vendeur
          </Button>
        </div>
      </div>
    </div>
  );
}
