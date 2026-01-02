"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MessageSquare,
  BookOpen,
  Clock,
  CheckCircle2,
  TrendingUp,
  Plus,
  ArrowUpRight,
  ChevronDown,
  X,
  Check,
} from "lucide-react";
import Link from "next/link";

// Mock data for the attendance calendar
const attendanceData = [
  { day: "Lun", status: "present" },
  { day: "Mar", status: "present" },
  { day: "Mer", status: "present" },
  { day: "Jeu", status: "present" },
  { day: "Ven", status: "present" },
  { day: "Sam", status: "absent" },
  { day: "Dim", status: "absent" },
];

const weeklyAttendance = [
  ["present", "present", "present", "present", "present", "absent", "absent"],
  ["late", "present", "present", "present", "present", "absent", "absent"],
  ["present", "present", "present", "present", "present", "absent", "absent"],
  ["present", "present", "present", "present", "present", "absent", "absent"],
  ["present", "present", "present", null, null, null, null],
];

// Mock recent absences
const recentAbsences = [
  {
    id: 1,
    student: "Marie Dupont",
    reason: "Rendez-vous médical",
    date: "15 Jan",
    status: "approved",
    subject: "Mathématiques",
  },
  {
    id: 2,
    student: "Pierre Dupont",
    reason: "Maladie - Grippe",
    date: "12 Jan",
    status: "pending",
    subject: "Français",
  },
  {
    id: 3,
    student: "Marie Dupont",
    reason: "Raison familiale",
    date: "08 Jan",
    status: "in_progress",
    subject: "Sciences",
  },
];

// Mock schedule
const todaySchedule = [
  { time: "8:20", lesson: "Mathématiques", teacher: "M. Martin", location: "Salle 120" },
  { time: "9:00", lesson: "Français", teacher: "Mme Dubois", location: "Salle 124" },
  { time: "10:00", lesson: "Sciences", teacher: "M. Bernard", location: "Labo 223" },
  { time: "10:55", lesson: "Histoire", teacher: "Mme Laurent", location: "Salle 178" },
];

