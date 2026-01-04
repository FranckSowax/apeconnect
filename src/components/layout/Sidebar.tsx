"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Store, // Marketplace
  Activity, // Connect
  Settings,
  ChevronDown,
  LayoutDashboard,
  HelpCircle,
  Sparkles,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles?: string[];
  color?: string;
  children?: { title: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    title: "Tableau de bord",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Vie Scolaire", // Connect
    href: "/connect",
    icon: Activity,
    children: [
      { title: "Vue d'ensemble", href: "/connect" },
      { title: "Absences", href: "/connect/new" },
      { title: "Bulletins", href: "/connect/history" },
    ],
  },
  {
    title: "Boutique", // Shop
    href: "/shop",
    icon: Store,
  },
  {
    title: "Admin",
    href: "/admin",
    icon: Settings, // Using Settings icon for Admin as generic
    roles: ["admin", "super_admin", "censeur"],
  },
];

const preferenceItems: NavItem[] = [
  {
    title: "Paramètres",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Aide",
    href: "/help",
    icon: HelpCircle,
  },
];

function NavItemComponent({
  item,
  isCollapsed,
  onNavigate,
}: {
  item: NavItem;
  isCollapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isActive = pathname === item.href || (pathname.startsWith(item.href + "/") && item.href !== "/dashboard"); // Avoid matching /dashboard for everything
  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren) {
    return (
      <div className="mb-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
            isActive
              ? "bg-white text-foreground shadow-sm ring-1 ring-black/5" 
              : "text-muted-foreground hover:bg-black/5 hover:text-foreground"
          )}
        >
          <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
          {!isCollapsed && (
            <>
              <span className="flex-1 text-left">{item.title}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform text-muted-foreground",
                  isOpen && "rotate-180"
                )}
              />
            </>
          )}
        </button>
        {!isCollapsed && isOpen && (
          <div className="ml-4 mt-1 space-y-1 border-l border-border pl-4">
            {item.children?.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                onClick={onNavigate}
                className={cn(
                  "block rounded-lg px-4 py-2 text-sm transition-colors",
                  pathname === child.href
                    ? "bg-white font-medium text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-black/5 hover:text-foreground"
                )}
              >
                {child.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 mb-1",
        isActive
          ? "bg-white text-foreground shadow-sm ring-1 ring-black/5"
          : "text-muted-foreground hover:bg-black/5 hover:text-foreground"
      )}
    >
      <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
      {!isCollapsed && <span>{item.title}</span>}
    </Link>
  );
}

export function SidebarContent({ isCollapsed, onNavigate }: { isCollapsed: boolean; onNavigate?: () => void }) {
  const { user, signOut, hasRole } = useAuth();

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.some((role) => hasRole(role as any));
  });

  return (
    <div className="flex h-full flex-col bg-white border-r border-border">
      {/* Logo */}
      <div className={cn("flex h-20 items-center px-6", isCollapsed && "justify-center px-2")}>
        <Link href="/dashboard" onClick={onNavigate} className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg font-hagrid">A</span>
          </div>
          {!isCollapsed && (
            <span className="font-hagrid font-bold text-xl text-foreground">APE Connect</span>
          )}
        </Link>
      </div>

      <ScrollArea className="flex-1 px-4 py-2">
        <div className="mb-2 px-2">
          {!isCollapsed && <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Menu Principal</h3>}
          <nav>
            {filteredNavItems.map((item) => (
              <NavItemComponent
                key={item.href}
                item={item}
                isCollapsed={isCollapsed}
                onNavigate={onNavigate}
              />
            ))}
          </nav>
        </div>

        <div className="mt-6 px-2">
          {!isCollapsed && <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Préférences</h3>}
          <nav>
            {preferenceItems.map((item) => (
              <NavItemComponent
                key={item.href}
                item={item}
                isCollapsed={isCollapsed}
                onNavigate={onNavigate}
              />
            ))}
          </nav>
        </div>
      </ScrollArea>

      {/* Upgrade Plan Card */}
      {!isCollapsed && (
        <div className="p-4 mx-4 mb-4 bg-white rounded-2xl shadow-sm border border-border">
          <div className="flex justify-center mb-3">
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <h4 className="text-center font-bold text-foreground mb-1">Pass Premium</h4>
          <p className="text-center text-xs text-muted-foreground mb-3">
            Accédez à toutes les fonctionnalités et au support prioritaire.
          </p>
          <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-full text-xs font-bold h-9">
            Mettre à niveau <ChevronDown className="ml-1 h-3 w-3 -rotate-90" />
          </Button>
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col h-screen sticky top-0 transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <SidebarContent isCollapsed={isCollapsed} />
    </aside>
  );
}

