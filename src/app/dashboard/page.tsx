import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/Toast";
import { formatBytes, formatRelativeTime } from "@/lib/utils";
import {
  Image, Video, Zap, HardDrive, Plus, ArrowRight, Sparkles,
  Clock, TrendingUp, Star
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [profileResult, projectsResult, jobsResult] = await Promise.all([
    supabase.from("users").select("*").eq("id", user.id).single(),
    supabase.from("projects").select("*").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(6),
    supabase.from("ai_jobs").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
  ]);

  const profile = profileResult.data;
  const projects = projectsResult.data ?? [];
  const jobs = jobsResult.data ?? [];

  const name = profile?.full_name ?? user.email?.split("@")[0] ?? "Creator";
  const storageUsed = profile?.storage_used ?? 0;
  const storageLimit = (profile?.storage_limit ?? 1) * 1024 * 1024 * 1024;
  const creditsRemaining = profile?.credits_remaining ?? 0;
  const tier = profile?.subscription_tier ?? "free";

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">
            Good morning, {name.split(" ")[0]} 👋
          </h1>
          <p className="text-white/40 text-sm">Here&apos;s what&apos;s happening with your projects.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/editor">
            <Button icon={<Image size={15} />} size="sm">New Photo Edit</Button>
          </Link>
          <Link href="/video-studio">
            <Button variant="secondary" icon={<Video size={15} />} size="sm">New Video</Button>
          </Link>
        </div>
      </div>

      {/* Upgrade banner for free tier */}
      {tier === "free" && (
        <div className="mb-6 gradient-border rounded-2xl p-4 flex items-center justify-between gap-4 bg-gradient-to-r from-brand-600/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
              <Sparkles size={18} className="text-brand-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Upgrade to Creator</p>
              <p className="text-xs text-white/40">Get 100 AI credits, remove watermarks, and unlock all filters</p>
            </div>
          </div>
          <Link href="/billing">
            <Button size="sm" icon={<ArrowRight size={13} />} iconPosition="right">Upgrade</Button>
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Projects Created"
          value={projects.length}
          icon={<Image size={18} />}
          color="purple"
        />
        <StatCard
          title="AI Credits Left"
          value={creditsRemaining}
          icon={<Zap size={18} />}
          color="blue"
        />
        <StatCard
          title="AI Jobs Run"
          value={jobs.length}
          icon={<TrendingUp size={18} />}
          color="green"
        />
        <StatCard
          title="Storage Used"
          value={formatBytes(storageUsed)}
          icon={<HardDrive size={18} />}
          color="pink"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Projects</h2>
            <Link href="/dashboard/history">
              <Button variant="ghost" size="xs" icon={<ArrowRight size={12} />} iconPosition="right">
                View all
              </Button>
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Image size={24} className="text-white/20" />
              </div>
              <p className="text-white/50 text-sm mb-4">No projects yet. Start your first edit!</p>
              <div className="flex justify-center gap-3">
                <Link href="/editor">
                  <Button size="sm" icon={<Plus size={13} />}>Edit Photo</Button>
                </Link>
                <Link href="/video-studio">
                  <Button variant="secondary" size="sm" icon={<Plus size={13} />}>Edit Video</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {projects.map((p) => (
                <Link key={p.id} href={`/editor?project=${p.id}`}>
                  <div className="glass glass-hover rounded-xl overflow-hidden group">
                    <div className="aspect-video bg-gradient-to-br from-brand-900/50 to-purple-900/30 flex items-center justify-center relative">
                      {p.thumbnail_url ? (
                        <img src={p.thumbnail_url} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl">{p.type === "video" ? "🎬" : "🖼️"}</span>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-medium text-white truncate">{p.name}</p>
                      <p className="text-[10px] text-white/30 mt-0.5">{formatRelativeTime(p.updated_at)}</p>
                    </div>
                  </div>
                </Link>
              ))}
              <Link href="/editor">
                <div className="glass glass-hover rounded-xl aspect-video flex flex-col items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-white/10 hover:border-brand-500/30 transition-colors">
                  <Plus size={20} className="text-white/30" />
                  <span className="text-xs text-white/30">New project</span>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Usage */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Usage This Month</h3>
            <div className="space-y-3">
              <ProgressBar
                label="AI Credits"
                value={creditsRemaining}
                max={tier === "free" ? 10 : tier === "creator" ? 100 : tier === "pro" ? 500 : 2000}
                color="brand"
              />
              <ProgressBar
                label="Storage"
                value={(storageUsed / storageLimit) * 100}
                max={100}
                color="green"
              />
            </div>
            <div className="mt-4">
              <Badge variant="purple" className="capitalize">{tier} Plan</Badge>
            </div>
          </div>

          {/* Recent AI Jobs */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Recent AI Jobs</h3>
            {jobs.length === 0 ? (
              <p className="text-xs text-white/30 text-center py-4">No AI jobs yet</p>
            ) : (
              <div className="space-y-2">
                {jobs.slice(0, 4).map((job) => (
                  <div key={job.id} className="flex items-center gap-2.5 py-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${job.status === "completed" ? "bg-emerald-400" : job.status === "failed" ? "bg-red-400" : "bg-amber-400 animate-pulse"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/60 truncate capitalize">{job.job_type.replace("_", " ")}</p>
                    </div>
                    <span className="text-[10px] text-white/30">{formatRelativeTime(job.created_at)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: "Remove Background", href: "/editor?tool=background_removal", icon: "✂️" },
                { label: "Upscale Image", href: "/editor?tool=upscale", icon: "🔍" },
                { label: "Apply Filter", href: "/marketplace", icon: "🎨" },
                { label: "Edit Video", href: "/video-studio", icon: "🎬" },
              ].map((a) => (
                <Link key={a.label} href={a.href}>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/8 transition-colors cursor-pointer group">
                    <span className="text-sm">{a.icon}</span>
                    <span className="text-xs text-white/60 group-hover:text-white transition-colors">{a.label}</span>
                    <ArrowRight size={12} className="ml-auto text-white/20 group-hover:text-white/50" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
