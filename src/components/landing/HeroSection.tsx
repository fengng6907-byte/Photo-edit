import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Zap, ArrowDown, Camera } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background orbs */}
      <div className="orb orb-crimson absolute -top-20 left-1/2 -translate-x-1/2 w-[800px] h-[700px] opacity-20 pointer-events-none" />
      <div className="orb orb-dark-crimson absolute bottom-0 right-0 w-[500px] h-[500px] opacity-25 pointer-events-none" />
      <div className="orb orb-dark-crimson absolute bottom-0 left-0 w-[400px] h-[400px] opacity-20 pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-crimson border border-brand-500/20 text-xs font-semibold text-brand-400 mb-10 tracking-widest uppercase">
          <Camera size={11} />
          Fujifilm · CCD · AI-Powered
        </div>

        {/* Headline */}
        <h1 className="text-6xl sm:text-7xl lg:text-[96px] font-black leading-none tracking-tight mb-7">
          <span className="block text-white">Film the Vibe.</span>
          <span className="block gradient-text-crimson mt-1">AI does the rest.</span>
        </h1>

        <p className="text-white/45 text-xl sm:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed">
          Turn any photo into cinematic Fujifilm warmth or retro CCD nostalgia.
          <br className="hidden sm:block" />
          One click. Ten free credits. No card needed.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link href="/login">
            <Button size="xl" icon={<Zap size={18} className="fill-current" />} className="neon-glow font-semibold">
              Get 10 Free Credits
            </Button>
          </Link>
          <Link href="#vibe-gallery">
            <Button size="xl" variant="secondary" icon={<ArrowDown size={17} />} iconPosition="right">
              See Gallery
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-12 mb-20">
          {[
            { value: "10K+", label: "Photos styled" },
            { value: "2", label: "AI film modes" },
            { value: "1 credit", label: "per transform" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-black text-white mb-1">{s.value}</div>
              <div className="text-xs text-white/35 uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Preview image strip */}
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0d0d0d] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-[#0d0d0d] to-transparent z-10 pointer-events-none" />
          <div className="grid grid-cols-4 gap-2">
            {[
              { src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=280&fit=crop&q=70", filter: "saturate(1.4) contrast(1.1) sepia(0.15)" },
              { src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=280&fit=crop&q=70", filter: "saturate(1.6) contrast(1.05)" },
              { src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=280&fit=crop&q=70", filter: "saturate(0.9) sepia(0.25) brightness(1.05)" },
              { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=280&fit=crop&q=70", filter: "saturate(1.3) contrast(1.15)" },
            ].map((img, i) => (
              <img
                key={i}
                src={img.src}
                alt=""
                className="w-full h-48 sm:h-64 object-cover rounded-xl"
                style={{ filter: img.filter }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
