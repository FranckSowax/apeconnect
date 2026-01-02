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
import { ArrowLeft, Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/shop">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Publier une annonce</h1>
          <p className="text-muted-foreground">
            Vendez vos manuels scolaires
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nouvelle annonce</CardTitle>
          <CardDescription>
            Remplissez les informations ci-dessous pour creer votre annonce
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photos */}
            <div className="space-y-2">
              <Label>Photos *</Label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                {photoPreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={preview}
                      alt={`Photo ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={() => removePhoto(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {photos.length < 5 && (
                  <label className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition-colors">
                    <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground">Ajouter</span>
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
              <p className="text-xs text-muted-foreground">
                Ajoutez jusqu&apos;a 5 photos (max 5 Mo chacune)
              </p>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Titre de l&apos;annonce *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Manuel de Mathematiques 3eme"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Decrivez l'etat du livre, les annotations eventuelles..."
                rows={4}
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Prix (FCFA) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="5000"
                min={0}
                required
              />
            </div>

            {/* Subject, Level, Condition */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="subject">Matiere *</Label>
                <Select
                  value={formData.subject}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, subject: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((subject) => (
                      <SelectItem key={subject.value} value={subject.value}>
                        {subject.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Niveau *</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, level: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Etat</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, condition: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONDITIONS.map((condition) => (
                      <SelectItem key={condition.value} value={condition.value}>
                        {condition.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/shop">Annuler</Link>
              </Button>
              <Button type="submit" disabled={isLoading}>
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
