"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const SUBJECTS = [
  { value: "mathematiques", label: "Mathematiques" },
  { value: "francais", label: "Francais" },
  { value: "anglais", label: "Anglais" },
  { value: "physique", label: "Physique-Chimie" },
  { value: "svt", label: "SVT" },
  { value: "histoire-geo", label: "Histoire-Geographie" },
  { value: "philosophie", label: "Philosophie" },
  { value: "autre", label: "Autre" },
];

const LEVELS = [
  { value: "6eme", label: "6eme" },
  { value: "5eme", label: "5eme" },
  { value: "4eme", label: "4eme" },
  { value: "3eme", label: "3eme" },
  { value: "2nde", label: "2nde" },
  { value: "1ere", label: "1ere" },
  { value: "terminale", label: "Terminale" },
];

const CONDITIONS = [
  { value: "neuf", label: "Neuf" },
  { value: "tres-bon", label: "Tres bon etat" },
  { value: "bon", label: "Bon etat" },
  { value: "acceptable", label: "Acceptable" },
];

export default function EditAdPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    subject: "",
    level: "",
    condition: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchAd = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .eq("id", params.id)
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching ad:", error);
        toast.error("Impossible de charger l'annonce");
        router.push("/shop/my-ads");
      } else {
        setFormData({
          title: data.title,
          description: data.description || "",
          price: data.price.toString(),
          subject: data.subject || "",
          level: data.level || "",
          condition: data.condition || "",
        });
      }
      setIsLoading(false);
    };

    fetchAd();
  }, [params.id, user, router, supabase]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("ads")
        .update({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          subject: formData.subject,
          level: formData.level,
          condition: formData.condition,
          status: "pending_review", // Reset status to pending on edit
        })
        .eq("id", params.id);

      if (error) throw error;

      toast.success("Annonce mise à jour");
      router.push("/shop/my-ads");
    } catch (error) {
      console.error("Error updating ad:", error);
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#062F28]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-8">
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white bg-white/50" asChild>
          <Link href="/shop/my-ads">
            <ArrowLeft className="h-5 w-5 text-[#062F28]" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[#062F28]">Modifier l&apos;annonce</h1>
          <p className="text-muted-foreground text-sm">
            Mettez à jour les informations de votre article
          </p>
        </div>
      </div>

      <Card className="border-0 shadow-sm rounded-[32px] bg-white overflow-hidden">
        <CardHeader className="bg-[#F9FAFB] border-b border-[#F3F4F6] p-8">
          <CardTitle className="text-[#062F28] font-bold">Informations</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="font-semibold text-[#062F28]">Titre *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="rounded-2xl border-0 bg-[#F9FAFB] h-12 focus:ring-2 focus:ring-[#9FE870] focus:bg-white transition-all"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="font-semibold text-[#062F28]">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="rounded-2xl border-0 bg-[#F9FAFB] min-h-[120px] focus:ring-2 focus:ring-[#9FE870] focus:bg-white transition-all resize-none p-4"
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price" className="font-semibold text-[#062F28]">Prix (FCFA) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                min={0}
                required
                className="rounded-2xl border-0 bg-[#F9FAFB] h-12 focus:ring-2 focus:ring-[#9FE870] focus:bg-white transition-all"
              />
            </div>

            {/* Subject, Level, Condition */}
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="subject" className="font-semibold text-[#062F28]">Matière *</Label>
                <Select
                  value={formData.subject}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, subject: value }))
                  }
                >
                  <SelectTrigger className="rounded-2xl border-0 bg-[#F9FAFB] h-12 focus:ring-2 focus:ring-[#9FE870] focus:bg-white transition-all">
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-[#E5E7EB]">
                    {SUBJECTS.map((subject) => (
                      <SelectItem key={subject.value} value={subject.value} className="rounded-lg focus:bg-[#F9FAFB]">
                        {subject.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level" className="font-semibold text-[#062F28]">Niveau *</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, level: value }))
                  }
                >
                  <SelectTrigger className="rounded-2xl border-0 bg-[#F9FAFB] h-12 focus:ring-2 focus:ring-[#9FE870] focus:bg-white transition-all">
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-[#E5E7EB]">
                    {LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value} className="rounded-lg focus:bg-[#F9FAFB]">
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition" className="font-semibold text-[#062F28]">État</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, condition: value }))
                  }
                >
                  <SelectTrigger className="rounded-2xl border-0 bg-[#F9FAFB] h-12 focus:ring-2 focus:ring-[#9FE870] focus:bg-white transition-all">
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-[#E5E7EB]">
                    {CONDITIONS.map((condition) => (
                      <SelectItem key={condition.value} value={condition.value} className="rounded-lg focus:bg-[#F9FAFB]">
                        {condition.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
              <Button type="button" variant="outline" className="w-full sm:w-auto rounded-full h-12 border-0 bg-[#F3F4F6] text-[#062F28] hover:bg-[#E5E7EB] font-bold" asChild>
                <Link href="/shop/my-ads">Annuler</Link>
              </Button>
              <Button type="submit" disabled={isSaving} className="w-full sm:flex-1 rounded-full h-12 bg-[#062F28] text-white hover:bg-[#062F28]/90 font-bold shadow-lg shadow-[#062F28]/20">
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
