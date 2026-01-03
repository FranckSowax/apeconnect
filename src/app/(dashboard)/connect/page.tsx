"use client";

import { RecentAbsences } from "@/components/connect/RecentAbsences";
import { AutomaticReports } from "@/components/connect/AutomaticReports";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ConnectPage() {
  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#062F28]">
            Connect Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Suivi de la vie scolaire et gestion des absences
          </p>
        </div>
        <Button asChild className="rounded-full bg-[#9FE870] text-[#062F28] hover:bg-[#8CD660] font-bold px-6 h-12 shadow-sm border-0">
          <Link href="/connect/new">
            <Plus className="mr-2 h-5 w-5" />
            Signaler une absence
          </Link>
        </Button>
      </div>

      {/* Split Screen Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Recent Absences */}
        <Card className="border-0 shadow-sm rounded-[32px] bg-white overflow-hidden">
           <CardContent className="p-0 h-full">
              <RecentAbsences />
           </CardContent>
        </Card>

        {/* Right Side: Automatic Reports */}
        <Card className="border-0 shadow-sm rounded-[32px] bg-white overflow-hidden">
           <CardContent className="p-0 h-full">
              <AutomaticReports />
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
