import Link from "next/link";
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
  subject: string;
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
      className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-border/50 bg-white cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-[4/5] relative overflow-hidden bg-secondary/10">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-muted-foreground hover:text-destructive shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className="h-4 w-4" />
        </Button>
        <Badge 
          className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-foreground hover:bg-white shadow-sm font-medium border-0"
        >
          {product.condition}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="text-xs font-medium text-accent-blue uppercase tracking-wider">
              {product.subject}
            </span>
            <h3 className="font-hagrid text-lg font-bold leading-tight mt-1 line-clamp-2">
              {product.title}
            </h3>
          </div>
          <span className="font-hagrid text-xl font-bold text-accent-green whitespace-nowrap">
            {product.price}€
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
          <div className="h-5 w-5 rounded-full bg-accent-yellow/50 flex items-center justify-center text-[10px] font-bold text-primary">
            {product.seller.name.charAt(0)}
          </div>
          <span className="truncate">Vendu par {product.seller.name}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium h-10 shadow-sm group-hover:shadow-md transition-all">
          <MessageCircle className="mr-2 h-4 w-4" />
          Contacter
        </Button>
      </CardFooter>
    </Card>
  );
}
