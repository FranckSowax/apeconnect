"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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

export default function NewAdPage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    subject: "",
    level: "",
    condition: "",
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validate
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} n'est pas une image valide`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} est trop volumineux (max 5 Mo)`);
        return false;
      }
      return true;
    });

    if (photos.length + validFiles.length > 5) {
      toast.error("Maximum 5 photos autorisees");
      return;
    }

    // Create previews
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setPhotos((prev) => [...prev, ...validFiles]);
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.price || !formData.subject || !formData.level) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (photos.length === 0) {
      toast.error("Veuillez ajouter au moins une photo");
      return;
    }

    setIsLoading(true);

    try {
      // Create ad record
      const { data: ad, error: adError } = await supabase
        .from("ads")
        .insert({
          user_id: user?.id,
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          subject: formData.subject,
          level: formData.level,
          condition: formData.condition,
          establishment_id: user?.establishment_id,
          status: "pending_review",
        })
        .select()
        .single();

      if (adError) throw adError;

      // Upload photos
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        const fileExt = photo.name.split(".").pop();
        const filePath = `${user?.id}/${ad.id}/${i}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("ad-photos")
          .upload(filePath, photo);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          continue;
        }

        // Save photo record
        await supabase.from("ad_photos").insert({
          ad_id: ad.id,
          file_path: filePath,
          file_type: photo.type,
          file_size: photo.size,
          order: i,
        });
      }

      toast.success("Annonce soumise avec succes", {
        description: "Votre annonce sera examinee avant publication.",
      });
      router.push("/shop/my-ads");
    } catch (error) {
      console.error("Error creating ad:", error);
      toast.error("Une erreur est survenue lors de la creation de l'annonce");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-8">
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white bg-white/50" asChild>
          <Link href="/shop">
            <ArrowLeft className="h-5 w-5 text-[#062F28]" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[#062F28]">Publier une annonce</h1>
          <p className="text-muted-foreground text-sm">
            Vendez vos manuels scolaires en quelques clics
          </p>
        </div>
      </div>

      <Card className="border-0 shadow-sm rounded-[32px] bg-white overflow-hidden">
        <CardHeader className="bg-[#F9FAFB] border-b border-[#F3F4F6] p-8">
          <CardTitle className="text-[#062F28] font-bold">Détails de l&apos;annonce</CardTitle>
          <CardDescription>
            Remplissez les informations ci-dessous pour créer votre annonce
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Photos */}
            <div className="space-y-4">
              <Label className="text-base font-semibold text-[#062F28]">Photos *</Label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                {photoPreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={preview}
                      alt={`Photo ${index + 1}`}
                      fill
                      className="object-cover rounded-2xl border border-zinc-100"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md"
                      onClick={() => removePhoto(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {photos.length < 5 && (
                  <label className="aspect-square border-2 border-dashed border-[#E5E7EB] rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-[#F9FAFB] hover:border-[#9FE870] transition-all group">
                    <div className="h-10 w-10 rounded-full bg-[#F3F4F6] flex items-center justify-center group-hover:bg-[#9FE870]/20 transition-colors mb-2">
                       <Upload className="h-5 w-5 text-muted-foreground group-hover:text-[#062F28]" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-[#062F28]">Ajouter</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </label>
                )}
              </div>
              <p className="text-xs text-muted-foreground bg-[#F9FAFB] p-3 rounded-xl inline-block">
                Astuce : Ajoutez jusqu&apos;à 5 photos claires pour vendre plus vite (max 5 Mo chacune).
              </p>
            </div>

            <div className="grid gap-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="font-semibold text-[#062F28]">Titre de l&apos;annonce *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ex: Manuel de Mathématiques 3ème"
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
                    placeholder="Décrivez l'état du livre, les annotations éventuelles..."
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
                    placeholder="5000"
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
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
              <Button type="button" variant="outline" className="w-full sm:w-auto rounded-full h-12 border-0 bg-[#F3F4F6] text-[#062F28] hover:bg-[#E5E7EB] font-bold" asChild>
                <Link href="/shop">Annuler</Link>
              </Button>
              <Button type="submit" disabled={isLoading} className="w-full sm:flex-1 rounded-full h-12 bg-[#062F28] text-white hover:bg-[#062F28]/90 font-bold shadow-lg shadow-[#062F28]/20">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Soumettre l&apos;annonce
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
