"use client";

import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { AIProcessingAnimation } from "@/components/ui/Loading";
import { cn, formatBytes, IMAGE_TYPES, MAX_IMAGE_SIZE_MB } from "@/lib/utils";
import {
  Upload, Download, Undo2, Redo2, Sparkles, Scissors, ArrowUp, User,
  Palette, RotateCcw, ZoomIn, SlidersHorizontal, Layers, Image,
  ChevronLeft, ChevronRight, X
} from "lucide-react";
import Link from "next/link";
import type { FilterSettings, FilterCategory } from "@/types";

const FILTERS = [
  { id: "none", name: "Original", category: "portrait" as FilterCategory, emoji: "📷", settings: {} },
  { id: "hollywood", name: "Hollywood", category: "cinematic" as FilterCategory, emoji: "🎬", settings: { contrast: 20, saturation: -10, temperature: -15, vignette: 30 } },
  { id: "blade_runner", name: "Blade Runner", category: "cinematic" as FilterCategory, emoji: "🌆", settings: { hue: 200, saturation: 20, shadows: -20, highlights: 10 } },
  { id: "teal_orange", name: "Teal Orange", category: "cinematic" as FilterCategory, emoji: "🍊", settings: { temperature: 20, tint: -10, saturation: 30 } },
  { id: "soft_glow", name: "Soft Glow", category: "portrait" as FilterCategory, emoji: "✨", settings: { brightness: 10, blur: 2, saturation: 10 } },
  { id: "golden_hour", name: "Golden Hour", category: "portrait" as FilterCategory, emoji: "🌅", settings: { temperature: 40, brightness: 15, saturation: 20 } },
  { id: "vsco_a4", name: "VSCO A4", category: "social_media" as FilterCategory, emoji: "📸", settings: { contrast: -10, saturation: -20, temperature: 10 } },
  { id: "vintage", name: "Vintage", category: "retro" as FilterCategory, emoji: "🎞️", settings: { saturation: -30, contrast: 15, grain: 20, temperature: 25 } },
  { id: "cyberpunk", name: "Cyberpunk", category: "gaming" as FilterCategory, emoji: "🤖", settings: { saturation: 50, hue: 280, contrast: 30 } },
  { id: "luxury", name: "Black Gold", category: "luxury" as FilterCategory, emoji: "💎", settings: { saturation: -40, contrast: 25, shadows: -30, highlights: 20 } },
  { id: "tokyo_night", name: "Tokyo Night", category: "travel" as FilterCategory, emoji: "🌃", settings: { saturation: 40, temperature: -20, contrast: 20 } },
  { id: "bali_sunset", name: "Bali Sunset", category: "travel" as FilterCategory, emoji: "🌴", settings: { temperature: 35, saturation: 25, highlights: 15 } },
];

const AI_TOOLS = [
  { id: "background_removal", name: "Remove BG", icon: <Scissors size={16} />, credits: 1 },
  { id: "upscale", name: "4x Upscale", icon: <ArrowUp size={16} />, credits: 2 },
  { id: "face_enhance", name: "Face Enhance", icon: <User size={16} />, credits: 2 },
  { id: "color_grade", name: "AI Color", icon: <Palette size={16} />, credits: 1 },
  { id: "enhance", name: "Auto Enhance", icon: <Sparkles size={16} />, credits: 1 },
  { id: "noise_removal", name: "Denoise", icon: <ZoomIn size={16} />, credits: 1 },
];

const categoryLabels: Record<string, string> = {
  all: "All",
  portrait: "Portrait",
  cinematic: "Cinematic",
  travel: "Travel",
  social_media: "Social",
  retro: "Retro",
  gaming: "Gaming",
  luxury: "Luxury",
};

