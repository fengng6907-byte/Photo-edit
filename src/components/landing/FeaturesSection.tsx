"use client";

import { Badge } from "@/components/ui/Badge";
import {
  Sparkles, Scissors, ArrowUp, User, Palette, Film, Volume2, Captions,
  Zap, Shield, Globe, Clock
} from "lucide-react";

const photoFeatures = [
  { icon: <Scissors size={20} />, title: "Background Removal", desc: "Instantly remove backgrounds with pixel-perfect precision powered by AI.", color: "blue" },
  { icon: <ArrowUp size={20} />, title: "AI Upscaling", desc: "Upscale images up to 4x resolution without losing quality.", color: "green" },
  { icon: <User size={20} />, title: "Portrait Enhancement", desc: "Automatically enhance skin, eyes, and facial features.", color: "pink" },
  { icon: <Palette size={20} />, title: "Color Grading", desc: "Apply professional cinematic color grades with one click.", color: "purple" },
  { icon: <Sparkles size={20} />, title: "AI Enhancement", desc: "Smart auto-enhancement that understands your photo's mood.", color: "amber" },
  { icon: <Film size={20} />, title: "100+ Filters", desc: "Cinematic, vintage, luxury, and social media filters.", color: "cyan" },
];

const videoFeatures = [
  { icon: <Film size={20} />, title: "Cinematic LUTs", desc: "Professional color lookup tables for Hollywood-grade grading.", color: "blue" },
  { icon: <Captions size={20} />, title: "AI Subtitles", desc: "Auto-generate accurate subtitles in 50+ languages.", color: "green" },
  { icon: <Volume2 size={20} />, title: "Audio Enhancement", desc: "Remove noise, enhance voices, and sync background music.", color: "purple" },
  { icon: <Zap size={20} />, title: "Auto Edit", desc: "AI auto-edit your clips for TikTok, Reels, and YouTube.", color: "pink" },
  { icon: <Clock size={20} />, title: "Slow Motion", desc: "Generate smooth slow motion from any video clip.", color: "amber" },
  { icon: <Shield size={20} />, title: "AI Stabilization", desc: "Remove camera shake with intelligent stabilization.", color: "cyan" },
];

const colorMap = {
  blue: { bg: "bg-blue-500/15", border: "border-blue-500/20", icon: "text-blue-400" },
  green: { bg: "bg-emerald-500/15", border: "border-emerald-500/20", icon: "text-emerald-400" },
  pink: { bg: "bg-pink-500/15", border: "border-pink-500/20", icon: "text-pink-400" },
  purple: { bg: "bg-brand-500/15", border: "border-brand-500/20", icon: "text-brand-400" },
  amber: { bg: "bg-amber-500/15", border: "border-amber-500/20", icon: "text-amber-400" },
  cyan: { bg: "bg-cyan-500/15", border: "border-cyan-500/20", icon: "text-cyan-400" },
};

function FeatureCard({ feature }: { feature: typeof photoFeatures[0] }) {
  const c = colorMap[feature.color as keyof typeof colorMap];
  return (
    <div className="group glass glass-hover rounded-2xl p-5 transition-all duration-300 hover:shadow-glass">
      <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mb-4 ${c.icon} group-hover:scale-110 transition-transform`}>
        {feature.icon}
      </div>
      <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
      <p className="text-sm text-white/50 leading-relaxed">{feature.desc}</p>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="orb orb-purple absolute -right-40 top-0 w-[400px] h-[400px] opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Photo Features */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <Badge variant="blue" className="mb-4">Photo Editing</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              AI Photo Editor
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto text-lg">
              Professional-grade photo editing powered by the latest AI models. Transform any image in seconds.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {photoFeatures.map((f) => <FeatureCard key={f.title} feature={f} />)}
          </div>
        </div>

        {/* Video Features */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <Badge variant="purple" className="mb-4">Video Editing</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              AI Video Studio
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto text-lg">
              Edit videos like a pro with AI-powered tools for stabilization, subtitles, color grading, and more.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videoFeatures.map((f) => <FeatureCard key={f.title} feature={f} />)}
          </div>
        </div>

        {/* Why PrismFlow */}
        <div className="gradient-border rounded-3xl p-8 sm:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="success" className="mb-4">Why PrismFlow</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Built for speed.<br />Designed for creators.
              </h2>
              <p className="text-white/50 mb-6 leading-relaxed">
                Every feature is built with performance and simplicity in mind.
                No complex menus. No steep learning curve. Just powerful AI at your fingertips.
              </p>
              <div className="space-y-3">
                {[
                  { icon: <Zap size={16} className="text-amber-400" />, text: "Process images in under 3 seconds" },
                  { icon: <Globe size={16} className="text-blue-400" />, text: "Works in any browser, no install needed" },
                  { icon: <Shield size={16} className="text-emerald-400" />, text: "Your files are always private and secure" },
                  { icon: <Sparkles size={16} className="text-brand-400" />, text: "New AI models added every week" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <span className="text-sm text-white/70">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "50K+", label: "Active Creators", color: "brand" },
                { value: "10M+", label: "Images Processed", color: "blue" },
                { value: "99.9%", label: "Uptime SLA", color: "green" },
                { value: "<3s", label: "Average Process Time", color: "pink" },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-2xl p-5 text-center">
                  <div className="text-3xl font-black gradient-text mb-1">{stat.value}</div>
                  <div className="text-xs text-white/40">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
