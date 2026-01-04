"use client";

import { useState } from "react";
import { useStudents } from "@/contexts/StudentContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, User, GraduationCap, BookOpen } from "lucide-react";
import { toast } from "sonner";
import type { Student } from "@/types";

export default function ChildrenPage() {
  const { user } = useAuth();
  const { students, loading, addStudent, updateStudent, deleteStudent, currentStudent, setCurrentStudent } = useStudents();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    class_name: "",
    level: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData({ full_name: "", class_name: "", level: "" });
    setEditingStudent(null);
  };

  const handleOpenAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const handleOpenEditDialog = (student: Student) => {
    setFormData({
      full_name: student.full_name,
      class_name: student.class_name || "",
      level: student.level || "",
    });
    setEditingStudent(student);
  };

  const handleSubmit = async () => {
    if (!formData.full_name.trim()) {
      toast.error("Le nom de l'enfant est requis");
      return;
    }

    setIsSubmitting(true);

    if (editingStudent) {
      // Update existing student
      const { error } = await updateStudent(editingStudent.id, {
        full_name: formData.full_name.trim(),
        class_name: formData.class_name.trim() || null,
        level: formData.level.trim() || null,
      });

      if (error) {
        toast.error("Erreur lors de la modification");
        console.error(error);
      } else {
        toast.success("Enfant modifié avec succès");
        setEditingStudent(null);
        resetForm();
      }
    } else {
      // Add new student
      const { error } = await addStudent({
        full_name: formData.full_name.trim(),
        class_name: formData.class_name.trim() || null,
        level: formData.level.trim() || null,
        establishment_id: user?.establishment_id || "",
      });

      if (error) {
        toast.error("Erreur lors de l'ajout");
        console.error(error);
      } else {
        toast.success("Enfant ajouté avec succès");
        setIsAddDialogOpen(false);
        resetForm();
      }
    }

    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await deleteStudent(id);
    if (error) {
      toast.error("Erreur lors de la suppression");
      console.error(error);
    } else {
      toast.success("Enfant supprimé avec succès");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mes Enfants</h1>
          <p className="text-muted-foreground">
            Gérez les informations de vos enfants scolarisés
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenAddDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Ajouter un enfant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un enfant</DialogTitle>
              <DialogDescription>
                Renseignez les informations de votre enfant
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nom complet *</Label>
                <Input
                  id="full_name"
                  placeholder="Prénom et Nom"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class_name">Classe</Label>
                <Input
                  id="class_name"
                  placeholder="Ex: 4ème B"
                  value={formData.class_name}
                  onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Niveau</Label>
                <Input
                  id="level"
                  placeholder="Ex: Collège"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Ajout..." : "Ajouter"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Students List */}
      {students.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Aucun enfant enregistré</h3>
            <p className="text-muted-foreground text-center mb-4">
              Ajoutez vos enfants pour commencer à gérer leurs absences et suivre leur scolarité.
            </p>
            <Button onClick={handleOpenAddDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Ajouter mon premier enfant
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => (
            <Card
              key={student.id}
              className={`relative transition-all cursor-pointer hover:shadow-md ${
                currentStudent?.id === student.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setCurrentStudent(student)}
            >
              {currentStudent?.id === student.id && (
                <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                  Sélectionné
                </div>
              )}
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{student.full_name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      {student.class_name && (
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" />
                          {student.class_name}
                        </span>
                      )}
                      {student.level && (
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {student.level}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Dialog open={editingStudent?.id === student.id} onOpenChange={(open) => {
                    if (!open) {
                      setEditingStudent(null);
                      resetForm();
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditDialog(student);
                        }}
                      >
                        <Pencil className="h-3 w-3" />
                        Modifier
                      </Button>
                    </DialogTrigger>
                    <DialogContent onClick={(e) => e.stopPropagation()}>
                      <DialogHeader>
                        <DialogTitle>Modifier l'enfant</DialogTitle>
                        <DialogDescription>
                          Modifiez les informations de votre enfant
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit_full_name">Nom complet *</Label>
                          <Input
                            id="edit_full_name"
                            placeholder="Prénom et Nom"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit_class_name">Classe</Label>
                          <Input
                            id="edit_class_name"
                            placeholder="Ex: 4ème B"
                            value={formData.class_name}
                            onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit_level">Niveau</Label>
                          <Input
                            id="edit_level"
                            placeholder="Ex: Collège"
                            value={formData.level}
                            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => {
                          setEditingStudent(null);
                          resetForm();
                        }}>
                          Annuler
                        </Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                          {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer cet enfant ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action est irréversible. Toutes les données associées à {student.full_name} seront supprimées.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(student.id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