export function PhotoEditorClient() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("none");
  const [processing, setProcessing] = useState(false);
  const [processingTool, setProcessingTool] = useState("");
  const [activePanel, setActivePanel] = useState<"filters" | "adjust" | "ai">("filters");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settings, setSettings] = useState<FilterSettings>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    temperature: 0,
    sharpness: 0,
    vignette: 0,
    grain: 0,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setFile(file);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setActiveFilter("none");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".heic"] },
    maxFiles: 1,
    maxSize: MAX_IMAGE_SIZE_MB * 1024 * 1024,
  });

  const handleAITool = async (toolId: string) => {
    if (!imageUrl) return;
    setProcessing(true);
    setProcessingTool(toolId);
    // Simulate AI processing — in production this calls the API
    await new Promise((r) => setTimeout(r, 3000));
    setProcessing(false);
    setProcessingTool("");
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `prismflow-${Date.now()}.jpg`;
    link.click();
  };

  const filteredFilters = filterCategory === "all"
    ? FILTERS
    : FILTERS.filter((f) => f.category === filterCategory);

  return (
    <div className="flex h-screen bg-[#070520] overflow-hidden">
      {/* Sidebar toggle for mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="glass rounded-xl p-2 text-white/60 hover:text-white"
        >
          <Layers size={18} />
        </button>
      </div>

      {/* Left Sidebar */}
      <aside
        className={cn(
          "flex flex-col glass border-r border-white/10 transition-all duration-300 overflow-hidden",
          sidebarOpen ? "w-72" : "w-0 lg:w-16"
        )}
      >
        <div className={cn("flex items-center justify-between h-14 border-b border-white/10 px-4 shrink-0", !sidebarOpen && "justify-center")}>
          {sidebarOpen ? (
            <>
              <Link href="/dashboard" className="flex items-center gap-2">
                <Sparkles size={16} className="text-brand-400" />
                <span className="text-sm font-semibold text-white">Photo Editor</span>
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="text-white/30 hover:text-white">
                <ChevronLeft size={16} />
              </button>
            </>
          ) : (
            <button onClick={() => setSidebarOpen(true)} className="text-white/30 hover:text-white">
              <ChevronRight size={16} />
            </button>
          )}
        </div>

        {sidebarOpen && (
          <>
            {/* Panel Tabs */}
            <div className="flex border-b border-white/10">
              {([
                { id: "filters", label: "Filters", icon: <Palette size={14} /> },
                { id: "adjust", label: "Adjust", icon: <SlidersHorizontal size={14} /> },
                { id: "ai", label: "AI Tools", icon: <Sparkles size={14} /> },
              ] as const).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActivePanel(tab.id)}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-1 py-2.5 text-xs transition-colors",
                    activePanel === tab.id
                      ? "text-brand-400 border-b-2 border-brand-500"
                      : "text-white/40 hover:text-white/70"
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin p-3">
              {/* Filters Panel */}
              {activePanel === "filters" && (
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setFilterCategory(key)}
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-xs transition-colors",
                          filterCategory === key
                            ? "bg-brand-500/20 text-brand-300 border border-brand-500/30"
                            : "text-white/40 hover:text-white bg-white/5"
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {filteredFilters.map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        className={cn(
                          "rounded-xl overflow-hidden border transition-all",
                          activeFilter === filter.id
                            ? "border-brand-500 shadow-glow"
                            : "border-white/10 hover:border-white/25"
                        )}
                      >
                        <div className="aspect-square bg-gradient-to-br from-brand-900/40 to-purple-900/30 flex items-center justify-center text-2xl">
                          {filter.emoji}
                        </div>
                        <div className="px-2 py-1.5 bg-white/5">
                          <p className="text-xs text-white/70 text-center truncate">{filter.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Adjustments Panel */}
              {activePanel === "adjust" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider">Adjustments</h3>
                    <button
                      onClick={() => setSettings({ brightness: 0, contrast: 0, saturation: 0, temperature: 0, sharpness: 0, vignette: 0, grain: 0 })}
                      className="text-xs text-white/30 hover:text-white flex items-center gap-1"
                    >
                      <RotateCcw size={11} /> Reset
                    </button>
                  </div>
                  {[
                    { key: "brightness", label: "Brightness", min: -100, max: 100 },
                    { key: "contrast", label: "Contrast", min: -100, max: 100 },
                    { key: "saturation", label: "Saturation", min: -100, max: 100 },
                    { key: "temperature", label: "Temperature", min: -100, max: 100 },
                    { key: "highlights", label: "Highlights", min: -100, max: 100 },
                    { key: "shadows", label: "Shadows", min: -100, max: 100 },
                    { key: "sharpness", label: "Sharpness", min: 0, max: 100 },
                    { key: "vignette", label: "Vignette", min: 0, max: 100 },
                    { key: "grain", label: "Grain", min: 0, max: 100 },
                  ].map((ctrl) => (
                    <Slider
                      key={ctrl.key}
                      label={ctrl.label}
                      value={settings[ctrl.key as keyof FilterSettings] as number ?? 0}
                      onChange={(v) => setSettings((s) => ({ ...s, [ctrl.key]: v }))}
                      min={ctrl.min}
                      max={ctrl.max}
                    />
                  ))}
                </div>
              )}

              {/* AI Tools Panel */}
              {activePanel === "ai" && (
                <div className="space-y-2">
                  <p className="text-xs text-white/30 mb-3">
                    Use AI credits to enhance your photo with advanced models.
                  </p>
                  {AI_TOOLS.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => handleAITool(tool.id)}
                      disabled={!imageUrl || processing}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left group",
                        imageUrl && !processing
                          ? "border-white/10 hover:border-brand-500/40 hover:bg-brand-500/10"
                          : "border-white/5 opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div className="w-8 h-8 rounded-lg bg-brand-500/15 flex items-center justify-center text-brand-400 group-hover:bg-brand-500/25">
                        {tool.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white">{tool.name}</p>
                        <p className="text-xs text-white/30">{tool.credits} credit{tool.credits !== 1 ? "s" : ""}</p>
                      </div>
                      <Sparkles size={13} className="text-white/20 group-hover:text-brand-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </aside>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between h-14 border-b border-white/10 px-4 glass shrink-0">
          <div className="flex items-center gap-2">
            {file && (
              <>
                <span className="text-xs text-white/40 truncate max-w-[200px]">{file.name}</span>
                <Badge variant="default" size="sm">{formatBytes(file.size)}</Badge>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white disabled:opacity-30" disabled>
              <Undo2 size={15} />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white disabled:opacity-30" disabled>
              <Redo2 size={15} />
            </button>
            <div className="w-px h-5 bg-white/10 mx-1" />
            {imageUrl && (
              <Button onClick={handleDownload} size="sm" icon={<Download size={14} />}>
                Export
              </Button>
            )}
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center bg-[#070520] relative overflow-hidden">
          <div className="absolute inset-0 bg-dots opacity-30" />

          {processing ? (
            <AIProcessingAnimation message={`Applying ${processingTool.replace("_", " ")}...`} />
          ) : imageUrl ? (
            <div className="relative max-w-full max-h-full p-8">
              <div className="relative rounded-2xl overflow-hidden shadow-glass-lg" style={{ filter: buildCSSFilter(settings) }}>
                <img
                  src={imageUrl}
                  alt="Editing canvas"
                  className="max-w-full max-h-[calc(100vh-8rem)] object-contain"
                  style={{ maxWidth: "800px" }}
                />
              </div>
              {activeFilter !== "none" && (
                <div className="absolute top-10 right-10">
                  <Badge variant="purple">{FILTERS.find(f => f.id === activeFilter)?.name}</Badge>
                </div>
              )}
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={cn(
                "w-full max-w-lg mx-8 border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all duration-300",
                isDragActive
                  ? "dropzone-active border-brand-400"
                  : "border-white/20 hover:border-white/40 hover:bg-white/3"
              )}
            >
              <input {...getInputProps()} />
              <div className="w-16 h-16 rounded-2xl bg-brand-500/15 flex items-center justify-center mx-auto mb-5">
                <Upload size={28} className="text-brand-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {isDragActive ? "Drop your image here" : "Upload an image"}
              </h3>
              <p className="text-sm text-white/40 mb-4">
                Drag & drop or click to browse
              </p>
              <p className="text-xs text-white/25">
                Supports JPG, PNG, WEBP, HEIC • Max 50MB
              </p>
            </div>
          )}

          {/* Active filter overlay indicator */}
          {imageUrl && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <div className="glass rounded-full px-4 py-2 flex items-center gap-3">
                {FILTERS.find(f => f.id === activeFilter) && (
                  <>
                    <span className="text-sm">{FILTERS.find(f => f.id === activeFilter)?.emoji}</span>
                    <span className="text-xs text-white/60">{FILTERS.find(f => f.id === activeFilter)?.name}</span>
                    {activeFilter !== "none" && (
                      <button onClick={() => setActiveFilter("none")} className="text-white/30 hover:text-white">
                        <X size={12} />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function buildCSSFilter(settings: FilterSettings): string {
  const filters = [];
  if (settings.brightness) filters.push(`brightness(${1 + settings.brightness / 100})`);
  if (settings.contrast) filters.push(`contrast(${1 + settings.contrast / 100})`);
  if (settings.saturation) filters.push(`saturate(${1 + settings.saturation / 100})`);
  if (settings.sharpness && settings.sharpness > 0) filters.push(`contrast(${1 + settings.sharpness / 200})`);
  if (settings.grain && settings.grain > 0) filters.push(`brightness(${1 - settings.grain / 500})`);
  return filters.join(" ");
}
