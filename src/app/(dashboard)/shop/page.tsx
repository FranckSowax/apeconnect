"use client";

import { useState } from "react";
import { ProductCard, Product } from "@/components/shop/ProductCard";
import { ShopFilters } from "@/components/shop/ShopFilters";
import { ProductDetailsSheet } from "@/components/shop/ProductDetailsSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Dummy data for high-fidelity UI demonstration
const DUMMY_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Manuel de Mathématiques 6ème - Collection Phare",
    price: 15,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop",
    condition: "Très bon",
    subject: "Mathématiques",
    seller: {
      name: "Sophie M.",
      avatar: "",
    },
  },
  {
    id: "2",
    title: "Histoire-Géographie 4ème - Magnard",
    price: 12,
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1000&auto=format&fit=crop",
    condition: "Bon",
    subject: "Histoire-Géo",
    seller: {
      name: "Thomas L.",
      avatar: "",
    },
  },
  {
    id: "3",
    title: "English for Everyone - Level 2",
    price: 18,
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1000&auto=format&fit=crop",
    condition: "Neuf",
    subject: "Langues",
    seller: {
      name: "Marie D.",
      avatar: "",
    },
  },
  {
    id: "4",
    title: "SVT Cycle 4 - Bordas",
    price: 14,
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1000&auto=format&fit=crop",
    condition: "Satisfaisant",
    subject: "Sciences",
    seller: {
      name: "Lucas P.",
      avatar: "",
    },
  },
  {
    id: "5",
    title: "Français 3ème - Fleurs d'encre",
    price: 16,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000&auto=format&fit=crop",
    condition: "Très bon",
    subject: "Français",
    seller: {
      name: "Camille B.",
      avatar: "",
    },
  },
  {
    id: "6",
    title: "Physique-Chimie 5ème - Hachette",
    price: 13,
    image: "https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?q=80&w=1000&auto=format&fit=crop",
    condition: "Bon",
    subject: "Sciences",
    seller: {
      name: "Antoine R.",
      avatar: "",
    },
  },
];

export default function ShopPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-hagrid text-3xl md:text-4xl font-bold text-foreground">
            Le Marketplace
          </h1>
          <p className="text-muted-foreground mt-2">
            Achetez et vendez vos manuels scolaires entre parents
          </p>
        </div>
        <Button className="rounded-full bg-accent-yellow text-primary hover:bg-accent-yellow/90 font-medium px-6 h-12 shadow-md">
          <Plus className="mr-2 h-5 w-5" />
          Déposer une annonce
        </Button>
      </div>

      {/* Mobile Search & Filter Trigger */}
      <div className="md:hidden flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un livre..."
            className="pl-10 rounded-full border-0 bg-white shadow-sm"
          />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full bg-white shadow-sm border-0">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <ShopFilters />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden md:block md:col-span-3 lg:col-span-3">
          <div className="sticky top-24">
            <ShopFilters />
          </div>
        </aside>

        {/* Product Grid */}
        <div className="col-span-1 md:col-span-9 lg:col-span-9">
          {/* Desktop Search Bar */}
          <div className="hidden md:flex mb-6 relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher par titre, matière, ISBN..."
              className="pl-12 h-14 rounded-full border-0 bg-white shadow-sm text-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {DUMMY_PRODUCTS.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
          
          <div className="mt-12 flex justify-center">
            <Button variant="outline" className="rounded-full px-8 h-12 border-2 hover:bg-accent-blue/10 hover:border-accent-blue hover:text-accent-blue font-medium">
              Charger plus d'annonces
            </Button>
          </div>
        </div>
      </div>

      <ProductDetailsSheet 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </div>
  );
}
