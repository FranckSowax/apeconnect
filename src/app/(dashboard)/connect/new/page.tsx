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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/connect">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Signaler une absence</h1>
            <p className="text-muted-foreground">
              Declarez une absence pour votre enfant
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground mb-4">
              Vous devez d&apos;abord ajouter un enfant avant de pouvoir signaler une absence.
            </p>
            <Button asChild>
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/connect">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Signaler une absence</h1>
          <p className="text-muted-foreground">
            Declarez une absence pour votre enfant
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nouvelle demande d&apos;absence</CardTitle>
          <CardDescription>
            Remplissez le formulaire ci-dessous pour signaler une absence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Selection */}
            <div className="space-y-2">
              <Label htmlFor="student">Eleve *</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Selectionnez un eleve" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.full_name} {student.class_name && `- ${student.class_name}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Selection */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Date de debut *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: fr }) : "Selectionnez une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Date de fin (optionnel)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP", { locale: fr }) : "Selectionnez une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      locale={fr}
                      disabled={(d) => (date ? d < date : false)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Reason Selection */}
            <div className="space-y-2">
              <Label htmlFor="reason">Motif *</Label>
              <Select value={reasonType} onValueChange={setReasonType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selectionnez un motif" />
                </SelectTrigger>
                <SelectContent>
                  {ABSENCE_REASONS.map((reason) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Custom Reason Text */}
            {reasonType === "autre" && (
              <div className="space-y-2">
                <Label htmlFor="reasonText">Preciser le motif *</Label>
                <Textarea
                  id="reasonText"
                  value={reasonText}
                  onChange={(e) => setReasonText(e.target.value)}
                  placeholder="Decrivez le motif de l'absence..."
                  rows={3}
                />
              </div>
            )}

            {/* File Upload */}
            <div className="space-y-2">
              <Label>Justificatif (optionnel)</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                {file ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Glissez un fichier ici ou cliquez pour parcourir
                    </p>
                    <p className="text-xs text-muted-foreground">
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
                      className="mt-4"
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
              <Button type="button" variant="outline" className="w-full sm:w-auto" asChild>
                <Link href="/connect">Annuler</Link>
              </Button>
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-[#2D5016] hover:bg-[#4A7C23]">
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
