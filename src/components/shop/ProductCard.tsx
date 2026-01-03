import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart, MessageCircle } from "lucide-react";
import Image from "next/image";

export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  condition: "Neuf" | "Très bon" | "Bon" | "Satisfaisant";
  category: string;
  seller: {
    name: string;
    avatar?: string;
  };
  isLiked?: boolean;
}

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <Card 
      className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white cursor-pointer rounded-[24px]"
      onClick={onClick}
    >
      <div className="aspect-[4/5] relative overflow-hidden bg-[#F3F4F6]">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-muted-foreground hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className="h-4 w-4" />
        </Button>
        <Badge 
          className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#062F28] hover:bg-white shadow-sm font-bold border-0 rounded-full"
        >
          {product.condition}
        </Badge>
      </div>
      
      <CardContent className="p-5 pb-2">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-[#9FE870] uppercase tracking-wider bg-[#062F28] px-2 py-0.5 rounded-full">
              {product.category}
            </span>
            <h3 className="text-base font-bold text-[#062F28] leading-tight mt-2 line-clamp-2">
              {product.title}
            </h3>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <span className="font-bold text-lg text-[#062F28]">
            {product.price.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">FCFA</span>
          </span>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-6 w-6 rounded-full bg-[#F3F4F6] flex items-center justify-center text-xs font-bold text-[#062F28] border border-white shadow-sm">
              {product.seller.name.charAt(0)}
            </div>
            <span className="truncate text-xs">{product.seller.name.split(' ')[0]}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-3">
        <Button className="w-full rounded-full bg-[#062F28] text-white hover:bg-[#062F28]/90 font-bold h-10 shadow-sm group-hover:shadow-md transition-all">
          <MessageCircle className="mr-2 h-4 w-4" />
          Contacter
        </Button>
      </CardFooter>
    </Card>
  );
}
