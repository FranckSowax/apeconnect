import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
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
        <div className="relative h-72 w-full bg-secondary/10">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover"
          />
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-4 right-4 rounded-full bg-white/80 backdrop-blur-md hover:bg-white text-muted-foreground hover:text-destructive"
          >
            <Heart className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-4 right-16 rounded-full bg-white/80 backdrop-blur-md hover:bg-white text-muted-foreground hover:text-primary"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header Info */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <Badge variant="outline" className="mb-2 border-accent-blue text-accent-blue bg-accent-blue/10">
                  {product.category}
                </Badge>
                <h2 className="font-hagrid text-2xl font-bold leading-tight">{product.title}</h2>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="block font-bold text-2xl text-[#2D5016]">
                  {product.price.toLocaleString()} FCFA
                </span>
                <span className="text-sm text-muted-foreground">Prix ferme</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                État : {product.condition}
              </Badge>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">Publié il y a 2 jours</span>
            </div>
          </div>

          {/* Seller Info */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/10 border border-secondary/20">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-white">
                <AvatarImage src={product.seller.avatar} />
                <AvatarFallback className="bg-accent-yellow/50 font-bold text-primary">
                  {product.seller.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-sm">{product.seller.name}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3 w-3 text-accent-green" />
                  <span>Parent vérifié</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-full">
              Voir le profil
            </Button>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-hagrid text-lg font-bold">Description</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              <br /><br />
              Manuel en parfait état, très peu utilisé. Couverture intacte, aucune annotation à l'intérieur. Idéal pour la rentrée prochaine.
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-background border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">ISBN</p>
              <p className="font-medium">978-2-09-171775-2</p>
            </div>
            <div className="p-4 rounded-2xl bg-background border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Éditeur</p>
              <p className="font-medium">Hachette Éducation</p>
            </div>
            <div className="p-4 rounded-2xl bg-background border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Année</p>
              <p className="font-medium">2023</p>
            </div>
            <div className="p-4 rounded-2xl bg-background border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Niveau</p>
              <p className="font-medium">Collège / 6ème</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 p-6 bg-white border-t border-border/50 pb-8">
          <Button className="w-full rounded-full h-12 text-lg font-bold shadow-lg bg-primary text-primary-foreground hover:bg-primary/90">
            <MessageCircle className="mr-2 h-5 w-5" />
            Contacter le vendeur
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-3">
            Paiement sécurisé et remise en main propre disponible à l'école.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
