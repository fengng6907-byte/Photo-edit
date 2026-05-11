"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Image, Video, Store, Settings, User, CreditCard,
  History, Heart, HardDrive, Bell, Shield, Sparkles, LogOut, ChevronRight,
  Zap
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const sidebarSections = [
  {
    label: "Create",
    items: [
      { href: "/editor", label: "Photo Editor", icon: <Image size={16} /> },
      { href: "/video-studio", label: "Video Studio", icon: <Video size={16} />, badge: "New" },
    ],
  },
  {
    label: "Explore",
    items: [
      { href: "/marketplace", label: "Marketplace", icon: <Store size={16} /> },
    ],
  },
  {
    label: "Workspace",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
      { href: "/dashboard/history", label: "History", icon: <History size={16} /> },
      { href: "/dashboard/favorites", label: "Favorites", icon: <Heart size={16} /> },
      { href: "/dashboard/storage", label: "Storage", icon: <HardDrive size={16} /> },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/profile", label: "Profile", icon: <User size={16} /> },
      { href: "/billing", label: "Billing", icon: <CreditCard size={16} /> },
      { href: "/settings", label: "Settings", icon: <Settings size={16} /> },
    ],
  },
];

interface SidebarProps {
  collapsed?: boolean;
  user?: {
    name?: string | null;
    email?: string | null;
    tier?: string;
    creditsRemaining?: number;
  };
}

export function Sidebar({ collapsed = false, user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col h-full glass border-r border-white/10 transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center h-14 border-b border-white/10 px-4", collapsed && "justify-center")}>
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center shadow-glow shrink-0">
            <Sparkles size={15} className="text-white" />
          </div>
          {!collapsed && (
            <span className="font-bold text-sm gradient-text">PrismFlow AI</span>
          )}
        </Link>
      </div>

      {/* Credits indicator */}
      {!collapsed && user && (
        <div className="mx-3 my-3 p-3 rounded-xl bg-gradient-to-r from-brand-600/20 to-brand-500/10 border border-brand-500/20">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-white/60 flex items-center gap-1">
              <Zap size={11} /> Credits
            </span>
            <span className="text-xs font-semibold text-brand-300">{user.creditsRemaining ?? 0}</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full"
              style={{ width: `${Math.min(((user.creditsRemaining ?? 0) / 100) * 100, 100)}%` }}
            />
          </div>
          {user.tier && (
            <div className="mt-2">
              <Badge variant="purple" size="sm" className="capitalize">{user.tier}</Badge>
            </div>
          )}
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide px-3 py-2 space-y-4">
        {sidebarSections.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-white/25">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg text-sm transition-all duration-150 group",
                    collapsed ? "justify-center p-2" : "gap-2.5 px-3 py-2",
                    pathname === item.href || pathname.startsWith(item.href + "/")
                      ? "bg-brand-500/20 text-brand-300"
                      : "text-white/50 hover:text-white hover:bg-white/8"
                  )}
                >
                  <span className={cn(
                    "shrink-0 transition-colors",
                    pathname === item.href ? "text-brand-400" : "text-white/40 group-hover:text-white/70"
                  )}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {"badge" in item && item.badge && (
                        <Badge variant="blue" size="sm">{item.badge}</Badge>
                      )}
                    </>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User info */}
      <div className={cn("border-t border-white/10 p-3", collapsed && "flex justify-center")}>
        {collapsed ? (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.name ?? "User"}</p>
              <p className="text-[10px] text-white/40 truncate">{user?.email}</p>
            </div>
            <Link href="/api/auth/signout">
              <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-red-400 transition-colors">
                <LogOut size={13} />
              </button>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
