"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryItem {
  label: string;
  style: "Fujifilm XT4" | "CCD Digital";
  before: string;
  after: string;
  description: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    label: "Golden Hour Portrait",
    style: "Fujifilm XT4",
    before: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
    after: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80&sat=-20&con=10",
    description: "Warm film grain, lifted shadows, analog softness",
  },
  {
    label: "City Street",
    style: "CCD Digital",
    before: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80",
    after: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80&sat=20",
    description: "Y2K saturation, digital noise, early 2000s energy",
  },
  {
    label: "Café Morning",
    style: "Fujifilm XT4",
    before: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
    after: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80&bri=10",
    description: "Velvia color, rich greens, cinematic depth",
  },
];

function BeforeAfterSlider({ before, after, label }: { before: string; after: string; label: string }) {
  const [sliderX, setSliderX] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateSlider = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setSliderX(pct);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    updateSlider(e.clientX);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setDragging(true);
    updateSlider(e.touches[0].clientX);
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => dragging && updateSlider(e.clientX);
    const onTouchMove = (e: TouchEvent) => dragging && updateSlider(e.touches[0].clientX);
    const onUp = () => setDragging(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging, updateSlider]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden cursor-col-resize select-none group"
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      {/* After (full width, clipped on right) */}
      <img
        src={after}
        alt={`${label} - AI styled`}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: "saturate(1.3) contrast(1.1)" }}
        draggable={false}
      />

      {/* Before (clipped on left) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderX}%` }}
      >
        <img
          src={before}
          alt={`${label} - original`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: `${100 / (sliderX / 100)}%`, maxWidth: "none" }}
          draggable={false}
        />
      </div>

      {/* Divider */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_rgba(220,20,60,0.8)] z-10"
        style={{ left: `${sliderX}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-crimson flex items-center justify-center">
          <ChevronLeft size={10} className="text-gray-800 -mr-0.5" />
          <ChevronRight size={10} className="text-gray-800 -ml-0.5" />
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/60 text-xs text-white/70 font-medium pointer-events-none">
        Before
      </div>
      <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-brand-500/80 text-xs text-white font-medium pointer-events-none">
        After · AI
      </div>
    </div>
  );
}

export function VibeGallery() {
  const [active, setActive] = useState(0);
  const item = GALLERY_ITEMS[active];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="orb orb-crimson absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-20 pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-brand-500 text-sm font-semibold uppercase tracking-widest mb-3">
            Vibe Gallery
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Drag to see the magic
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Fujifilm warmth or CCD nostalgia — pick your vibe and let the AI handle the rest.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Slider */}
          <div className="lg:col-span-3">
            <BeforeAfterSlider
              key={active}
              before={item.before}
              after={item.after}
              label={item.label}
            />
          </div>

          {/* Gallery picker + info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass rounded-2xl p-5 border border-white/6">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">AI Style Applied</p>
              <h3 className="text-xl font-bold text-white">{item.style}</h3>
              <p className="text-white/50 text-sm mt-2">{item.description}</p>
              <div className="mt-4 h-px bg-white/6" />
              <p className="text-xs text-white/30 mt-4 font-mono">1 credit per transform</p>
            </div>

            <div className="space-y-2">
              {GALLERY_ITEMS.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all",
                    active === i
                      ? "glass-crimson border border-brand-500/30"
                      : "hover:bg-white/4 border border-transparent"
                  )}
                >
                  <img
                    src={g.before}
                    alt={g.label}
                    className="w-12 h-9 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className={cn("text-sm font-medium truncate", active === i ? "text-white" : "text-white/60")}>
                      {g.label}
                    </p>
                    <p className="text-xs text-brand-500/80 font-medium">{g.style}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
