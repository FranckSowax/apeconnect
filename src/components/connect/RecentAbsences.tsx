"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const StatusIcon = ({ status }: { status: Absence["status"] }) => {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4 text-accent-yellow" />;
    case "approved":
      return <CheckCircle2 className="h-4 w-4 text-accent-green" />;
    case "rejected":
      return <XCircle className="h-4 w-4 text-destructive" />;
  }
};

const StatusBadge = ({ status }: { status: Absence["status"] }) => {
  switch (status) {
    case "pending":
      return <Badge variant="secondary" className="bg-accent-yellow/20 text-yellow-700 hover:bg-accent-yellow/30 border-0">En attente</Badge>;
    case "approved":
      return <Badge variant="secondary" className="bg-accent-green/20 text-green-700 hover:bg-accent-green/30 border-0">Justifiée</Badge>;
    case "rejected":
      return <Badge variant="destructive" className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-0">Injustifiée</Badge>;
  }
};

export function RecentAbsences() {
  return (
    <Card className="h-full border-border/50 shadow-sm bg-white overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-hagrid text-xl">Absences Récentes</CardTitle>
          <Button variant="ghost" className="text-sm font-medium text-accent-blue hover:text-accent-blue/80 hover:bg-accent-blue/10 rounded-full">
            Voir tout
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {DUMMY_ABSENCES.map((absence) => (
            <div
              key={absence.id}
              className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                  <AvatarImage src={absence.studentAvatar} />
                  <AvatarFallback className="bg-accent-blue/20 text-accent-blue font-bold">
                    {absence.studentName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                    {absence.studentName}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span>{absence.date}</span>
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
                <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 bg-secondary/5">
          <Button className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium h-10 shadow-sm">
            Signaler une nouvelle absence
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
