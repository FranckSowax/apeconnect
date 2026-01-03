"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Upload, Loader2, ArrowLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { Student } from "@/types";

const ABSENCE_REASONS = [
  { value: "maladie", label: "Maladie" },
  { value: "rdv_medical", label: "Rendez-vous medical" },
  { value: "famille", label: "Raison familiale" },
  { value: "voyage", label: "Voyage" },
  { value: "autre", label: "Autre" },
];

export default function NewAbsencePage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [date, setDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [reasonType, setReasonType] = useState<string>("");
  const [reasonText, setReasonText] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("parent_id", user.id);

      if (error) {
        toast.error("Erreur lors du chargement des eleves");
        console.error(error);
      } else {
        setStudents(data || []);
      }
      setIsLoadingStudents(false);
    };

    fetchStudents();
  }, [user, supabase]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("Type de fichier non supporte. Utilisez JPG, PNG ou PDF.");
      return;
    }

    // Validate file size (5MB max)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("Le fichier est trop volumineux. Maximum 5 Mo.");
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStudent || !date || !reasonType) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsLoading(true);

    try {
      // Create absence record
      const { data: absence, error: absenceError } = await supabase
        .from("absences")
        .insert({
          user_id: user?.id,
          student_id: selectedStudent,
          date: format(date, "yyyy-MM-dd"),
          end_date: endDate ? format(endDate, "yyyy-MM-dd") : null,
          reason_text: reasonType === "autre" ? reasonText : ABSENCE_REASONS.find(r => r.value === reasonType)?.label,
          status: "pending",
        })
        .select()
        .single();

      if (absenceError) throw absenceError;

      // Upload justification if provided
      if (file && absence) {
        const fileExt = file.name.split(".").pop();
        const filePath = `${user?.id}/${absence.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("absence-justifications")
          .upload(filePath, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
        } else {
          // Save justification record
          await supabase.from("absence_justifications").insert({
            absence_id: absence.id,
            file_path: filePath,
            file_type: file.type,
            file_size: file.size,
          });
        }
      }

      toast.success("Demande d'absence envoyee avec succes");
      router.push("/connect/history");
    } catch (error) {
      console.error("Error submitting absence:", error);
      toast.error("Une erreur est survenue lors de l'envoi");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingStudents) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#062F28]" />
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-white bg-white/50" asChild>
            <Link href="/connect">
              <ArrowLeft className="h-5 w-5 text-[#062F28]" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#062F28]">Signaler une absence</h1>
            <p className="text-muted-foreground text-sm">
              Déclarez une absence pour votre enfant
            </p>
          </div>
        </div>

        <Card className="border-0 shadow-sm rounded-[32px] bg-white text-center">
          <CardContent className="py-16">
            <p className="text-muted-foreground mb-6">
              Vous devez d&apos;abord ajouter un enfant avant de pouvoir signaler une absence.
            </p>
            <Button asChild className="rounded-full bg-[#062F28] text-white hover:bg-[#062F28]/90 font-bold h-12 px-8">
              <Link href="/settings/students">
                Ajouter un enfant
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-8">
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white bg-white/50" asChild>
          <Link href="/connect">
            <ArrowLeft className="h-5 w-5 text-[#062F28]" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[#062F28]">Signaler une absence</h1>
          <p className="text-muted-foreground text-sm">
            Déclarez une absence pour votre enfant
          </p>
        </div>
      </div>

      <Card className="border-0 shadow-sm rounded-[32px] bg-white overflow-hidden">
        <CardHeader className="bg-[#F9FAFB] border-b border-[#F3F4F6] p-8">
          <CardTitle className="text-[#062F28] font-bold">Nouvelle demande d&apos;absence</CardTitle>
          <CardDescription>
            Remplissez le formulaire ci-dessous pour signaler une absence
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Student Selection */}
            <div className="space-y-2">
              <Label htmlFor="student" className="font-semibold text-[#062F28]">Élève *</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger className="rounded-2xl border-0 bg-[#F9FAFB] h-12 focus:ring-2 focus:ring-[#9FE870] focus:bg-white transition-all">
                  <SelectValue placeholder="Sélectionnez un élève" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-[#E5E7EB]">
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id} className="rounded-lg focus:bg-[#F9FAFB]">
                      {student.full_name} {student.class_name && `- ${student.class_name}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Selection */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="font-semibold text-[#062F28]">Date de début *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal rounded-2xl border-0 bg-[#F9FAFB] h-12 focus:ring-2 focus:ring-[#9FE870] focus:bg-white transition-all",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: fr }) : "Sélectionnez une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-2xl border-0 shadow-xl" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      locale={fr}
                      className="rounded-2xl bg-white p-4"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="font-semibold text-[#062F28]">Date de fin (optionnel)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal rounded-2xl border-0 bg-[#F9FAFB] h-12 focus:ring-2 focus:ring-[#9FE870] focus:bg-white transition-all",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP", { locale: fr }) : "Sélectionnez une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-2xl border-0 shadow-xl" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      locale={fr}
                      disabled={(d) => (date ? d < date : false)}
                      className="rounded-2xl bg-white p-4"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Reason Selection */}
            <div className="space-y-2">
              <Label htmlFor="reason" className="font-semibold text-[#062F28]">Motif *</Label>
              <Select value={reasonType} onValueChange={setReasonType}>
                <SelectTrigger className="rounded-2xl border-0 bg-[#F9FAFB] h-12 focus:ring-2 focus:ring-[#9FE870] focus:bg-white transition-all">
                  <SelectValue placeholder="Sélectionnez un motif" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-[#E5E7EB]">
                  {ABSENCE_REASONS.map((reason) => (
                    <SelectItem key={reason.value} value={reason.value} className="rounded-lg focus:bg-[#F9FAFB]">
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Custom Reason Text */}
            {reasonType === "autre" && (
              <div className="space-y-2">
                <Label htmlFor="reasonText" className="font-semibold text-[#062F28]">Préciser le motif *</Label>
                <Textarea
                  id="reasonText"
                  value={reasonText}
                  onChange={(e) => setReasonText(e.target.value)}
                  placeholder="Décrivez le motif de l'absence..."
                  rows={3}
                  className="rounded-2xl border-0 bg-[#F9FAFB] min-h-[100px] focus:ring-2 focus:ring-[#9FE870] focus:bg-white transition-all resize-none p-4"
                />
              </div>
            )}

            {/* File Upload */}
            <div className="space-y-2">
              <Label className="font-semibold text-[#062F28]">Justificatif (optionnel)</Label>
              <div className="border-2 border-dashed border-[#E5E7EB] rounded-2xl p-8 text-center hover:bg-[#F9FAFB] hover:border-[#9FE870] transition-all group">
                {file ? (
                  <div className="flex items-center justify-center gap-2 bg-[#F3F4F6] p-2 rounded-xl inline-flex">
                    <span className="text-sm font-medium text-[#062F28]">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full hover:bg-white"
                      onClick={() => setFile(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="h-12 w-12 rounded-full bg-[#F3F4F6] flex items-center justify-center mx-auto mb-3 group-hover:bg-[#9FE870]/20 transition-colors">
                       <Upload className="h-6 w-6 text-muted-foreground group-hover:text-[#062F28]" />
                    </div>
                    <p className="text-sm text-[#062F28] font-medium mb-1">
                      Glissez un fichier ici ou cliquez pour parcourir
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      JPG, PNG ou PDF (max 5 Mo)
                    </p>
                    <Input
                      type="file"
                      className="hidden"
                      id="file-upload"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleFileChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full border-zinc-200 hover:bg-white text-[#062F28]"
                      onClick={() => document.getElementById("file-upload")?.click()}
                    >
                      Choisir un fichier
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
              <Button type="button" variant="outline" className="w-full sm:w-auto rounded-full h-12 border-0 bg-[#F3F4F6] text-[#062F28] hover:bg-[#E5E7EB] font-bold" asChild>
                <Link href="/connect">Annuler</Link>
              </Button>
              <Button type="submit" disabled={isLoading} className="w-full sm:flex-1 rounded-full h-12 bg-[#062F28] text-white hover:bg-[#062F28]/90 font-bold shadow-lg shadow-[#062F28]/20">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Envoyer la demande
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
