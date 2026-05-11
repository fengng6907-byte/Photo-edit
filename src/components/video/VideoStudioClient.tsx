"use client";

import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AIProcessingAnimation } from "@/components/ui/Loading";
import { Slider } from "@/components/ui/Input";
import { cn, formatBytes, formatDuration } from "@/lib/utils";
import {
  Upload, Download, Play, Pause, Scissors, Captions, Music, Volume2,
  Film, Zap, Sparkles, SkipBack, SkipForward, ChevronLeft, Layers,
  SlidersHorizontal, Clock
} from "lucide-react";
import Link from "next/link";

const VIDEO_TOOLS = [
  { id: "trim", label: "Trim & Cut", icon: <Scissors size={16} />, desc: "Cut and trim your video" },
  { id: "subtitle", label: "AI Subtitles", icon: <Captions size={16} />, desc: "Auto-generate captions", credits: 3 },
  { id: "music", label: "Add Music", icon: <Music size={16} />, desc: "Sync background music" },
  { id: "enhance", label: "AI Enhance", icon: <Sparkles size={16} />, desc: "Enhance video quality", credits: 2 },
  { id: "stabilize", label: "Stabilize", icon: <Zap size={16} />, desc: "Remove camera shake", credits: 3 },
  { id: "denoise", label: "Denoise Audio", icon: <Volume2 size={16} />, desc: "Remove background noise", credits: 2 },
];

const LUT_PRESETS = [
  { id: "none", name: "Original", emoji: "📷" },
  { id: "hollywood", name: "Hollywood", emoji: "🎬" },
  { id: "teal_orange", name: "Teal & Orange", emoji: "🎨" },
  { id: "blade_runner", name: "Blade Runner", emoji: "🌆" },
  { id: "vintage_film", name: "Vintage Film", emoji: "🎞️" },
  { id: "clean_crisp", name: "Clean & Crisp", emoji: "✨" },
];

const FORMAT_PRESETS = [
  { id: "16:9", label: "YouTube (16:9)", emoji: "▶️" },
  { id: "9:16", label: "TikTok (9:16)", emoji: "📱" },
  { id: "1:1", label: "Instagram (1:1)", emoji: "📷" },
  { id: "4:5", label: "Portrait (4:5)", emoji: "🖼️" },
];

