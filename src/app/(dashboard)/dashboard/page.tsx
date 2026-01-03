"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  TrendingUp,
  Plus,
  Bell,
  Calendar,
  Gift,
  ShoppingBag,
  Users,
  FileText,
  ChevronRight,
  Send,
  Megaphone,
  Vote,
  Eye,
  Heart,
} from "lucide-react";
import Link from "next/link";

// Types pour les données
interface Announcement {
  id: number;
  title: string;
  category: "urgent" | "info" | "event" | "admin";
  date: string;
  preview: string;
  read: boolean;
}

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  rsvpStatus: "confirmed" | "pending" | "declined" | null;
  participants: number;
}

interface LiaisonMessage {
  id: number;
  from: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
  type: "teacher" | "admin" | "cpe";
}

interface Child {
  id: number;
  name: string;
  class: string;
  absences: number;
  attendanceRate: number;
}

// Mock data
const announcements: Announcement[] = [
  { id: 1, title: "Réunion parents-profs", category: "event", date: "15 Jan", preview: "Réunion du 2ème trimestre le 20 janvier...", read: false },
  { id: 2, title: "Fermeture exceptionnelle", category: "urgent", date: "14 Jan", preview: "L'établissement sera fermé le...", read: false },
  { id: 3, title: "Nouvelle procédure absences", category: "admin", date: "12 Jan", preview: "À partir du 1er février, les justificatifs...", read: true },
];

const upcomingEvents: Event[] = [
  { id: 1, title: "Sortie pédagogique - Musée", date: "20 Jan", time: "8h30", rsvpStatus: null, participants: 24 },
  { id: 2, title: "Réunion parents-profs", date: "25 Jan", time: "17h00", rsvpStatus: "confirmed", participants: 45 },
  { id: 3, title: "Journée portes ouvertes", date: "02 Fév", time: "9h00", rsvpStatus: "pending", participants: 120 },
];

const liaisonMessages: LiaisonMessage[] = [
  { id: 1, from: "Mme Ondo", subject: "Comportement en classe", preview: "Je souhaite vous informer que...", date: "Aujourd'hui", read: false, type: "teacher" },
  { id: 2, from: "Administration", subject: "Cotisation APE", preview: "Rappel : la cotisation annuelle...", date: "Hier", read: true, type: "admin" },
];

const children: Child[] = [
  { id: 1, name: "Marie", class: "4ème B", absences: 2, attendanceRate: 96 },
  { id: 2, name: "Pierre", class: "6ème A", absences: 1, attendanceRate: 98 },
];

const recentAbsences = [
  { id: 1, student: "Marie", reason: "Rendez-vous médical", date: "15 Jan", status: "approved" },
  { id: 2, student: "Pierre", reason: "Maladie - Grippe", date: "12 Jan", status: "pending" },
];