export default function DashboardPage() {
  const { hasRole } = useAuth();
  const isAdmin = hasRole(["censeur", "admin", "super_admin"]);
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="space-y-6 pb-8">
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Absences Approved Card */}
        <Card className="bg-white border-0 shadow-sm rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Absences justifiées</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-bold text-foreground">12</span>
                  <Badge className="bg-[#2D5016]/10 text-[#2D5016] hover:bg-[#2D5016]/20 border-0 rounded-full px-3 py-1 text-xs font-bold">
                    Bon
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-secondary/50">
                <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-[#2D5016] font-medium">+2%</span> par rapport au mois dernier
            </p>
          </CardContent>
        </Card>

        {/* Taux de présence Card */}
        <Card className="bg-white border-0 shadow-sm rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Taux de présence</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-bold text-foreground">96%</span>
                  <Badge className="bg-[#2D5016]/10 text-[#2D5016] hover:bg-[#2D5016]/20 border-0 rounded-full px-3 py-1 text-xs font-bold">
                    Excellent
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-secondary/50">
                <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-[#2D5016] font-medium">+12%</span> par rapport au semestre dernier
            </p>
          </CardContent>
        </Card>

        {/* Attendance Calendar Card */}
        <Card className="bg-white border-0 shadow-sm rounded-3xl overflow-hidden md:col-span-2 lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-foreground">Assiduité de la classe</p>
              <Button variant="outline" size="sm" className="rounded-full h-8 text-xs border-border/50 gap-1">
                mois <ChevronDown className="h-3 w-3" />
              </Button>
            </div>

            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {attendanceData.map((d, i) => (
                <div key={i} className="text-center text-xs text-muted-foreground font-medium">
                  {d.day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="space-y-1">
              {weeklyAttendance.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-1">
                  {week.map((status, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`h-8 w-8 mx-auto rounded-full flex items-center justify-center ${
                        status === "present"
                          ? "bg-[#2D5016]/10"
                          : status === "late"
                          ? "bg-[#F7D66E]/20"
                          : status === "absent"
                          ? "bg-secondary/50"
                          : "bg-transparent"
                      }`}
                    >
                      {status === "present" && <Check className="h-4 w-4 text-[#2D5016]" />}
                      {status === "late" && <X className="h-4 w-4 text-[#F7D66E]" />}
                      {status === "absent" && <X className="h-4 w-4 text-muted-foreground/50" />}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        {/* My Absences / Tasks Section - Takes 3 columns */}
        <Card className="bg-white border-0 shadow-sm rounded-3xl overflow-hidden lg:col-span-3">
          <CardHeader className="pb-2 px-6 pt-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">Mes demandes</CardTitle>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 hover:bg-secondary/50">
                <Plus className="h-5 w-5" />
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-4">
              {[
                { id: "all", label: "Toutes" },
                { id: "pending", label: "En attente" },
                { id: "in_progress", label: "En cours" },
                { id: "done", label: "Traitées" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
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

          <CardContent className="px-6 pb-6">
            <div className="space-y-4 mt-4">
              {recentAbsences.map((absence) => (
                <div
                  key={absence.id}
                  className="flex items-start justify-between p-4 rounded-2xl bg-secondary/20 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground mb-1">
                      {absence.reason}
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      {absence.subject}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{absence.date}</span>
                      <span>•</span>
                      <span>{absence.student}</span>
                    </div>
                  </div>
                  <Badge
                    className={`rounded-full px-3 py-1 text-xs font-medium border-0 ${
                      absence.status === "approved"
                        ? "bg-[#2D5016]/10 text-[#2D5016]"
                        : absence.status === "pending"
                        ? "bg-[#F7D66E]/20 text-[#B8860B]"
                        : "bg-[#FFB2DD]/20 text-[#E91E8C]"
                    }`}
                  >
                    {absence.status === "approved"
                      ? "Traitée"
                      : absence.status === "pending"
                      ? "En attente"
                      : "En cours"}
                  </Badge>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-secondary/30 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#F7D66E] to-[#2D5016]"
                    style={{ width: "65%" }}
                  />
                </div>
                <span className="text-xs text-muted-foreground font-medium">65%</span>
              </div>
            </div>

            <Button
              className="w-full mt-4 rounded-full bg-foreground hover:bg-foreground/90 text-white font-medium h-12"
              asChild
            >
              <Link href="/connect/history">Voir toutes les demandes</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Schedule Section - Takes 2 columns */}
        <Card className="bg-white border-0 shadow-sm rounded-3xl overflow-hidden lg:col-span-2">
          <CardHeader className="pb-2 px-6 pt-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">Activité récente</CardTitle>
              <Button variant="outline" size="sm" className="rounded-full h-8 text-xs border-border/50 gap-1">
                aujourd&apos;hui <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            {/* Schedule Header */}
            <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground font-medium mt-4 mb-3 px-2">
              <span>Heure</span>
              <span>Action</span>
              <span>Par</span>
              <span>Détail</span>
            </div>

            {/* Schedule Items */}
            <div className="space-y-3">
              {todaySchedule.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 gap-2 items-center p-3 rounded-xl hover:bg-secondary/20 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground">{item.time}</span>
                  <span className="text-sm text-foreground truncate">{item.lesson}</span>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-secondary text-xs">
                        {item.teacher.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground truncate hidden sm:block">
                      {item.teacher}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground truncate">{item.location}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Link href="/connect/new" className="group">
          <Card className="h-full bg-gradient-to-br from-[#2D5016] to-[#4A7C23] border-0 shadow-sm rounded-2xl overflow-hidden hover:shadow-lg transition-all group-hover:-translate-y-1">
            <CardContent className="p-4 sm:p-5 flex flex-col items-center justify-center text-center min-h-[120px]">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-white font-bold text-sm sm:text-base">Nouvelle absence</span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/shop" className="group">
          <Card className="h-full bg-gradient-to-br from-[#F7D66E] to-[#E5C55D] border-0 shadow-sm rounded-2xl overflow-hidden hover:shadow-lg transition-all group-hover:-translate-y-1">
            <CardContent className="p-4 sm:p-5 flex flex-col items-center justify-center text-center min-h-[120px]">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-[#2D5016]" />
              </div>
              <span className="text-[#2D5016] font-bold text-sm sm:text-base">Marketplace</span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/shop/new" className="group">
          <Card className="h-full bg-gradient-to-br from-[#FFB2DD] to-[#F799CC] border-0 shadow-sm rounded-2xl overflow-hidden hover:shadow-lg transition-all group-hover:-translate-y-1">
            <CardContent className="p-4 sm:p-5 flex flex-col items-center justify-center text-center min-h-[120px]">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-[#E91E8C]" />
              </div>
              <span className="text-[#E91E8C] font-bold text-sm sm:text-base">Publier annonce</span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/connect/history" className="group">
          <Card className="h-full bg-gradient-to-br from-[#B6CAEB] to-[#9AB8E2] border-0 shadow-sm rounded-2xl overflow-hidden hover:shadow-lg transition-all group-hover:-translate-y-1">
            <CardContent className="p-4 sm:p-5 flex flex-col items-center justify-center text-center min-h-[120px]">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-[#2D5016]" />
              </div>
              <span className="text-[#2D5016] font-bold text-sm sm:text-base">Historique</span>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Admin Stats (only for admins) */}
      {isAdmin && (
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
                  <p className="text-xs text-muted-foreground font-medium">Annonces</p>
                  <p className="text-2xl sm:text-3xl font-bold mt-1">48</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-[#B6CAEB]/30 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-[#2D5016]" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-[#2D5016]" />
                <span className="text-[#2D5016] font-medium">+5</span> cette semaine
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm rounded-2xl">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Messages</p>
                  <p className="text-2xl sm:text-3xl font-bold mt-1">324</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-[#FFB2DD]/20 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-[#E91E8C]" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Aujourd&apos;hui</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
