import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate, formatBytes, formatCurrency } from "@/lib/utils";
import {
  Users, Zap, DollarSign, BarChart3, Shield, Settings,
  AlertTriangle, CheckCircle, Clock, TrendingUp, Database,
  Film, Image
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard" };

const ADMIN_NAV = [
  { href: "/admin", label: "Overview", icon: <BarChart3 size={15} /> },
  { href: "/admin/users", label: "Users", icon: <Users size={15} /> },
  { href: "/admin/jobs", label: "AI Jobs", icon: <Zap size={15} /> },
  { href: "/admin/revenue", label: "Revenue", icon: <DollarSign size={15} /> },
  { href: "/admin/filters", label: "Filters", icon: <Image size={15} /> },
  { href: "/admin/settings", label: "Settings", icon: <Settings size={15} /> },
];

// Mocked data — in production this comes from DB aggregates
const mockStats = {
  totalUsers: 52341,
  activeSubscriptions: 8420,
  monthlyRevenue: 142850,
  aiJobsToday: 12483,
  storageUsedTotal: 8.7 * 1024 * 1024 * 1024 * 1024,
  newUsersThisWeek: 1247,
};

const recentUsers = [
  { id: 1, name: "Alex Kim", email: "alex@example.com", tier: "pro", joined: "2026-05-10", status: "active" },
  { id: 2, name: "Maria Garcia", email: "maria@example.com", tier: "creator", joined: "2026-05-09", status: "active" },
  { id: 3, name: "James Wilson", email: "james@example.com", tier: "free", joined: "2026-05-09", status: "active" },
  { id: 4, name: "Yuki Sato", email: "yuki@example.com", tier: "studio", joined: "2026-05-08", status: "active" },
  { id: 5, name: "Sarah Lee", email: "sarah@example.com", tier: "pro", joined: "2026-05-08", status: "suspended" },
];

const recentJobs = [
  { id: "j1", type: "background_removal", user: "alex@example.com", status: "completed", time: "2s" },
  { id: "j2", type: "upscale", user: "maria@example.com", status: "completed", time: "8s" },
  { id: "j3", type: "face_enhance", user: "yuki@example.com", status: "processing", time: "..." },
  { id: "j4", type: "color_grade", user: "james@example.com", status: "failed", time: "5s" },
  { id: "j5", type: "noise_removal", user: "sarah@example.com", status: "completed", time: "3s" },
];

const tierColors = { free: "default", creator: "blue", pro: "purple", studio: "success" } as const;
const jobStatusColors = { completed: "success", processing: "warning", failed: "error", queued: "info" } as const;

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // In production: check user.role === "admin"
  // For now, allow any authenticated user to view admin demo

  return (
    <div className="flex h-screen bg-[#0a0828] overflow-hidden">
      {/* Admin Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 glass border-r border-white/10">
        <div className="flex items-center gap-2.5 h-14 px-4 border-b border-white/10">
          <Shield size={16} className="text-brand-400" />
          <span className="font-bold text-sm text-white">Admin Panel</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/8 transition-colors"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="w-full">← Back to App</Button>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-white/40 text-sm">Platform overview and management</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                All systems operational
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Users"
              value={mockStats.totalUsers.toLocaleString()}
              change="+1,247 this week"
              icon={<Users size={18} />}
              color="purple"
            />
            <StatCard
              title="Active Subs"
              value={mockStats.activeSubscriptions.toLocaleString()}
              change="+12.5%"
              icon={<TrendingUp size={18} />}
              color="blue"
            />
            <StatCard
              title="Monthly Revenue"
              value={formatCurrency(mockStats.monthlyRevenue)}
              change="+8.3%"
              icon={<DollarSign size={18} />}
              color="green"
            />
            <StatCard
              title="AI Jobs Today"
              value={mockStats.aiJobsToday.toLocaleString()}
              icon={<Zap size={18} />}
              color="pink"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Revenue breakdown */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-base font-semibold text-white mb-4">Revenue by Plan</h2>
              <div className="space-y-3">
                {[
                  { plan: "Studio", users: 420, revenue: 33180, color: "emerald" },
                  { plan: "Pro", users: 2840, revenue: 82360, color: "brand" },
                  { plan: "Creator", users: 5160, revenue: 27080, color: "blue" },
                  { plan: "Free", users: 43921, revenue: 0, color: "gray" },
                ].map((item) => (
                  <div key={item.plan}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/60">{item.plan} ({item.users.toLocaleString()} users)</span>
                      <span className="text-white">{formatCurrency(item.revenue)}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-brand-500"
                        style={{ width: `${(item.revenue / mockStats.monthlyRevenue) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Storage & Resources */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-base font-semibold text-white mb-4">Platform Health</h2>
              <div className="space-y-3">
                {[
                  { label: "Storage Used", value: "8.7 TB / 100 TB", pct: 8.7 },
                  { label: "CDN Bandwidth", value: "2.1 TB / 10 TB", pct: 21 },
                  { label: "AI Processing Queue", value: "47 jobs / max 1000", pct: 4.7 },
                  { label: "API Rate Limit", value: "62% capacity", pct: 62 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/60">{item.label}</span>
                      <span className="text-white">{item.value}</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.pct > 80 ? "bg-red-500" : item.pct > 60 ? "bg-amber-500" : "bg-emerald-500"}`}
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Users */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-white">Recent Users</h2>
                <Link href="/admin/users">
                  <Button variant="ghost" size="xs">View all</Button>
                </Link>
              </div>
              <div className="space-y-2">
                {recentUsers.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {u.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{u.name}</p>
                      <p className="text-xs text-white/30 truncate">{u.email}</p>
                    </div>
                    <Badge variant={tierColors[u.tier as keyof typeof tierColors]} size="sm" className="capitalize">{u.tier}</Badge>
                    <Badge variant={u.status === "active" ? "success" : "error"} size="sm">{u.status}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent AI Jobs */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-white">Recent AI Jobs</h2>
                <Link href="/admin/jobs">
                  <Button variant="ghost" size="xs">View all</Button>
                </Link>
              </div>
              <div className="space-y-2">
                {recentJobs.map((job) => (
                  <div key={job.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${job.status === "completed" ? "bg-emerald-400" : job.status === "processing" ? "bg-amber-400 animate-pulse" : "bg-red-400"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white capitalize truncate">{job.type.replace("_", " ")}</p>
                      <p className="text-xs text-white/30 truncate">{job.user}</p>
                    </div>
                    <div className="text-xs text-white/30 font-mono">{job.time}</div>
                    <Badge variant={jobStatusColors[job.status as keyof typeof jobStatusColors] ?? "default"} size="sm">
                      {job.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
