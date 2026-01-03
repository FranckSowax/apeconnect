"use client";

import { useState } from "react";
import { ProductCard, Product } from "@/components/shop/ProductCard";
import { ProductDetailsSheet } from "@/components/shop/ProductDetailsSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Plus,
  SlidersHorizontal,
  BookOpen,
  Shirt,
  GraduationCap,
  Backpack,
  Pencil,
  MoreHorizontal,
  TrendingUp,
  ChevronDown,
  Laptop,
  GraduationCap as TutorIcon,
  Car,
  UtensilsCrossed,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";

// Categories avec icônes
const CATEGORIES = [
  { id: "all", label: "Tout", icon: MoreHorizontal, color: "bg-secondary" },
  { id: "manuels", label: "Manuels", icon: BookOpen, color: "bg-[#2D5016]/10" },
  { id: "uniformes", label: "Uniformes", icon: Shirt, color: "bg-[#F7D66E]/20" },
  { id: "toges", label: "Toges", icon: GraduationCap, color: "bg-[#FFB2DD]/20" },
  { id: "sacs", label: "Sacs", icon: Backpack, color: "bg-[#B6CAEB]/20" },
  { id: "fournitures", label: "Fournitures", icon: Pencil, color: "bg-[#9AAB65]/20" },
  { id: "numerique", label: "Numérique", icon: Laptop, color: "bg-[#60A5FA]/20" },
  { id: "services", label: "Services", icon: TutorIcon, color: "bg-[#A78BFA]/20" },
  { id: "covoiturage", label: "Covoiturage", icon: Car, color: "bg-[#34D399]/20" },
  { id: "restauration", label: "Restauration", icon: UtensilsCrossed, color: "bg-[#FB923C]/20" },
];

// Dummy data avec catégories variées et prix en FCFA
const DUMMY_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Manuel de Mathématiques 6ème - Collection Phare",
    price: 7500,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop",
    condition: "Très bon",
    category: "Manuels",
    seller: { name: "Sophie M.", avatar: "" },
  },
  {
    id: "2",
    title: "Uniforme Scolaire Complet - Taille M",
    price: 15000,
    image: "https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?q=80&w=1000&auto=format&fit=crop",
    condition: "Neuf",
    category: "Uniformes",
    seller: { name: "Thomas L.", avatar: "" },
  },
  {
    id: "3",
    title: "Toge de Cérémonie Bleue - Terminale",
    price: 25000,
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000&auto=format&fit=crop",
    condition: "Très bon",
    category: "Toges",
    seller: { name: "Marie D.", avatar: "" },
  },
  {
    id: "4",
    title: "Sac à dos scolaire - Grande capacité",
    price: 12000,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop",
    condition: "Bon",
    category: "Sacs",
    seller: { name: "Lucas P.", avatar: "" },
  },
  {
    id: "5",
    title: "Histoire-Géographie 4ème - Magnard",
    price: 6000,
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1000&auto=format&fit=crop",
    condition: "Bon",
    category: "Manuels",
    seller: { name: "Camille B.", avatar: "" },
  },
  {
    id: "6",
    title: "Kit Fournitures Complet - Rentrée",
    price: 8500,
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1000&auto=format&fit=crop",
    condition: "Neuf",
    category: "Fournitures",
    seller: { name: "Antoine R.", avatar: "" },
  },
  {
    id: "7",
    title: "Chemise Blanche Uniforme - Taille L",
    price: 5000,
    image: "https://images.unsplash.com/photo-1598032895397-b9472444bf93?q=80&w=1000&auto=format&fit=crop",
    condition: "Très bon",
    category: "Uniformes",
    seller: { name: "Emma T.", avatar: "" },
  },
  {
    id: "8",
    title: "Physique-Chimie Terminale S",
    price: 9000,
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1000&auto=format&fit=crop",
    condition: "Bon",
    category: "Manuels",
    seller: { name: "Paul M.", avatar: "" },
  },
  {
    id: "9",
    title: "Tablette Samsung Galaxy Tab A7 - 32Go",
    price: 85000,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1000&auto=format&fit=crop",
    condition: "Très bon",
    category: "Numérique",
    seller: { name: "David K.", avatar: "" },
  },
  {
    id: "10",
    title: "Clé USB 64Go - Idéal cours",
    price: 8000,
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?q=80&w=1000&auto=format&fit=crop",
    condition: "Neuf",
    category: "Numérique",
    seller: { name: "Léa F.", avatar: "" },
  },
  {
    id: "11",
    title: "Cours particuliers Maths - Niveau Collège",
    price: 15000,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1000&auto=format&fit=crop",
    condition: "Neuf",
    category: "Services",
    seller: { name: "Prof. Martin", avatar: "" },
  },
  {
    id: "12",
    title: "Soutien scolaire Français - Primaire",
    price: 12000,
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1000&auto=format&fit=crop",
    condition: "Neuf",
    category: "Services",
    seller: { name: "Mme Dupont", avatar: "" },
  },
  {
    id: "13",
    title: "Covoiturage Libreville - Lycée Melen",
    price: 2500,
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1000&auto=format&fit=crop",
    condition: "Neuf",
    category: "Covoiturage",
    seller: { name: "Jean-Pierre A.", avatar: "" },
  },
  {
    id: "14",
    title: "Trajet quotidien Owendo - École Saint-Exupéry",
    price: 3000,
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop",
    condition: "Neuf",
    category: "Covoiturage",
    seller: { name: "Marie-Claire B.", avatar: "" },
  },
  {
    id: "15",
    title: "Goûters groupés - 20 parts/semaine",
    price: 25000,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop",
    condition: "Neuf",
    category: "Restauration",
    seller: { name: "Traiteur Mama", avatar: "" },
  },
  {
    id: "16",
    title: "Box déjeuner équilibré - Enfants",
    price: 3500,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop",
    condition: "Neuf",
    category: "Restauration",
    seller: { name: "Chef Cuisine", avatar: "" },
  },
];

