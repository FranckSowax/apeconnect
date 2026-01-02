"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function ShopFilters() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl">Filtres</h2>
        <Button variant="ghost" size="sm" className="text-muted-foreground h-8 rounded-full">
          Effacer
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["category", "price", "condition"]} className="w-full">
        {/* Categories */}
        <AccordionItem value="category" className="border-b-border/50">
          <AccordionTrigger className="font-bold text-base hover:no-underline py-3">Catégories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-1 pb-4">
              {["Manuels", "Uniformes", "Toges", "Sacs", "Fournitures", "Numérique", "Services", "Covoiturage", "Restauration"].map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox id={`cat-${item}`} className="rounded-md border-input data-[state=checked]:bg-[#2D5016] data-[state=checked]:text-white border-muted-foreground/30" />
                  <Label htmlFor={`cat-${item}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                    {item}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price" className="border-b-border/50">
          <AccordionTrigger className="font-bold text-base hover:no-underline py-3">Prix</AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-6 px-1">
              <Slider defaultValue={[15000]} max={50000} step={1000} className="mb-4" />
              <div className="flex items-center justify-between text-sm font-medium">
                <span className="bg-white px-3 py-1 rounded-full border border-border">0 FCFA</span>
                <span className="bg-white px-3 py-1 rounded-full border border-border">50 000+ FCFA</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Condition */}
        <AccordionItem value="condition" className="border-none">
          <AccordionTrigger className="font-bold text-base hover:no-underline py-3">État</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-1 pb-4">
              {["Neuf", "Très bon", "Bon", "Satisfaisant"].map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox id={`cond-${item}`} className="rounded-md border-input data-[state=checked]:bg-[#2D5016] data-[state=checked]:text-white border-muted-foreground/30" />
                  <Label htmlFor={`cond-${item}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                    {item}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button className="w-full rounded-full bg-[#2D5016] hover:bg-[#4A7C23] font-medium shadow-md">
        Voir les résultats
      </Button>
    </div>
  );
}
