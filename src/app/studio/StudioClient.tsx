"use client";

import { useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { DashboardNav } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  Upload,
  Zap,
  Download,
  RotateCcw,
  Film,
  Camera,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

type StyleKey = "fujifilm" | "ccd";

const STYLES: { id: StyleKey; label: string; icon: React.ReactNode; desc: string }[] = [
  {
    id: "fujifilm",
    label: "Fujifilm XT4",
    icon: <Camera size={16} />,
    desc: "Warm grain · lifted shadows · analog cinematic",
  },
  {
    id: "ccd",
    label: "CCD Digital",
    icon: <Film size={16} />,
    desc: "Y2K saturation · digital noise · early 2000s",
  },
];

type Status = "idle" | "uploading" | "transforming" | "done" | "error";

function drawWatermark(canvas: HTMLCanvasElement, image: HTMLImageElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  ctx.drawImage(image, 0, 0);

  // Watermark config
  const margin = Math.round(canvas.width * 0.025);
  const fontSize = Math.round(canvas.width * 0.022);
  const text = "VibeLens";

  ctx.save();
  // Semi-transparent pill background
  ctx.font = `600 ${fontSize}px Inter, system-ui, sans-serif`;
  const textWidth = ctx.measureText(text).width;
  const padH = fontSize * 0.5;
  const padV = fontSize * 0.28;
  const rx = 6;
  const x = canvas.width - margin - textWidth - padH * 2;
  const y = canvas.height - margin - fontSize - padV * 2;
  const w = textWidth + padH * 2;
  const h = fontSize + padV * 2;

  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.beginPath();
  ctx.moveTo(x + rx, y);
  ctx.lineTo(x + w - rx, y);
  ctx.arcTo(x + w, y, x + w, y + rx, rx);
  ctx.lineTo(x + w, y + h - rx);
  ctx.arcTo(x + w, y + h, x + w - rx, y + h, rx);
  ctx.lineTo(x + rx, y + h);
  ctx.arcTo(x, y + h, x, y + h - rx, rx);
  ctx.lineTo(x, y + rx);
  ctx.arcTo(x, y, x + rx, y, rx);
  ctx.closePath();
  ctx.fill();

  // Text
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.fillText(text, x + padH, y + padV + fontSize * 0.82);
  ctx.restore();
}

export function StudioClient() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [style, setStyle] = useState<StyleKey>("fujifilm");
  const [status, setStatus] = useState<Status>("idle");
  const [transformedUrl, setTransformedUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setTransformedUrl(null);
    setStatus("idle");
    setErrorMsg("");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
    disabled: status === "transforming" || status === "uploading",
  });

  const handleTransform = async () => {
    if (!file || !preview) return;
    setStatus("uploading");
    setErrorMsg("");

    try {
      // Convert file to base64 data URL for sending
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setStatus("transforming");

      const res = await fetch("/api/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: dataUrl, style }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Transform failed");
      }

      setTransformedUrl(data.transformedUrl);
      setStatus("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  };

  const handleDownload = async () => {
    if (!transformedUrl) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = transformedUrl;

    img.onload = () => {
      const canvas = canvasRef.current ?? document.createElement("canvas");
      drawWatermark(canvas, img);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `vibelens-${style}-${Date.now()}.jpg`;
        a.click();
        URL.revokeObjectURL(url);
      }, "image/jpeg", 0.92);
    };
  };

  const reset = () => {
    setPreview(null);
    setFile(null);
    setTransformedUrl(null);
    setStatus("idle");
    setErrorMsg("");
  };

  const isLoading = status === "uploading" || status === "transforming";

  return (
    <>
      <DashboardNav />
      <canvas ref={canvasRef} className="hidden" />

      <main className="min-h-screen bg-[#0d0d0d] pt-6 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Studio</h1>
            <p className="text-white/40 text-sm">Upload a photo · pick a vibe · download with watermark</p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left — upload + controls */}
            <div className="lg:col-span-2 space-y-5">
              {/* Style selector */}
              <div className="space-y-3">
                <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">Choose Style</p>
                {STYLES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    disabled={isLoading}
                    className={cn(
                      "w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all disabled:opacity-50",
                      style === s.id
                        ? "glass-crimson border-brand-500/30 shadow-glow"
                        : "border-white/8 hover:border-white/15 hover:bg-white/3"
                    )}
                  >
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                      style === s.id ? "bg-brand-500/20 text-brand-400" : "bg-white/6 text-white/40"
                    )}>
                      {s.icon}
                    </div>
                    <div>
                      <p className={cn("font-semibold text-sm", style === s.id ? "text-white" : "text-white/55")}>
                        {s.label}
                      </p>
                      <p className="text-xs text-white/30 mt-0.5">{s.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Dropzone */}
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mb-3">Upload Photo</p>
                <div
                  {...getRootProps()}
                  className={cn(
                    "rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all",
                    isDragActive
                      ? "border-brand-500 bg-brand-500/8"
                      : preview
                      ? "border-white/12 bg-white/2"
                      : "border-white/10 hover:border-white/20 bg-white/2 hover:bg-white/4",
                    isLoading && "pointer-events-none opacity-60"
                  )}
                >
                  <input {...getInputProps()} />
                  {preview ? (
                    <div>
                      <img
                        src={preview}
                        alt="Selected"
                        className="w-full h-36 object-cover rounded-lg mb-2"
                      />
                      <p className="text-xs text-white/30 truncate">{file?.name}</p>
                    </div>
                  ) : (
                    <div className="py-4">
                      <Upload size={24} className="text-white/25 mx-auto mb-3" />
                      <p className="text-sm text-white/50 font-medium">
                        {isDragActive ? "Drop it" : "Drag & drop or click"}
                      </p>
                      <p className="text-xs text-white/25 mt-1">JPG, PNG, WebP · max 50MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action button */}
              <Button
                onClick={handleTransform}
                disabled={!file || isLoading}
                loading={isLoading}
                icon={!isLoading ? <Zap size={16} className="fill-current" /> : undefined}
                className="w-full"
                size="lg"
              >
                {status === "uploading"
                  ? "Uploading..."
                  : status === "transforming"
                  ? "Transforming..."
                  : "Transform · 1 Credit"}
              </Button>

              {status === "done" && (
                <Button onClick={reset} variant="secondary" icon={<RotateCcw size={14} />} className="w-full">
                  Transform Another
                </Button>
              )}

              {/* Credit info */}
              <p className="text-center text-xs text-white/25">
                Each transform costs 1 credit
              </p>
            </div>

            {/* Right — result */}
            <div className="lg:col-span-3">
              <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mb-3">Result</p>

              <div className="rounded-2xl border border-white/8 overflow-hidden min-h-96 bg-white/2 flex flex-col">
                {status === "idle" && !preview && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-white/20">
                    <Camera size={48} className="mb-4" />
                    <p className="text-sm">Your transformed photo will appear here</p>
                  </div>
                )}

                {status === "idle" && preview && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-white/30">
                    <Zap size={36} className="mb-4 text-brand-500/40" />
                    <p className="text-sm font-medium text-white/50">Ready to transform</p>
                    <p className="text-xs mt-1">Click &ldquo;Transform · 1 Credit&rdquo; to start</p>
                  </div>
                )}

                {isLoading && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                    <div className="relative mb-6">
                      <Loader2 size={48} className="animate-spin text-brand-500" />
                    </div>
                    <p className="text-white/60 font-medium text-sm">
                      {status === "uploading" ? "Preparing your image..." : "AI is applying the vibe..."}
                    </p>
                    <p className="text-white/25 text-xs mt-1">This usually takes 10–20 seconds</p>
                  </div>
                )}

                {status === "error" && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                    <AlertCircle size={40} className="text-red-400 mb-4" />
                    <p className="text-red-400 font-medium text-sm mb-1">Transform failed</p>
                    <p className="text-white/40 text-xs max-w-xs">{errorMsg}</p>
                    <Button onClick={reset} variant="secondary" size="sm" className="mt-6" icon={<RotateCcw size={13} />}>
                      Try again
                    </Button>
                  </div>
                )}

                {status === "done" && transformedUrl && (
                  <div className="relative">
                    <img
                      src={transformedUrl}
                      alt="Transformed"
                      className="w-full object-contain"
                    />
                    {/* Overlay watermark preview */}
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/45 text-white/80 text-xs font-semibold">
                      VibeLens
                    </div>

                    {/* Download bar */}
                    <div className="p-4 border-t border-white/8 flex items-center justify-between gap-4 bg-[#111111]">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-400" />
                        <span className="text-white/60 text-sm">Transform complete</span>
                        <span className="text-xs text-brand-400 font-medium capitalize">{style}</span>
                      </div>
                      <Button
                        onClick={handleDownload}
                        icon={<Download size={15} />}
                        size="sm"
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Before/After comparison if both images */}
              {status === "done" && preview && transformedUrl && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl overflow-hidden">
                    <div className="text-xs text-white/30 mb-1.5 px-0.5">Before</div>
                    <img src={preview} alt="Before" className="w-full h-32 object-cover rounded-lg" />
                  </div>
                  <div className="rounded-xl overflow-hidden">
                    <div className="text-xs text-brand-400 mb-1.5 px-0.5">After · {style}</div>
                    <img src={transformedUrl} alt="After" className="w-full h-32 object-cover rounded-lg" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
