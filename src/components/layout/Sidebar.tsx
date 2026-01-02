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
  User, // Profile
  Settings,
  LogOut,
  Menu,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles?: string[];
  color?: string; // Add color property for the requested accents
  children?: { title: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    title: "Marketplace",
    href: "/shop",
    icon: Store,
    color: "text-accent-yellow", // Yellow
  },
  {
    title: "Connect",
    href: "/connect",
    icon: Activity,
    color: "text-accent-green", // Green
    children: [
      { title: "Dashboard", href: "/connect" },
      { title: "Absences", href: "/connect/new" },
      { title: "History", href: "/connect/history" },
    ],
  },
  {
    title: "Profile",
    href: "/profile", // Direct link to profile as per brief
    icon: User,
    color: "text-accent-blue", // Blue
  },
  {
    title: "Admin",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ["admin", "super_admin", "censeur"],
    color: "text-accent-pink", // Pink
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    color: "text-muted-foreground",
  },
];

function NavItemComponent({
  item,
  isCollapsed,
}: {
  item: NavItem;
  isCollapsed: boolean;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
  const hasChildren = item.children && item.children.length > 0;

  // Visual identity: Active state gets the pill shape and specific color background or text
  // The brief says: "Pill-shaped buttons (rounded-full)"
  
  if (hasChildren) {
    return (
      <div className="mb-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex w-full items-center gap-4 rounded-full px-4 py-3 text-sm font-medium transition-all duration-200",
            isActive
              ? "bg-white shadow-sm text-foreground" 
              : "text-muted-foreground hover:bg-white/50 hover:text-foreground"
          )}
        >
          <item.icon className={cn("h-5 w-5", isActive ? item.color : "text-muted-foreground")} />
          {!isCollapsed && (
            <>
              <span className="flex-1 text-left">{item.title}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </>
          )}
        </button>
        {!isCollapsed && isOpen && (
          <div className="ml-4 mt-2 space-y-1 border-l-2 border-border pl-4">
            {item.children?.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "block rounded-full px-4 py-2 text-sm transition-colors",
                  pathname === child.href
                    ? "bg-white font-medium text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-white/50 hover:text-foreground"
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
      className={cn(
        "flex items-center gap-4 rounded-full px-4 py-3 text-sm font-medium transition-all duration-200 mb-2",
        isActive
          ? "bg-white shadow-sm text-foreground"
          : "text-muted-foreground hover:bg-white/50 hover:text-foreground"
      )}
    >
      <item.icon className={cn("h-5 w-5", isActive ? item.color : "text-muted-foreground")} />
      {!isCollapsed && <span>{item.title}</span>}
    </Link>
  );
}

function SidebarContent({ isCollapsed }: { isCollapsed: boolean }) {
  const { user, signOut, hasRole } = useAuth();

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.some((role) => hasRole(role as any));
  });

  return (
    <div className="flex h-full flex-col bg-background/50 backdrop-blur-xl">
      {/* Logo */}
      <div className={cn("flex h-20 items-center px-6", isCollapsed && "justify-center px-2")}>
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-accent-yellow flex items-center justify-center shadow-sm">
            <span className="text-primary font-bold text-xl">A</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-hagrid font-bold text-lg leading-none">APE+</span>
              <span className="text-xs text-muted-foreground font-medium">Connect & Shop</span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-4">
        <nav>
          {filteredNavItems.map((item) => (
            <NavItemComponent
              key={item.href}
              item={item}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>
      </ScrollArea>

      {/* User section */}
      <div className="p-4 mt-auto">
        {!isCollapsed && user && (
          <div className="mb-4 px-4 py-3 bg-white rounded-3xl shadow-sm border border-border/50">
            <p className="text-sm font-bold truncate text-foreground">{user.full_name || user.email}</p>
            <p className="text-xs text-muted-foreground capitalize mt-0.5">{user.role?.replace("_", " ")}</p>
          </div>
        )}
        <Button
          variant="ghost"
          size={isCollapsed ? "icon" : "default"}
          className={cn(
            "w-full rounded-full hover:bg-destructive/10 hover:text-destructive text-muted-foreground",
            !isCollapsed && "justify-start px-4"
          )}
          onClick={() => signOut()}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="ml-3">Sign Out</span>}
        </Button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-border h-screen sticky top-0 bg-secondary/30 transition-all duration-300",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        <SidebarContent isCollapsed={isCollapsed} />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-40 bg-white shadow-sm rounded-full"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0 border-r-0 bg-background">
          <SidebarContent isCollapsed={false} />
        </SheetContent>
      </Sheet>
    </>
  );
}

