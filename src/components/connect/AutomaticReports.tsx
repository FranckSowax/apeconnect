"use client";

import { CardHeader, CardTitle } from "@/components/ui/card";
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
      return <FileText className="h-5 w-5 text-[#60A5FA]" />;
    case "monthly":
      return <TrendingUp className="h-5 w-5 text-[#9FE870]" />;
    case "alert":
      return <AlertCircle className="h-5 w-5 text-[#E91E8C]" />;
  }
};

const ReportColor = ({ type }: { type: Report["type"] }) => {
  switch (type) {
    case "weekly":
      return "bg-[#60A5FA]/10 border-[#60A5FA]/20 group-hover:border-[#60A5FA]/40";
    case "monthly":
      return "bg-[#9FE870]/10 border-[#9FE870]/20 group-hover:border-[#9FE870]/40";
    case "alert":
      return "bg-[#FFB2DD]/10 border-[#FFB2DD]/20 group-hover:border-[#FFB2DD]/40";
  }
};

export function AutomaticReports() {
  return (
    <div className="flex flex-col h-full">
      <CardHeader className="pb-4 pt-6 px-6">
        <CardTitle className="font-bold text-xl text-[#062F28] flex items-center gap-2">
          Rapports Automatiques
        </CardTitle>
      </CardHeader>
      <div className="flex-1 flex flex-col gap-4 p-6 pt-0">
        {DUMMY_REPORTS.map((report) => (
          <div
            key={report.id}
            className={`flex items-center justify-between p-4 rounded-2xl border transition-all hover:shadow-md cursor-pointer group ${ReportColor(
              { type: report.type }
            )}`}
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                <ReportIcon type={report.type} />
              </div>
              <div>
                <h4 className="font-bold text-[#062F28] text-sm">{report.title}</h4>
                <p className="text-xs text-muted-foreground">{report.date}</p>
              </div>
            </div>
            <Button size="icon" variant="ghost" className="rounded-full hover:bg-white/50 h-8 w-8">
              <Download className="h-4 w-4 text-[#062F28]/70" />
            </Button>
          </div>
        ))}

        <div className="mt-auto pt-6">
          <div className="bg-gradient-to-br from-[#F7D66E]/20 to-[#F7D66E]/10 rounded-[24px] p-6 text-center border border-[#F7D66E]/20">
            <h4 className="font-bold text-lg text-[#062F28] mb-2">Besoin d&apos;un justificatif ?</h4>
            <p className="text-sm text-[#062F28]/70 mb-4 leading-relaxed">
              Générez automatiquement un certificat de scolarité ou un justificatif d&apos;absence.
            </p>
            <Button className="w-full rounded-full bg-white text-[#062F28] hover:bg-[#FDFBF7] font-bold h-10 shadow-sm border border-[#F7D66E]/30">
              Générer un document
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
