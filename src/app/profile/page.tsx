import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate, formatBytes } from "@/lib/utils";
import { User, Mail, Calendar, HardDrive, Zap, Crown, Edit2 } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single();

  const name = profile?.full_name ?? user.email?.split("@")[0] ?? "User";
  const tier = profile?.subscription_tier ?? "free";
  const storageUsed = profile?.storage_used ?? 0;
  const creditsRemaining = profile?.credits_remaining ?? 0;

  const tierColors = { free: "default", creator: "blue", pro: "purple", studio: "success" } as const;

  return (
    <div className="flex h-screen bg-[#0a0828] overflow-hidden">
      <div className="hidden lg:flex flex-col">
        <Sidebar user={{ name, email: user.email, tier, creditsRemaining }} />
      </div>
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">Profile</h1>
            <Link href="/settings">
              <Button variant="secondary" size="sm" icon={<Edit2 size={13} />}>Edit Profile</Button>
            </Link>
          </div>

          {/* Profile card */}
          <div className="glass rounded-3xl p-8 mb-6">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-glow">
                {name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold text-white">{name}</h2>
                  <Badge variant={tierColors[tier as keyof typeof tierColors]} className="capitalize">
                    <Crown size={10} className="mr-1" /> {tier}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-white/50 text-sm mb-4">
                  <Mail size={13} />
                  <span>{user.email}</span>
                </div>
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2 text-white/40">
                    <Calendar size={13} />
                    <span>Joined {formatDate((user as { created_at?: string }).created_at ?? new Date().toISOString())}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/40">
                    <Zap size={13} className="text-brand-400" />
                    <span><strong className="text-white">{creditsRemaining}</strong> credits left</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/40">
                    <HardDrive size={13} />
                    <span><strong className="text-white">{formatBytes(storageUsed)}</strong> used</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Projects", value: "0", icon: "🖼️" },
              { label: "AI Jobs", value: "0", icon: "⚡" },
              { label: "Filters Saved", value: "0", icon: "🎨" },
              { label: "Exports", value: "0", icon: "📤" },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-2xl p-4 text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/40">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Account info */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Account Details</h3>
            <div className="space-y-3">
              {[
                { label: "Email", value: user.email ?? "" },
                { label: "Account ID", value: user.id.slice(0, 8) + "..." },
                { label: "Authentication", value: "Email + Google OAuth" },
                { label: "Plan", value: `${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan` },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <span className="text-sm text-white/40">{item.label}</span>
                  <span className="text-sm text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
