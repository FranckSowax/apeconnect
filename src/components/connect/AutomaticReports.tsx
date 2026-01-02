"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, TrendingUp, AlertCircle } from "lucide-react";

interface Report {
  id: string;
  title: string;
  date: string;
  type: "weekly" | "monthly" | "alert";
  status: "ready" | "processing";
}

const DUMMY_REPORTS: Report[] = [
  {
    id: "1",
    title: "Rapport Hebdomadaire",
    date: "15 - 21 Janvier",
    type: "weekly",
    status: "ready",
  },
  {
    id: "2",
    title: "Bilan Mensuel",
    date: "Décembre 2025",
    type: "monthly",
    status: "ready",
  },
  {
    id: "3",
    title: "Alerte Assiduité",
    date: "Léo Dubois",
    type: "alert",
    status: "ready",
  },
];

const ReportIcon = ({ type }: { type: Report["type"] }) => {
  switch (type) {
    case "weekly":
      return <FileText className="h-5 w-5 text-accent-blue" />;
    case "monthly":
      return <TrendingUp className="h-5 w-5 text-accent-green" />;
    case "alert":
      return <AlertCircle className="h-5 w-5 text-destructive" />;
  }
};

const ReportColor = ({ type }: { type: Report["type"] }) => {
  switch (type) {
    case "weekly":
      return "bg-accent-blue/10 border-accent-blue/20";
    case "monthly":
      return "bg-accent-green/10 border-accent-green/20";
    case "alert":
      return "bg-destructive/5 border-destructive/20";
  }
};

export function AutomaticReports() {
  return (
    <Card className="h-full border-border/50 shadow-sm bg-white flex flex-col">
      <CardHeader>
        <CardTitle className="font-hagrid text-xl flex items-center gap-2">
          Rapports Automatiques
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        {DUMMY_REPORTS.map((report) => (
          <div
            key={report.id}
            className={`flex items-center justify-between p-4 rounded-2xl border transition-all hover:shadow-md cursor-pointer ${ReportColor(
              { type: report.type }
            )}`}
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                <ReportIcon type={report.type} />
              </div>
              <div>
                <h4 className="font-bold text-foreground">{report.title}</h4>
                <p className="text-sm text-muted-foreground">{report.date}</p>
              </div>
            </div>
            <Button size="icon" variant="ghost" className="rounded-full hover:bg-white/50">
              <Download className="h-4 w-4 text-foreground/70" />
            </Button>
          </div>
        ))}

        <div className="mt-auto pt-6">
          <div className="bg-accent-yellow/10 rounded-3xl p-6 text-center border border-accent-yellow/20">
            <h4 className="font-hagrid text-lg font-bold mb-2">Besoin d'un justificatif ?</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Générez automatiquement un certificat de scolarité ou un justificatif d'absence.
            </p>
            <Button variant="outline" className="rounded-full border-accent-yellow text-yellow-800 hover:bg-accent-yellow hover:text-primary font-medium bg-white">
              Générer un document
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
