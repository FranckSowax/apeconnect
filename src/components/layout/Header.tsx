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
    <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-border/50 bg-white/80 backdrop-blur-md px-6 shadow-sm">
      {/* Search */}
      <div className="flex-1 lg:ml-0 ml-12">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Rechercher..."
            className="h-11 w-full rounded-full border-none bg-secondary/20 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/70"
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
          <SelectTrigger className="w-[200px] rounded-full border-none bg-secondary/20 h-11">
            <SelectValue placeholder="Sélectionner un établissement" />
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
      <Button variant="ghost" size="icon" className="relative h-11 w-11 rounded-full hover:bg-secondary/20">
        <Bell className="h-5 w-5 text-foreground/70" />
        <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-accent-pink border-2 border-white" />
      </Button>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-11 w-11 rounded-full p-0 hover:bg-transparent">
            <Avatar className="h-11 w-11 border-2 border-white shadow-sm ring-2 ring-secondary/20 transition-all hover:ring-primary/20">
              <AvatarImage src={user?.avatar_url || ""} alt={user?.full_name || ""} />
              <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 rounded-2xl border-border/50 shadow-lg" align="end" forceMount>
          <DropdownMenuLabel className="font-normal p-4">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-bold leading-none font-hagrid">
                {user?.full_name || "Utilisateur"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-border/50" />
          <DropdownMenuItem asChild className="rounded-xl cursor-pointer focus:bg-secondary/20 mx-1">
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              <span>Mon profil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="rounded-xl cursor-pointer focus:bg-secondary/20 mx-1">
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Paramètres</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border/50" />
          <DropdownMenuItem onClick={() => signOut()} className="rounded-xl cursor-pointer focus:bg-destructive/10 focus:text-destructive mx-1 text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Se déconnecter</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
