import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "./ProductCard";
import Image from "next/image";
import { MessageCircle, Heart, Share2, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProductDetailsSheetProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailsSheet({ product, isOpen, onClose }: ProductDetailsSheetProps) {
  if (!product) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:w-[540px] overflow-y-auto p-0 border-l-border/50">
        {/* Hero Image */}
        <div className="relative h-80 w-full bg-[#F3F4F6]">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover"
          />
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/80 backdrop-blur-md hover:bg-white text-muted-foreground hover:text-red-500 shadow-sm"
          >
            <Heart className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-4 right-16 h-10 w-10 rounded-full bg-white/80 backdrop-blur-md hover:bg-white text-muted-foreground hover:text-[#062F28] shadow-sm"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-8 space-y-8">
          {/* Header Info */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <Badge variant="outline" className="mb-3 border-0 text-[#062F28] bg-[#9FE870] font-bold px-3 py-1 rounded-full uppercase tracking-wide text-[10px]">
                  {product.category}
                </Badge>
                <h2 className="text-2xl font-bold leading-tight text-[#062F28]">{product.title}</h2>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="block font-bold text-3xl text-[#062F28]">
                  {product.price.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">FCFA</span>
                </span>
                <span className="text-sm text-muted-foreground">Prix ferme</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <Badge variant="secondary" className="bg-[#F3F4F6] text-[#062F28] rounded-full px-3 font-medium hover:bg-[#E5E7EB]">
                État : {product.condition}
              </Badge>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">Publié il y a 2 jours</span>
            </div>
          </div>

          {/* Seller Info */}
          <div className="flex items-center justify-between p-4 rounded-[24px] bg-[#F3F4F6] border border-transparent hover:border-[#9FE870]/20 transition-colors">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                <AvatarImage src={product.seller.avatar} />
                <AvatarFallback className="bg-[#062F28] font-bold text-white">
                  {product.seller.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-[#062F28]">{product.seller.name}</p>
                <div className="flex items-center gap-1 text-xs text-[#062F28]/70">
                  <ShieldCheck className="h-3 w-3 text-[#9FE870]" />
                  <span>Parent vérifié</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-full border-zinc-200 bg-white hover:bg-white text-[#062F28] font-medium shadow-sm">
              Voir le profil
            </Button>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg text-[#062F28]">Description</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              <br /><br />
              Manuel en parfait état, très peu utilisé. Couverture intacte, aucune annotation à l&apos;intérieur. Idéal pour la rentrée prochaine.
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#F9FAFB]">
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-bold">ISBN</p>
              <p className="font-medium text-[#062F28]">978-2-09-171775-2</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F9FAFB]">
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-bold">Éditeur</p>
              <p className="font-medium text-[#062F28]">Hachette Éducation</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F9FAFB]">
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-bold">Année</p>
              <p className="font-medium text-[#062F28]">2023</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F9FAFB]">
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-bold">Niveau</p>
              <p className="font-medium text-[#062F28]">Collège / 6ème</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 p-6 bg-white/80 backdrop-blur-md border-t border-zinc-100 pb-8">
          <Button className="w-full rounded-full h-14 text-lg font-bold shadow-lg shadow-[#062F28]/20 bg-[#062F28] text-white hover:bg-[#062F28]/90 transition-all transform hover:scale-[1.02]">
            <MessageCircle className="mr-2 h-5 w-5" />
            Contacter le vendeur
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-4">
            Paiement sécurisé et remise en main propre disponible à l&apos;école.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
