"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { CreditCard, User, Bell, Shield, LogOut, Camera, Plus } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-hagrid text-3xl md:text-4xl font-bold text-foreground">
          Mon Profil
        </h1>
        <p className="text-muted-foreground">
          Gérez vos informations personnelles et vos préférences
        </p>
      </div>

      {/* Main Profile Card */}
      <Card className="border-border/50 shadow-sm bg-white overflow-hidden">
        <div className="h-32 bg-accent-blue/20 w-full relative">
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full h-8 w-8 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <CardContent className="pt-16 pb-8 text-center space-y-4">
          <div>
            <h2 className="font-hagrid text-2xl font-bold">Jean Dupont</h2>
            <p className="text-muted-foreground">Parent d'élève • Lycée Classique</p>
          </div>
          <div className="flex justify-center gap-2">
            <Button variant="outline" className="rounded-full">
              Modifier le profil
            </Button>
            <Button variant="ghost" className="rounded-full text-destructive hover:text-destructive hover:bg-destructive/10">
              <LogOut className="h-4 w-4 mr-2" />
              Se déconnecter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Settings Tabs */}
      <Tabs defaultValue="account" className="w-full">
        <div className="flex justify-center mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <TabsList className="bg-white border border-border/50 p-1 rounded-full shadow-sm w-auto inline-flex">
            <TabsTrigger value="account" className="rounded-full px-4 sm:px-6 data-[state=active]:bg-accent-yellow data-[state=active]:text-primary text-sm sm:text-base whitespace-nowrap">
              <User className="h-4 w-4 mr-2" />
              Compte
            </TabsTrigger>
            <TabsTrigger value="payment" className="rounded-full px-4 sm:px-6 data-[state=active]:bg-accent-green data-[state=active]:text-primary text-sm sm:text-base whitespace-nowrap">
              <CreditCard className="h-4 w-4 mr-2" />
              Paiement
            </TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-full px-4 sm:px-6 data-[state=active]:bg-accent-blue data-[state=active]:text-primary text-sm sm:text-base whitespace-nowrap">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          <Card className="border-border/50 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="font-hagrid text-xl">Informations Personnelles</CardTitle>
              <CardDescription>Mettez à jour vos coordonnées</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" defaultValue="Jean" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" defaultValue="Dupont" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="jean.dupont@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" type="tel" defaultValue="+225 07 07 07 07 07" />
              </div>
              <div className="pt-4 flex justify-end">
                <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Enregistrer les modifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment" className="space-y-6">
          <Card className="border-border/50 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="font-hagrid text-xl">Moyens de Paiement</CardTitle>
              <CardDescription>Gérez vos cartes et méthodes de paiement mobile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-2xl bg-secondary/5">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-16 bg-white rounded flex items-center justify-center border">
                      <span className="font-bold text-xs">VISA</span>
                    </div>
                    <div>
                      <p className="font-medium">Visa terminant par 4242</p>
                      <p className="text-sm text-muted-foreground">Expire le 12/2026</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="text-muted-foreground hover:text-destructive">
                    Supprimer
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-2xl bg-secondary/5">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-16 bg-orange-500 rounded flex items-center justify-center text-white">
                      <span className="font-bold text-xs">OM</span>
                    </div>
                    <div>
                      <p className="font-medium">Orange Money</p>
                      <p className="text-sm text-muted-foreground">+225 07 07 07 07 07</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="text-muted-foreground hover:text-destructive">
                    Supprimer
                  </Button>
                </div>
              </div>

              <Button variant="outline" className="w-full rounded-full border-dashed border-2 h-12">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un moyen de paiement
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-border/50 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="font-hagrid text-xl">Préférences de Notification</CardTitle>
              <CardDescription>Choisissez comment vous souhaitez être informé</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Notifications Push</Label>
                    <p className="text-sm text-muted-foreground">Recevoir des alertes sur votre mobile</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Emails Marketing</Label>
                    <p className="text-sm text-muted-foreground">Recevoir des offres et actualités</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Alertes Absences</Label>
                    <p className="text-sm text-muted-foreground">Notification immédiate pour toute absence</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Nouveaux messages Marketplace</Label>
                    <p className="text-sm text-muted-foreground">Lorsqu'un acheteur vous contacte</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
