"use client";

export const dynamic = "force-dynamic";

import { useAuth } from "@/contexts/AuthContext";
import { useStudents } from "@/contexts/StudentContext";
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
  ArrowUpRight,
  ArrowDownLeft,
  MoreHorizontal,
  Search,
  Mic,
  Paperclip,
  Wallet
} from "lucide-react";
import Link from "next/link";

// Types
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

const recentActivities = [
  { id: 1, title: "Absence justifiée", subtitle: "Marie - Rendez-vous médical", amount: "-1h", date: "15 Jan", status: "Completed", icon: Clock },
  { id: 2, title: "Paiement Cantine", subtitle: "Rechargement compte", amount: "25.000 FCFA", date: "14 Jan", status: "Completed", icon: Wallet },
  { id: 3, title: "Bulletin T1", subtitle: "Pierre - 6ème A", amount: "14.5/20", date: "10 Jan", status: "Completed", icon: FileText },
  { id: 4, title: "Cotisation APE", subtitle: "Année 2024-2025", amount: "10.000 FCFA", date: "05 Jan", status: "Completed", icon: Users },
  { id: 5, title: "Retard", subtitle: "Marie - Transport", amount: "-15min", date: "02 Jan", status: "Pending", icon: Clock },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { currentStudent, students } = useStudents();
  const isParent = user?.role === "parent";

  return (
    <div className="space-y-6 pb-8">
      {/* Selected Child Banner (for parents) */}
      {isParent && currentStudent && (
        <Card className="border-0 shadow-sm rounded-[24px] bg-gradient-to-r from-[#062F28] to-[#0a4a3f] text-white overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Users className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold truncate">{currentStudent.full_name}</h2>
                  {students.length > 1 && (
                    <Badge className="bg-white/20 text-white border-0 text-xs">
                      {students.length} enfants
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-white/80 text-sm">
                  {currentStudent.class_name && (
                    <span className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {currentStudent.class_name}
                    </span>
                  )}
                  {currentStudent.level && (
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      {currentStudent.level}
                    </span>
                  )}
                </div>
              </div>
              <Link href="/children" className="flex-shrink-0">
                <Button className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-full">
                  Gérer les enfants
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No child prompt (for parents without children) */}
      {isParent && students.length === 0 && (
        <Card className="border-2 border-dashed border-primary/30 rounded-[24px] bg-primary/5">
          <CardContent className="p-6 text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Ajoutez vos enfants</h3>
            <p className="text-muted-foreground mb-4">
              Pour profiter de toutes les fonctionnalités, commencez par ajouter vos enfants.
            </p>
            <Link href="/children">
              <Button className="rounded-full">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un enfant
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Top Section */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Wallet / Balance Card - GREEN CARD */}
        <Card className="xl:col-span-1 bg-gradient-to-br from-[#9FE870] to-[#8CD660] border-0 rounded-[32px] overflow-hidden relative shadow-lg shadow-[#9FE870]/20">
          <CardContent className="p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[#062F28] font-medium text-sm bg-white/30 px-3 py-1 rounded-full">Solde APE</span>
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-white/30 text-[#062F28] hover:bg-white/40">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <h2 className="text-[#062F28] text-4xl font-bold font-hagrid mb-1">20.670 <span className="text-xl">FCFA</span></h2>
              <p className="text-[#062F28]/70 text-sm mb-6">+2.5% vs mois dernier</p>
            </div>
            
            <div className="flex gap-3">
              <Button className="flex-1 bg-white text-[#062F28] hover:bg-white/90 rounded-full font-bold h-12 shadow-sm border-0">
                <ArrowDownLeft className="mr-2 h-4 w-4" />
                Recharger
              </Button>
              <Button className="flex-1 bg-[#062F28] text-white hover:bg-[#062F28]/90 rounded-full font-bold h-12 shadow-sm border-0">
                Payer
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Decorative background curves */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          </CardContent>
        </Card>

        {/* Small Stats Cards */}
        <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm rounded-[24px] bg-white">
            <CardContent className="p-5 flex flex-col justify-between h-full">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-[#F7D66E]/20 flex items-center justify-center text-[#B8860B]">
                  <Clock className="h-5 w-5" />
                </div>
                <span className="font-medium text-muted-foreground">Absences</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-foreground">3</span>
                <Badge className="ml-2 bg-[#9FE870]/20 text-[#062F28] hover:bg-[#9FE870]/30 border-0">
                  -2%
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm rounded-[24px] bg-white">
            <CardContent className="p-5 flex flex-col justify-between h-full">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-[#B6CAEB]/20 flex items-center justify-center text-[#2D5016]">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <span className="font-medium text-muted-foreground">Messages</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-foreground">5</span>
                <Badge className="ml-2 bg-[#9FE870]/20 text-[#062F28] hover:bg-[#9FE870]/30 border-0">
                  2 news
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm rounded-[24px] bg-white">
            <CardContent className="p-5 flex flex-col justify-between h-full">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-[#FFB2DD]/20 flex items-center justify-center text-[#E91E8C]">
                  <Gift className="h-5 w-5" />
                </div>
                <span className="font-medium text-muted-foreground">Points</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-foreground">1.250</span>
                <Badge className="ml-2 bg-[#9FE870]/20 text-[#062F28] hover:bg-[#9FE870]/30 border-0">
                  +50
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Score Card */}
        <Card className="xl:col-span-1 border-0 shadow-sm rounded-[24px] bg-white relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Qualité Dossier
            </CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2">
              <h2 className="text-3xl font-bold text-[#062F28]">Excellent</h2>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Score</span>
                <div className="h-2 w-24 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-[#062F28] w-[92%]" />
                </div>
              </div>
              <span className="text-3xl font-bold text-[#9FE870]">92%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle Section: Chart & Assistant */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="xl:col-span-2 border-0 shadow-sm rounded-[32px] bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-bold text-[#062F28]">Présence & Résultats</CardTitle>
              <p className="text-sm text-muted-foreground">Année scolaire 2024-2025</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="rounded-full px-3 py-1 cursor-pointer hover:bg-secondary bg-secondary/50 border-0">
                Cette année
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pl-0">
            {/* CSS Bar Chart Simulation */}
            <div className="h-[250px] w-full flex items-end justify-between px-6 gap-2 mt-4">
              {[65, 45, 75, 55, 85, 70, 45, 60, 75, 65, 50, 60].map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                  <div className="w-full flex gap-1 h-full items-end justify-center relative">
                    <div 
                      className="w-3 bg-[#062F28] rounded-t-full transition-all group-hover:bg-[#062F28]/80"
                      style={{ height: `${h}%` }}
                    />
                    <div 
                      className="w-3 bg-[#9FE870] rounded-t-full transition-all group-hover:bg-[#9FE870]/80"
                      style={{ height: `${h * 0.6}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"][i]}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#062F28]" />
                <span className="text-sm text-muted-foreground">Présence</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#9FE870]" />
                <span className="text-sm text-muted-foreground">Moyenne</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Assistant */}
        <Card className="xl:col-span-1 border-0 shadow-sm rounded-[32px] bg-white flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[#062F28]">Assistant APE</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#9FE870] to-[#062F28] flex items-center justify-center mb-6 shadow-xl shadow-[#9FE870]/20 relative overflow-hidden group cursor-pointer hover:scale-105 transition-transform">
               <div className="absolute inset-0 bg-white/20 blur-xl group-hover:bg-white/30 transition-colors" />
               <Search className="h-10 w-10 text-white relative z-10" />
            </div>
            <h3 className="text-lg font-bold text-[#062F28] mb-2">Besoin d'aide ?</h3>
            
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              <Badge variant="outline" className="rounded-full px-3 py-1 bg-secondary/30 border-0 hover:bg-secondary/50 cursor-pointer text-xs">
                Justifier une absence
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1 bg-secondary/30 border-0 hover:bg-secondary/50 cursor-pointer text-xs">
                Menu cantine
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1 bg-secondary/30 border-0 hover:bg-secondary/50 cursor-pointer text-xs">
                Bulletin T1
              </Badge>
            </div>

            <div className="w-full mt-auto relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Search className="h-4 w-4" />
              </div>
              <input 
                type="text" 
                placeholder="Posez une question..." 
                className="w-full h-12 rounded-full bg-[#F3F4F6] pl-10 pr-24 text-sm focus:outline-none focus:ring-2 focus:ring-[#9FE870] transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                 <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-white">
                   <Paperclip className="h-4 w-4 text-muted-foreground" />
                 </Button>
                 <Button size="icon" className="h-8 w-8 rounded-full bg-[#9FE870] hover:bg-[#8CD660] text-[#062F28]">
                   <ArrowUpRight className="h-4 w-4" />
                 </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section: List & Stats */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Transactions / Activities List */}
        <Card className="xl:col-span-2 border-0 shadow-sm rounded-[32px] bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold text-[#062F28]">Activités Récentes</CardTitle>
            <div className="flex gap-2">
               <Button variant="outline" size="sm" className="rounded-full border-0 bg-secondary/30 hover:bg-secondary/50 text-xs h-8">
                 Ce mois
                 <ChevronRight className="ml-1 h-3 w-3" />
               </Button>
               <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                 <MoreHorizontal className="h-4 w-4" />
               </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 hover:bg-[#F9FAFB] rounded-2xl transition-colors group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-[#F3F4F6] group-hover:bg-white group-hover:shadow-sm flex items-center justify-center transition-all">
                      <activity.icon className="h-5 w-5 text-[#062F28]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#062F28] text-sm">{activity.title}</h4>
                      <p className="text-xs text-muted-foreground">{activity.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="font-bold text-[#062F28] text-sm">{activity.amount}</p>
                      <p className="text-xs text-muted-foreground">{activity.date}</p>
                    </div>
                    <Badge 
                      className={`rounded-full px-3 py-1 border-0 text-[10px] ${
                        activity.status === "Completed" 
                          ? "bg-[#9FE870]/20 text-[#062F28]" 
                          : "bg-[#FFB2DD]/20 text-[#E91E8C]"
                      }`}
                    >
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Statistic Donut */}
        <div className="xl:col-span-1 flex flex-col gap-6">
           <Card className="border-0 shadow-sm rounded-[32px] bg-white flex-1">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold text-[#062F28]">Statistiques</CardTitle>
                <Badge variant="outline" className="rounded-full border-0 bg-secondary/30 text-xs">
                  Ce mois
                </Badge>
             </CardHeader>
             <CardContent className="flex flex-col items-center justify-center pb-8">
               <div className="relative h-48 w-48 mt-4">
                  {/* CSS Conic Gradient Donut */}
                  <div 
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "conic-gradient(#062F28 0% 70%, #9FE870 70% 85%, #E5E7EB 85% 100%)"
                    }}
                  />
                  <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center">
                     <p className="text-xs text-muted-foreground font-medium">Total Dépenses</p>
                     <p className="text-2xl font-bold text-[#062F28]">35.000</p>
                  </div>
               </div>
               <div className="flex w-full justify-between px-4 mt-8">
                  <div className="flex items-center gap-2">
                     <div className="h-3 w-3 rounded-full bg-[#062F28]" />
                     <span className="text-xs font-medium text-[#062F28]">Cantine</span>
                  </div>
                  <span className="text-xs font-bold">25k</span>
               </div>
               <div className="flex w-full justify-between px-4 mt-2">
                  <div className="flex items-center gap-2">
                     <div className="h-3 w-3 rounded-full bg-[#9FE870]" />
                     <span className="text-xs font-medium text-[#062F28]">APE</span>
                  </div>
                  <span className="text-xs font-bold">10k</span>
               </div>
             </CardContent>
           </Card>

           <Card className="border-0 shadow-sm rounded-[32px] bg-[#9FE870] overflow-hidden">
              <CardContent className="p-0">
                 <Button className="w-full h-14 bg-transparent hover:bg-black/5 text-[#062F28] font-bold text-lg border-0 flex items-center justify-between px-6">
                   <span>Menu Cantine</span>
                   <ArrowUpRight className="h-5 w-5" />
                 </Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
