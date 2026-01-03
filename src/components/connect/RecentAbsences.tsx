"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, Clock, CheckCircle2, XCircle } from "lucide-react";

interface Absence {
  id: string;
  studentName: string;
  studentAvatar?: string;
  date: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  time: string;
}

const DUMMY_ABSENCES: Absence[] = [
  {
    id: "1",
    studentName: "Léo Dubois",
    date: "Aujourd'hui",
    time: "08:30 - 12:00",
    reason: "Rendez-vous médical",
    status: "pending",
  },
  {
    id: "2",
    studentName: "Léo Dubois",
    date: "Hier",
    time: "Toute la journée",
    reason: "Maladie",
    status: "approved",
  },
  {
    id: "3",
    studentName: "Emma Laurent",
    date: "24 Jan",
    time: "14:00 - 16:00",
    reason: "Transport scolaire",
    status: "rejected",
  },
];

const StatusBadge = ({ status }: { status: Absence["status"] }) => {
  switch (status) {
    case "pending":
      return <Badge variant="secondary" className="bg-[#F7D66E]/20 text-[#B8860B] hover:bg-[#F7D66E]/30 border-0 rounded-full">En attente</Badge>;
    case "approved":
      return <Badge variant="secondary" className="bg-[#9FE870]/20 text-[#062F28] hover:bg-[#9FE870]/30 border-0 rounded-full">Justifiée</Badge>;
    case "rejected":
      return <Badge variant="destructive" className="bg-[#FFB2DD]/20 text-[#E91E8C] hover:bg-[#FFB2DD]/30 border-0 rounded-full">Injustifiée</Badge>;
  }
};

export function RecentAbsences() {
  return (
    <div className="flex flex-col h-full">
      <CardHeader className="pb-2 pt-6 px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="font-bold text-xl text-[#062F28]">Absences Récentes</CardTitle>
          <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-[#062F28] hover:bg-[#F3F4F6] rounded-full h-8 px-4">
            Voir tout
          </Button>
        </div>
      </CardHeader>
      <div className="flex-1 p-0">
        <div className="divide-y divide-zinc-100">
          {DUMMY_ABSENCES.map((absence) => (
            <div
              key={absence.id}
              className="flex items-center justify-between p-4 px-6 hover:bg-[#F9FAFB] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10 border border-zinc-100 shadow-sm">
                  <AvatarImage src={absence.studentAvatar} />
                  <AvatarFallback className="bg-[#9FE870]/20 text-[#062F28] font-bold">
                    {absence.studentName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-sm text-[#062F28] group-hover:text-[#2D5016] transition-colors">
                    {absence.studentName}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span className="font-medium">{absence.date}</span>
                    <span>•</span>
                    <span>{absence.time}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end gap-1">
                  <StatusBadge status={absence.status} />
                  <span className="text-xs text-muted-foreground max-w-[150px] truncate text-right hidden md:block">
                    {absence.reason}
                  </span>
                </div>
                <div className="h-8 w-8 rounded-full bg-transparent group-hover:bg-white flex items-center justify-center transition-all">
                   <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-[#062F28] transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-6">
          <Button className="w-full rounded-full bg-[#F3F4F6] text-[#062F28] hover:bg-[#E5E7EB] font-bold h-12 shadow-sm border-0">
            Signaler une nouvelle absence
          </Button>
        </div>
      </div>
    </div>
  );
}
