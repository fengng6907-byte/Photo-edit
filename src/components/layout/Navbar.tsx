"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  Sparkles, Menu, X, ChevronDown, Zap, Image, Video, Store, Star, BarChart3
} from "lucide-react";

const navLinks = [
  {
    label: "Features",
    href: "/features",
    icon: <Zap size={15} />,
  },
  {
    label: "Editor",
    icon: <Image size={15} />,
    children: [
      { label: "Photo Editor", href: "/editor", description: "AI-powered photo editing" },
      { label: "Video Studio", href: "/video-studio", description: "Professional video editing" },
    ],
  },
  {
    label: "Marketplace",
    href: "/marketplace",
    icon: <Store size={15} />,
  },
  {
    label: "Pricing",
    href: "/pricing",
    icon: <Star size={15} />,
  },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "glass border-b border-white/10 shadow-glass" : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg gradient-text">PrismFlow AI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              link.children ? (
                <div key={link.label} className="relative">
                  <button
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors",
                      "text-white/70 hover:text-white hover:bg-white/10"
                    )}
                  >
                    {link.icon}
                    {link.label}
                    <ChevronDown size={13} className={cn("transition-transform", openDropdown === link.label && "rotate-180")} />
                  </button>
                  {openDropdown === link.label && (
                    <div
                      className="absolute top-full left-0 pt-2"
                      onMouseEnter={() => setOpenDropdown(link.label)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <div className="glass rounded-xl border border-white/10 shadow-glass p-2 min-w-[200px]">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex flex-col px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors"
                          >
                            <span className="text-sm font-medium text-white">{child.label}</span>
                            <span className="text-xs text-white/40">{child.description}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors",
                    pathname === link.href
                      ? "text-white bg-white/10"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  )}
                >
                  {link.icon}
                  {link.label}
                </Link>
              )
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" icon={<Sparkles size={14} />}>
                Start Free
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors text-white/70"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-white/10 animate-slide-up">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              link.children ? (
                <div key={link.label}>
                  <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white/30">
                    {link.label}
                  </p>
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors",
                    pathname === link.href
                      ? "text-white bg-white/10"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  )}
                >
                  {link.icon}
                  {link.label}
                </Link>
              )
            ))}
            <div className="pt-4 flex flex-col gap-2 border-t border-white/10">
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="secondary" className="w-full">Sign In</Button>
              </Link>
              <Link href="/register" onClick={() => setMobileOpen(false)}>
                <Button className="w-full">Start Free</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function DashboardNav({ user }: { user?: { name?: string; email?: string; avatar?: string; role?: string } }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: <BarChart3 size={16} /> },
    { href: "/editor", label: "Photo Editor", icon: <Image size={16} /> },
    { href: "/video-studio", label: "Video Studio", icon: <Video size={16} /> },
    { href: "/marketplace", label: "Marketplace", icon: <Store size={16} /> },
  ];

  return (
    <header className="glass border-b border-white/10 sticky top-0 z-40">
      <div className="flex items-center justify-between h-14 px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 text-white/60"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Menu size={18} />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center">
              <Sparkles size={13} className="text-white" />
            </div>
            <span className="font-bold text-sm gradient-text hidden sm:block">PrismFlow AI</span>
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors",
                pathname === item.href
                  ? "bg-brand-500/20 text-brand-300"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/settings">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:opacity-80 transition-opacity">
              {user?.name?.charAt(0)?.toUpperCase() ?? user?.email?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
