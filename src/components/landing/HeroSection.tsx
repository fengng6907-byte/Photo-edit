"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, Play, ArrowRight, Zap, Star } from "lucide-react";

const floatingCards = [
  { label: "Background Removed", icon: "✂️", color: "from-blue-500/20 to-blue-600/10", delay: "0s", x: "-left-8", y: "top-1/4" },
  { label: "AI Enhanced", icon: "✨", color: "from-brand-500/20 to-brand-600/10", delay: "1s", x: "-right-8", y: "top-1/3" },
  { label: "4K Upscaled", icon: "🔍", color: "from-emerald-500/20 to-emerald-600/10", delay: "2s", x: "-left-12", y: "bottom-1/4" },
  { label: "Style Applied", icon: "🎨", color: "from-pink-500/20 to-pink-600/10", delay: "1.5s", x: "-right-12", y: "bottom-1/3" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="orb orb-purple absolute -top-40 -left-40 w-[600px] h-[600px] opacity-60" />
      <div className="orb orb-blue absolute -bottom-40 -right-40 w-[500px] h-[500px] opacity-40" />
      <div className="orb orb-pink absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center">
        {/* Announcement Badge */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-white/70">Introducing PrismFlow AI 2.0</span>
            <span className="text-brand-400 font-medium flex items-center gap-1">
              See what&apos;s new <ArrowRight size={13} />
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <span className="block text-white">Create Stunning</span>
          <span className="block gradient-text">AI-Powered</span>
          <span className="block text-white">Visuals</span>
        </h1>

        {/* Subheadline */}
        <p
          className="text-lg sm:text-xl text-white/50 max-w-2xl mb-10 leading-relaxed animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          Transform your photos and videos with professional-grade AI editing.
          Cinematic filters, background removal, upscaling, and more — all in seconds.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 mb-16 animate-slide-up"
          style={{ animationDelay: "0.4s" }}
        >
          <Link href="/register">
            <Button
              size="xl"
              icon={<Sparkles size={18} />}
              className="neon-glow text-base font-semibold"
            >
              Start Editing Free
            </Button>
          </Link>
          <Link href="#demo">
            <Button
              variant="glass"
              size="xl"
              icon={<Play size={16} />}
              className="text-base font-semibold"
            >
              Watch Demo
            </Button>
          </Link>
        </div>

        {/* Social Proof */}
        <div
          className="flex flex-col sm:flex-row items-center gap-6 mb-16 animate-fade-in"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {["A", "B", "C", "D", "E"].map((letter, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-[#0a0828] flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: `hsl(${i * 70 + 220}, 70%, 50%)` }}
                >
                  {letter}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="text-white text-sm font-semibold">50,000+</div>
              <div className="text-white/40 text-xs">Happy creators</div>
            </div>
          </div>
          <div className="h-8 w-px bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="text-white/70 text-sm">4.9/5 rating</span>
          </div>
          <div className="h-8 w-px bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-1.5 text-white/50 text-sm">
            <Zap size={13} className="text-emerald-400" />
            No credit card required
          </div>
        </div>

        {/* Hero Preview */}
        <div
          className="relative w-full max-w-5xl animate-fade-in"
          style={{ animationDelay: "0.6s" }}
        >
          {/* Main preview card */}
          <div className="gradient-border rounded-3xl overflow-hidden shadow-glass-lg">
            <div className="bg-[#0d0a30] rounded-3xl p-6 sm:p-8">
              {/* Mockup editor UI */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                </div>
                <div className="flex-1 mx-4 h-6 bg-white/5 rounded-lg flex items-center px-3">
                  <span className="text-xs text-white/30">prismflow.ai/editor</span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 h-64 sm:h-80">
                {/* Sidebar */}
                <div className="col-span-1 space-y-3">
                  {["Portrait", "Cinematic", "Travel", "Retro", "Luxury"].map((cat, i) => (
                    <div
                      key={cat}
                      className={`px-3 py-2 rounded-lg text-xs ${i === 1 ? "bg-brand-500/30 text-brand-300 border border-brand-500/30" : "bg-white/5 text-white/40"}`}
                    >
                      {cat}
                    </div>
                  ))}
                </div>
                {/* Canvas */}
                <div className="col-span-2 bg-white/5 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-900/50 via-purple-900/30 to-blue-900/50" />
                  <div className="relative text-center">
                    <div className="text-4xl mb-2">🖼️</div>
                    <p className="text-xs text-white/40">Your image here</p>
                  </div>
                  {/* Filter overlay hint */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="glass rounded-lg px-3 py-1.5 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="text-xs text-white/60">Hollywood filter applied</span>
                    </div>
                  </div>
                </div>
                {/* Controls */}
                <div className="col-span-1 space-y-3">
                  {["Brightness", "Contrast", "Saturation", "Temperature"].map((ctrl) => (
                    <div key={ctrl}>
                      <div className="flex justify-between text-[10px] text-white/30 mb-1">
                        <span>{ctrl}</span>
                        <span>72</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full"
                          style={{ width: `${40 + Math.random() * 40}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="pt-2">
                    <div className="bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs rounded-lg px-3 py-2 text-center cursor-pointer hover:bg-brand-500/30 transition-colors">
                      ✨ AI Enhance
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating cards */}
          {floatingCards.map((card) => (
            <div
              key={card.label}
              className={`absolute ${card.x} ${card.y} hidden lg:flex items-center gap-2 glass rounded-xl px-3 py-2 shadow-glass animate-float`}
              style={{ animationDelay: card.delay }}
            >
              <span className="text-lg">{card.icon}</span>
              <span className="text-xs font-medium text-white/80 whitespace-nowrap">{card.label}</span>
            </div>
          ))}
        </div>

        {/* Supported formats */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 animate-fade-in" style={{ animationDelay: "0.8s" }}>
          <span className="text-xs text-white/30">Supports:</span>
          {["JPG", "PNG", "WEBP", "HEIC", "MP4", "MOV", "WEBM"].map((fmt) => (
            <span key={fmt} className="px-2.5 py-1 bg-white/5 rounded-md text-xs text-white/50 border border-white/10">
              {fmt}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
