"use client";

import { RecentAbsences } from "@/components/connect/RecentAbsences";
import { AutomaticReports } from "@/components/connect/AutomaticReports";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function ConnectPage() {
  return (
    <div className="space-y-8 lg:h-[calc(100vh-8rem)] h-auto flex flex-col">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="font-hagrid text-3xl md:text-4xl font-bold text-foreground">
            Connect Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Suivi de la vie scolaire et gestion des absences
          </p>
        </div>
        <Button asChild className="rounded-full bg-accent-yellow text-primary hover:bg-accent-yellow/90 font-medium px-6 h-12 shadow-md">
          <Link href="/connect/new">
            <Plus className="mr-2 h-5 w-5" />
            Signaler une absence
          </Link>
        </Button>
      </div>

      {/* Split Screen Content */}
      <div className="lg:flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:min-h-0">
        {/* Left Side: Recent Absences */}
        <div className="lg:h-full h-auto">
          <RecentAbsences />
        </div>

        {/* Right Side: Automatic Reports */}
        <div className="lg:h-full h-auto">
          <AutomaticReports />
        </div>
      </div>
    </div>
  );
}
