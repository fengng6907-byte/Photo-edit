"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Camera, Menu, X, Zap, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function CreditBadge() {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      supabase
        .from("profiles")
        .select("credits")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          setCredits(data?.credits ?? null);
          setLoading(false);
        });
    });
  }, []);

  if (loading || credits === null) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
        credits > 5
          ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
          : credits > 0
          ? "bg-amber-500/10 border-amber-500/25 text-amber-400"
          : "bg-red-500/10 border-red-500/25 text-red-400"
      )}
    >
      <Zap size={11} className="fill-current" />
      {credits} credits
    </div>
  );
}

const navLinks = [
  { label: "Studio", href: "/studio" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) =>
      setUser(session?.user ?? null)
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "glass border-b border-white/6 shadow-glass" : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
              <Camera size={15} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight gradient-text-crimson">VibeLens</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm transition-colors",
                  pathname === link.href
                    ? "text-white bg-white/8"
                    : "text-white/60 hover:text-white hover:bg-white/6"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <CreditBadge />
                <Link href="/studio">
                  <Button size="sm" icon={<Camera size={14} />}>Open Studio</Button>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-white/40 hover:text-white/70 transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/login">
                  <Button size="sm" icon={<Zap size={13} />}>Start Free</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/8 transition-colors text-white/60"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-white/6 animate-[slideUp_0.2s_ease-out]">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-lg text-sm transition-colors",
                  pathname === link.href
                    ? "text-white bg-white/8"
                    : "text-white/60 hover:text-white hover:bg-white/6"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-2 border-t border-white/6">
              {user ? (
                <>
                  <div className="flex justify-center"><CreditBadge /></div>
                  <Link href="/studio" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full">Open Studio</Button>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-sm text-white/40 hover:text-white/70 w-full py-2"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="secondary" className="w-full">Sign In</Button>
                  </Link>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full">Start Free</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function DashboardNav() {
  const [user, setUser] = useState<{ email?: string } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="glass border-b border-white/6 sticky top-0 z-40">
      <div className="flex items-center justify-between h-14 px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <Camera size={13} className="text-white" />
          </div>
          <span className="font-bold text-sm gradient-text-crimson hidden sm:block">VibeLens</span>
        </Link>

        <div className="flex items-center gap-3">
          <CreditBadge />
          {user && (
            <button
              onClick={handleSignOut}
              className="text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              Sign out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
