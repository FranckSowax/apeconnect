"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Moon, Sun, Globe, Bell, Shield, Smartphone, Mail } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 px-4 sm:px-6">
      <div className="space-y-2">
        <h1 className="font-hagrid text-2xl sm:text-3xl font-bold text-foreground">
          Paramètres
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Gérez vos préférences de l'application
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <div className="flex justify-start mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <TabsList className="bg-white border border-border/50 p-1 rounded-full shadow-sm w-auto inline-flex">
            <TabsTrigger 
              value="general" 
              className="rounded-full px-4 sm:px-6 data-[state=active]:bg-secondary data-[state=active]:text-foreground text-sm whitespace-nowrap"
            >
              Général
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="rounded-full px-4 sm:px-6 data-[state=active]:bg-secondary data-[state=active]:text-foreground text-sm whitespace-nowrap"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger 
              value="privacy" 
              className="rounded-full px-4 sm:px-6 data-[state=active]:bg-secondary data-[state=active]:text-foreground text-sm whitespace-nowrap"
            >
              Confidentialité
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="general" className="space-y-6">
          <Card className="border-border/50 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5" />
                Apparence
              </CardTitle>
              <CardDescription>Personnalisez l'interface de l'application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Mode Sombre</Label>
                  <p className="text-sm text-muted-foreground">
                    Basculer entre le thème clair et sombre
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Langue et Région
              </CardTitle>
              <CardDescription>Définissez vos préférences régionales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Langue</Label>
                <Select defaultValue="fr">
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Sélectionner une langue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-border/50 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Préférences de notification
              </CardTitle>
              <CardDescription>Gérez comment vous recevez nos alertes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/20 rounded-full">
                    <Smartphone className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-base">Notifications Push</Label>
                    <p className="text-sm text-muted-foreground">Sur votre appareil mobile</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/20 rounded-full">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-base">Emails</Label>
                    <p className="text-sm text-muted-foreground">Résumé quotidien et alertes</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card className="border-border/50 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Sécurité
              </CardTitle>
              <CardDescription>Protégez votre compte et vos données</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Double authentification</Label>
                  <p className="text-sm text-muted-foreground">
                    Ajouter une couche de sécurité supplémentaire
                  </p>
                </div>
                <Switch />
              </div>
              <div className="pt-4">
                <Button variant="outline" className="w-full sm:w-auto">
                  Changer le mot de passe
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