export default function ShopPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = DUMMY_PRODUCTS.filter((product) => {
    const matchesCategory = activeCategory === "all" || product.category.toLowerCase() === activeCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-8">
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-white border-0 shadow-sm rounded-3xl overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Annonces actives</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">156</span>
                  <Badge className="bg-[#2D5016]/10 text-[#2D5016] border-0 rounded-full text-xs">
                    +12%
                  </Badge>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-[#F7D66E]/20 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-[#F7D66E]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm rounded-3xl overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Ventes ce mois</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">48</span>
                  <Badge className="bg-[#2D5016]/10 text-[#2D5016] border-0 rounded-full text-xs">
                    +8%
                  </Badge>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-[#2D5016]/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-[#2D5016]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#2D5016] to-[#4A7C23] border-0 shadow-sm rounded-3xl overflow-hidden sm:col-span-2 lg:col-span-1">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80 font-medium mb-1">Publier une annonce</p>
                <p className="text-white font-bold">Vendez vos articles</p>
              </div>
              <Link href="/shop/new">
                <Button size="icon" className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 text-white">
                  <Plus className="h-6 w-6" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="bg-white border-0 shadow-sm rounded-3xl overflow-hidden">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher un article..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-2xl border-0 bg-secondary/30 text-base focus:bg-secondary/50 transition-colors"
              />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-0 bg-secondary/30 hover:bg-secondary/50">
                  <SlidersHorizontal className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-80 border-l-border/50">
                <div className="space-y-6 mt-6">
                  <h3 className="font-bold text-lg">Filtres</h3>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-muted-foreground">Prix</p>
                    <div className="flex gap-2 flex-wrap">
                      <Button variant="outline" size="sm" className="rounded-full">0 - 5000 FCFA</Button>
                      <Button variant="outline" size="sm" className="rounded-full">5000 - 15000 FCFA</Button>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button variant="outline" size="sm" className="rounded-full">15000 - 30000 FCFA</Button>
                      <Button variant="outline" size="sm" className="rounded-full">30000+ FCFA</Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-muted-foreground">État</p>
                    <div className="flex flex-wrap gap-2">
                      {["Neuf", "Très bon", "Bon", "Satisfaisant"].map((condition) => (
                        <Button key={condition} variant="outline" size="sm" className="rounded-full">
                          {condition}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full rounded-full bg-[#2D5016] hover:bg-[#4A7C23]">
                    Appliquer les filtres
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all ${
                isActive
                  ? "bg-foreground text-white shadow-md"
                  : "bg-white text-muted-foreground hover:bg-secondary/50 shadow-sm"
              }`}
            >
              <Icon className="h-4 w-4" />
              {category.label}
            </button>
          );
        })}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-bold text-foreground">{filteredProducts.length}</span> articles trouvés
        </p>
        <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground gap-1">
          Trier par <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => setSelectedProduct(product)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <Card className="bg-white border-0 shadow-sm rounded-3xl">
          <CardContent className="p-12 text-center">
            <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-lg mb-2">Aucun article trouvé</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Essayez de modifier vos critères de recherche
            </p>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
              }}
            >
              Réinitialiser les filtres
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Load More */}
      {filteredProducts.length > 0 && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            className="rounded-full px-8 h-12 border-2 hover:bg-[#2D5016]/10 hover:border-[#2D5016] hover:text-[#2D5016] font-medium"
          >
            Charger plus d&apos;articles
          </Button>
        </div>
      )}

      <ProductDetailsSheet
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