export default function DashboardPage() {
  const { user, hasRole } = useAuth();
  const isAdmin = hasRole(["censeur", "admin", "super_admin"]);
  const [activeTab, setActiveTab] = useState<"all" | "urgent" | "events">("all");

  const getCategoryColor = (category: Announcement["category"]) => {
    switch (category) {
      case "urgent": return "bg-red-100 text-red-700 border-red-200";
      case "event": return "bg-[#B6CAEB]/30 text-[#2D5016] border-[#B6CAEB]";
      case "admin": return "bg-[#F7D66E]/20 text-[#B8860B] border-[#F7D66E]";
      default: return "bg-[#2D5016]/10 text-[#2D5016] border-[#2D5016]/20";
    }
  };

  const getCategoryLabel = (category: Announcement["category"]) => {
    switch (category) {
      case "urgent": return "Urgent";
      case "event": return "Événement";
      case "admin": return "Administratif";
      default: return "Information";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Bonjour, {user?.full_name?.split(" ")[0] || "Parent"} 👋
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-1">
            Voici un aperçu de la vie scolaire de vos enfants
          </p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Button variant="outline" size="sm" className="rounded-full gap-2 h-10 px-4">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
            <Badge className="bg-red-500 text-white text-[10px] px-1.5 py-0 h-5 min-w-5 rounded-full">3</Badge>
          </Button>
          <Button asChild className="rounded-full bg-[#2D5016] hover:bg-[#4A7C23] gap-2 h-10 px-4">
            <Link href="/connect/new">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Signaler absence</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Children Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {children.map((child) => (
          <Card key={child.id} className="bg-white border-0 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 bg-gradient-to-br from-[#2D5016] to-[#4A7C23]">
                    <AvatarFallback className="text-white font-bold">{child.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-foreground">{child.name}</h3>
                    <p className="text-sm text-muted-foreground">{child.class}</p>
                  </div>
                </div>
                <Badge className={`rounded-full ${child.attendanceRate >= 95 ? "bg-[#2D5016]/10 text-[#2D5016]" : "bg-[#F7D66E]/20 text-[#B8860B]"}`}>
                  {child.attendanceRate}% présence
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Absences ce mois</span>
                  <span className="font-medium">{child.absences}</span>
                </div>
                <Progress value={child.attendanceRate} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Announcements Section */}
        <Card className="bg-white border-0 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden lg:col-span-2">
          <CardHeader className="pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[#2D5016]/10 flex items-center justify-center">
                  <Megaphone className="h-4 w-4 text-[#2D5016]" />
                </div>
                <CardTitle className="text-base sm:text-lg font-bold">Tableau d'annonces</CardTitle>
              </div>
              <Button variant="ghost" size="sm" className="text-[#2D5016] hover:bg-[#2D5016]/5 rounded-full gap-1 text-sm">
                Voir tout <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mt-4 overflow-x-auto pb-1 -mx-1 px-1">
              {[
                { id: "all" as const, label: "Toutes" },
                { id: "urgent" as const, label: "Urgentes" },
                { id: "events" as const, label: "Événements" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-foreground text-white"
                      : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </CardHeader>

          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="space-y-3 mt-3">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={`p-4 rounded-xl sm:rounded-2xl transition-colors cursor-pointer ${
                    announcement.read ? "bg-secondary/10 hover:bg-secondary/20" : "bg-secondary/30 hover:bg-secondary/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge className={`rounded-full text-[10px] sm:text-xs border ${getCategoryColor(announcement.category)}`}>
                          {getCategoryLabel(announcement.category)}
                        </Badge>
                        {!announcement.read && (
                          <span className="h-2 w-2 rounded-full bg-[#2D5016]"></span>
                        )}
                      </div>
                      <h4 className="font-semibold text-sm sm:text-base text-foreground truncate">{announcement.title}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">{announcement.preview}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{announcement.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Calendar & Events Section */}
        <Card className="bg-white border-0 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden">
          <CardHeader className="pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[#F7D66E]/20 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-[#B8860B]" />
                </div>
                <CardTitle className="text-base sm:text-lg font-bold">Événements</CardTitle>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="space-y-3 mt-2">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="p-3 sm:p-4 rounded-xl bg-secondary/20 hover:bg-secondary/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm text-foreground line-clamp-1">{event.title}</h4>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <span>{event.date}</span>
                    <span>•</span>
                    <span>{event.time}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> {event.participants}
                    </span>
                  </div>
                  {event.rsvpStatus === null ? (
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 h-8 rounded-full bg-[#2D5016] hover:bg-[#4A7C23] text-xs">
                        Je participe
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 h-8 rounded-full text-xs">
                        Pas disponible
                      </Button>
                    </div>
                  ) : (
                    <Badge className={`rounded-full ${
                      event.rsvpStatus === "confirmed"
                        ? "bg-[#2D5016]/10 text-[#2D5016]"
                        : event.rsvpStatus === "pending"
                        ? "bg-[#F7D66E]/20 text-[#B8860B]"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {event.rsvpStatus === "confirmed" ? "Confirmé" : event.rsvpStatus === "pending" ? "En attente" : "Décliné"}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row: Liaison + Absences */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Carnet de Liaison */}
        <Card className="bg-white border-0 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden">
          <CardHeader className="pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[#B6CAEB]/30 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-[#2D5016]" />
                </div>
                <CardTitle className="text-base sm:text-lg font-bold">Carnet de liaison</CardTitle>
              </div>
              <Badge className="bg-[#2D5016] text-white rounded-full">
                {liaisonMessages.filter(m => !m.read).length} nouveau{liaisonMessages.filter(m => !m.read).length > 1 ? "x" : ""}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="space-y-3 mt-2">
              {liaisonMessages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-xl transition-colors cursor-pointer ${
                    message.read ? "bg-secondary/10 hover:bg-secondary/20" : "bg-secondary/30 hover:bg-secondary/40"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className={`${
                        message.type === "teacher" ? "bg-[#B6CAEB]" : message.type === "admin" ? "bg-[#F7D66E]" : "bg-[#FFB2DD]"
                      } text-[#2D5016] font-medium text-sm`}>
                        {message.from.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm text-foreground truncate">{message.from}</span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{message.date}</span>
                      </div>
                      <p className="font-medium text-sm text-foreground mt-0.5 truncate">{message.subject}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{message.preview}</p>
                    </div>
                    {!message.read && <span className="h-2 w-2 rounded-full bg-[#2D5016] flex-shrink-0 mt-2"></span>}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 rounded-full h-10" asChild>
              <Link href="/connect">
                <Send className="h-4 w-4 mr-2" />
                Envoyer un message
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Absences */}
        <Card className="bg-white border-0 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden">
          <CardHeader className="pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[#FFB2DD]/20 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-[#E91E8C]" />
                </div>
                <CardTitle className="text-base sm:text-lg font-bold">Absences récentes</CardTitle>
              </div>
              <Button variant="ghost" size="sm" className="text-[#2D5016] hover:bg-[#2D5016]/5 rounded-full gap-1 text-sm" asChild>
                <Link href="/connect/history">
                  Historique <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="space-y-3 mt-2">
              {recentAbsences.map((absence) => (
                <div key={absence.id} className="p-4 rounded-xl bg-secondary/20 hover:bg-secondary/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{absence.student}</span>
                        <Badge className={`rounded-full text-[10px] ${
                          absence.status === "approved"
                            ? "bg-[#2D5016]/10 text-[#2D5016]"
                            : "bg-[#F7D66E]/20 text-[#B8860B]"
                        }`}>
                          {absence.status === "approved" ? "Justifiée" : "En attente"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{absence.reason}</p>
                      <p className="text-xs text-muted-foreground mt-1">{absence.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 rounded-full bg-[#2D5016] hover:bg-[#4A7C23] h-10" asChild>
              <Link href="/connect/new">
                <Plus className="h-4 w-4 mr-2" />
                Signaler une absence
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Link href="/connect/new" className="group">
          <Card className="h-full bg-gradient-to-br from-[#2D5016] to-[#4A7C23] border-0 shadow-sm rounded-2xl overflow-hidden hover:shadow-lg transition-all group-hover:-translate-y-1">
            <CardContent className="p-4 sm:p-5 flex flex-col items-center justify-center text-center min-h-[100px] sm:min-h-[120px]">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/20 flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-white font-bold text-sm sm:text-base">Signaler absence</span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/shop" className="group">
          <Card className="h-full bg-gradient-to-br from-[#F7D66E] to-[#E5C55D] border-0 shadow-sm rounded-2xl overflow-hidden hover:shadow-lg transition-all group-hover:-translate-y-1">
            <CardContent className="p-4 sm:p-5 flex flex-col items-center justify-center text-center min-h-[100px] sm:min-h-[120px]">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/30 flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-[#2D5016]" />
              </div>
              <span className="text-[#2D5016] font-bold text-sm sm:text-base">APE+ Shop</span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/shop/new" className="group">
          <Card className="h-full bg-gradient-to-br from-[#FFB2DD] to-[#F799CC] border-0 shadow-sm rounded-2xl overflow-hidden hover:shadow-lg transition-all group-hover:-translate-y-1">
            <CardContent className="p-4 sm:p-5 flex flex-col items-center justify-center text-center min-h-[100px] sm:min-h-[120px]">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/30 flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                <Gift className="h-5 w-5 sm:h-6 sm:w-6 text-[#E91E8C]" />
              </div>
              <span className="text-[#E91E8C] font-bold text-sm sm:text-base">Bourse solidaire</span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/connect/history" className="group">
          <Card className="h-full bg-gradient-to-br from-[#B6CAEB] to-[#9AB8E2] border-0 shadow-sm rounded-2xl overflow-hidden hover:shadow-lg transition-all group-hover:-translate-y-1">
            <CardContent className="p-4 sm:p-5 flex flex-col items-center justify-center text-center min-h-[100px] sm:min-h-[120px]">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/30 flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                <Vote className="h-5 w-5 sm:h-6 sm:w-6 text-[#2D5016]" />
              </div>
              <span className="text-[#2D5016] font-bold text-sm sm:text-base">Sondages</span>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Admin Stats (only for admins) */}
      {isAdmin && (
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#2D5016]/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-[#2D5016]" />
            </div>
            Tableau de bord administrateur
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card className="bg-white border-0 shadow-sm rounded-2xl">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">En attente</p>
                    <p className="text-2xl sm:text-3xl font-bold mt-1">12</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-[#F7D66E]/20 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-[#F7D66E]" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-[#2D5016]" />
                  <span className="text-[#2D5016] font-medium">+2</span> depuis hier
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm rounded-2xl">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Approuvées</p>
                    <p className="text-2xl sm:text-3xl font-bold mt-1">156</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-[#2D5016]/10 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-[#2D5016]" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Ce mois-ci</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm rounded-2xl">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Taux engagement</p>
                    <p className="text-2xl sm:text-3xl font-bold mt-1">87%</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-[#B6CAEB]/30 flex items-center justify-center">
                    <Eye className="h-5 w-5 text-[#2D5016]" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-[#2D5016]" />
                  <span className="text-[#2D5016] font-medium">+5%</span> ce mois
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm rounded-2xl">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Familles actives</p>
                    <p className="text-2xl sm:text-3xl font-bold mt-1">324</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-[#FFB2DD]/20 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-[#E91E8C]" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Ce trimestre</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
