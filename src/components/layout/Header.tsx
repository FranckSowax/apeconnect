"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEstablishment } from "@/contexts/EstablishmentContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Search, User, Settings, LogOut } from "lucide-react";
import Link from "next/link";

export function Header() {
  const { user, signOut, isSuperAdmin } = useAuth();
  const { currentEstablishment, establishments, setCurrentEstablishment } =
    useEstablishment();

  const initials = user?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
      {/* Search */}
      <div className="flex-1 lg:ml-0 ml-12">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Rechercher..."
            className="h-9 w-full rounded-md border bg-transparent pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Establishment Selector (for super_admin) */}
      {isSuperAdmin && establishments.length > 0 && (
        <Select
          value={currentEstablishment?.id || ""}
          onValueChange={(value) => {
            const establishment = establishments.find((e) => e.id === value);
            if (establishment) setCurrentEstablishment(establishment);
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Selectionner un etablissement" />
          </SelectTrigger>
          <SelectContent>
            {establishments.map((establishment) => (
              <SelectItem key={establishment.id} value={establishment.id}>
                {establishment.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Notifications */}
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
      </Button>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.avatar_url || ""} alt={user?.full_name || ""} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user?.full_name || "Utilisateur"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/settings/profile">
              <User className="mr-2 h-4 w-4" />
              <span>Mon profil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Parametres</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Se deconnecter</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