export function VideoStudioClient() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeTool, setActiveTool] = useState("trim");
  const [activeLUT, setActiveLUT] = useState("none");
  const [processing, setProcessing] = useState(false);
  const [processingTool, setProcessingTool] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePanel, setActivePanel] = useState<"tools" | "color" | "format">("tools");
  const [audioSettings, setAudioSettings] = useState({ volume: 100, music: 50 });
  const videoRef = useRef<HTMLVideoElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setFile(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/*": [".mp4", ".mov", ".webm"] },
    maxFiles: 1,
    maxSize: 500 * 1024 * 1024,
  });

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleApplyTool = async (toolId: string) => {
    if (!videoUrl) return;
    setProcessing(true);
    setProcessingTool(toolId);
    await new Promise((r) => setTimeout(r, 3500));
    setProcessing(false);
    setProcessingTool("");
  };

  const handleDownload = () => {
    if (!videoUrl) return;
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = `prismflow-video-${Date.now()}.mp4`;
    link.click();
  };

  return (
    <div className="flex h-screen bg-[#070520] overflow-hidden">
      {/* Left Sidebar */}
      <aside
        className={cn(
          "flex flex-col glass border-r border-white/10 transition-all duration-300 overflow-hidden shrink-0",
          sidebarOpen ? "w-72" : "w-0"
        )}
      >
        <div className="flex items-center justify-between h-14 border-b border-white/10 px-4 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Film size={16} className="text-brand-400" />
            <span className="text-sm font-semibold text-white">Video Studio</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="text-white/30 hover:text-white">
            <ChevronLeft size={16} />
          </button>
        </div>

        {/* Panel tabs */}
        <div className="flex border-b border-white/10">
          {([
            { id: "tools", label: "Tools", icon: <Layers size={14} /> },
            { id: "color", label: "Color", icon: <Film size={14} /> },
            { id: "format", label: "Format", icon: <SlidersHorizontal size={14} /> },
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
          {/* Tools panel */}
          {activePanel === "tools" && (
            <div className="space-y-2">
              {VIDEO_TOOLS.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => {
                    setActiveTool(tool.id);
                    if (tool.credits) handleApplyTool(tool.id);
                  }}
                  disabled={!videoUrl || processing}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left group",
                    activeTool === tool.id
                      ? "border-brand-500/50 bg-brand-500/15"
                      : "border-white/10 hover:border-brand-500/30 hover:bg-brand-500/8",
                    (!videoUrl || processing) && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    activeTool === tool.id ? "bg-brand-500/30 text-brand-300" : "bg-white/5 text-white/50"
                  )}>
                    {tool.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">{tool.label}</p>
                    <p className="text-xs text-white/30">{tool.desc}</p>
                  </div>
                  {tool.credits && (
                    <Badge variant="purple" size="sm">{tool.credits}cr</Badge>
                  )}
                </button>
              ))}

              {/* Audio controls */}
              {videoUrl && (
                <div className="mt-4 p-3 glass rounded-xl space-y-3">
                  <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider">Audio</h4>
                  <Slider label="Volume" value={audioSettings.volume} onChange={(v) => setAudioSettings(s => ({ ...s, volume: v }))} />
                  <Slider label="Music Mix" value={audioSettings.music} onChange={(v) => setAudioSettings(s => ({ ...s, music: v }))} />
                </div>
              )}
            </div>
          )}

          {/* Color/LUT panel */}
          {activePanel === "color" && (
            <div>
              <p className="text-xs text-white/30 mb-3">Apply cinematic color grading LUTs</p>
              <div className="grid grid-cols-2 gap-2">
                {LUT_PRESETS.map((lut) => (
                  <button
                    key={lut.id}
                    onClick={() => setActiveLUT(lut.id)}
                    className={cn(
                      "rounded-xl border overflow-hidden transition-all",
                      activeLUT === lut.id ? "border-brand-500 shadow-glow" : "border-white/10 hover:border-white/25"
                    )}
                  >
                    <div className="aspect-video bg-gradient-to-br from-brand-900/40 to-purple-900/30 flex items-center justify-center text-2xl">
                      {lut.emoji}
                    </div>
                    <div className="px-2 py-1.5 bg-white/5">
                      <p className="text-xs text-center text-white/70 truncate">{lut.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Format panel */}
          {activePanel === "format" && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider">Export Format</h4>
              {FORMAT_PRESETS.map((fmt) => (
                <button
                  key={fmt.id}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/10 hover:border-brand-500/30 hover:bg-brand-500/8 transition-all text-left"
                >
                  <span className="text-lg">{fmt.emoji}</span>
                  <div>
                    <p className="text-sm text-white">{fmt.label}</p>
                    <p className="text-xs text-white/30">Aspect ratio: {fmt.id}</p>
                  </div>
                </button>
              ))}

              <div className="mt-4 p-3 glass rounded-xl space-y-3">
                <h4 className="text-xs font-semibold text-white/50">Quality</h4>
                {["480p", "720p", "1080p", "4K"].map((q) => (
                  <button key={q} className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/8 text-sm text-white/60 hover:text-white transition-colors">
                    <span>{q}</span>
                    {q === "1080p" && <Badge variant="blue" size="sm">Default</Badge>}
                    {q === "4K" && <Badge variant="purple" size="sm">Pro+</Badge>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between h-14 border-b border-white/10 px-4 glass shrink-0">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40">
                <Layers size={16} />
              </button>
            )}
            {file && (
              <Badge variant="default">{formatBytes(file.size)}</Badge>
            )}
            {duration > 0 && (
              <Badge variant="blue" icon={<Clock size={10} />}>{formatDuration(duration)}</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {videoUrl && (
              <Button onClick={handleDownload} size="sm" icon={<Download size={14} />}>
                Export Video
              </Button>
            )}
          </div>
        </div>

        {/* Video Area */}
        <div className="flex-1 flex flex-col items-center justify-center bg-[#070520] relative overflow-hidden">
          <div className="absolute inset-0 bg-dots opacity-20" />

          {processing ? (
            <AIProcessingAnimation message={`Processing: ${processingTool.replace("_", " ")}...`} />
          ) : videoUrl ? (
            <div className="relative w-full h-full flex items-center justify-center p-6">
              <video
                ref={videoRef}
                src={videoUrl}
                className="max-w-full max-h-[calc(100vh-12rem)] rounded-2xl shadow-glass-lg"
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onEnded={() => setIsPlaying(false)}
              />
              {activeLUT !== "none" && (
                <div className="absolute top-8 right-8">
                  <Badge variant="purple">{LUT_PRESETS.find(l => l.id === activeLUT)?.name}</Badge>
                </div>
              )}
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={cn(
                "w-full max-w-lg mx-8 border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all",
                isDragActive ? "dropzone-active border-brand-400" : "border-white/20 hover:border-white/40"
              )}
            >
              <input {...getInputProps()} />
              <div className="w-16 h-16 rounded-2xl bg-brand-500/15 flex items-center justify-center mx-auto mb-5">
                <Upload size={28} className="text-brand-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Upload a video</h3>
              <p className="text-sm text-white/40 mb-2">Drag & drop or click to browse</p>
              <p className="text-xs text-white/25">Supports MP4, MOV, WEBM • Max 500MB</p>
            </div>
          )}
        </div>

        {/* Timeline / Controls */}
        {videoUrl && (
          <div className="glass border-t border-white/10 p-4 shrink-0">
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white">
                  <SkipBack size={16} />
                </button>
                <button
                  onClick={togglePlay}
                  className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white hover:bg-brand-400 transition-colors shadow-glow"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white">
                  <SkipForward size={16} />
                </button>
              </div>
              <div className="text-xs text-white/40 font-mono">
                {formatDuration(currentTime)} / {formatDuration(duration)}
              </div>
              <div className="flex-1">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden cursor-pointer">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all"
                    style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%" }}
                  />
                </div>
              </div>
            </div>
            {/* Timeline track */}
            <div className="timeline-track">
              <div className="h-full flex items-center px-3">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="flex-1 h-8 rounded mx-0.5 bg-brand-500/20 border border-brand-500/10" />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
